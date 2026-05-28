"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import { UserIcon } from '@/components/Icons';

const Profile = () => {
  const { user, updateProfile, addAddress, updateAddress, deleteAddress, logoutUser, loading, requestReturn, requestExchange, changePassword, deleteAccount } = useShop();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Return / Exchange states
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnReason, setReturnReason] = useState('Damaged Product');
  const [exchangeReason, setExchangeReason] = useState('Wrong Size/Color');
  const [refundUpiId, setRefundUpiId] = useState('');

  const getDaysElapsed = (orderDateStr) => {
    try {
      if (!orderDateStr) return 99;
      const orderDate = new Date(orderDateStr);
      const currentDate = new Date();
      orderDate.setHours(0,0,0,0);
      currentDate.setHours(0,0,0,0);
      const diffTime = currentDate - orderDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return 99;
    }
  };

  const handleReturnClick = (order) => {
    setSelectedOrder(order);
    setReturnReason('Damaged Product');
    setRefundUpiId('');
    setShowReturnModal(true);
  };

  const handleExchangeClick = (order) => {
    setSelectedOrder(order);
    setExchangeReason('Wrong Size/Color');
    setShowExchangeModal(true);
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!refundUpiId) {
      toast.error('Refund UPI ID is required');
      return;
    }
    if (!refundUpiId.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g. username@upi)');
      return;
    }

    const success = await requestReturn(selectedOrder.orderId, refundUpiId, returnReason);
    if (success) {
      setShowReturnModal(false);
      setSelectedOrder(null);
    }
  };

  const handleExchangeSubmit = async (e) => {
    e.preventDefault();
    const success = await requestExchange(selectedOrder.orderId, exchangeReason);
    if (success) {
      setShowExchangeModal(false);
      setSelectedOrder(null);
    }
  };

  // Form states for profile
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  // Form states for address
  const [addressInput, setAddressInput] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Form states for password change & deletion
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
    } else {
      setUsernameInput(user.username || '');
      setEmailInput(user.email || '');
      setPhoneInput(user.phone || '');
    }
  }, [user, router, loading]);

  if (loading) {
    return (
      <main className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: '#0f172a' }}>
        <div className="text-white text-center">
          <div className="spinner-border text-info mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
          <h5 className="fw-bold mt-2">Syncing Session</h5>
          <p className="text-muted small">Loading user setup details...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  // Handle password change submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (currentPassword === newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setIsChangingPassword(true);
    const success = await changePassword(currentPassword, newPassword);
    setIsChangingPassword(false);

    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // Handle delete account click
  const handleDeleteAccountClick = async () => {
    const confirmDelete = window.confirm('Are you sure you want to permanently delete your account? This action is irreversible and will erase all your profile data and order history.');
    if (confirmDelete) {
      setIsDeletingAccount(true);
      const success = await deleteAccount();
      setIsDeletingAccount(false);
      if (success) {
        router.push('/login');
      }
    }
  };

  // Handle profile update
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!usernameInput || !phoneInput) {
      toast.error('Username and Phone number cannot be empty');
      return;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneInput)) {
      toast.error('Phone number must be exactly 10 digits and contain only numbers');
      return;
    }
    updateProfile(usernameInput, phoneInput);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressInput.fullName || !addressInput.street || !addressInput.city || !addressInput.state || !addressInput.zip || !addressInput.phone) {
      toast.error('Please fill in all address fields');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(addressInput.phone)) {
      toast.error('Phone number must be exactly 10 digits and contain only numbers');
      return;
    }

    let success;
    if (editingAddressId) {
      success = await updateAddress(editingAddressId, addressInput);
    } else {
      success = await addAddress(addressInput);
    }

    if (success) {
      setShowAddressForm(false);
      setAddressInput({ fullName: '', street: '', city: '', state: '', zip: '', phone: '' });
      setEditingAddressId(null);
    }
  };

  const handleEditClick = (addr) => {
    setAddressInput({
      fullName: addr.fullName || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zip: addr.zip || '',
      phone: addr.phone || ''
    });
    setEditingAddressId(addr._id || addr.id);
    setShowAddressForm(true);
  };

  const handleDeleteClick = async (addrId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(addrId);
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  return (
    <main className="position-relative min-vh-100 py-5" style={{ backgroundColor: '#0f172a', overflow: 'hidden' }}>
      {/* Decorative neon background glow circles */}
      <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0) 70%)', top: '-10%', right: '-10%', zIndex: 1 }}></div>
      <div className="position-absolute rounded-circle" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, rgba(192,132,252,0) 70%)', bottom: '-10%', left: '-10%', zIndex: 1 }}></div>

      <div className="container position-relative py-4" style={{ zIndex: 2 }}>
        <div className="row g-4">
          
          {/* Left Navigation Sidebar */}
          <div className="col-lg-4 col-xl-3 animate-fade-in-up">
            <div className="card glass-premium p-4 text-white text-center h-100" style={{ borderRadius: '24px' }}>
              
              {/* User Avatar */}
              <div className="position-relative d-inline-block mx-auto mb-3">
                <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ 
                  width: '90px', 
                  height: '90px', 
                  background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
                  boxShadow: '0 0 20px rgba(129, 140, 248, 0.4)'
                }}>
                  <span className="fw-bold text-white" style={{ fontSize: '2.2rem' }}>
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '15px', height: '15px' }}></span>
              </div>

              <h4 className="fw-bold mb-1">{user.username}</h4>
              <p className="text-muted small mb-4">{user.email}</p>

              <hr className="my-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              {/* Navigation Tabs */}
              <div className="nav flex-column nav-pills gap-2 text-start" role="tablist">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`nav-link text-white text-start d-flex align-items-center py-3 px-4 border-0 rounded-3 transition ${activeTab === 'overview' ? 'bg-dark' : 'bg-transparent'}`}
                  style={{ 
                    background: activeTab === 'overview' ? 'rgba(255, 255, 255, 0.08) !important' : 'transparent',
                    borderLeft: activeTab === 'overview' ? '4px solid #38bdf8' : '4px solid transparent',
                    fontWeight: activeTab === 'overview' ? '600' : 'normal'
                  }}
                >
                  <i className="fas fa-user-cog me-3 text-info"></i> Account Overview
                </button>
                
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`nav-link text-white text-start d-flex align-items-center py-3 px-4 border-0 rounded-3 transition ${activeTab === 'orders' ? 'bg-dark' : 'bg-transparent'}`}
                  style={{ 
                    background: activeTab === 'orders' ? 'rgba(255, 255, 255, 0.08) !important' : 'transparent',
                    borderLeft: activeTab === 'orders' ? '4px solid #818cf8' : '4px solid transparent',
                    fontWeight: activeTab === 'orders' ? '600' : 'normal'
                  }}
                >
                  <i className="fas fa-boxes me-3 text-warning"></i> My Orders 
                  {user.orders?.length > 0 && (
                    <span className="badge bg-secondary ms-auto small">{user.orders.length}</span>
                  )}
                </button>
                
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`nav-link text-white text-start d-flex align-items-center py-3 px-4 border-0 rounded-3 transition ${activeTab === 'addresses' ? 'bg-dark' : 'bg-transparent'}`}
                  style={{ 
                    background: activeTab === 'addresses' ? 'rgba(255, 255, 255, 0.08) !important' : 'transparent',
                    borderLeft: activeTab === 'addresses' ? '4px solid #c084fc' : '4px solid transparent',
                    fontWeight: activeTab === 'addresses' ? '600' : 'normal'
                  }}
                >
                  <i className="fas fa-map-marker-alt me-3 text-danger"></i> Addresses
                </button>

                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`nav-link text-white text-start d-flex align-items-center py-3 px-4 border-0 rounded-3 transition ${activeTab === 'settings' ? 'bg-dark' : 'bg-transparent'}`}
                  style={{ 
                    background: activeTab === 'settings' ? 'rgba(255, 255, 255, 0.08) !important' : 'transparent',
                    borderLeft: activeTab === 'settings' ? '4px solid #06b6d4' : '4px solid transparent',
                    fontWeight: activeTab === 'settings' ? '600' : 'normal'
                  }}
                >
                  <i className="fas fa-cog me-3" style={{ color: '#06b6d4' }}></i> Settings
                </button>

                <button 
                  onClick={handleLogout}
                  className="nav-link text-danger text-start d-flex align-items-center py-3 px-4 border-0 bg-transparent rounded-3 mt-4"
                >
                  <i className="fas fa-sign-out-alt me-3"></i> Logout
                </button>
              </div>

            </div>
          </div>

          {/* Right Main Content Panel */}
          <div className="col-lg-8 col-xl-9 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="card glass-premium p-4 p-md-5 text-white h-100" style={{ borderRadius: '24px' }}>
              
              {/* Tab 1: Account Overview */}
              {activeTab === 'overview' && (
                <div>
                  <h3 className="fw-bold mb-2">Account Overview</h3>
                  <p className="text-muted small mb-4">View and update your profile details below</p>
                  
                  <form onSubmit={handleProfileSubmit}>
                    <div className="row g-4">
                      <div className="col-md-4">
                        <label className="form-label small fw-bold text-muted">Username</label>
                        <div className="input-group">
                          <span className="input-group-text bg-dark border-0 text-muted d-flex align-items-center"><UserIcon size={16} /></span>
                          <input 
                            type="text" 
                            value={usernameInput} 
                            onChange={(e) => setUsernameInput(e.target.value)}
                            className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                            placeholder="GamerName"
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <label className="form-label small fw-bold text-muted">Email Address (Locked)</label>
                        <div className="input-group">
                          <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-envelope"></i></span>
                          <input 
                            type="email" 
                            value={emailInput} 
                            disabled={true}
                            className="form-control bg-dark border-0 text-muted shadow-none px-3 py-2" 
                            style={{ cursor: 'not-allowed', opacity: 0.6 }}
                            placeholder="name@example.com"
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-bold text-muted">Phone Number</label>
                        <div className="input-group">
                          <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-phone-alt"></i></span>
                          <input 
                            type="tel" 
                            value={phoneInput} 
                            onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                            placeholder="e.g. 9876543210"
                            maxLength="10"
                          />
                        </div>
                      </div>
                      
                      <div className="col-12 mt-4 pt-2">
                        <button type="submit" className="btn btn-vibrant-gradient px-4 py-2 fw-bold rounded-pill">
                          Save Changes <i className="fas fa-check-circle ms-2"></i>
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="mt-5 p-4 rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h5 className="fw-bold mb-3"><i className="fas fa-shield-alt me-2 text-info"></i> Security Info</h5>
                    <p className="text-muted small mb-0">Your account is secured with end-to-end local encryption. To update your password, contact client support or reset via token methods.</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Orders List */}
              {activeTab === 'orders' && (
                <div>
                  <h3 className="fw-bold mb-2">My Orders</h3>
                  <p className="text-muted small mb-4">Track the details and fulfillment status of your mock orders</p>

                  {!user.orders || user.orders.length === 0 ? (
                    <div className="text-center py-5 rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px dotted rgba(255,255,255,0.1)' }}>
                      <i className="fas fa-box-open fa-3x mb-3 text-muted"></i>
                      <h5 className="fw-bold">No Orders Found</h5>
                      <p className="text-muted small mb-3">You haven't placed any orders yet.</p>
                      <button onClick={() => router.push('/shop')} className="btn btn-outline-light btn-sm rounded-pill px-4">
                        Shop Now
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-4">
                      {user.orders.map((order) => (
                        <div key={order.id} className="p-4 rounded-4" style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                          border: '1px solid rgba(255,255,255,0.06)' 
                        }}>
                          {/* Order Header Summary */}
                          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 g-2">
                            <div>
                              <span className="badge bg-dark text-info border border-info me-2 px-3 py-2" style={{ fontSize: '0.85rem' }}>
                                {order.id}
                              </span>
                              <span className="text-muted small">{order.date}</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="fw-bold h5 mb-0 text-gradient-vibrant me-3">{order.total}</span>
                              <span className={`badge px-3 py-2 rounded-pill ${
                                order.status === 'Delivered' ? 'bg-success text-white' : 
                                order.status === 'Processing' ? 'bg-primary text-white' : 'bg-warning text-dark'
                              }`} style={{ fontSize: '0.75rem' }}>
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <hr className="my-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

                          {/* Order items list */}
                          <h6 className="small fw-bold text-muted mb-3 text-start">ITEMS ORDERED:</h6>
                          <div className="d-flex flex-column gap-3 mb-3">
                            {order.items?.map((item, idx) => {
                              const getCleanImageUrl = (img) => {
                                if (!img) return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%23f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%236c757d">No Image Available</text></svg>';
                                if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) return img;
                                return img.startsWith('/') ? img : `/${img}`;
                              };

                              return (
                                <div key={idx} className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                  <div style={{ width: '60px', height: '60px', backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={getCleanImageUrl(item.image)} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                  </div>
                                  <div className="flex-grow-1 text-start">
                                    <h6 className="fw-bold mb-1 text-white">{item.name}</h6>
                                    {item.price && <span className="text-info small fw-semibold" style={{ color: '#38bdf8' }}>{item.price}</span>}
                                  </div>
                                  <div className="text-end">
                                    <span className="badge bg-dark border border-secondary text-muted px-3 py-2" style={{ fontSize: '0.8rem' }}>
                                      Qty: {item.quantity}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Shipping Details */}
                          {order.shippingInfo && (
                            <div className="mt-3 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.04)', fontSize: '0.8rem' }}>
                              <span className="text-muted fw-bold d-block mb-1 text-start"><i className="fas fa-truck me-1"></i> SHIPPED TO:</span>
                              <div className="text-light text-start">{order.shippingInfo.fullName} - {order.shippingInfo.street}, {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.zip} (Phone: {order.shippingInfo.phone})</div>
                            </div>
                          )}

                          {/* Return and Exchange Options */}
                          {(() => {
                            const daysElapsed = getDaysElapsed(order.date);
                            const isEligible = daysElapsed <= 7;
                            const isActioned = ['Return Requested', 'Exchange Requested', 'Returned', 'Exchanged', 'Cancelled'].includes(order.status);

                            return (
                              <div className="mt-3 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                                  <span className="text-muted small text-start">
                                    Placed {daysElapsed} day{daysElapsed !== 1 ? 's' : ''} ago 
                                    {!isActioned && (
                                      isEligible ? (
                                        <span className="text-success ms-2">• Eligible for Return/Exchange (7-day window)</span>
                                      ) : (
                                        <span className="text-danger ms-2">• Return/Exchange window closed (7 days elapsed)</span>
                                      )
                                    )}
                                  </span>

                                  {isEligible && !isActioned && (
                                    <div className="d-flex gap-2">
                                      <button 
                                        onClick={() => handleReturnClick(order)} 
                                        className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1.5 fw-bold"
                                        style={{ fontSize: '0.8rem' }}
                                      >
                                        <i className="fas fa-undo me-1"></i> Return Items
                                      </button>
                                      <button 
                                        onClick={() => handleExchangeClick(order)} 
                                        className="btn btn-sm btn-outline-warning rounded-pill px-3 py-1.5 fw-bold"
                                        style={{ fontSize: '0.8rem' }}
                                      >
                                        <i className="fas fa-sync me-1"></i> Exchange Items
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {order.status === 'Return Requested' && (
                                  <div className="alert alert-danger mb-0 mt-3 py-2 px-3 text-start small d-flex align-items-center gap-2 border-0" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: '#ef4444' }}>
                                    <i className="fas fa-info-circle"></i>
                                    <span>Return Requested. Refund will be processed to UPI: <strong>{order.returnRequest?.upiId}</strong> (Reason: {order.returnRequest?.reason})</span>
                                  </div>
                                )}

                                {order.status === 'Exchange Requested' && (
                                  <div className="alert alert-warning mb-0 mt-3 py-2 px-3 text-start small d-flex align-items-center gap-2 border-0" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#f59e0b' }}>
                                    <i className="fas fa-info-circle"></i>
                                    <span>Exchange Requested (Reason: {order.exchangeRequest?.reason})</span>
                                  </div>
                                )}

                                {order.status === 'Returned' && (
                                  <div className="alert alert-success mb-0 mt-3 py-2 px-3 text-start small d-flex align-items-center gap-2 border-0" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981' }}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>Returned &amp; Refunded successfully.</span>
                                  </div>
                                )}

                                {order.status === 'Exchanged' && (
                                  <div className="alert alert-success mb-0 mt-3 py-2 px-3 text-start small d-flex align-items-center gap-2 border-0" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981' }}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>Exchanged successfully. Replacement item dispatched.</span>
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Address Management */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h3 className="fw-bold mb-2">My Addresses</h3>
                      <p className="text-muted small mb-0">Manage your saved shipping and billing coordinates</p>
                    </div>
                    <button 
                      onClick={() => {
                        setEditingAddressId(null);
                        setAddressInput({ fullName: '', street: '', city: '', state: '', zip: '', phone: '' });
                        setShowAddressForm(true);
                      }} 
                      className="btn btn-info text-dark rounded-pill fw-bold px-4"
                    >
                      <i className="fas fa-plus me-2"></i> Add New Address
                    </button>
                  </div>

                  <div className="row g-4">
                    {!user.addresses || user.addresses.length === 0 ? (
                      <div className="col-12 text-center py-5 rounded-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px dotted rgba(255,255,255,0.1)' }}>
                        <i className="fas fa-map-marked-alt fa-3x mb-3 text-muted"></i>
                        <h5 className="fw-bold">No Saved Addresses</h5>
                        <p className="text-muted small mb-0">You haven't saved any addresses yet. Add one to speed up checkout.</p>
                      </div>
                    ) : (
                      user.addresses.map((addr, idx) => (
                        <div className="col-md-6" key={addr._id || addr.id || idx}>
                          <div className="card bg-transparent border p-4 h-100 position-relative" style={{ borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                            <div className="d-flex flex-column gap-1 text-light" style={{ opacity: 0.9, paddingRight: '60px' }}>
                              <strong className="text-white h5 mb-2">{addr.fullName}</strong>
                              <span>{addr.street}</span>
                              <span>{addr.city}, {addr.state} - {addr.zip}</span>
                              <span className="mt-2 text-muted"><i className="fas fa-phone-alt me-2 small text-info"></i> {addr.phone}</span>
                            </div>
                            
                            {/* Action Buttons in top right */}
                            <div className="position-absolute top-0 end-0 p-3 d-flex gap-2">
                              <button 
                                onClick={() => handleEditClick(addr)} 
                                className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" 
                                style={{ width: '32px', height: '32px', padding: 0 }}
                                title="Edit"
                              >
                                <i className="fas fa-edit" style={{ fontSize: '0.85rem' }}></i>
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(addr._id || addr.id)} 
                                className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center" 
                                style={{ width: '32px', height: '32px', padding: 0 }}
                                title="Delete"
                              >
                                <i className="fas fa-trash-alt" style={{ fontSize: '0.85rem' }}></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Settings */}
              {activeTab === 'settings' && (
                <div>
                  <h3 className="fw-bold mb-2">Account Settings</h3>
                  <p className="text-muted small mb-4">Manage your password settings and account status</p>
                  
                  {/* Change Password Section */}
                  <form onSubmit={handlePasswordSubmit} className="mb-5">
                    <h5 className="fw-bold mb-3 text-info"><i className="fas fa-key me-2"></i> Change Password</h5>
                    <div className="row g-4">
                      <div className="col-md-4">
                        <label className="form-label small fw-bold text-muted">Current Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-lock"></i></span>
                          <input 
                            type="password" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                            placeholder="Current Password"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <label className="form-label small fw-bold text-muted">New Password (min. 6 characters)</label>
                        <div className="input-group">
                          <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-key"></i></span>
                          <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                            placeholder="New Password"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-bold text-muted">Confirm New Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-dark border-0 text-muted"><i className="fas fa-check-circle"></i></span>
                          <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                            placeholder="Confirm New Password"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="col-12 mt-4 pt-2">
                        <button type="submit" disabled={isChangingPassword} className="btn btn-vibrant-gradient px-4 py-2 fw-bold rounded-pill">
                          {isChangingPassword ? 'Updating...' : 'Update Password'} <i className="fas fa-key ms-2"></i>
                        </button>
                      </div>
                    </div>
                  </form>

                  <hr className="my-5" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                  {/* Danger Zone: Delete Account */}
                  <div className="p-4 rounded-4 text-start" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <h5 className="fw-bold mb-3 text-danger"><i className="fas fa-exclamation-triangle me-2"></i> Danger Zone</h5>
                    <p className="text-muted small mb-4">
                      Once you delete your account, there is no going back. All of your saved addresses, cart items, wishlist details, and past mock orders will be permanently wiped from our database.
                    </p>
                    <button 
                      type="button" 
                      onClick={handleDeleteAccountClick}
                      disabled={isDeletingAccount}
                      className="btn btn-danger px-4 py-2.5 fw-bold rounded-pill"
                      style={{ 
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                        border: 'none',
                        boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      {isDeletingAccount ? 'Deleting Account...' : 'Delete Account'} <i className="fas fa-trash-alt ms-2"></i>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
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
        }} onClick={() => setShowAddressForm(false)}>
          
          <div className="card glass-premium p-4 p-md-5 text-white animate-fade-in-up" style={{ 
            maxWidth: '550px', 
            width: '90%', 
            borderRadius: '24px',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button 
              onClick={() => setShowAddressForm(false)}
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

            <h3 className="fw-bold mb-2">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
            <p className="text-muted small mb-4">{editingAddressId ? 'Modify address coordinates' : 'Save a new location setup'}</p>

            <form onSubmit={handleAddressSubmit} className="text-start">
              <div className="mb-3">
                <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Full Name</label>
                <input 
                  type="text" 
                  value={addressInput.fullName} 
                  onChange={(e) => setAddressInput({ ...addressInput, fullName: e.target.value })} 
                  required 
                  className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Street Address</label>
                <input 
                  type="text" 
                  value={addressInput.street} 
                  onChange={(e) => setAddressInput({ ...addressInput, street: e.target.value })} 
                  required 
                  className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                  placeholder="House no, Street name, Locality"
                />
              </div>

              <div className="row g-3">
                <div className="col-6 mb-3">
                  <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>City</label>
                  <input 
                    type="text" 
                    value={addressInput.city} 
                    onChange={(e) => setAddressInput({ ...addressInput, city: e.target.value })} 
                    required 
                    className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                    placeholder="e.g. Jaipur"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>State</label>
                  <input 
                    type="text" 
                    value={addressInput.state} 
                    onChange={(e) => setAddressInput({ ...addressInput, state: e.target.value })} 
                    required 
                    className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                    placeholder="e.g. Rajasthan"
                  />
                </div>
              </div>

              <div className="row g-3">
                <div className="col-6 mb-4">
                  <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>ZIP Code</label>
                  <input 
                    type="text" 
                    value={addressInput.zip} 
                    onChange={(e) => setAddressInput({ ...addressInput, zip: e.target.value })} 
                    required 
                    className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                    placeholder="e.g. 302034"
                  />
                </div>
                <div className="col-6 mb-4">
                  <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Phone Number</label>
                  <input 
                    type="tel" 
                    value={addressInput.phone} 
                    onChange={(e) => setAddressInput({ ...addressInput, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} 
                    required 
                    maxLength="10"
                    className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                    placeholder="e.g. 9876543210"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-vibrant-gradient w-100 py-3 fw-bold rounded-pill" style={{ fontSize: '1rem' }}>
                {editingAddressId ? 'Save Address Changes' : 'Save Address'} <i className="fas fa-check-circle ms-2"></i>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {showReturnModal && selectedOrder && (
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
        }} onClick={() => setShowReturnModal(false)}>
          
          <div className="card glass-premium p-4 p-md-5 text-white animate-fade-in-up" style={{ 
            maxWidth: '500px', 
            width: '90%', 
            borderRadius: '24px',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => setShowReturnModal(false)}
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

            <h3 className="fw-bold mb-2">Request Order Return</h3>
            <p className="text-muted small mb-4">Order ID: {selectedOrder.orderId}</p>

            <form onSubmit={handleReturnSubmit} className="text-start">
              <div className="mb-3">
                <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Select Reason for Return</label>
                <select 
                  className="form-select bg-dark border-0 text-white shadow-none px-3 py-2"
                  value={returnReason} 
                  onChange={(e) => setReturnReason(e.target.value)}
                  style={{ borderRadius: '10px' }}
                >
                  <option value="Damaged Product">Damaged or Defective Product</option>
                  <option value="Incorrect Item Received">Incorrect Item Received</option>
                  <option value="Product Not as Described">Product Not as Described</option>
                  <option value="Better Price Available">Better Price Available</option>
                  <option value="Changed My Mind">Changed My Mind</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Refund UPI ID</label>
                <input 
                  type="text" 
                  value={refundUpiId}
                  onChange={(e) => setRefundUpiId(e.target.value.trim())}
                  required 
                  className="form-control bg-dark border-0 text-white shadow-none px-3 py-2" 
                  placeholder="username@bank (must contain @)"
                  style={{ borderRadius: '10px' }}
                />
                <small className="text-muted d-block mt-2">The refund amount of {selectedOrder.total} will be processed to this UPI account once approved.</small>
              </div>

              <button type="submit" className="btn btn-vibrant-gradient w-100 py-3 fw-bold rounded-pill" style={{ fontSize: '1rem' }}>
                Submit Return Request <i className="fas fa-paper-plane ms-2"></i>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Exchange Request Modal */}
      {showExchangeModal && selectedOrder && (
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
        }} onClick={() => setShowExchangeModal(false)}>
          
          <div className="card glass-premium p-4 p-md-5 text-white animate-fade-in-up" style={{ 
            maxWidth: '500px', 
            width: '90%', 
            borderRadius: '24px',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => setShowExchangeModal(false)}
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

            <h3 className="fw-bold mb-2">Request Order Exchange</h3>
            <p className="text-muted small mb-4">Order ID: {selectedOrder.orderId}</p>

            <form onSubmit={handleExchangeSubmit} className="text-start">
              <div className="mb-4">
                <label className="form-label small fw-bold text-light" style={{ opacity: 0.8 }}>Select Reason for Exchange</label>
                <select 
                  className="form-select bg-dark border-0 text-white shadow-none px-3 py-2"
                  value={exchangeReason} 
                  onChange={(e) => setExchangeReason(e.target.value)}
                  style={{ borderRadius: '10px' }}
                >
                  <option value="Wrong Size/Color">Wrong Size or Color</option>
                  <option value="Defective Unit Received">Defective Unit Received (Need replacement)</option>
                  <option value="Incorrect Model Sent">Incorrect Model Sent</option>
                </select>
              </div>

              <button type="submit" className="btn btn-vibrant-gradient w-100 py-3 fw-bold rounded-pill" style={{ fontSize: '1rem' }}>
                Submit Exchange Request <i className="fas fa-sync ms-2"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
