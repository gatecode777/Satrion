"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Header = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { cart, wishlist, user, isLoginModalOpen, setIsLoginModalOpen, loginUser, signupUser } = useShop();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Modal form states
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const handleModalLogin = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    const success = loginUser(loginEmail, loginPassword);
    if (success) {
      setIsLoginModalOpen(false);
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  const handleModalSignup = (e) => {
    e.preventDefault();
    if (!signupUsername || !signupEmail || !signupPassword || !signupConfirmPassword || !signupPhone) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(signupEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(signupPhone)) {
      toast.error('Phone number must be exactly 10 digits and contain only numbers');
      return;
    }

    if (signupPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const success = signupUser(signupUsername, signupEmail, signupPassword, signupPhone);
    if (success) {
      setIsLoginModalOpen(false);
      setSignupUsername('');
      setSignupEmail('');
      setSignupPhone('');
      setSignupPassword('');
      setSignupConfirmPassword('');
    }
  };

  return (
    <>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top glass" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand text-success logo h1 align-self-center d-flex align-items-center" href="/" style={{ width: 'auto' }}>
            <img src="/satrion.png" alt="Satrion Logo" style={{ height: '75px', width: '75%', filter: 'brightness(0)' }} />
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#templatemo_main_nav"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="align-self-center collapse navbar-collapse flex-fill d-lg-flex justify-content-lg-between" id="templatemo_main_nav">
            <div className="flex-fill text-center">
              <ul className="nav navbar-nav d-flex justify-content-center mx-lg-auto gap-4">
                <li className="nav-item">
                  <Link className="nav-link" href="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/shop">Shop</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="navbar align-self-center d-flex">
              <div className="d-lg-none flex-sm-fill mt-3 mb-4 col-7 col-sm-auto pr-3">
                <div className="input-group">
                  <input type="text" className="form-control" id="inputMobileSearch" placeholder="Search ..." />
                  <div className="input-group-text">
                    <i className="fa fa-fw fa-search"></i>
                  </div>
                </div>
              </div>
              <button
                className="nav-icon d-none d-lg-inline bg-transparent border-0"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <i className="fa fa-fw fa-search text-dark mr-2"></i>
              </button>
              <Link className="nav-icon position-relative text-decoration-none me-3" href="/wishlist">
                <i className="fa fa-fw fa-heart text-dark"></i>
                {wishlist.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-white" style={{ fontSize: '0.65rem', padding: '3px 6px' }}>
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link className="nav-icon position-relative text-decoration-none me-3" href="/cart">
                <i className="fa fa-fw fa-cart-arrow-down text-dark"></i>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-white" style={{ fontSize: '0.65rem', padding: '3px 6px' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
              {user && user.isAdmin && (
                <Link className="nav-icon position-relative text-decoration-none me-3" href="/admin" title="Admin Panel">
                  <i className="fa fa-fw fa-cog text-dark"></i>
                </Link>
              )}
              <Link className="nav-icon position-relative text-decoration-none" href={user ? "/profile" : "/login"}>
                <i className="fa fa-fw fa-user text-dark"></i>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Close Header */}

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div 
          className="animate-fade-in-up"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 11000,
            animation: 'fadeIn 0.3s ease-in'
          }} 
          onClick={() => setIsSearchModalOpen(false)}
        >
          <div 
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: '650px',
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsSearchModalOpen(false)}
              style={{
                position: 'absolute',
                top: '-50px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                fontSize: '24px',
                cursor: 'pointer',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              ×
            </button>

            {/* Search Form */}
            <form 
              action="/shop" 
              method="get" 
              style={{ 
                borderRadius: '24px', 
                backgroundColor: '#ffffff',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}
            >
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control form-control-lg border-0 shadow-none text-dark" 
                  id="inputModalSearch" 
                  name="q" 
                  placeholder="Search products, brands and more..." 
                  autoFocus
                  style={{ 
                    fontSize: '1.2rem', 
                    backgroundColor: '#f1f5f9', 
                    borderRadius: '12px 0 0 12px',
                    padding: '14px 20px',
                    outline: 'none'
                  }} 
                />
                <button 
                  type="submit" 
                  className="btn btn-dark d-flex align-items-center justify-content-center" 
                  style={{ 
                    borderRadius: '0 12px 12px 0', 
                    padding: '0 28px',
                    fontSize: '1.1rem'
                  }}
                >
                  <i className="fa fa-fw fa-search text-white"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login / Signup Modal */}
      {isLoginModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.3s ease-in'
        }} onClick={() => setIsLoginModalOpen(false)}>
          
          <div className="card glass-premium p-4 p-md-5 text-white animate-fade-in-up" style={{ 
            maxWidth: '480px', 
            width: '90%', 
            borderRadius: '24px',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '20px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {isLoginView ? (
              /* Login View */
              <form onSubmit={handleModalLogin} className="text-start">
                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-2">Welcome Back</h3>
                  <p className="text-muted small">Login to continue customized setup</p>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-envelope"></i></span>
                    <input 
                      type="email" 
                      value={loginEmail} 
                      onChange={(e) => setLoginEmail(e.target.value)} 
                      required 
                      className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                      placeholder="name@example.com" 
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-lock"></i></span>
                    <input 
                      type="password" 
                      value={loginPassword} 
                      onChange={(e) => setLoginPassword(e.target.value)} 
                      required 
                      className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-vibrant-gradient w-100 py-3 fw-bold rounded-pill mb-4" style={{ fontSize: '1rem' }}>
                  Login Now <i className="fas fa-sign-in-alt ms-2"></i>
                </button>
                
                <p className="text-center text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setIsLoginView(false)} style={{ color: '#c084fc', background: 'none', border: 'none', padding: 0, fontWeight: '600' }}>
                    Sign Up
                  </button>
                </p>
              </form>
            ) : (
              /* Signup View */
              <form onSubmit={handleModalSignup} className="text-start">
                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-2">Create Account</h3>
                  <p className="text-muted small">Sign up to buy and build custom systems</p>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Username</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-user"></i></span>
                    <input 
                      type="text" 
                      value={signupUsername} 
                      onChange={(e) => setSignupUsername(e.target.value)} 
                      required 
                      className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                      placeholder="e.g. GamerName" 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-envelope"></i></span>
                    <input 
                      type="email" 
                      value={signupEmail} 
                      onChange={(e) => setSignupEmail(e.target.value)} 
                      required 
                      className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                      placeholder="name@example.com" 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-phone"></i></span>
                    <input 
                      type="tel" 
                      value={signupPhone} 
                      onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                      required 
                      maxLength="10"
                      className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                      placeholder="e.g. 9876543210" 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-lock"></i></span>
                    <input 
                      type="password" 
                      value={signupPassword} 
                      onChange={(e) => setSignupPassword(e.target.value)} 
                      required 
                      className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                      placeholder="At least 6 characters" 
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-check-double"></i></span>
                    <input 
                      type="password" 
                      value={signupConfirmPassword} 
                      onChange={(e) => setSignupConfirmPassword(e.target.value)} 
                      required 
                      className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                      placeholder="Re-enter password" 
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-vibrant-gradient w-100 py-3 fw-bold rounded-pill mb-4" style={{ fontSize: '1rem' }}>
                  Create Account <i className="fas fa-user-plus ms-2"></i>
                </button>
                
                <p className="text-center text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                  Already have an account?{' '}
                  <button type="button" onClick={() => setIsLoginView(true)} style={{ color: '#38bdf8', background: 'none', border: 'none', padding: 0, fontWeight: '600' }}>
                    Login
                  </button>
                </p>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default Header;
