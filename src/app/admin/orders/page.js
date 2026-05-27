"use client";

import React, { useEffect, useState } from 'react';
import { useShop } from '../../../context/ShopContext';
import { toast } from 'react-toastify';

export default function AdminOrders() {
  const { token } = useShop();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Detail view state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders?page=${page}&status=${status}&search=${search}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, page, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order status');
      toast.success('Order status updated');
      
      // Update local state list
      const updatedOrders = orders.map(o => {
        if (o._id === orderId) {
          const updatedObj = { ...o, status: newStatus };
          if (newStatus === 'Returned') {
            updatedObj.paymentStatus = 'REFUNDED';
            if (updatedObj.returnRequest) {
              updatedObj.returnRequest.status = 'Refunded';
            }
          } else if (newStatus === 'Exchanged') {
            if (updatedObj.exchangeRequest) {
              updatedObj.exchangeRequest.status = 'Replaced';
            }
          }
          return updatedObj;
        }
        return o;
      });
      setOrders(updatedOrders);
      
      // Update details modal state if open
      if (selectedOrder && selectedOrder._id === orderId) {
        const updatedSel = { ...selectedOrder, status: newStatus };
        if (newStatus === 'Returned') {
          updatedSel.paymentStatus = 'REFUNDED';
          if (updatedSel.returnRequest) {
            updatedSel.returnRequest.status = 'Refunded';
          }
        } else if (newStatus === 'Exchanged') {
          if (updatedSel.exchangeRequest) {
            updatedSel.exchangeRequest.status = 'Replaced';
          }
        }
        setSelectedOrder(updatedSel);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (orderId, orderNum) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderNum}?`)) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete order');
      }
      toast.success('Order deleted successfully');
      setShowDetailModal(false);
      fetchOrders();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const renderStatusBadge = (statusValue) => {
    switch (statusValue) {
      case 'Pending':
        return (
          <span className="badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold" style={{ backgroundColor: 'rgba(217, 119, 6, 0.15)', color: '#fbbf24', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
            <i className="far fa-clock"></i> Pending
          </span>
        );
      case 'Processing':
        return (
          <span className="badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold" style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
            <i className="fas fa-spinner fa-spin"></i> Processing
          </span>
        );
      case 'Shipped':
        return (
          <span className="badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <i className="fas fa-truck"></i> Shipped
          </span>
        );
      case 'Delivered':
        return (
          <span className="badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <i className="far fa-check-circle"></i> Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <i className="far fa-times-circle"></i> Cancelled
          </span>
        );
      case 'Return Requested':
        return (
          <span className="badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold" style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            <i className="fas fa-undo"></i> Return Requested
          </span>
        );
      case 'Exchange Requested':
        return (
          <span className="badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <i className="fas fa-sync"></i> Exchange Requested
          </span>
        );
      case 'Returned':
        return (
          <span className="badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold" style={{ backgroundColor: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: '1px solid rgba(100, 116, 139, 0.3)' }}>
            <i className="fas fa-arrow-left"></i> Returned
          </span>
        );
      case 'Exchanged':
        return (
          <span className="badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold" style={{ backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            <i className="fas fa-exchange-alt"></i> Exchanged
          </span>
        );
      default:
        return (
          <span className="badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 fw-semibold" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}>
            {statusValue}
          </span>
        );
    }
  };

  const renderPaymentStatusBadge = (payStatus) => {
    const statusUpper = payStatus?.toUpperCase() || 'PENDING';
    
    if (statusUpper === 'COMPLETED') {
      return (
        <span className="badge rounded-pill px-3 py-1.5 fw-bold" style={{ border: '1px solid #10b981', color: '#10b981', fontSize: '0.75rem', backgroundColor: 'transparent' }}>
          COMPLETED
        </span>
      );
    } else if (statusUpper === 'REFUNDED') {
      return (
        <span className="badge rounded-pill px-3 py-1.5 fw-bold" style={{ border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.75rem', backgroundColor: 'transparent' }}>
          REFUNDED
        </span>
      );
    } else {
      return (
        <span className="badge rounded-pill px-3 py-1.5 fw-bold" style={{ border: '1px solid #d97706', color: '#d97706', fontSize: '0.75rem', backgroundColor: 'transparent' }}>
          PENDING
        </span>
      );
    }
  };

  const getTimelineSteps = (order) => {
    const timeline = [];
    
    const parseTime = (dateStr) => {
      if (!dateStr) return '';
      const dateObj = new Date(dateStr);
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + 
             dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const createdDate = order.createdAt ? parseTime(order.createdAt) : (order.date + " 12:00");
    const updatedDate = order.updatedAt ? parseTime(order.updatedAt) : createdDate;

    // Always starts with pending
    timeline.push({
      status: 'PENDING',
      message: 'Order placed successfully',
      date: createdDate
    });

    if (order.status === 'Cancelled') {
      timeline.push({
        status: 'CANCELLED',
        message: 'Order cancelled by user.',
        date: updatedDate
      });
    }

    if (['Processing', 'Shipped', 'Delivered', 'Return Requested', 'Exchange Requested', 'Returned', 'Exchanged'].includes(order.status)) {
      timeline.push({
        status: 'PROCESSING',
        message: 'Order is being processed.',
        date: createdDate
      });
    }

    if (['Shipped', 'Delivered', 'Return Requested', 'Exchange Requested', 'Returned', 'Exchanged'].includes(order.status)) {
      timeline.push({
        status: 'SHIPPED',
        message: 'Order shipped.',
        date: createdDate
      });
    }

    if (['Delivered', 'Return Requested', 'Exchange Requested', 'Returned', 'Exchanged'].includes(order.status)) {
      timeline.push({
        status: 'DELIVERED',
        message: 'Order delivered successfully.',
        date: createdDate
      });
    }

    if (['Return Requested', 'Returned'].includes(order.status)) {
      const returnDate = order.returnRequest?.requestedAt ? parseTime(order.returnRequest.requestedAt) : createdDate;
      timeline.push({
        status: 'RETURN REQUESTED',
        message: `Return requested by user. Reason: ${order.returnRequest?.reason || 'Not specified'}`,
        date: returnDate
      });
    }

    if (order.status === 'Returned') {
      timeline.push({
        status: 'RETURNED & REFUNDED',
        message: 'Returned successfully. UPI Refund marked as completed.',
        date: updatedDate
      });
    }

    if (['Exchange Requested', 'Exchanged'].includes(order.status)) {
      const exchangeDate = order.exchangeRequest?.requestedAt ? parseTime(order.exchangeRequest.requestedAt) : createdDate;
      timeline.push({
        status: 'EXCHANGE REQUESTED',
        message: `Exchange requested by user. Reason: ${order.exchangeRequest?.reason || 'Not specified'}`,
        date: exchangeDate
      });
    }

    if (order.status === 'Exchanged') {
      timeline.push({
        status: 'EXCHANGED',
        message: 'Exchanged successfully. Replacement item dispatched.',
        date: updatedDate
      });
    }

    // Show latest first
    return timeline.reverse();
  };

  return (
    <>
      <div className="animate-fade-in-up">
        {/* Search and Filters */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <form onSubmit={handleSearchSubmit} className="d-flex gap-2 flex-grow-1" style={{ maxWidth: '400px' }}>
            <input 
              type="text" 
              placeholder="Search order ID or customer..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="form-control bg-dark border-0 text-white py-2 px-3"
              style={{ borderRadius: '10px' }}
            />
            <button type="submit" className="btn btn-dark border-0 py-2 px-3 hover-lift" style={{ borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <i className="fas fa-search"></i>
            </button>
          </form>
  
          <select 
            value={status} 
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="form-select bg-dark border-0 text-white py-2 px-3"
            style={{ borderRadius: '10px', width: '200px', cursor: 'pointer' }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Return Requested">Return Requested</option>
            <option value="Exchange Requested">Exchange Requested</option>
            <option value="Returned">Returned</option>
            <option value="Exchanged">Exchanged</option>
          </select>
        </div>
  
        {/* Orders Table */}
        <div className="card glass-premium border-0 p-4" style={{ borderRadius: '16px' }}>
          <div className="table-responsive">
            <table className="table table-dark table-hover border-0 align-middle mb-0">
              <thead>
                <tr className="text-muted small border-bottom" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <th className="py-3 bg-transparent border-0">Order ID</th>
                  <th className="py-3 bg-transparent border-0">Customer</th>
                  <th className="py-3 bg-transparent border-0">Date</th>
                  <th className="py-3 bg-transparent border-0">Total Amount</th>
                  <th className="py-3 bg-transparent border-0">Status</th>
                  <th className="py-3 bg-transparent border-0">Payment</th>
                  <th className="py-3 bg-transparent border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 bg-transparent border-0">
                      <div className="spinner-border text-info" role="status"></div>
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="border-bottom" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <td className="py-3 bg-transparent border-0 fw-semibold text-info">{order.orderId}</td>
                      <td className="py-3 bg-transparent border-0">
                        <div className="fw-semibold text-white">{order.shippingInfo?.fullName || 'N/A'}</div>
                        <span className="small text-muted">{order.userId?.email || 'N/A'}</span>
                      </td>
                      <td className="py-3 bg-transparent border-0 text-muted small">{order.date}</td>
                      <td className="py-3 bg-transparent border-0 fw-bold text-white">{order.total}</td>
                      <td className="py-3 bg-transparent border-0">
                        {renderStatusBadge(order.status)}
                      </td>
                      <td className="py-3 bg-transparent border-0">
                        <div className="d-flex flex-column align-items-start gap-1">
                          {renderPaymentStatusBadge(order.paymentStatus || 'PENDING')}
                          <span className="small text-muted" style={{ fontSize: '0.7rem' }}>
                            {order.paymentMethod?.toUpperCase() || 'COD'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 bg-transparent border-0 text-end">
                        <button onClick={() => openDetailModal(order)} className="btn btn-sm btn-dark border-0 px-3 py-2 text-info" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                          <i className="far fa-eye me-1"></i> Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted bg-transparent border-0">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
  
          {/* Pagination */}
          {pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination mb-0">
                  {[...Array(pages)].map((_, idx) => (
                    <li key={idx} className="page-item">
                      <button 
                        onClick={() => setPage(idx + 1)}
                        className={`page-link border-0 mx-1 px-3 py-2 bg-dark ${page === idx + 1 ? 'active bg-info text-white' : 'text-muted'}`}
                        style={{ borderRadius: '8px' }}
                      >
                        {idx + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
  
      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          zIndex: 999,
          overflowY: 'auto',
          padding: '90px 16px 40px 16px',
          animation: 'fadeIn 0.2s ease-in'
        }} onClick={() => setShowDetailModal(false)}>
          
          <div className="card glass-premium p-4 p-md-5 text-white animate-fade-in-up" style={{ 
            maxWidth: '1100px', 
            width: '100%', 
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <div className="d-flex align-items-center gap-3">
                <button 
                  onClick={() => setShowDetailModal(false)} 
                  className="btn btn-dark border-0 p-2 d-flex align-items-center justify-content-center rounded-circle"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', width: '40px', height: '40px' }}
                >
                  <i className="fas fa-arrow-left text-white"></i>
                </button>
                <div>
                  <h4 className="fw-bold mb-0">Order Details</h4>
                  <span className="text-muted small">#{selectedOrder.orderId}</span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button 
                  onClick={() => {
                    toast.info('Downloading invoice...');
                  }} 
                  className="btn btn-dark border-0 px-3 py-2 text-white d-flex align-items-center gap-2"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px' }}
                >
                  <i className="far fa-file-pdf"></i> Download Invoice
                </button>
                {selectedOrder.status === 'Pending' && (
                  <button 
                    onClick={() => handleStatusChange(selectedOrder._id, 'Processing')} 
                    className="btn btn-primary px-3 py-2 fw-semibold"
                    style={{ borderRadius: '10px', backgroundColor: '#3b82f6', border: 'none' }}
                  >
                    Mark as Confirmed
                  </button>
                )}
              </div>
            </div>

            <div className="row g-4 text-start">
              {/* Left Column */}
              <div className="col-lg-7">
                {/* Order Items Card */}
                <div className="card bg-dark border-0 p-4 mb-4" style={{ borderRadius: '16px', backgroundColor: 'rgba(15, 23, 42, 0.3)' }}>
                  <h5 className="fw-bold text-white mb-3">Order Items</h5>
                  <div className="d-flex flex-column gap-3 mb-4">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="d-flex justify-content-between align-items-center p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div className="d-flex align-items-center gap-3">
                          <div 
                            className="d-flex align-items-center justify-content-center rounded" 
                            style={{ 
                              width: '50px', 
                              height: '50px', 
                              backgroundColor: 'rgba(255,255,255,0.05)', 
                              border: '1px solid rgba(255,255,255,0.08)',
                              overflow: 'hidden'
                            }}
                          >
                            {item.image ? (
                              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <i className="fas fa-box text-muted fa-lg"></i>
                            )}
                          </div>
                          <div>
                            <span className="fw-semibold text-white d-block">{item.name}</span>
                            <span className="small text-muted">
                              Qty: {item.quantity} × {item.price || selectedOrder.total}
                            </span>
                          </div>
                        </div>
                        <span className="fw-bold text-white">
                          {item.price ? ('₹' + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toLocaleString('en-IN')) : selectedOrder.total}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Pricing */}
                  <div className="border-top pt-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="d-flex justify-content-between mb-2 text-muted small">
                      <span>Subtotal</span>
                      <span className="text-white">{selectedOrder.total}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 text-muted small">
                      <span>Shipping</span>
                      <span className="text-white">₹0.00</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold text-white fs-5 border-top pt-2" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <span>Total</span>
                      <span className="text-info">{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>

                {/* Order History Timeline Card */}
                <div className="card bg-dark border-0 p-4" style={{ borderRadius: '16px', backgroundColor: 'rgba(15, 23, 42, 0.3)' }}>
                  <h5 className="fw-bold text-white mb-1">Order History</h5>
                  <p className="text-muted small mb-4">Detailed timeline of order status updates</p>
                  
                  <div className="timeline-container ps-2" style={{ position: 'relative' }}>
                    {getTimelineSteps(selectedOrder).map((step, idx, arr) => (
                      <div key={idx} className="timeline-item d-flex gap-3 mb-4" style={{ position: 'relative' }}>
                        {/* Connecting Line */}
                        {idx !== arr.length - 1 && (
                          <div 
                            style={{ 
                              position: 'absolute', 
                              left: '9px', 
                              top: '20px', 
                              bottom: '-28px', 
                              width: '2px', 
                              backgroundColor: 'rgba(59, 130, 246, 0.3)' 
                            }}
                          ></div>
                        )}
                        
                        {/* Dot indicator */}
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center" 
                          style={{ 
                            width: '20px', 
                            height: '20px', 
                            backgroundColor: step.status.includes('CANCELLED') ? '#ef4444' : '#3b82f6', 
                            zIndex: 2,
                            marginTop: '3px'
                          }}
                        >
                          <div className="rounded-circle bg-dark" style={{ width: '8px', height: '8px' }}></div>
                        </div>

                        {/* Step Details */}
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                            <h6 className="mb-0 fw-bold text-white" style={{ fontSize: '0.95rem' }}>{step.status}</h6>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{step.date}</span>
                          </div>
                          <p className="text-muted small mb-0 mt-1">{step.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-lg-5">
                {/* Customer Information Card */}
                <div className="card bg-dark border-0 p-4 mb-4" style={{ borderRadius: '16px', backgroundColor: 'rgba(15, 23, 42, 0.3)' }}>
                  <h5 className="fw-bold text-white mb-3">Customer Information</h5>
                  
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3">
                      <i className="far fa-user text-muted fa-fw mt-1"></i>
                      <div>
                        <span className="fw-semibold text-white d-block">{selectedOrder.shippingInfo?.fullName || selectedOrder.userId?.username || 'N/A'}</span>
                        <span className="text-muted small">Customer</span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <i className="far fa-envelope text-muted fa-fw"></i>
                      <span className="text-white small text-truncate">{selectedOrder.userId?.email || 'N/A'}</span>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <i className="fas fa-phone-alt text-muted fa-fw"></i>
                      <span className="text-white small">{selectedOrder.shippingInfo?.phone || 'N/A'}</span>
                    </div>

                    <div className="d-flex align-items-start gap-3 border-top pt-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <i className="fas fa-map-marker-alt text-muted fa-fw mt-1"></i>
                      <address className="mb-0 text-white small lh-lg" style={{ opacity: 0.9 }}>
                        {selectedOrder.shippingInfo?.street}<br />
                        {selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.state} - {selectedOrder.shippingInfo?.zip}
                      </address>
                    </div>
                  </div>
                </div>

                {/* Order Summary Card */}
                <div className="card bg-dark border-0 p-4 mb-4" style={{ borderRadius: '16px', backgroundColor: 'rgba(15, 23, 42, 0.3)' }}>
                  <h5 className="fw-bold text-white mb-3">Order Summary</h5>
                  
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small">Status</span>
                      {renderStatusBadge(selectedOrder.status)}
                    </div>

                    <div className="d-flex justify-content-between align-items-start">
                      <span className="text-muted small">Payment</span>
                      <div className="text-end">
                        {renderPaymentStatusBadge(selectedOrder.paymentStatus || 'PENDING')}
                        <span className="text-muted d-block small mt-1" style={{ fontSize: '0.75rem' }}>
                          {selectedOrder.paymentMethod?.toUpperCase() || 'COD'}
                        </span>
                      </div>
                    </div>

                    {selectedOrder.paymentMethod?.toUpperCase() !== 'COD' && selectedOrder.transactionInfo && (
                      <div className="p-3 rounded border" style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                        <span className="text-muted d-block mb-2 text-uppercase fw-semibold" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>Transaction Info</span>
                        <div className="d-flex justify-content-between small text-white mb-1">
                          <span className="text-muted">ID:</span>
                          <span>{selectedOrder.transactionInfo.id}</span>
                        </div>
                        {selectedOrder.transactionInfo.upiId && (
                          <div className="d-flex justify-content-between small text-white">
                            <span className="text-muted">UPI:</span>
                            <span>{selectedOrder.transactionInfo.upiId}</span>
                          </div>
                        )}
                        {selectedOrder.transactionInfo.cardNumber && (
                          <div className="d-flex justify-content-between small text-white">
                            <span className="text-muted">Card:</span>
                            <span>{selectedOrder.transactionInfo.cardNumber}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center border-top pt-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <span className="text-muted small">Date</span>
                      <span className="text-white small fw-semibold">{selectedOrder.date}</span>
                    </div>
                  </div>
                </div>

                {/* Refund Management Card (for Returns) */}
                {(selectedOrder.status === 'Return Requested' || selectedOrder.status === 'Returned') && (
                  <div className="card border-0 p-4" style={{ borderRadius: '16px', backgroundColor: 'rgba(30, 27, 75, 0.4)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <i className="far fa-credit-card text-primary"></i>
                      <h5 className="fw-bold text-white mb-0" style={{ color: '#bc79e4' }}>Refund Management</h5>
                    </div>

                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small">Refund Method:</span>
                        <span className="badge bg-primary text-white rounded-pill px-3 py-1fw-bold" style={{ backgroundColor: '#4f46e5', fontSize: '0.75rem' }}>UPI</span>
                      </div>

                      {selectedOrder.paymentMethod?.toUpperCase() !== 'COD' && selectedOrder.transactionInfo?.upiId && (
                        <div className="small">
                          <span className="text-muted d-block text-uppercase fw-semibold mb-1" style={{ fontSize: '0.65rem' }}>Original UPI (Source)</span>
                          <span className="text-white">{selectedOrder.transactionInfo.upiId}</span>
                        </div>
                      )}

                      <div>
                        <span className="text-muted d-block text-uppercase fw-semibold mb-1" style={{ fontSize: '0.65rem' }}>New Refund UPI (Target)</span>
                        <div className="d-flex align-items-center justify-content-between p-3 rounded" style={{ border: '1px dashed rgba(59, 130, 246, 0.5)', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
                          <span className="fw-bold text-info" style={{ wordBreak: 'break-all' }}>{selectedOrder.returnRequest?.upiId || 'N/A'}</span>
                          <button 
                            onClick={() => {
                              if (selectedOrder.returnRequest?.upiId) {
                                navigator.clipboard.writeText(selectedOrder.returnRequest.upiId);
                                toast.info('Refund UPI ID copied!');
                              }
                            }} 
                            className="btn btn-sm btn-link text-info p-0 shadow-none"
                          >
                            <i className="far fa-copy"></i>
                          </button>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small">Refund Status:</span>
                        {selectedOrder.returnRequest?.status === 'Refunded' ? (
                          <span className="badge rounded-pill bg-success text-white px-3 py-1.5 fw-bold" style={{ fontSize: '0.75rem' }}>REFUNDED</span>
                        ) : (
                          <span className="badge rounded-pill bg-warning text-dark px-3 py-1.5 fw-bold" style={{ backgroundColor: '#fbbf24', fontSize: '0.75rem' }}>PENDING</span>
                        )}
                      </div>

                      {selectedOrder.status === 'Return Requested' && (
                        <button 
                          onClick={() => handleStatusChange(selectedOrder._id, 'Returned')} 
                          className="btn btn-primary w-100 fw-bold py-2.5 mt-2" 
                          style={{ backgroundColor: '#4f46e5', border: 'none', borderRadius: '10px' }}
                        >
                          Mark as Refunded
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Update & Actions Footer */}
              <div className="col-12 border-top pt-4 d-flex justify-content-between align-items-center flex-wrap gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="d-flex align-items-center gap-3">
                  <span className="text-muted small fw-bold">Update Status:</span>
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    className="form-select bg-dark border-0 text-white py-2 px-3 rounded-pill"
                    style={{ width: '200px', cursor: 'pointer' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Return Requested">Return Requested</option>
                    <option value="Exchange Requested">Exchange Requested</option>
                    <option value="Returned">Returned</option>
                    <option value="Exchanged">Exchanged</option>
                  </select>
                </div>

                <div className="d-flex gap-2">
                  <button onClick={() => handleDelete(selectedOrder._id, selectedOrder.orderId)} className="btn btn-outline-danger border-0 px-4 py-2 small fw-bold" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px' }}>
                    <i className="fas fa-trash me-2"></i> Delete Order
                  </button>
                  <button onClick={() => setShowDetailModal(false)} className="btn btn-outline-light border-0 px-4 py-2" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
