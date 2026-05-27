"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useShop } from '../../context/ShopContext';

export default function AdminLayout({ children }) {
  const { user, loading, token, logout } = useShop();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Protect Admin Layout — skip guard for the login page itself
  const isAdminLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isAdminLoginPage) return; // login page handles its own auth
    if (!loading) {
      if (!user) {
        router.push('/admin/login');
      } else if (!user.isAdmin) {
        router.push('/');
      }
    }
  }, [user, loading, router, isAdminLoginPage]);

  // Render admin login page without sidebar/chrome
  if (isAdminLoginPage) {
    return <>{children}</>;
  }

  // Show minimal loading screen only while auth state is being resolved
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0b0f19' }}>
        <div style={{ textAlign: 'center', color: '#e2e8f0' }}>
          <div className="spinner-border text-info mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '12px' }}>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Auth resolved but not an admin — redirect is already triggered by useEffect
  if (!user || !user.isAdmin) {
    return null;
  }


  const menuItems = [
    { name: 'Dashboard',  path: '/admin',            icon: 'fa-chart-line' },
    { name: 'Products',   path: '/admin/products',   icon: 'fa-boxes' },
    { name: 'Categories', path: '/admin/categories', icon: 'fa-layer-group' },
    { name: 'Orders',     path: '/admin/orders',     icon: 'fa-shopping-bag' },
    { name: 'Customers',  path: '/admin/users',      icon: 'fa-users' },
    { name: 'Inquiries',  path: '/admin/inquiries',  icon: 'fa-envelope-open-text' },
  ];

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#0b0f19', color: '#e2e8f0' }}>
      
      {/* Sidebar */}
      <aside 
        className="glass-premium d-flex flex-column transition hide-scroll" 
        style={{ 
          width: sidebarOpen ? '260px' : '70px',
          minWidth: sidebarOpen ? '260px' : '70px',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto'
        }}
      >
        {/* Brand Header */}
        <div className="p-3 d-flex align-items-center justify-content-between border-bottom" style={{ borderColor: 'rgba(255,255,255,0.08)', height: '76px' }}>
          {sidebarOpen ? (
            <Link href="/" className="text-decoration-none d-flex align-items-center">
              <span className="h4 fw-bold mb-0 text-gradient-vibrant">SATRION</span>
              <span className="badge bg-secondary ms-2 small" style={{ fontSize: '0.65rem' }}>ADMIN</span>
            </Link>
          ) : (
            <Link href="/" className="text-decoration-none">
              <span className="h4 fw-bold mb-0 text-info">S</span>
            </Link>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="btn btn-sm btn-dark border-0 text-muted p-1"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            <i className={`fas ${sidebarOpen ? 'fa-angle-double-left' : 'fa-angle-double-right'}`}></i>
          </button>
        </div>



        {/* Menu Nav Links */}
        <nav className="flex-grow-1 px-2 pt-2">
          <ul className="list-unstyled">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.name} className="mb-2">
                  <Link 
                    href={item.path} 
                    className={`d-flex align-items-center p-3 rounded text-decoration-none transition ${
                      isActive ? 'profile-tab-active text-white' : 'text-muted footer-hover'
                    }`}
                    style={{
                      borderRadius: '12px',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <i className={`fas ${item.icon} fa-fw`} style={{ fontSize: '1.2rem', minWidth: '24px' }}></i>
                    {sidebarOpen && <span className="ms-3 fw-semibold" style={{ fontSize: '0.95rem' }}>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {sidebarOpen && (
            <div className="mb-3 p-3 rounded bg-dark border-0 d-flex align-items-center justify-content-between" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <div className="d-flex align-items-center overflow-hidden">
                <div className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                  {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="ms-3 overflow-hidden">
                  <h6 className="mb-0 fw-bold text-white text-truncate">{user.username}</h6>
                  <span className="small text-muted text-truncate d-block" style={{ fontSize: '0.75rem' }}>{user.email}</span>
                </div>
              </div>
              <button 
                onClick={() => { logout(); router.push('/admin/login'); }} 
                className="btn btn-sm btn-outline-danger border-0 ms-2" 
                title="Logout"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          )}

          <Link 
            href="/" 
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2 border-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}
          >
            <i className="fas fa-home"></i>
            {sidebarOpen && <span className="fw-bold small">Back to Shop</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0, overflowX: 'hidden' }}>
        {/* Top Navbar */}
        <header 
          className="d-flex align-items-center justify-content-between px-4" 
          style={{ 
            height: '76px', 
            backgroundColor: '#0c1322', 
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 90
          }}
        >
          <div>
            <h4 className="fw-bold mb-0 text-white">
              {menuItems.find(m => m.path === pathname)?.name || 'Admin Panel'}
            </h4>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-success py-2 px-3 fw-bold rounded-pill" style={{ letterSpacing: '0.5px' }}>
              <i className="fas fa-shield-halved me-1"></i> Admin Authorized
            </span>
          </div>
        </header>

        {/* Nested Page Render */}
        <main className="flex-grow-1 p-4" style={{ backgroundColor: '#0b0f19' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
