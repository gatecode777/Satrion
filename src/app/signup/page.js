"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '../../context/ShopContext';
import { toast } from 'react-toastify';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { signupUser, user } = useShop();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword || !phone) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Phone number must be exactly 10 digits and contain only numbers');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const success = await signupUser(username, email, password, phone);
    if (success) {
      router.push('/profile');
    }
  };

  return (
    <main className="position-relative d-flex align-items-center justify-content-center min-vh-100 py-5" style={{ backgroundColor: '#0f172a', overflow: 'hidden' }}>
      {/* Decorative background glow circles */}
      <div className="position-absolute rounded-circle" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(56,189,248,0) 70%)', bottom: '10%', left: '10%', zIndex: 1 }}></div>
      <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(192,132,252,0.15) 0%, rgba(192,132,252,0) 70%)', top: '10%', right: '10%', zIndex: 1 }}></div>

      <div className="container d-flex justify-content-center position-relative" style={{ zIndex: 2 }}>
        <div className="card glass-premium p-4 p-md-5 text-white" style={{ maxWidth: '480px', width: '100%', borderRadius: '24px' }}>
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Create Account</h2>
            <p className="text-muted small">Sign up to buy and build custom systems</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="text-start">
            {/* Username Field */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Username</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-user"></i></span>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                  placeholder="e.g. GamerName" 
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-3">
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
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-phone"></i></span>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                  required 
                  maxLength="10"
                  className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                  placeholder="e.g. 9876543210" 
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-lock"></i></span>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                  placeholder="At least 6 characters" 
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-check-double"></i></span>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                  placeholder="Re-enter password" 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-vibrant-gradient w-100 py-3 fw-bold rounded-pill mb-4" style={{ fontSize: '1.05rem' }}>
              Create Account <i className="fas fa-user-plus ms-2"></i>
            </button>
            
            {/* Login Link */}
            <p className="text-center text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#38bdf8', fontWeight: '600' }} className="text-decoration-none">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Signup;
