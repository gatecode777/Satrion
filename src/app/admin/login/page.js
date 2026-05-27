"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '../../../context/ShopContext';
import { toast } from 'react-toastify';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginUser, user, loading } = useShop();
  const router = useRouter();

  // If already logged in as admin, redirect to panel
  useEffect(() => {
    if (!loading && user) {
      if (user.isAdmin) {
        router.push('/admin');
      } else {
        // Logged in but not admin — send to home
        toast.error('You do not have administrator privileges.');
        router.push('/');
      }
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    const success = await loginUser(email, password);
    setIsSubmitting(false);

    if (success) {
      // useEffect above will handle redirect once user state updates
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #060b18 0%, #0d1b2e 50%, #060b18 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Ambient background effects */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)',
        top: '-100px', left: '-100px', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        bottom: '-80px', right: '-80px', pointerEvents: 'none'
      }} />

      {/* Subtle grid pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '440px', padding: '0 20px' }}>

        {/* Brand mark */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px', borderRadius: '16px', marginBottom: '16px',
            background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(99,102,241,0.2))',
            border: '1px solid rgba(56,189,248,0.3)',
          }}>
            <i className="fas fa-shield-halved" style={{ fontSize: '28px', color: '#38bdf8' }} />
          </div>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.6rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            Admin Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>
            SATRION — Restricted Access
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(56,189,248,0.12)',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset',
        }}>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-envelope" style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: '#475569', fontSize: '0.9rem'
                }} />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@satrion.com"
                  style={{
                    width: '100%', padding: '12px 14px 12px 40px', boxSizing: 'border-box',
                    background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(71,85,105,0.5)',
                    borderRadius: '10px', color: '#e2e8f0', fontSize: '0.95rem', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(71,85,105,0.5)'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-lock" style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: '#475569', fontSize: '0.9rem'
                }} />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 44px 12px 40px', boxSizing: 'border-box',
                    background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(71,85,105,0.5)',
                    borderRadius: '10px', color: '#e2e8f0', fontSize: '0.95rem', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(71,85,105,0.5)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '4px'
                  }}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%', padding: '13px', border: 'none', borderRadius: '10px',
                background: isSubmitting
                  ? 'rgba(56,189,248,0.3)'
                  : 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(14,165,233,0.3)',
                transition: 'all 0.2s', letterSpacing: '0.3px',
              }}
            >
              {isSubmitting ? (
                <>
                  <span style={{ display: 'inline-block', marginRight: '8px' }}>
                    <i className="fas fa-circle-notch fa-spin" />
                  </span>
                  Authenticating...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }} />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ margin: '24px 0', borderTop: '1px solid rgba(71,85,105,0.3)' }} />

          {/* Footer link */}
          <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem', margin: 0 }}>
            Not an admin?{' '}
            <a
              href="/login"
              style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}
            >
              Go to User Login
            </a>
          </p>
        </div>

        {/* Security note */}
        <p style={{ textAlign: 'center', color: '#334155', fontSize: '0.75rem', marginTop: '20px' }}>
          <i className="fas fa-lock" style={{ marginRight: '5px' }} />
          Unauthorized access is strictly prohibited
        </p>
      </div>
    </div>
  );
}
