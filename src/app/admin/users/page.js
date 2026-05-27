"use client";

import React, { useEffect, useState } from 'react';
import { useShop } from '../../../context/ShopContext';
import { toast } from 'react-toastify';

export default function AdminUsers() {
  const { token, user: currentUser } = useShop();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users?page=${page}&search=${search}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users || []);
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
      fetchUsers();
    }
  }, [token, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };



  const handleDelete = async (userId, username) => {
    if (userId === currentUser._id) {
      toast.error("You cannot delete your own admin account!");
      return;
    }

    if (!window.confirm(`WARNING: Are you sure you want to permanently delete customer account "${username}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete customer');
      }
      toast.success(`Deleted customer ${username}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Search Input bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="d-flex gap-2 flex-grow-1" style={{ maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Search customers by name or email..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="form-control bg-dark border-0 text-white py-2 px-3"
            style={{ borderRadius: '10px' }}
          />
          <button type="submit" className="btn btn-dark border-0 py-2 px-3 hover-lift" style={{ borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="card glass-premium border-0 p-4" style={{ borderRadius: '16px' }}>
        <div className="table-responsive">
          <table className="table table-dark table-hover border-0 align-middle mb-0">
            <thead>
              <tr className="text-muted small border-bottom" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <th className="py-3 bg-transparent border-0">Customer Name</th>
                <th className="py-3 bg-transparent border-0">Email Address</th>
                <th className="py-3 bg-transparent border-0">Registered Date</th>
                <th className="py-3 bg-transparent border-0 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 bg-transparent border-0">
                    <div className="spinner-border text-info" role="status"></div>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((userObj) => (
                  <tr key={userObj._id} className="border-bottom" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <td className="py-3 bg-transparent border-0">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-secondary text-white fw-bold d-flex align-items-center justify-content-center me-3" style={{ width: '36px', height: '36px' }}>
                          {userObj.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-semibold text-white">{userObj.username}</span>
                      </div>
                    </td>
                    <td className="py-3 bg-transparent border-0 text-muted">{userObj.email}</td>
                    <td className="py-3 bg-transparent border-0 text-muted small">{new Date(userObj.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 bg-transparent border-0 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button 
                          onClick={() => handleDelete(userObj._id, userObj.username)} 
                          className="btn btn-sm btn-dark border-0 p-2 text-danger" 
                          style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}
                          title="Delete Customer"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted bg-transparent border-0">No customers found</td>
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
  );
}
