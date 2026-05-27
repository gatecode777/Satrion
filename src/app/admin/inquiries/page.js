"use client";

import React, { useEffect, useState } from 'react';
import { useShop } from '../../../context/ShopContext';
import { toast } from 'react-toastify';

export default function AdminInquiries() {
  const { token } = useShop();
  const [inquiries, setInquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Detail Modal state
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/inquiries?page=${page}&status=${status}&search=${search}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch inquiries');
      const data = await res.json();
      setInquiries(data.inquiries || []);
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
      fetchInquiries();
    }
  }, [token, page, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchInquiries();
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');
      toast.success('Inquiry status updated');
      setInquiries(inquiries.map(inq => inq._id === inquiryId ? { ...inq, status: newStatus } : inq));
      
      if (selectedInquiry && selectedInquiry._id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this quote request?')) return;

    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete inquiry');
      }
      toast.success('Quote inquiry deleted');
      setShowDetailModal(false);
      fetchInquiries();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openDetailModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowDetailModal(true);
  };

  return (
    <>
      <div className="animate-fade-in-up">
        {/* Search and status select */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <form onSubmit={handleSearchSubmit} className="d-flex gap-2 flex-grow-1" style={{ maxWidth: '400px' }}>
            <input 
              type="text" 
              placeholder="Search by client, email, or product..." 
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
            <option value="Contacted">Contacted</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
  
        {/* Table grid */}
        <div className="card glass-premium border-0 p-4" style={{ borderRadius: '16px' }}>
          <div className="table-responsive">
            <table className="table table-dark table-hover border-0 align-middle mb-0">
              <thead>
                <tr className="text-muted small border-bottom" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <th className="py-3 bg-transparent border-0">Client</th>
                  <th className="py-3 bg-transparent border-0">Subject / Product</th>
                  <th className="py-3 bg-transparent border-0">Quantity</th>
                  <th className="py-3 bg-transparent border-0">Received Date</th>
                  <th className="py-3 bg-transparent border-0">Status</th>
                  <th className="py-3 bg-transparent border-0 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 bg-transparent border-0">
                      <div className="spinner-border text-info" role="status"></div>
                    </td>
                  </tr>
                ) : inquiries.length > 0 ? (
                  inquiries.map((inq) => (
                    <tr key={inq._id} className="border-bottom" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <td className="py-3 bg-transparent border-0">
                        <div className="fw-semibold text-white">{inq.name}</div>
                        <span className="small text-muted">{inq.email}</span>
                      </td>
                      <td className="py-3 bg-transparent border-0 text-white fw-semibold">{inq.subject || inq.productName || 'General Inquiry'}</td>
                      <td className="py-3 bg-transparent border-0 text-muted">{inq.quantity || '-'}</td>
                      <td className="py-3 bg-transparent border-0 text-muted small">{new Date(inq.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 bg-transparent border-0">
                        <select 
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                          className={`form-select form-select-sm border-0 rounded-pill px-3 py-2 fw-semibold text-center ${
                            inq.status === 'Resolved' ? 'bg-success text-white' :
                            inq.status === 'Contacted' ? 'bg-primary text-white' :
                            'bg-warning text-dark'
                          }`}
                          style={{ width: '130px', cursor: 'pointer' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="py-3 bg-transparent border-0 text-end">
                        <button onClick={() => openDetailModal(inq)} className="btn btn-sm btn-dark border-0 px-3 py-2 text-info" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                          <i className="far fa-envelope me-1"></i> View Message
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted bg-transparent border-0">No quote requests found</td>
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
  
      {/* Inquiry Detail Modal */}
      {showDetailModal && selectedInquiry && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease-in'
        }} onClick={() => setShowDetailModal(false)}>
          
          <div className="card glass-premium p-4 p-md-5 text-white animate-fade-in-up" style={{ 
            maxWidth: '600px', 
            width: '90%', 
            borderRadius: '24px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Quote Request Details</h5>
              <button onClick={() => setShowDetailModal(false)} className="btn-close btn-close-white shadow-none"></button>
            </div>

            <div className="row g-4 text-start">
              <div className="col-12 p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-muted small d-block">Subject / Item</span>
                <span className="fw-semibold text-white d-block mb-1" style={{ fontSize: '1.1rem' }}>{selectedInquiry.subject || selectedInquiry.productName || 'General Inquiry'}</span>
                {selectedInquiry.quantity != null && <span className="badge bg-secondary text-light px-3 py-2 rounded-pill small">Quantity: {selectedInquiry.quantity}</span>}
              </div>

              <div className="col-md-6">
                <span className="text-muted small d-block">Client Contact</span>
                <strong className="text-white d-block">{selectedInquiry.name}</strong>
                <a href={`mailto:${selectedInquiry.email}`} className="text-info d-block small mb-1">{selectedInquiry.email}</a>
                <a href={`tel:${selectedInquiry.phone}`} className="text-light text-decoration-none small d-block"><i className="fas fa-phone me-1 small"></i>{selectedInquiry.phone}</a>
              </div>

              <div className="col-md-6 text-md-end">
                <span className="text-muted small d-block">Submission Date</span>
                <span className="text-white small">{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
              </div>

              <div className="col-12 border-top border-bottom py-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <span className="text-muted small d-block mb-2">Message Description</span>
                <p className="mb-0 text-light small lh-lg" style={{ whiteSpace: 'pre-wrap', opacity: 0.9 }}>
                  {selectedInquiry.message || 'No additional message was provided.'}
                </p>
              </div>

              {/* Status and Action Buttons */}
              <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div className="d-flex align-items-center gap-3">
                  <span className="text-muted small fw-bold">Update Status:</span>
                  <select 
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(selectedInquiry._id, e.target.value)}
                    className="form-select bg-dark border-0 text-white py-2 px-3 rounded-pill"
                    style={{ width: '150px', cursor: 'pointer' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="d-flex gap-2">
                  <button onClick={() => handleDelete(selectedInquiry._id)} className="btn btn-outline-danger border-0 px-4 py-2 small fw-bold" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px' }}>
                    <i className="fas fa-trash me-2"></i> Delete Inquiry
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
