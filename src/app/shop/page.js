"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useShop } from '../../context/ShopContext';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category') || null;

  const [dbProducts, setDbProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { addToCart, toggleWishlist, wishlist } = useShop();
  
  const isWishlisted = (productId) => wishlist.some((item) => item.id === productId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: '1',
    message: '',
    productname: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);

        let prods = [];
        if (prodRes.ok) {
          prods = await prodRes.json();
          // Map _id to id, format prices as strings
          const mapped = prods.map(p => ({
            ...p,
            id: p._id || p.id,
            price: typeof p.price === 'number' ? '₹' + p.price.toLocaleString('en-IN') : p.price
          }));
          setDbProducts(mapped);
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          setDbCategories(catData.categories || []);
        }
      } catch (err) {
        console.error('Error fetching shop page data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (categoryParam && dbCategories.length > 0) {
      const decodedParam = decodeURIComponent(categoryParam).toLowerCase();
      const matched = dbCategories.find(c => c.slug === decodedParam || c.name.toLowerCase() === decodedParam);
      if (matched) {
        setSelectedCategory(matched.name);
      } else if (decodedParam === 'all') {
        setSelectedCategory('All');
      } else {
        setSelectedCategory(categoryParam);
      }
    }
  }, [categoryParam, dbCategories]);

  // Dynamically compute active categories for the top bar and sidebar
  const categories = [
    { name: 'All', count: dbProducts.length },
    ...dbCategories.map(cat => ({
      name: cat.name,
      count: dbProducts.filter(p => p.category === cat.name).length
    }))
  ];

  const searchQuery = searchParams?.get('q') || '';

  // Filter products based on selected category & search query
  const filteredProducts = dbProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort products based on selected sort option
  const getSortedProducts = () => {
    let sorted = [...filteredProducts];

    switch (sortBy) {
      case 'A to Z':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'Price: Low to High':
        return sorted.sort((a, b) => parseFloat(a.price.replace(/[₹,]/g, '')) - parseFloat(b.price.replace(/[₹,]/g, '')));
      case 'Price: High to Low':
        return sorted.sort((a, b) => parseFloat(b.price.replace(/[₹,]/g, '')) - parseFloat(a.price.replace(/[₹,]/g, '')));
      case 'Featured':
      default:
        return sorted;
    }
  };

  const sortedProducts = getSortedProducts();

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleQuoteClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      ...formData,
      productname: product.name
    });
    setShowQuoteModal(true);
    setFormSubmitted(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;
    if (name === 'phone') {
      filteredValue = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData({
      ...formData,
      [name]: filteredValue
    });
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setSubmitError('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      setSubmitError('Please enter your email address');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    if (!formData.phone.trim()) {
      setSubmitError('Please enter your phone number');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setSubmitError('Phone number must be exactly 10 digits and contain only numbers');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // 1. Post to local Next.js api to store in MongoDB
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.productname,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          quantity: formData.quantity,
          message: formData.message
        })
      });

      if (!res.ok) {
        throw new Error('Local sync failed');
      }

      // 2. Post to Google Form as secondary background event
      const googleFormURL = "https://docs.google.com/forms/d/e/1FAIpQLScpjf5X6rj7EtE-npfCVus2eClGHrMr_tgAs24Y9yIwp63oLQ/formResponse";
      const formDataToSend = new URLSearchParams({
        'entry.955757516': formData.productname,
        'entry.834920774': formData.name,
        'entry.572130896': formData.email,
        'entry.740462758': formData.phone,
        'entry.1451959839': formData.quantity,
        'entry.549543547': formData.message,
        'submit': 'Submit'
      }).toString();

      fetch(googleFormURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formDataToSend
      }).catch(err => console.log("Google forms backdrop err:", err));

      setFormSubmitted(true);
      setTimeout(() => {
        setShowQuoteModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          quantity: '1',
          message: '',
          productname: ''
        });
        setFormSubmitted(false);
        setIsSubmitting(false);
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);

      const localQuotes = JSON.parse(localStorage.getItem('quoteRequests') || '[]');
      localQuotes.push({
        ...formData,
        timestamp: new Date().toLocaleString()
      });
      localStorage.setItem('quoteRequests', JSON.stringify(localQuotes));

      setSubmitError('Saved locally. We will contact you soon.');
      setFormSubmitted(true);
      setTimeout(() => {
        setShowQuoteModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          quantity: '1',
          message: '',
          productname: ''
        });
        setFormSubmitted(false);
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fa fa-star ${index < rating ? 'text-warning' : 'text-muted'}`}
        style={{ fontSize: '14px' }}
      ></i>
    ));
  };

  const getCleanImageUrl = (img) => {
    if (!img) return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%23f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%236c757d">No Image Available</text></svg>';
    if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) return img;
    return img.startsWith('/') ? img : `/${img}`;
  };

  return (
    <main>
      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease-in'
        }} onClick={() => setShowQuoteModal(false)}>
          <div className="modal-container" style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '550px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            animation: 'slideUp 0.3s ease-out'
          }} onClick={(e) => e.stopPropagation()}>

            {/* Modal Header */}
            <div style={{
              background: '#bc79e4',
              padding: '25px',
              borderRadius: '20px 20px 0 0',
              color: 'white',
              textAlign: 'center'
            }}>
              <button
                onClick={() => setShowQuoteModal(false)}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '20px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s'
                }}
              >
                ×
              </button>
              <i className="fas fa-file-invoice-dollar" style={{ fontSize: '48px', marginBottom: '15px' }}></i>
              <h2 style={{ margin: '0', fontSize: '28px' }}>Request a Quote</h2>
              <p style={{ margin: '10px 0 0', opacity: 0.9 }}>Get the best price for your chosen product</p>
            </div>

            {/* Modal Body */}
            {!formSubmitted ? (
              <form onSubmit={handleSubmitQuote} style={{ padding: '30px' }}>
                {/* Product Name Display */}
                <div style={{
                  background: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  borderLeft: '4px solid #bc79e4'
                }}>
                  <strong style={{ color: '#bc79e4' }}>Selected Product:</strong>
                  <p style={{ margin: '5px 0 0', color: '#666' }}>{selectedProduct?.name}</p>
                </div>

                {/* Name Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    <i className="fas fa-user" style={{ marginRight: '8px', color: '#bc79e4' }}></i>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'all 0.3s',
                      outline: 'none'
                    }}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    <i className="fas fa-envelope" style={{ marginRight: '8px', color: '#bc79e4' }}></i>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'all 0.3s',
                      outline: 'none'
                    }}
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Phone Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    <i className="fas fa-phone" style={{ marginRight: '8px', color: '#bc79e4' }}></i>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    maxLength="10"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'all 0.3s',
                      outline: 'none'
                    }}
                    placeholder="Enter your 10-digit phone number"
                  />
                </div>

                {/* Quantity Field */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    <i className="fas fa-boxes" style={{ marginRight: '8px', color: '#bc79e4' }}></i>
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'all 0.3s',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Message Field */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                    <i className="fas fa-comment" style={{ marginRight: '8px', color: '#bc79e4' }}></i>
                    Additional Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'all 0.3s',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    placeholder="Any specific requirements or questions?"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#bc79e4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
                  Submit Quote Request
                </button>
              </form>
            ) : (
              <div style={{ padding: '50px 30px', textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: '#bc79e4',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <i className="fas fa-check" style={{ fontSize: '40px', color: 'white' }}></i>
                </div>
                <h3 style={{ color: '#bc79e4', marginBottom: '10px' }}>Request Submitted!</h3>
                <p style={{ color: '#666', fontSize: '16px' }}>
                  Thank you for your interest. Our team will contact you shortly with the best quote.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showDetailsModal && selectedProduct && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease-in'
        }} onClick={() => setShowDetailsModal(false)}>
          <div className="modal-container text-dark position-relative" style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '900px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease-out',
            display: 'flex',
            flexDirection: 'column',
            padding: '40px'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              onClick={() => setShowDetailsModal(false)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'all 0.2s',
                fontSize: '18px',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Modal Body */}
            <div style={{ maxHeight: '75vh', overflowY: 'auto', overflowX: 'hidden', paddingRight: '5px' }}>
              <div className="row text-start align-items-stretch">
                {/* Left Column: Image Gallery */}
                <div className="col-md-6 mb-4 mb-md-0 d-flex flex-column">
                  <div style={{ 
                    padding: '24px', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '20px', 
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    minHeight: '350px',
                    flexGrow: 1
                  }}>
                    <img 
                      src={getCleanImageUrl(selectedProduct.image)} 
                      alt={selectedProduct.name} 
                      style={{ width: '100%', height: 'auto', maxHeight: '320px', objectFit: 'contain' }} 
                    />
                  </div>
                  {/* Gallery Thumbnails */}
                  <div className="d-flex mt-3 gap-2">
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      border: '2px solid #38bdf8',
                      padding: '4px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <img 
                        src={getCleanImageUrl(selectedProduct.image)} 
                        alt="Thumbnail" 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Product Info */}
                <div className="col-md-6 d-flex flex-column justify-content-between">
                  <div style={{ paddingLeft: '15px' }}>
                    <span 
                      style={{ 
                        color: '#00a2e8', 
                        fontSize: '0.85rem', 
                        fontWeight: '700', 
                        textTransform: 'uppercase', 
                        letterSpacing: '1px',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      {selectedProduct.category}
                    </span>
                    <h2 
                      className="text-dark fw-bold mb-2" 
                      style={{ 
                        fontSize: '1.8rem', 
                        lineHeight: '1.2', 
                        fontWeight: '800',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {selectedProduct.name}
                    </h2>
                    
                    {/* Rating Section */}
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="d-flex gap-1">
                        {renderStars(selectedProduct.rating)}
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        ({selectedProduct.reviews || 0} customer reviews)
                      </span>
                    </div>

                    {/* Price Section */}
                    <h2 
                      className="text-dark fw-bold mb-3" 
                      style={{ 
                        fontSize: '2rem', 
                        fontWeight: '800',
                        color: '#0f172a'
                      }}
                    >
                      {selectedProduct.price}
                    </h2>

                    {/* Description Section */}
                    <div className="mb-4">
                      <span 
                        style={{ 
                          fontSize: '0.85rem', 
                          fontWeight: '700', 
                          color: '#475569', 
                          textTransform: 'uppercase', 
                          letterSpacing: '1px',
                          display: 'block',
                          marginBottom: '8px'
                        }}
                      >
                        Description
                      </span>
                      <p 
                        className="text-muted" 
                        style={{ 
                          fontSize: '0.95rem',
                          lineHeight: '1.6', 
                          whiteSpace: 'pre-line',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          color: '#475569'
                        }}
                      >
                        {selectedProduct.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ paddingLeft: '15px' }}>
                    <div className="d-flex gap-3 mb-4">
                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          setShowDetailsModal(false);
                        }}
                        className="btn d-flex align-items-center justify-content-center gap-2"
                        style={{
                          backgroundColor: '#0d1527',
                          color: '#ffffff',
                          borderRadius: '12px',
                          padding: '16px 24px',
                          fontWeight: '700',
                          border: 'none',
                          flexGrow: 1,
                          fontSize: '1rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#1e293b';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#0d1527';
                        }}
                      >
                        <i className="fas fa-shopping-cart"></i> Add to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(selectedProduct)}
                        className="btn d-flex align-items-center justify-content-center"
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                        }}
                      >
                        <i 
                          className={isWishlisted(selectedProduct.id) ? "fas fa-heart text-danger" : "far fa-heart"}
                          style={{ fontSize: '1.2rem', color: isWishlisted(selectedProduct.id) ? '#ef4444' : '#64748b' }}
                        ></i>
                      </button>
                    </div>

                    {/* Stock and Shipping Information */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                        <span className="fw-bold text-dark">Availability:</span>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>In Stock</span>
                      </div>
                      <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                        <span className="fw-bold text-dark">Shipping:</span>
                        <span style={{ color: '#64748b', fontWeight: '500' }}>Free Standard Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          .modal-container::-webkit-scrollbar {
            width: 8px;
          }
          
          .modal-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          .modal-container::-webkit-scrollbar-thumb {
            background: #94a3b8;
            border-radius: 10px;
          }
          
          .modal-container::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
          
          .hover-link {
            color: var(--text-secondary) !important;
            display: inline-block;
            transition: all 0.2s ease;
          }
          
          .hover-link:hover {
            color: #818cf8 !important;
            transform: translateX(4px);
          }
        `}
      </style>

      {/* Start Content */}
      <div className="container py-5">
        <div className="row">
          {/* Sidebar Categories */}
          <div className="col-lg-3">
            <h3 className="fw-bold mb-4 text-dark" style={{ letterSpacing: '-0.5px' }}>Categories</h3>
            <ul className="list-unstyled">
              <li className="pb-3 border-bottom mb-3" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`d-flex justify-content-between align-items-center w-100 text-start bg-transparent border-0 p-0 pb-1 ${selectedCategory === 'All' ? 'text-dark fw-bold' : 'text-muted'}`}
                  style={{ fontSize: '1.05rem', cursor: 'pointer' }}
                >
                  <span>All Products</span>
                  <span className="badge rounded-pill bg-light text-dark border">{dbProducts.length}</span>
                </button>
              </li>
              {dbCategories.map((cat, idx) => {
                const count = dbProducts.filter(p => p.category === cat.name).length;
                return (
                  <li key={cat._id || idx} className="pb-3 border-bottom mb-3" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                    <button
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`d-flex justify-content-between align-items-center w-100 text-start bg-transparent border-0 p-0 pb-1 ${selectedCategory === cat.name ? 'text-dark fw-bold' : 'text-muted'}`}
                      style={{ fontSize: '1.05rem', cursor: 'pointer' }}
                    >
                      <span>{cat.name}</span>
                      <span className="badge rounded-pill bg-light text-dark border">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Products Grid */}
          <div className="col-lg-9">
            {searchQuery && (
              <div className="alert alert-light border shadow-sm d-flex justify-content-between align-items-center mb-4 text-dark" style={{ borderRadius: '16px', padding: '16px 24px' }}>
                <div>
                  <i className="fas fa-search me-2" style={{ color: '#bc79e4' }}></i>
                  Showing results for "<strong>{searchQuery}</strong>" ({sortedProducts.length} items found)
                </div>
                <Link href="/shop" className="btn btn-sm btn-dark rounded-pill px-3" style={{ fontSize: '0.85rem' }}>
                  Clear Search
                </Link>
              </div>
            )}
            {/* Top Bar */}
            <div className="row">
              <div className="col-md-6">
                <ul className="list-inline shop-top-menu pb-3 pt-1">
                  {categories.map((category) => (
                    <li key={category.name} className="list-inline-item">
                      <button
                        className={`h3 text-decoration-none mr-3 ${selectedCategory === category.name ? 'text-dark fw-bold' : 'text-muted'}`}
                        onClick={() => setSelectedCategory(category.name)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                      >
                        {category.name} ({category.count})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6 pb-4">
                <div className="d-flex">
                  <select
                    className="form-control text-dark border-secondary"
                    value={sortBy}
                    onChange={handleSortChange}
                    style={{ cursor: 'pointer' }}
                  >
                    <option>Featured</option>
                    <option>A to Z</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="row">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <div className="col-md-4 mb-4" key={product.id}>
                    <div 
                      onClick={() => { setSelectedProduct(product); setShowDetailsModal(true); }}
                      className="card product-wap border-0 overflow-hidden shadow-sm h-100 d-flex flex-column" 
                      style={{ backgroundColor: '#ffffff', borderRadius: '16px', position: 'relative', cursor: 'pointer' }}
                    >
                      
                      {/* Image Block with Floating Badges */}
                      <div style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px', position: 'relative', borderBottom: '1px solid #f1f5f9' }}>
                        {/* Best Seller Pill Badge */}
                        {product.rating >= 4 ? (
                          <div
                            style={{
                              position: 'absolute',
                              top: '16px',
                              left: '16px',
                              border: '1px solid #e2e8f0',
                              backgroundColor: '#f8fafc',
                              color: '#2563eb',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              padding: '4px 12px',
                              borderRadius: '8px',
                              zIndex: 10,
                            }}
                          >
                            best seller
                          </div>
                        ) : (
                          <div
                            style={{
                              position: 'absolute',
                              top: '16px',
                              left: '16px',
                              border: '1px solid #e2e8f0',
                              backgroundColor: '#f8fafc',
                              color: '#475569',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              padding: '4px 12px',
                              borderRadius: '8px',
                              zIndex: 10,
                            }}
                          >
                            featured
                          </div>
                        )}

                        {/* Floating Wishlist Heart Icon */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className="btn bg-white d-flex align-items-center justify-content-center"
                          style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                            zIndex: 10,
                            transition: 'all 0.2s'
                          }}
                          title={isWishlisted(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          <i className={isWishlisted(product.id) ? "fas fa-heart text-danger" : "far fa-heart text-secondary"} style={{ fontSize: '1.05rem' }}></i>
                        </button>

                        {/* Product Image */}
                        <img
                          className="card-img img-fluid"
                          src={getCleanImageUrl(product.image)}
                          alt={product.name}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </div>

                      {/* Info & Details Container */}
                      <div className="card-body bg-transparent d-flex flex-column flex-grow-1 justify-content-between p-3">
                        <div>
                          {/* Stars Rating & Count */}
                          <div className="d-flex align-items-center mb-2">
                            <span className="me-2 d-flex align-items-center gap-1">
                              {renderStars(product.rating)}
                            </span>
                            <span className="small text-muted" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                              ({product.reviews || Math.floor((product.id ? product.id.charCodeAt(0) * 7 : 7) % 15) + 5})
                            </span>
                          </div>

                          {/* Title & Price Grid */}
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(product);
                                setShowDetailsModal(true);
                              }}
                              className="h5 text-decoration-none fw-bold bg-transparent border-0 p-0 text-start text-dark flex-grow-1 me-3 mb-0 hover-underline"
                              style={{ fontSize: '1.05rem', lineHeight: '1.4', cursor: 'pointer', outline: 'none' }}
                            >
                              {product.name}
                            </button>
                            <span className="h5 fw-bold text-dark mb-0 text-nowrap" style={{ fontSize: '1.2rem' }}>
                              ₹{product.price ? product.price.toLocaleString('en-IN') : '99,999'}
                            </span>
                          </div>

                          {/* Dynamic Bullet Tags */}
                          <div className="small text-muted text-capitalize mb-3" style={{ fontSize: '0.82rem', fontWeight: '500' }}>
                            {(() => {
                              const categoryPart = product.category || 'Hardware';
                              const nameParts = product.name.split(' ').filter(w => w.length > 2 && !w.includes('(') && !w.includes(')'));
                              const tag1 = categoryPart;
                              const tag2 = nameParts[1] || 'Premium';
                              const tag3 = nameParts[2] || 'Genuine';
                              return `${tag1} • ${tag2} • ${tag3}`;
                            })()}
                          </div>
                        </div>

                        {/* Bottom Actions always visible */}
                        <div className="d-flex gap-2 mt-auto pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="btn d-flex align-items-center justify-content-center gap-2 text-white flex-grow-1"
                            style={{
                              backgroundColor: '#0f172a',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '12px 20px',
                              fontWeight: '700',
                              fontSize: '0.9rem',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <i className="fas fa-shopping-cart"></i> add to cart
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                              setShowDetailsModal(true);
                            }}
                            className="btn bg-white d-flex align-items-center justify-content-center"
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '12px',
                              border: '1px solid #e2e8f0',
                              color: '#0f172a',
                              transition: 'all 0.3s ease'
                            }}
                            title="View Details"
                          >
                            <i className="far fa-eye" style={{ fontSize: '1.05rem' }}></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <h4>No products found in this category</h4>
                  <p>Please check back later for new products!</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="row mt-4">
              <ul className="pagination justify-content-end">
                <li className="page-item">
                  <Link
                    className="page-link active"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    1
                  </Link>
                </li>
                <li className="page-item">
                  <Link
                    className="page-link"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    2
                  </Link>
                </li>
                <li className="page-item">
                  <Link
                    className="page-link"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    3
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* End Content */}

      {/* Brands Section */}
      <section className="bg-light py-5">
        <div className="container my-4">
          <div className="row text-center py-3">
            <div className="col-lg-6 m-auto">
              <h1 className="h1">Our Brands</h1>
              <p>
                We partner with only the most trusted and genuine brands in the industry to bring you authentic products with complete warranty and support.
              </p>
            </div>
            <div className="col-lg-9 m-auto tempaltemo-carousel">
              <div className="row d-flex flex-row">
                {/* Controls - Previous */}
                <div className="col-1 align-self-center">
                  <a
                    className="h1"
                    href="#multi-item-example"
                    role="button"
                    data-bs-slide="prev"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="text-dark fas fa-chevron-left"></i>
                  </a>
                </div>

                {/* Carousel Wrapper */}
                <div className="col">
                  <div
                    className="carousel slide carousel-multi-item pt-2 pt-md-0"
                    id="multi-item-example"
                    data-bs-ride="carousel"
                  >
                    {/* Slides */}
                    <div className="carousel-inner product-links-wap" role="listbox">
                      {/* First slide */}
                      <div className="carousel-item active">
                        <div className="row">
                          {['intel', 'amd', 'nvidia', 'samsung'].map((brand, idx) => (
                            <div className="col-3 p-md-5" key={idx}>
                              <Link href="#">
                                <img
                                  className="img-fluid brand-img"
                                  src={`/brand_0${idx + 1}.png`}
                                  alt={`${brand} Logo`}
                                  style={{ filter: 'grayscale(0%)', opacity: 0.8 }}
                                />
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Second slide */}
                      <div className="carousel-item">
                        <div className="row">
                          {['logitech', 'razer', 'corsair', 'lg'].map((brand, idx) => (
                            <div className="col-3 p-md-5" key={idx}>
                              <Link href="#">
                                <img
                                  className="img-fluid brand-img"
                                  src={`/brand_0${idx + 1}.png`}
                                  alt={`${brand} Logo`}
                                  style={{ filter: 'grayscale(0%)', opacity: 0.8 }}
                                />
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Third slide */}
                      <div className="carousel-item">
                        <div className="row">
                          {['sony', 'benq', 'acer', 'asus'].map((brand, idx) => (
                            <div className="col-3 p-md-5" key={idx}>
                              <Link href="#">
                                <img
                                  className="img-fluid brand-img"
                                  src={`/brand_0${idx + 1}.png`}
                                  alt={`${brand} Logo`}
                                  style={{ filter: 'grayscale(0%)', opacity: 0.8 }}
                                />
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls - Next */}
                <div className="col-1 align-self-center">
                  <a
                    className="h1"
                    href="#multi-item-example"
                    role="button"
                    data-bs-slide="next"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="text-dark fas fa-chevron-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Brands Section */}
    </main>
  );
}

const Shop = () => {
  return (
    <Suspense fallback={
      <div className="text-center py-5">
        <div className="spinner-border text-info" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
};

export default Shop;
