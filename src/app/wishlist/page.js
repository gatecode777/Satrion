"use client";

import React from 'react';
import Link from 'next/link';
import { useShop } from '../../context/ShopContext';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  const getCleanImageUrl = (img) => {
    if (!img) return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%23f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%236c757d">No Image Available</text></svg>';
    if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) return img;
    return img.startsWith('/') ? img : `/${img}`;
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    toggleWishlist(product); // Remove from wishlist after adding to cart
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
                  <Link href="/shop" className="position-relative d-block overflow-hidden" style={{ borderBottom: '1px solid #f1f1f1' }}>
                    <div className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa', height: '260px', width: '100%' }}>
                      <img src={getCleanImageUrl(product.image)} className="card-img-top w-100 h-100" alt={product.name} style={{ objectFit: 'cover' }} />
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="card-body p-4 d-flex flex-column flex-grow-1 justify-content-between">
                    <div>
                      <span className="badge bg-secondary mb-2" style={{ fontSize: '0.75rem' }}>{product.category}</span>
                      <Link href="/shop" className="text-decoration-none">
                        <h6 className="text-dark fw-bold mb-2 text-truncate" style={{ fontSize: '1.05rem' }}>{product.name}</h6>
                      </Link>
                      <h5 className="fw-bold mb-3" style={{ color: '#bc79e4' }}>{product.price}</h5>
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
    </main>
  );
};

export default Wishlist;
