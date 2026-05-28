"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { toast } from 'react-toastify';
import ProductCardImage from './ProductCardImage';
import { UserIcon, ShoppingBagIcon } from './Icons';

const formatPrice = (price) => {
  if (price === undefined || price === null) return '₹0';
  if (typeof price === 'number') {
    return '₹' + price.toLocaleString('en-IN');
  }
  if (typeof price === 'string') {
    if (price.includes('₹')) return price;
    const cleanStr = price.replace(/[₹,]/g, '').trim();
    const num = parseFloat(cleanStr);
    return isNaN(num) ? '₹' + price : '₹' + num.toLocaleString('en-IN');
  }
  return '₹' + price;
};

const getNumericPrice = (p) => {
  if (p === undefined || p === null) return 0;
  if (typeof p === 'number') return p;
  const cleanStr = String(p).replace(/[₹,]/g, '').trim();
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
};


const ShopClient = ({ initialCategories = [], initialProducts = [] }) => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category') || null;

  const [dbProducts, setDbProducts] = useState(initialProducts);
  const [dbCategories, setDbCategories] = useState(initialCategories);
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);


  useEffect(() => {
    // Reset scroll when mounting
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, []);

  // Update URL categories sync
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

  // Filter products based on selected category, search query, and price range
  const filteredProducts = dbProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    // Safety check for numeric price
    const priceNum = getNumericPrice(product.price);
    const matchesPrice = priceNum >= minPrice && priceNum <= maxPrice;

    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesCategory && matchesPrice && matchesSearch;
  });

  // Reset pagination to page 1 on search, category filter, price filter, or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, searchQuery, minPrice, maxPrice]);

  // Sort products based on selected sort option
  const getSortedProducts = () => {
    let sorted = [...filteredProducts];

    switch (sortBy) {
      case 'A to Z':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'Price: Low to High':
        return sorted.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
      case 'Price: High to Low':
        return sorted.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
      case 'Featured':
      default:
        return sorted;
    }
  };


  const sortedProducts = getSortedProducts();

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const paginatedProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    if (typeof window !== 'undefined') {
      const gridElement = document.getElementById('shop-products-grid');
      if (gridElement) {
        gridElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

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
                    <UserIcon size={16} style={{ marginRight: '8px', color: '#bc79e4' }} />
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
                    <ProductCardImage
                      src={getCleanImageUrl(selectedProduct.image)}
                      alt={selectedProduct.name}
                      fallback=""
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
                      {formatPrice(selectedProduct.price)}
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
                        <ShoppingBagIcon size={18} style={{ marginRight: '8px' }} /> Add to Cart
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

          .custom-slider {
            height: 6px;
            background: #e2e8f0;
            border-radius: 5px;
            outline: none;
            transition: background 450ms ease-in;
            -webkit-appearance: none;
          }
          .custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #bc79e4;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(188, 121, 228, 0.5);
            transition: transform 0.1s ease;
          }
          .custom-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
          }
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .slide-in-right-animation {
            animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>


      {/* Start Content */}
      <div className="container py-5">
        <div className="row">
          {/* Sidebar Categories */}
          <div className="col-lg-3 d-none d-lg-block">
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

            {/* Price Filter Widget */}
            <div className="card border-0 shadow-sm mt-5 p-4" style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
              <h4 className="fw-bold mb-3 text-dark animate-fade-in" style={{ fontSize: '1.2rem', letterSpacing: '-0.3px' }}>
                <i className="fas fa-sliders-h me-2" style={{ color: '#bc79e4' }}></i> Filter by Price
              </h4>
              
              {/* Range Slider for Max Price */}
              <div className="mb-4">
                <div className="d-flex justify-content-between text-muted small fw-bold mb-2">
                  <span>MAX PRICE</span>
                  <span className="text-dark fw-bold" style={{ color: '#bc79e4' }}>{formatPrice(maxPrice)}</span>
                </div>
                <input 
                  type="range" 
                  className="form-range custom-slider"
                  min="50000" 
                  max="150000" 
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                  <span>₹50,000</span>
                  <span>₹1,50,000</span>
                </div>
              </div>

              {/* Min and Max Inputs */}
              <div className="row g-2 mb-4">
                <div className="col-6">
                  <label className="text-muted small fw-bold mb-1 d-block">MIN</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light text-muted border-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>₹</span>
                    <input 
                      type="number" 
                      className="form-control bg-light border-0 text-dark fw-semibold" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                      placeholder="Min"
                      style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label className="text-muted small fw-bold mb-1 d-block">MAX</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light text-muted border-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>₹</span>
                    <input 
                      type="number" 
                      className="form-control bg-light border-0 text-dark fw-semibold" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.max(0, Number(e.target.value)))}
                      placeholder="Max"
                      style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="mb-4">
                <label className="text-muted small fw-bold mb-2 d-block">QUICK PRESETS</label>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    { label: 'All Prices', min: 50000, max: 150000 },
                    { label: 'Under ₹75k', min: 50000, max: 75000 },
                    { label: '₹75k - ₹100k', min: 75000, max: 100000 },
                    { label: '₹100k - ₹125k', min: 100000, max: 125000 },
                    { label: 'Over ₹125k', min: 125000, max: 150000 }
                  ].map((preset, idx) => {
                    const isActive = minPrice === preset.min && maxPrice === preset.max;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setMinPrice(preset.min);
                          setMaxPrice(preset.max);
                        }}
                        className="btn btn-sm text-capitalize border"
                        style={{
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          padding: '6px 12px',
                          backgroundColor: isActive ? '#bc79e4' : 'transparent',
                          color: isActive ? '#ffffff' : '#64748b',
                          borderColor: isActive ? '#bc79e4' : '#e2e8f0',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={() => {
                  setMinPrice(50000);
                  setMaxPrice(150000);
                  setSelectedCategory('All');
                }}
                className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                style={{
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  padding: '10px',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  backgroundColor: '#f8fafc',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#0f172a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                <i className="fas fa-undo"></i> Reset Filters
              </button>
            </div>
          </div>


          {/* Products Grid */}
          <div className="col-lg-9">
            {/* Mobile/Tablet Toolbar: Filters Button + Search Capsule */}
            <div className="d-flex d-lg-none gap-3 mb-4 w-100 align-items-center">
              {/* Filters Capsule Button */}
              <button 
                onClick={() => setIsFiltersDrawerOpen(true)}
                className="btn bg-white border d-flex align-items-center justify-content-center gap-2 text-dark fw-bold px-4"
                style={{
                  height: '46px',
                  borderRadius: '24px',
                  fontSize: '0.95rem',
                  borderColor: '#e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  flexShrink: 0,
                  minWidth: '120px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filters
              </button>

              {/* Search Capsule Input Form */}
              <form action="/shop" method="get" className="position-relative flex-grow-1 mb-0">
                <i className="fa fa-search position-absolute text-muted" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}></i>
                <input 
                  type="text"
                  name="q"
                  className="form-control"
                  placeholder="Search products..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  style={{
                    paddingLeft: '44px',
                    paddingRight: '16px',
                    height: '46px',
                    borderRadius: '24px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: '#0f172a',
                    outline: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                />
              </form>
            </div>
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
            <div className="row align-items-center mb-4 pb-2">
              <div className="col-md-6 col-12 mb-3 mb-md-0">
                <h4 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                  <span className="text-muted fs-6 fw-normal ms-2">({sortedProducts.length} items)</span>
                </h4>
              </div>
              <div className="col-md-6 col-12 d-flex justify-content-md-end">
                <div className="d-flex align-items-center gap-2 w-100 justify-content-md-end">
                  <span className="text-muted small text-nowrap d-none d-sm-inline">Sort By:</span>
                  <select
                    className="form-select text-dark border shadow-sm"
                    value={sortBy}
                    onChange={handleSortChange}
                    style={{ cursor: 'pointer', minWidth: '180px', borderRadius: '8px', padding: '8px 12px' }}
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
            <div className="row" id="shop-products-grid">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <div className="col-md-4 mb-4" key={product.id}>
                    <div
                      onClick={() => { setSelectedProduct(product); setShowDetailsModal(true); }}
                      className="card product-wap border-0 overflow-hidden shadow-sm h-100 d-flex flex-column"
                      style={{ backgroundColor: '#ffffff', borderRadius: '16px', position: 'relative', cursor: 'pointer' }}
                    >

                      {/* Image Block with Floating Badges */}
                      <div style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px', position: 'relative', borderBottom: '1px solid #f1f5f9' }}>
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

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className="btn bg-white d-flex align-items-center justify-content-center shadow-sm"
                          style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: 'none',
                            zIndex: 10,
                            transition: 'all 0.2s'
                          }}
                          title={isWishlisted(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          <i className={isWishlisted(product.id) ? "fas fa-heart text-danger" : "far fa-heart text-secondary"} style={{ fontSize: '1.05rem' }}></i>
                        </button>

                        <img
                          className="card-img img-fluid"
                          src={getCleanImageUrl(product.image)}
                          alt={product.name}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      </div>

                      <div className="card-body bg-transparent d-flex flex-column flex-grow-1 justify-content-between p-3">
                        <div>
                          <div className="d-flex align-items-center mb-2">
                            <span className="me-2 d-flex align-items-center gap-1">
                              {renderStars(product.rating)}
                            </span>
                            <span className="small text-muted" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                              ({product.reviews || Math.floor((product.id ? product.id.charCodeAt(0) * 7 : 7) % 15) + 5})
                            </span>
                          </div>

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
                              {formatPrice(product.price)}
                            </span>
                          </div>

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
                            <ShoppingBagIcon size={16} style={{ marginRight: '8px' }} /> add to cart
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
            {totalPages > 1 && (
              <div className="row mt-5">
                <nav aria-label="Product Page Navigation">
                  <ul className="pagination justify-content-center align-items-center gap-2">
                    {/* Previous Button */}
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link shadow-sm d-flex align-items-center justify-content-center"
                        style={{
                          borderRadius: '12px',
                          width: '42px',
                          height: '42px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          color: '#0f172a',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                    </li>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      const isActive = currentPage === pageNum;
                      return (
                        <li key={pageNum} className={`page-item ${isActive ? 'active' : ''}`}>
                          <button
                            className="page-link shadow-sm d-flex align-items-center justify-content-center"
                            style={{
                              borderRadius: '12px',
                              width: '42px',
                              height: '42px',
                              border: '1px solid ' + (isActive ? '#0f172a' : '#e2e8f0'),
                              backgroundColor: isActive ? '#0f172a' : '#ffffff',
                              color: isActive ? '#ffffff' : '#0f172a',
                              fontWeight: '600',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer'
                            }}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}

                    {/* Next Button */}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link shadow-sm d-flex align-items-center justify-content-center"
                        style={{
                          borderRadius: '12px',
                          width: '42px',
                          height: '42px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          color: '#0f172a',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
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

      {/* Mobile Filters Drawer */}
      {isFiltersDrawerOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100" 
          style={{ zIndex: 12000, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(3px)', transition: 'all 0.3s' }}
          onClick={() => setIsFiltersDrawerOpen(false)}
        >
          <div 
            className="bg-white h-100 d-flex flex-column slide-in-right-animation" 
            style={{ 
              width: '85%', 
              maxWidth: '360px', 
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)', 
              position: 'relative',
              marginLeft: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between p-4 border-bottom">
              <h4 className="fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.3px' }}>
                <i className="fas fa-sliders-h me-2" style={{ color: '#bc79e4' }}></i> Filters
              </h4>
              <button 
                onClick={() => setIsFiltersDrawerOpen(false)}
                className="btn border-0 p-0 bg-transparent text-dark"
                style={{ fontSize: '1.45rem', cursor: 'pointer', outline: 'none' }}
                aria-label="Close Filters"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-grow-1 p-4 overflow-auto">
              {/* Category Filter */}
              <h5 className="fw-bold mb-3 text-dark">Categories</h5>
              <ul className="list-unstyled mb-5">
                <li className="pb-3 border-bottom mb-3" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setIsFiltersDrawerOpen(false);
                    }}
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
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setIsFiltersDrawerOpen(false);
                        }}
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

              {/* Price Filter Widget */}
              <div className="card border-0 shadow-sm p-4" style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                <h4 className="fw-bold mb-3 text-dark" style={{ fontSize: '1.2rem', letterSpacing: '-0.3px' }}>
                  <i className="fas fa-sliders-h me-2" style={{ color: '#bc79e4' }}></i> Filter by Price
                </h4>
                
                {/* Range Slider for Max Price */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between text-muted small fw-bold mb-2">
                    <span>MAX PRICE</span>
                    <span className="text-dark fw-bold" style={{ color: '#bc79e4' }}>{formatPrice(maxPrice)}</span>
                  </div>
                  <input 
                    type="range" 
                    className="form-range custom-slider"
                    min="50000" 
                    max="150000" 
                    step="5000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                    <span>₹50,000</span>
                    <span>₹1,50,000</span>
                  </div>
                </div>

                {/* Min and Max Inputs */}
                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <label className="text-muted small fw-bold mb-1 d-block">MIN</label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-light text-muted border-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>₹</span>
                      <input 
                        type="number" 
                        className="form-control bg-light border-0 text-dark fw-semibold" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                        placeholder="Min"
                        style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small fw-bold mb-1 d-block">MAX</label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-light text-muted border-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>₹</span>
                      <input 
                        type="number" 
                        className="form-control bg-light border-0 text-dark fw-semibold" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Math.max(0, Number(e.target.value)))}
                        placeholder="Max"
                        style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="mb-4">
                  <label className="text-muted small fw-bold mb-2 d-block">QUICK PRESETS</label>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      { label: 'All Prices', min: 50000, max: 150000 },
                      { label: 'Under ₹75k', min: 50000, max: 75000 },
                      { label: '₹75k - ₹100k', min: 75000, max: 100000 },
                      { label: '₹100k - ₹125k', min: 100000, max: 125000 },
                      { label: 'Over ₹125k', min: 125000, max: 150000 }
                    ].map((preset, idx) => {
                      const isActive = minPrice === preset.min && maxPrice === preset.max;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setMinPrice(preset.min);
                            setMaxPrice(preset.max);
                          }}
                          className="btn btn-sm text-capitalize border"
                          style={{
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            padding: '6px 12px',
                            backgroundColor: isActive ? '#bc79e4' : 'transparent',
                            color: isActive ? '#ffffff' : '#64748b',
                            borderColor: isActive ? '#bc79e4' : '#e2e8f0',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice(50000);
                    setMaxPrice(150000);
                    setSelectedCategory('All');
                    setIsFiltersDrawerOpen(false);
                  }}
                  className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                  style={{
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                    backgroundColor: '#f8fafc',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fas fa-undo"></i> Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ShopClient;
