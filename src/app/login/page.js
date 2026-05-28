"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '../../context/ShopContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser, user } = useShop();
  const router = useRouter();

  // Redirect if already logged in — user login only handles regular users
  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const success = await loginUser(email, password);
    if (success) {
      // Redirect based on role — admin goes to panel, others to profile
      // The useEffect above will handle the redirect once user state updates
    }
  };

  return (
    <main className="position-relative d-flex align-items-center justify-content-center min-vh-100 py-5" style={{ backgroundColor: '#0f172a', overflow: 'hidden' }}>
      {/* Decorative background glow circles */}
      <div className="position-absolute rounded-circle" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(56,189,248,0) 70%)', top: '10%', left: '10%', zIndex: 1 }}></div>
      <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(192,132,252,0.15) 0%, rgba(192,132,252,0) 70%)', bottom: '10%', right: '10%', zIndex: 1 }}></div>

      <div className="container d-flex justify-content-center position-relative" style={{ zIndex: 2 }}>
        <div className="card glass-premium p-4 p-md-5 text-white" style={{ maxWidth: '480px', width: '100%', borderRadius: '24px' }}>
          {/* Back Button */}
          <div className="mb-4">
            <Link 
              href="/" 
              className="text-decoration-none d-inline-flex align-items-center"
              style={{ color: '#94a3b8', transition: 'all 0.2s ease', fontSize: '0.9rem', fontWeight: '500' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#38bdf8';
                e.currentTarget.querySelector('.fa-arrow-left').style.transform = 'translateX(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.querySelector('.fa-arrow-left').style.transform = 'none';
              }}
            >
              <i className="fas fa-arrow-left me-2" style={{ transition: 'transform 0.2s ease' }}></i> Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Welcome Back</h2>
            <p className="text-muted small">Login to access your Satrion profile and orders</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="text-start">
            {/* Email Field */}
            <div className="mb-4">
              <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-envelope"></i></span>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                  placeholder="name@example.com" 
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-lock"></i></span>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                  placeholder="••••••••" 
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="d-flex justify-content-between align-items-center mb-4" style={{ fontSize: '0.85rem' }}>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="rememberMe" style={{ cursor: 'pointer' }} />
                <label className="form-check-label text-muted" htmlFor="rememberMe" style={{ cursor: 'pointer' }}>
                  Remember me
                </label>
              </div>
              <a href="#" className="text-decoration-none" style={{ color: '#38bdf8' }} onClick={(e) => { e.preventDefault(); toast.info("Mock reset link sent!"); }}>Forgot Password?</a>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-vibrant-gradient w-100 py-3 fw-bold rounded-pill mb-4" style={{ fontSize: '1.05rem' }}>
              Login Now <i className="fas fa-sign-in-alt ms-2"></i>
            </button>
            
            {/* Register Link */}
            <p className="text-center text-muted mb-2" style={{ fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link href="/signup" style={{ color: '#c084fc', fontWeight: '600' }} className="text-decoration-none">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
