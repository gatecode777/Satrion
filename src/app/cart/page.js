"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '../../context/ShopContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, addOrder, user, addAddress } = useShop();
  const router = useRouter();
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddNewAddressForm, setShowAddNewAddressForm] = useState(false);
  const [newAddressInput, setNewAddressInput] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // Payment mock states
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiry: '',
    cvv: ''
  });
  const [upiDetails, setUpiDetails] = useState({
    upiId: '',
    bankName: 'SBI'
  });

  // Auto-select first saved address when modal opens
  useEffect(() => {
    if (showCheckoutModal && user?.addresses && user.addresses.length > 0) {
      setSelectedAddressId(user.addresses[0]._id || user.addresses[0].id);
    }
  }, [showCheckoutModal, user]);

  // Reactive selection watcher when addresses list updates
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      if (!selectedAddressId) {
        setSelectedAddressId(user.addresses[0]._id || user.addresses[0].id);
      } else {
        const exists = user.addresses.some(a => (a._id || a.id) === selectedAddressId);
        if (!exists) {
          setSelectedAddressId(user.addresses[0]._id || user.addresses[0].id);
        }
      }
    }
  }, [user?.addresses]);

  // Helper to parse price string to number (removes currency symbols, commas)
  const parsePrice = (priceVal) => {
    if (typeof priceVal === 'number') return priceVal;
    if (!priceVal) return 0;
    return parseFloat(priceVal.toString().replace(/[^\d.]/g, '')) || 0;
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (parsePrice(item.product.price) * item.quantity), 0);
  const shipping = subtotal > 10000 ? 0 : (cart.length > 0 ? 150 : 0); // Free shipping over ₹10k
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const formatCurrency = (num) => {
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleQuantityChange = (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty >= 1) {
      updateCartQuantity(productId, newQty);
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      toast.warning('Please login or create an account to proceed to checkout!');
      router.push('/login');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleAddNewAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddressInput.fullName || !newAddressInput.street || !newAddressInput.city || !newAddressInput.state || !newAddressInput.zip || !newAddressInput.phone) {
      toast.error('Please fill in all address fields');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(newAddressInput.phone)) {
      toast.error('Phone number must be exactly 10 digits and contain only numbers');
      return;
    }

    const success = await addAddress(newAddressInput);
    if (success) {
      setShowAddNewAddressForm(false);
      setNewAddressInput({ fullName: '', street: '', city: '', state: '', zip: '', phone: '' });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!selectedAddressId) {
      toast.error('Please select or add a shipping address');
      return;
    }

    const shippingAddress = user.addresses.find(
      (a) => (a._id || a.id) === selectedAddressId
    );

    if (!shippingAddress) {
      toast.error('Selected address is invalid');
      return;
    }

    // Payment validation
    if (paymentMethod === 'Credit / Debit Card') {
      if (!cardDetails.cardNumber || !cardDetails.nameOnCard || !cardDetails.expiry || !cardDetails.cvv) {
        toast.error('Please fill in all credit card fields');
        return;
      }
      if (cardDetails.cvv.length < 3) {
        toast.error('CVV must be at least 3 digits');
        return;
      }
    } else if (paymentMethod === 'UPI / Net Banking') {
      if (!upiDetails.upiId) {
        toast.error('Please enter your UPI ID');
        return;
      }
      if (!upiDetails.upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID (e.g. username@upi)');
        return;
      }
    }

    const paymentDetails = paymentMethod === 'UPI / Net Banking' ? upiDetails : (paymentMethod === 'Credit / Debit Card' ? cardDetails : null);
    const orderId = await addOrder(shippingAddress, paymentMethod, paymentDetails);
    if (orderId) {
      setShowCheckoutModal(false);
      router.push('/profile');
    }
  };

  return (
    <main className="bg-light py-5 min-vh-100">
      <div className="container">
        <h2 className="fw-bold mb-4 text-dark">Shopping Cart</h2>
        
        {cart.length === 0 ? (
          <div className="text-center py-5 glass p-5 shadow-sm" style={{ borderRadius: '24px', backgroundColor: '#ffffff' }}>
            <i className="fas fa-shopping-basket fa-5x mb-4 text-muted opacity-50"></i>
            <h3 className="fw-bold text-dark mb-3">Your Cart is Empty</h3>
            <p className="text-muted mb-4">Add some high-performance products to your cart and customize your setup.</p>
            <Link href="/shop" className="btn btn-dark rounded-pill px-5 py-3 fw-bold hover-lift">
              Go to Shop <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        ) : (
          <div className="row">
            {/* Cart Items List */}
            <div className="col-lg-8 mb-4">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '24px', backgroundColor: '#ffffff' }}>
                <h5 className="fw-bold text-dark mb-4">{cart.length} distinct item(s) in your cart</h5>
                
                {cart.map((item) => {
                  const itemSubtotal = parsePrice(item.product.price) * item.quantity;
  const getCleanImageUrl = (img) => {
    if (!img) return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%23f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%236c757d">No Image Available</text></svg>';
    if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) return img;
    return img.startsWith('/') ? img : `/${img}`;
  };

  return (
     <div key={item.product.id} className="row align-items-center mb-4 pb-4 border-bottom" style={{ borderColor: '#f1f1f1 !important' }}>
      {/* Image */}
      <div className="col-3 col-md-2">
        <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
          <img src={getCleanImageUrl(item.product.image)} alt={item.product.name} className="img-fluid" style={{ objectFit: 'contain', maxHeight: '80px' }} />
        </div>
      </div>
                      
                      {/* Product Name & Description */}
                      <div className="col-9 col-md-4 mb-2 mb-md-0">
                        <Link href="/shop" className="text-decoration-none text-dark">
                          <h6 className="fw-bold mb-1">{item.product.name}</h6>
                        </Link>
                        <small className="text-muted d-block text-truncate" style={{ maxWidth: '200px' }}>{item.product.category}</small>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="col-4 col-md-2 d-flex align-items-center justify-content-md-center">
                        <div className="input-group input-group-sm" style={{ width: '90px' }}>
                          <button onClick={() => handleQuantityChange(item.product.id, item.quantity, -1)} className="btn btn-outline-secondary rounded-start px-2" type="button">-</button>
                          <span className="form-control text-center bg-white border-top border-bottom py-1" style={{ fontSize: '0.9rem' }}>{item.quantity}</span>
                          <button onClick={() => handleQuantityChange(item.product.id, item.quantity, 1)} className="btn btn-outline-secondary rounded-end px-2" type="button">+</button>
                        </div>
                      </div>
                      
                      {/* Price & Subtotal */}
                      <div className="col-6 col-md-3 text-end">
                        <span className="text-muted d-block small" style={{ fontSize: '0.8rem' }}>
                          {item.product.price.toString().startsWith('₹') ? item.product.price : `₹${item.product.price}`} each
                        </span>
                        <span className="fw-bold text-dark d-block" style={{ fontSize: '1.05rem', color: '#bc79e4' }}>{formatCurrency(itemSubtotal)}</span>
                      </div>
                      
                      {/* Delete Button */}
                      <div className="col-2 col-md-1 text-end">
                        <button onClick={() => removeFromCart(item.product.id)} className="btn btn-link text-danger p-0" title="Remove item">
                          <i className="fas fa-trash-alt fa-lg"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                <div className="d-flex justify-content-between mt-2">
                  <Link href="/shop" className="btn btn-outline-dark rounded-pill px-4 fw-bold">
                    <i className="fas fa-arrow-left me-2"></i> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4 position-sticky" style={{ top: '110px', borderRadius: '24px', backgroundColor: '#ffffff' }}>
                <h4 className="fw-bold text-dark mb-4">Summary</h4>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-bold text-dark">{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Shipping</span>
                  <span className="text-dark">
                    {shipping === 0 ? <span className="text-success fw-bold">FREE</span> : formatCurrency(shipping)}
                  </span>
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">GST (18%)</span>
                  <span className="text-dark">{formatCurrency(tax)}</span>
                </div>
                
                <hr className="my-4" style={{ borderColor: '#eee' }} />
                
                <div className="d-flex justify-content-between mb-4">
                  <span className="h5 fw-bold text-dark mb-0">Total</span>
                  <span className="h4 fw-bold text-dark mb-0" style={{ color: '#bc79e4' }}>{formatCurrency(total)}</span>
                </div>
                
                <button onClick={handleCheckoutClick} className="btn btn-primary-gradient w-100 py-3 rounded-pill fw-bold hover-lift mb-3" style={{ fontSize: '1.05rem' }}>
                  Proceed to Checkout <i className="fas fa-credit-card ms-2"></i>
                </button>
                
                <small className="text-muted text-center d-block" style={{ fontSize: '0.8rem' }}>
                  <i className="fas fa-lock me-1"></i> Secured Checkout & Genuine Guarantee
                </small>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
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
        }} onClick={() => setShowCheckoutModal(false)}>
          <div className="modal-container text-dark" style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '650px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease-out'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 30px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 className="fw-bold mb-0">Secure Checkout</h3>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#999'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handlePlaceOrder} style={{ padding: '30px', maxHeight: '70vh', overflowY: 'auto' }} className="text-start">
              <h5 className="fw-bold mb-3 text-dark"><i className="fas fa-truck me-2" style={{ color: '#bc79e4' }}></i>Shipping Address</h5>
              
              {/* Saved Address list */}
              {user.addresses && user.addresses.length > 0 ? (
                <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                  {user.addresses.map((addr, idx) => {
                    const isSelected = (addr._id || addr.id) === selectedAddressId;
                    return (
                      <div 
                        key={addr._id || addr.id || idx}
                        onClick={() => setSelectedAddressId(addr._id || addr.id)}
                        style={{
                          border: isSelected ? '2px solid #38bdf8' : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid #38bdf8' : '2px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          transition: 'all 0.2s'
                        }} />
                        <div style={{ fontSize: '0.85rem' }} className="text-start flex-grow-1">
                          <strong className="d-block text-dark">{addr.fullName}</strong>
                          <span className="text-muted">{addr.street}, {addr.city}, {addr.state} - {addr.zip}</span>
                          <span className="d-block text-muted small mt-1"><i className="fas fa-phone-alt me-1"></i> {addr.phone}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted small mb-3">No saved addresses found. Please add a shipping address below.</p>
              )}

              {/* Add New Address Form Inline */}
              {showAddNewAddressForm ? (
                <div className="p-3 border rounded-3 mb-3 bg-light text-start">
                  <h6 className="fw-bold mb-3">Add New Address</h6>
                  <div className="row g-2">
                    <div className="col-12">
                      <input type="text" placeholder="Full Name" className="form-control form-control-sm" value={newAddressInput.fullName} onChange={(e) => setNewAddressInput({ ...newAddressInput, fullName: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <input type="text" placeholder="Street Address" className="form-control form-control-sm" value={newAddressInput.street} onChange={(e) => setNewAddressInput({ ...newAddressInput, street: e.target.value })} required />
                    </div>
                    <div className="col-6">
                      <input type="text" placeholder="City" className="form-control form-control-sm" value={newAddressInput.city} onChange={(e) => setNewAddressInput({ ...newAddressInput, city: e.target.value })} required />
                    </div>
                    <div className="col-6">
                      <input type="text" placeholder="State" className="form-control form-control-sm" value={newAddressInput.state} onChange={(e) => setNewAddressInput({ ...newAddressInput, state: e.target.value })} required />
                    </div>
                    <div className="col-6">
                      <input type="text" placeholder="ZIP Code" className="form-control form-control-sm" value={newAddressInput.zip} onChange={(e) => setNewAddressInput({ ...newAddressInput, zip: e.target.value })} required />
                    </div>
                     <div className="col-6">
                       <input 
                         type="tel" 
                         placeholder="Phone Number (10 digits)" 
                         className="form-control form-control-sm" 
                         value={newAddressInput.phone} 
                         onChange={(e) => setNewAddressInput({ ...newAddressInput, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} 
                         required 
                         maxLength="10"
                       />
                     </div>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button type="button" onClick={handleAddNewAddressSubmit} className="btn btn-sm btn-info text-dark fw-bold rounded-pill px-3">Save & Select</button>
                    <button type="button" onClick={() => setShowAddNewAddressForm(false)} className="btn btn-sm btn-outline-secondary rounded-pill px-3">Cancel</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setShowAddNewAddressForm(true)} className="btn btn-sm btn-outline-dark rounded-pill px-3 py-1 mb-3">
                  <i className="fas fa-plus me-1"></i> Deliver to a New Address
                </button>
              )}

              <h5 className="fw-bold mt-4 mb-3 text-dark"><i className="fas fa-credit-card me-2" style={{ color: '#bc79e4' }}></i>Payment Method</h5>
              <div className="mb-3">
                <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                  {/* Enabled in future:
                  <option value="Credit / Debit Card">Credit / Debit Card (Mock payment)</option>
                  <option value="UPI / Net Banking">UPI / Net Banking (Mock payment)</option>
                  */}
                </select>
              </div>

              {/* Conditional payment detail fields */}
              {paymentMethod === 'Credit / Debit Card' && (
                <div className="p-3 border rounded-3 bg-light mb-4 text-start">
                  <h6 className="fw-bold mb-3 text-dark"><i className="fas fa-credit-card me-2 text-primary"></i>Card Details</h6>
                  <div className="row g-2">
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted mb-1">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 1111-2222-3333-4444" 
                        className="form-control form-control-sm"
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold text-muted mb-1">Name on Card</label>
                      <input 
                        type="text" 
                        placeholder="e.g. John Doe" 
                        className="form-control form-control-sm"
                        value={cardDetails.nameOnCard}
                        onChange={(e) => setCardDetails({ ...cardDetails, nameOnCard: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className="form-control form-control-sm"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted mb-1">CVV</label>
                      <input 
                        type="password" 
                        placeholder="e.g. 123" 
                        maxLength="4"
                        className="form-control form-control-sm"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI / Net Banking' && (
                <div className="p-3 border rounded-3 bg-light mb-4 text-start">
                  <h6 className="fw-bold mb-3 text-dark"><i className="fas fa-mobile-alt me-2 text-success"></i>UPI / Net Banking Details</h6>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-1">UPI ID / VPA</label>
                    <input 
                      type="text" 
                      placeholder="e.g. username@upi" 
                      className="form-control form-control-sm"
                      value={upiDetails.upiId}
                      onChange={(e) => setUpiDetails({ ...upiDetails, upiId: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label small fw-bold text-muted mb-1">Select Bank</label>
                    <select 
                      className="form-select form-select-sm"
                      value={upiDetails.bankName}
                      onChange={(e) => setUpiDetails({ ...upiDetails, bankName: e.target.value })}
                    >
                      <option value="SBI">State Bank of India (SBI)</option>
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="AXIS">Axis Bank</option>
                      <option value="KOTAK">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                </div>
              )}

              {paymentMethod === 'Cash on Delivery' && (
                <div className="alert alert-info py-2 px-3 mb-4" style={{ fontSize: '0.85rem' }}>
                  <i className="fas fa-info-circle me-1"></i> Pay in cash when your order is delivered.
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 mb-4">
                <span className="fw-bold text-dark">Order Total:</span>
                <span className="h4 fw-bold mb-0" style={{ color: '#bc79e4' }}>{formatCurrency(total)}</span>
              </div>

              <button type="submit" className="btn btn-primary-gradient w-100 py-3 fw-bold rounded-pill shadow-sm">
                Place Order ({formatCurrency(total)})
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;
