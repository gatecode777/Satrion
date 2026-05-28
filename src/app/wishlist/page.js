"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '../../context/ShopContext';
import ProductCardImage from '@/components/ProductCardImage';

const Wishlist = () => {
  const { wishlist, toggleWishlist, moveWishlistToCart } = useShop();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getCleanImageUrl = (img) => {
    if (!img) return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%23f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%236c757d">No Image Available</text></svg>';
    if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) return img;
    return img.startsWith('/') ? img : `/${img}`;
  };

  const handleMoveToCart = (product) => {
    moveWishlistToCart(product);
  };

  const renderStars = (rating = 5) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fa fa-star ${index < rating ? 'text-warning' : 'text-muted'}`}
        style={{ fontSize: '14px' }}
      ></i>
    ));
  };

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

  return (
    <main className="bg-light py-5 min-vh-100">
      <div className="container">
        <h2 className="fw-bold mb-4 text-dark">My Wishlist</h2>

        {wishlist.length === 0 ? (
          <div className="text-center py-5 glass p-5 shadow-sm" style={{ borderRadius: '24px', backgroundColor: '#ffffff' }}>
            <i className="far fa-heart fa-5x mb-4 text-muted opacity-50"></i>
            <h3 className="fw-bold text-dark mb-3">Your Wishlist is Empty</h3>
            <p className="text-muted mb-4">Explore our catalog and click the heart icon to save products you love.</p>
            <Link href="/shop" className="btn btn-dark rounded-pill px-5 py-3 fw-bold hover-lift">
              Explore Products <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        ) : (
          <div className="row">
            {wishlist.map((product) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={product.id}>
                <div className="card h-100 border-0 overflow-hidden shadow-sm d-flex flex-column" style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                }}>
                  {/* Image Block */}
                  <div 
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowDetailsModal(true);
                    }}
                    className="position-relative d-block overflow-hidden" 
                    style={{ borderBottom: '1px solid #f1f1f1', cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa', height: '260px', width: '100%' }}>
                      <img src={getCleanImageUrl(product.image)} className="card-img-top w-100 h-100" alt={product.name} style={{ objectFit: 'cover' }} />
                    </div>
                    {/* Quick View Eye Button */}
                    <button suppressHydrationWarning={true}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setShowDetailsModal(true);
                      }}
                      className="btn btn-light position-absolute rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                      style={{
                        top: '12px',
                        right: '12px',
                        width: '38px',
                        height: '38px',
                        border: '1px solid rgba(0,0,0,0.05)',
                        color: '#0f172a',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        transition: 'all 0.2s',
                        zIndex: 5
                      }}
                      title="Quick View"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.transform = 'scale(1.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <i className="far fa-eye" style={{ fontSize: '1rem' }}></i>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="card-body p-4 d-flex flex-column flex-grow-1 justify-content-between">
                    <div>
                      <span className="badge bg-secondary mb-2" style={{ fontSize: '0.75rem' }}>{product.category}</span>
                      <div 
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowDetailsModal(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <h6 className="text-dark fw-bold mb-2 text-truncate" style={{ fontSize: '1.05rem' }}>{product.name}</h6>
                      </div>
                      <h5 className="fw-bold mb-3" style={{ color: '#000000ff' }}>₹ {product.price}</h5>
                    </div>

                    <div className="mt-auto pt-2 d-flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="btn btn-primary-gradient flex-grow-1 py-2 rounded-pill fw-bold hover-lift text-white"
                        style={{ fontSize: '0.9rem' }}
                      >
                        <i className="fas fa-cart-plus me-2"></i> Move to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="btn btn-outline-danger px-3 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '42px', height: '42px' }}
                        title="Remove from Wishlist"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
            <button suppressHydrationWarning={true}
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
                      <button suppressHydrationWarning={true}
                        onClick={() => {
                          handleMoveToCart(selectedProduct);
                          setShowDetailsModal(false);
                        }}
                        className="btn btn-primary-gradient d-flex align-items-center justify-content-center gap-2"
                        style={{
                          borderRadius: '12px',
                          padding: '16px 24px',
                          fontWeight: '700',
                          border: 'none',
                          flexGrow: 1,
                          fontSize: '1rem',
                          transition: 'all 0.2s',
                          color: '#ffffff'
                        }}
                      >
                        <i className="fas fa-cart-plus me-2"></i> Move to Cart
                      </button>
                      <button suppressHydrationWarning={true}
                        onClick={() => {
                          toggleWishlist(selectedProduct);
                          setShowDetailsModal(false);
                        }}
                        className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          transition: 'all 0.2s'
                        }}
                        title="Remove from Wishlist"
                      >
                        <i className="fas fa-trash-alt" style={{ fontSize: '1.2rem' }}></i>
                      </button>
                    </div>

                    {/* Delivery Info */}
                    <div
                      className="d-flex align-items-center gap-2 text-muted"
                      style={{
                        fontSize: '0.85rem',
                        borderTop: '1px solid #f1f5f9',
                        paddingTop: '20px'
                      }}
                    >
                      <i className="fas fa-truck" style={{ color: '#64748b' }}></i>
                      <span className="fw-bold text-dark">Shipping:</span>
                      <span style={{ color: '#64748b', fontWeight: '500' }}>Free Standard Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS animations */}
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

export default Wishlist;
