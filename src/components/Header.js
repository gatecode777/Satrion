"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Header = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { cart, wishlist, user, isLoginModalOpen, setIsLoginModalOpen, loginUser, signupUser } = useShop();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(mobileSearchQuery)}`;
      setIsMobileMenuOpen(false);
    }
  };

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
      {/* Scoped CSS for Mobile Offcanvas Transitions */}
      <style>
        {`
          @keyframes slideInLeft {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          .slide-in-left-animation {
            animation: slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>

      {/* Desktop Header (d-none d-lg-block) */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top glass d-none d-lg-block" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand text-success logo h1 align-self-center d-flex align-items-center" href="/" style={{ width: 'auto' }}>
            <img src="/satrion.png?v=2" alt="Satrion Logo" style={{ height: '75px', width: '75%', filter: 'brightness(0)' }} />
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
            <div className="navbar align-self-center d-flex align-items-center gap-4">
              <form action="/shop" method="get" className="d-lg-none flex-sm-fill mt-3 mb-4 col-7 col-sm-auto pr-3">
                <div className="input-group">
                  <input 
                    type="text" 
                    name="q"
                    className="form-control text-dark bg-light border" 
                    id="inputMobileSearch" 
                    placeholder="Search ..." 
                    aria-label="Search products"
                    style={{ minHeight: '44px' }}
                  />
                  <button type="submit" className="input-group-text bg-dark border-0 text-white" aria-label="Submit Search" style={{ cursor: 'pointer' }}>
                    <i className="fa fa-fw fa-search"></i>
                  </button>
                </div>
              </form>
              <button
                className="nav-icon d-none d-lg-inline bg-transparent border-0 p-0"
                onClick={() => setIsSearchModalOpen(true)}
                aria-label="Search"
                title="Search"
              >
                <i className="fa fa-fw fa-search text-dark"></i>
              </button>
              <Link 
                className="nav-icon position-relative text-decoration-none" 
                href="/wishlist"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <i className="fa fa-fw fa-heart text-dark"></i>
                {wishlist.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-white" style={{ fontSize: '0.65rem', padding: '3px 6px' }}>
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link 
                className="nav-icon position-relative text-decoration-none" 
                href="/cart"
                aria-label="Shopping Cart"
                title="Shopping Cart"
              >
                <i className="fa fa-fw fa-cart-arrow-down text-dark"></i>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-white" style={{ fontSize: '0.65rem', padding: '3px 6px' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
              {user && user.isAdmin && (
                <Link 
                  className="nav-icon position-relative text-decoration-none" 
                  href="/admin" 
                  title="Admin Panel"
                  aria-label="Admin Panel"
                >
                  <i className="fa fa-fw fa-cog text-dark"></i>
                </Link>
              )}
              <Link 
                className="nav-icon position-relative text-decoration-none" 
                href={user ? "/profile" : "/login"}
                aria-label={user ? "Profile" : "Login"}
                title={user ? "Profile" : "Login"}
              >
                <i className="fa fa-fw fa-user text-dark"></i>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Header (d-block d-lg-none) — Exact SDPT Layout */}
      <div className="d-lg-none bg-white py-3 px-3 border-bottom sticky-top shadow-sm glass" style={{ zIndex: 1030 }}>
        {/* Row 1: Left Hamburger, Center Logo, Right Profile & Cart */}
        <div className="d-flex align-items-center justify-content-between">
          {/* Left: Hamburger menu toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="btn p-0 border-0 bg-transparent text-dark"
            style={{ fontSize: '1.45rem', outline: 'none' }}
            aria-label="Open Menu"
          >
            <i className="fa fa-bars"></i>
          </button>

          {/* Center: Satrion Logo */}
          <Link href="/" className="d-flex align-items-center">
            <img src="/satrion.png?v=2" alt="Satrion Logo" style={{ height: '42px', width: 'auto', filter: 'brightness(0)' }} />
          </Link>

          {/* Right: Profile & Cart Icon with Badge */}
          <div className="d-flex align-items-center gap-3">
            <Link href={user ? "/profile" : "/login"} className="text-dark" style={{ fontSize: '1.35rem' }} aria-label="Profile">
              <i className="far fa-user"></i>
            </Link>
            <Link href="/cart" className="position-relative text-dark" style={{ fontSize: '1.35rem' }} aria-label="Shopping Cart">
              <i className="fas fa-shopping-bag"></i>
              {cartCount > 0 && (
                <span 
                  className="position-absolute translate-middle badge rounded-circle bg-danger d-flex align-items-center justify-content-center text-white" 
                  style={{ 
                    fontSize: '0.6rem', 
                    width: '18px', 
                    height: '18px', 
                    top: '-3px', 
                    right: '-9px',
                    padding: '0',
                    fontWeight: '700'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Row 2: Full Width Search Capsule below top bar */}
        <form onSubmit={handleMobileSearchSubmit} className="mt-3">
          <div className="position-relative w-100">
            <i className="fa fa-search position-absolute text-muted" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.95rem' }}></i>
            <input 
              type="text"
              className="form-control"
              placeholder="Search for products..."
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              style={{
                paddingLeft: '44px',
                paddingRight: '16px',
                height: '42px',
                borderRadius: '24px',
                backgroundColor: '#f1f5f9',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#0f172a',
                outline: 'none',
                boxShadow: 'none'
              }}
            />
          </div>
        </form>
      </div>

      {/* Mobile Drawer Offcanvas Slide-in Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100" 
          style={{ zIndex: 12000, backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(3px)', transition: 'all 0.3s' }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="bg-white h-100 d-flex flex-column slide-in-left-animation" 
            style={{ 
              width: '80%', 
              maxWidth: '340px', 
              boxShadow: '4px 0 24px rgba(0,0,0,0.15)', 
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top row: Satrion Logo on left, Close X button on right */}
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img src="/satrion.png?v=2" alt="Satrion Logo" style={{ height: '36px', width: 'auto', filter: 'brightness(0)' }} />
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn border-0 p-0 bg-transparent text-dark"
                style={{ fontSize: '1.45rem', cursor: 'pointer', outline: 'none' }}
                aria-label="Close Menu"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Drawer Content Body */}
            <div className="flex-grow-1 p-3 overflow-auto">
              {/* Capsule Search Box inside Drawer */}
              <form onSubmit={handleMobileSearchSubmit} className="mb-4">
                <div className="position-relative w-100">
                  <i className="fa fa-search position-absolute text-muted" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.95rem' }}></i>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="Search CPU, GPU, RAM..."
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    style={{
                      paddingLeft: '44px',
                      paddingRight: '16px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: '#f1f5f9',
                      border: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: '#0f172a',
                      outline: 'none',
                      boxShadow: 'none'
                    }}
                  />
                </div>
              </form>

              {/* Navigation lists */}
              <div className="d-flex flex-column gap-3">
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-decoration-none text-dark fw-bold py-2 border-bottom d-block"
                  style={{ fontSize: '1.1rem', borderColor: '#f1f5f9' }}
                >
                  Home
                </Link>

                {/* Products Dropdown Accordion */}
                <div className="border-bottom pb-2" style={{ borderColor: '#f1f5f9' }}>
                  <button 
                    onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                    className="w-100 border-0 bg-transparent p-0 py-2 d-flex align-items-center justify-content-between text-dark fw-bold"
                    style={{ fontSize: '1.1rem', outline: 'none' }}
                  >
                    <span>Products</span>
                    <i className="fas fa-chevron-down text-muted" style={{ fontSize: '0.85rem', transform: isProductsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}></i>
                  </button>

                  {/* Categories inside Products dropdown accordion */}
                  {isProductsDropdownOpen && (
                    <div className="ps-3 mt-2 d-flex flex-column gap-2" style={{ borderLeft: '2px solid #bc79e4' }}>
                      <Link 
                        href="/shop" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-decoration-none text-muted py-1"
                        style={{ fontSize: '0.95rem', fontWeight: '600', color: '#64748b' }}
                      >
                        All Products
                      </Link>
                      {[
                        { name: 'Processors', url: '/shop?category=Processors' },
                        { name: 'Graphics Cards', url: '/shop?category=Graphics%20Cards' },
                        { name: 'Gaming Laptops', url: '/shop?category=Gaming%20Laptops' },
                        { name: 'Custom Gaming PCs', url: '/shop?category=Custom%20Gaming%20PCs' },
                        { name: 'Monitors', url: '/shop?category=Monitors' }
                      ].map((item, idx) => (
                        <Link 
                          key={idx}
                          href={item.url} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-decoration-none text-muted py-1"
                          style={{ fontSize: '0.95rem', fontWeight: '500' }}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link 
                  href="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-decoration-none text-dark fw-bold py-2 border-bottom d-block"
                  style={{ fontSize: '1.1rem', borderColor: '#f1f5f9' }}
                >
                  About
                </Link>

                <Link 
                  href="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-decoration-none text-dark fw-bold py-2 border-bottom d-block"
                  style={{ fontSize: '1.1rem', borderColor: '#f1f5f9' }}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
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
