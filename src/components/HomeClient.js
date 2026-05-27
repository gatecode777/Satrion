"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';

const HomeClient = ({ initialCategories = [], initialProducts = [] }) => {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const isWishlisted = (productId) => wishlist.some((item) => item.id === productId);

  // Carousel states for automatic sliding
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = 5;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [categories, setCategories] = useState(initialCategories);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [gamingProducts, setGamingProducts] = useState([]);

  useEffect(() => {
    // Scroll reset
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }

    // Filter products locally for the sections
    const featured = initialProducts.filter(p => p.homepageSection === 'Featured Products' && p.isActive !== false).slice(0, 6);
    setFeaturedProducts(featured);

    const bestsellers = initialProducts.filter(p => p.homepageSection === 'Bestsellers' && p.isActive !== false).slice(0, 6);
    setBestsellerProducts(bestsellers);

    const gaming = initialProducts.filter(p => p.homepageSection === 'Our Range of Gaming Products' && p.isActive !== false).slice(0, 6);
    setGamingProducts(gaming);
  }, [initialProducts]);

  const renderStars = (rating = 5) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fa fa-star ${index < rating ? 'text-warning' : 'text-muted'}`}
        style={{ fontSize: '0.9rem' }}
      ></i>
    ));
  };

  const getCleanImageUrl = (img) => {
    if (!img) return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%23f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%236c757d">No Image Available</text></svg>';
    if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) return img;
    return img.startsWith('/') ? img : `/${img}`;
  };

  return (
    <main className="bg-light">
      {/* Hero Section Carousel */}
      <div id="hero-carousel" className="carousel slide carousel-fade">
        <div className="carousel-indicators">
          {[...Array(slidesCount)].map((_, idx) => (
            <button 
              key={idx}
              type="button" 
              onClick={() => setCurrentSlide(idx)}
              className={currentSlide === idx ? 'active' : ''} 
              aria-current={currentSlide === idx ? 'true' : 'false'} 
              aria-label={`Slide ${idx + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner" style={{ height: '80vh' }}>
          {[
            { img: '/banner_img_01_new.png', tag: 'GAMING SERIES', title: 'Unleash Gaming Power', desc: 'High-performance gaming PCs with RTX graphics.' },
            { img: '/banner_img_02_new.png', tag: 'NEW ARRIVALS', title: 'Next-Gen Storage', desc: 'Ultra-fast NVMe SSDs for seamless loading.' },
            { img: '/banner_img_03_new.png', tag: 'ACCESSORIES', title: 'Precision Control', desc: 'Ergonomic mice and mechanical keyboards.' },
            { img: '/banner_img_04_new.png', tag: 'LAPTOPS', title: 'Premium Mobility', desc: 'Sleek, powerful laptops for professionals on the go.' },
            { img: '/banner_img_05_new.png', tag: 'CONSOLES', title: 'Next-Level Play', desc: 'Minimalist controllers and gear for true gamers.' }
          ].map((banner, idx) => (
            <div className={`carousel-item h-100 ${idx === currentSlide ? 'active' : ''}`} key={idx}>
              <img
                src={banner.img}
                className="d-block w-100 h-100"
                style={{ objectFit: 'cover', opacity: 0.8 }}
                alt={banner.title}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center">
                <div className="container">
                  <div className="col-lg-5 col-md-7 animate-fade-in-up glass p-5 shadow-lg" style={{ borderRadius: '24px', border: '1px solid rgba(255,255,255,0.5)' }}>
                    <span className="text-secondary" style={{ letterSpacing: '2px', fontWeight: '600', fontSize: '0.9rem' }}>{banner.tag}</span>
                    <h1 className="display-4 fw-bolder text-dark mt-2 mb-3" style={{ lineHeight: '1.1' }}>
                      {banner.title.split(' ')[0]}<br />
                      {banner.title.split(' ').slice(1).join(' ')}
                    </h1>
                    <p className="lead text-muted mb-4" style={{ opacity: 0.8 }}>{banner.desc}</p>
                    <Link href="/shop" className="btn btn-dark rounded-pill px-4 py-2 fw-bold hover-lift">
                      Shop Now <i className="fas fa-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button 
          className="carousel-control-prev" 
          type="button" 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount)}
          style={{ width: '5%' }}
        >
          <span className="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true" style={{ width: '40px', height: '40px', backgroundSize: '20px' }}></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button 
          className="carousel-control-next" 
          type="button" 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slidesCount)}
          style={{ width: '5%' }}
        >
          <span className="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true" style={{ width: '40px', height: '40px', backgroundSize: '20px' }}></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Features Bar */}
      <section className="py-4 border-bottom border-light" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="row text-center text-md-start">
            {[
              { icon: 'fa-truck', title: 'Free Shipping', desc: 'On all orders over ₹5,000' },
              { icon: 'fa-shield-alt', title: 'Secure Payment', desc: '100% protected payments' },
              { icon: 'fa-headset', title: '24/7 Support', desc: 'Dedicated tech experts' },
              { icon: 'fa-credit-card', title: 'Easy EMI', desc: 'Available on all major banks' }
            ].map((feature, idx) => (
              <div className="col-6 col-lg-3 mb-3 mb-lg-0 d-flex align-items-center justify-content-center justify-content-md-start" key={idx}>
                <i className={`fas ${feature.icon} fa-2x text-dark me-3 opacity-75`}></i>
                <div>
                  <h6 className="text-dark mb-0 fw-bold">{feature.title}</h6>
                  <small className="text-muted">{feature.desc}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Bar */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span>⚡ Spring Clearance Event: Save Up to 70%</span>
          <span>🖥️ Build Your Dream PC Today</span>
          <span>🔧 Free Assembly on Custom Builds</span>
          <span>🆕 New Components Just Dropped</span>
          <span>🚚 Free Shipping on Orders Over ₹5000</span>
          <span>⚡ Spring Clearance Event: Save Up to 70%</span>
          <span>🖥️ Build Your Dream PC Today</span>
          <span>🔧 Free Assembly on Custom Builds</span>
          <span>🆕 New Components Just Dropped</span>
          <span>🚚 Free Shipping on Orders Over ₹5000</span>
        </div>
      </div>

      {/* Shop by Components (Horizontal Scroll) */}
      <section className="container py-5 mt-4">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-muted fw-bold" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>BROWSE COLLECTION</span>
            <h2 className="h1 fw-bold text-dark mt-1">Shop by Components</h2>
          </div>
          <div className="d-none d-md-flex gap-2">
            <button className="btn btn-outline-dark rounded-circle" style={{ width: '40px', height: '40px' }}><i className="fas fa-chevron-left"></i></button>
            <button className="btn btn-outline-dark rounded-circle" style={{ width: '40px', height: '40px' }}><i className="fas fa-chevron-right"></i></button>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No categories available.</p>
          </div>
        ) : (
          <div className="row overflow-auto flex-nowrap pb-4 hide-scroll" style={{ WebkitOverflowScrolling: 'touch', margin: '0 -15px', padding: '0 15px' }}>
            {categories.map((item, idx) => (
              <div className="col-10 col-sm-6 col-md-4 col-lg-3" key={item.id || idx}>
                <Link href={`/shop?category=${encodeURIComponent(item.name)}`} className="text-decoration-none">
                  <div className="card h-100 hover-lift border-0 overflow-hidden shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '16px' }}>
                    <img src={getCleanImageUrl(item.image) || '/category_img_01.jpg'} className="card-img-top" alt={item.name} style={{ height: '200px', objectFit: 'cover' }} />
                    <div className="card-body text-center py-4">
                      <h5 className="card-title fw-bold text-dark mb-0">{item.name}</h5>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="container py-5">
        <div className="row text-center mb-5">
          <div className="col-lg-6 m-auto">
            <h2 className="h1 fw-bold text-dark">Featured Products</h2>
            <p className="text-muted">Discover our best-selling products trusted by customers for quality and performance.</p>
          </div>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No featured products available.</p>
          </div>
        ) : (
          <div className="row">
            {featuredProducts.map((prod, idx) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={prod.id || idx}>
                <div
                  onClick={() => { setSelectedProduct(prod); setShowDetailsModal(true); }}
                  className="card product-wap border-0 overflow-hidden shadow-sm h-100 d-flex flex-column"
                  style={{ backgroundColor: '#ffffff', borderRadius: '16px', position: 'relative', cursor: 'pointer' }}
                >

                  {/* Image Block with Floating Badges */}
                  <div style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px', position: 'relative', borderBottom: '1px solid #f1f5f9' }}>
                    {prod.rating >= 4 ? (
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
                        toggleWishlist(prod);
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
                      title={isWishlisted(prod.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <i className={isWishlisted(prod.id) ? "fas fa-heart text-danger" : "far fa-heart text-secondary"} style={{ fontSize: '1.05rem' }}></i>
                    </button>

                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        className="card-img-top img-fluid"
                        src={getCleanImageUrl(prod.image) || '/feature_prod_01.jpg'}
                        alt={prod.name}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  </div>

                  <div className="card-body bg-transparent d-flex flex-column flex-grow-1 justify-content-between p-3">
                    <div>
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-2 d-flex align-items-center gap-1">
                          {renderStars(prod.rating)}
                        </span>
                        <span className="small text-muted" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                          ({prod.reviews || Math.floor((prod.id ? prod.id.charCodeAt(0) * 7 : 7) % 15) + 5})
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold text-dark flex-grow-1 me-3 mb-0 hover-underline"
                          style={{ fontSize: '1.05rem', lineHeight: '1.4' }}
                        >
                          {prod.name}
                        </h5>
                        <span className="h5 fw-bold text-dark mb-0 text-nowrap" style={{ fontSize: '1.2rem' }}>
                          {prod.price}
                        </span>
                      </div>

                      <div className="small text-muted text-capitalize mb-3" style={{ fontSize: '0.82rem', fontWeight: '500' }}>
                        {(() => {
                          const categoryPart = prod.category || 'Hardware';
                          const nameParts = prod.name.split(' ').filter(w => w.length > 2 && !w.includes('(') && !w.includes(')'));
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
                          addToCart(prod);
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
                          setSelectedProduct(prod);
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
            ))}
          </div>
        )}
      </section>

      {/* Bestsellers */}
      <section className="container py-5 border-top" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
        <div className="row text-center mb-5">
          <div className="col-lg-6 m-auto">
            <h2 className="h1 fw-bold text-dark">Bestsellers</h2>
            <p className="text-muted">Our most popular and highly rated products across all categories.</p>
          </div>
        </div>

        {bestsellerProducts.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No bestsellers available.</p>
          </div>
        ) : (
          <div className="row">
            {bestsellerProducts.map((prod, idx) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={prod.id || idx}>
                <div
                  onClick={() => { setSelectedProduct(prod); setShowDetailsModal(true); }}
                  className="card product-wap border-0 overflow-hidden shadow-sm h-100 d-flex flex-column"
                  style={{ backgroundColor: '#ffffff', borderRadius: '16px', position: 'relative', cursor: 'pointer' }}
                >

                  {/* Image Block with Floating Badges */}
                  <div style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', justifycontent: 'center', alignItems: 'center', height: '280px', position: 'relative', borderBottom: '1px solid #f1f5f9' }}>
                    {prod.rating >= 4 ? (
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
                        toggleWishlist(prod);
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
                      title={isWishlisted(prod.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <i className={isWishlisted(prod.id) ? "fas fa-heart text-danger" : "far fa-heart text-secondary"} style={{ fontSize: '1.05rem' }}></i>
                    </button>

                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        className="card-img-top img-fluid"
                        src={getCleanImageUrl(prod.image) || '/shop_01.jpg'}
                        alt={prod.name}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  </div>

                  <div className="card-body bg-transparent d-flex flex-column flex-grow-1 justify-content-between p-3">
                    <div>
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-2 d-flex align-items-center gap-1">
                          {renderStars(prod.rating)}
                        </span>
                        <span className="small text-muted" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                          ({prod.reviews || Math.floor((prod.id ? prod.id.charCodeAt(0) * 7 : 7) % 15) + 5})
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold text-dark flex-grow-1 me-3 mb-0 hover-underline"
                          style={{ fontSize: '1.05rem', lineHeight: '1.4' }}
                        >
                          {prod.name}
                        </h5>
                        <span className="h5 fw-bold text-dark mb-0 text-nowrap" style={{ fontSize: '1.2rem' }}>
                          {prod.price}
                        </span>
                      </div>

                      <div className="small text-muted text-capitalize mb-3" style={{ fontSize: '0.82rem', fontWeight: '500' }}>
                        {(() => {
                          const categoryPart = prod.category || 'Hardware';
                          const nameParts = prod.name.split(' ').filter(w => w.length > 2 && !w.includes('(') && !w.includes(')'));
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
                          addToCart(prod);
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
                          setSelectedProduct(prod);
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
            ))}
          </div>
        )}
      </section>

      {/* Our Range of Gaming Products */}
      <section className="container py-5 border-top" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
        <div className="row text-center mb-5">
          <div className="col-lg-6 m-auto">
            <h2 className="h1 fw-bold text-dark">Our Range of Gaming Products</h2>
            <p className="text-muted">Elevate your gameplay with top-tier gaming peripherals and gear.</p>
          </div>
        </div>

        {gamingProducts.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No gaming products available.</p>
          </div>
        ) : (
          <div className="row">
            {gamingProducts.map((prod, idx) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={prod.id || idx}>
                <div
                  onClick={() => { setSelectedProduct(prod); setShowDetailsModal(true); }}
                  className="card product-wap border-0 overflow-hidden shadow-sm h-100 d-flex flex-column"
                  style={{ backgroundColor: '#ffffff', borderRadius: '16px', position: 'relative', cursor: 'pointer' }}
                >

                  {/* Image Block with Floating Badges */}
                  <div style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', justifycontent: 'center', alignItems: 'center', height: '280px', position: 'relative', borderBottom: '1px solid #f1f5f9' }}>
                    {prod.rating >= 4 ? (
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
                        toggleWishlist(prod);
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
                      title={isWishlisted(prod.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <i className={isWishlisted(prod.id) ? "fas fa-heart text-danger" : "far fa-heart text-secondary"} style={{ fontSize: '1.05rem' }}></i>
                    </button>

                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        className="card-img-top img-fluid"
                        src={getCleanImageUrl(prod.image) || '/rgb_keyboard.png'}
                        alt={prod.name}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  </div>

                  <div className="card-body bg-transparent d-flex flex-column flex-grow-1 justify-content-between p-3">
                    <div>
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-2 d-flex align-items-center gap-1">
                          {renderStars(prod.rating)}
                        </span>
                        <span className="small text-muted" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                          ({prod.reviews || Math.floor((prod.id ? prod.id.charCodeAt(0) * 7 : 7) % 15) + 5})
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold text-dark flex-grow-1 me-3 mb-0 hover-underline"
                          style={{ fontSize: '1.05rem', lineHeight: '1.4' }}
                        >
                          {prod.name}
                        </h5>
                        <span className="h5 fw-bold text-dark mb-0 text-nowrap" style={{ fontSize: '1.2rem' }}>
                          {prod.price}
                        </span>
                      </div>

                      <div className="small text-muted text-capitalize mb-3" style={{ fontSize: '0.82rem', fontWeight: '500' }}>
                        {(() => {
                          const categoryPart = prod.category || 'Hardware';
                          const nameParts = prod.name.split(' ').filter(w => w.length > 2 && !w.includes('(') && !w.includes(')'));
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
                          addToCart(prod);
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
                          setSelectedProduct(prod);
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
            ))}
          </div>
        )}
      </section>

      {/* Services / Why Choose Us */}
      <section className="py-5" style={{ backgroundColor: '#000000ff' }}>
        <div className="container py-5">
          <div className="row text-center mb-5">
            <div className="col-lg-6 m-auto">
              <h2 className="h1 fw-bold text-white">Our Services</h2>
              <p className="text-secondary">We offer a range of IT services to help businesses thrive in the digital age.</p>
            </div>
          </div>
          <div className="row">
            {[
              { icon: 'fa-codepen', title: 'Web Development' },
              { icon: 'fa-handshake', title: 'IT Support' },
              { icon: 'fa-rocketchat', title: 'IT Personal Services' },
              { icon: 'fa-user', title: '24 Hours Service' }
            ].map((srv, idx) => (
              <div className="col-md-6 col-lg-3 mb-4" key={idx}>
                <div className="h-100 py-5 px-3 text-center rounded-4 hover-lift" style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }}>
                  <div className="d-inline-flex align-items-center justify-content-center bg-black rounded-circle mb-4" style={{ width: '80px', height: '80px' }}>
                    <i className={`fa-solid ${srv.icon} fa-2x text-white`}></i>
                  </div>
                  <h5 className="text-white fw-bold">{srv.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
        `}
      </style>
    </main>
  );
};

export default HomeClient;
