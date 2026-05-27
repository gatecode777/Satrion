"use client";

import React, { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { token } = useShop();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center p-5">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading Stats...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="card border-0 mb-4 p-4" style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(192,132,252,0.15) 100%)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="fw-bold text-white mb-1">Satrion Admin Console</h3>
        <p className="text-muted mb-0">Control panels, products database, quote requests and sales records.</p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {/* Total Revenue */}
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="card glass-premium border-0 p-4 h-100" style={{ borderRadius: '16px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="small text-muted fw-bold">TOTAL REVENUE</span>
              <div className="rounded-circle p-2 bg-info bg-opacity-10 text-info">
                <i className="fas fa-wallet fa-lg"></i>
              </div>
            </div>
            <h2 className="fw-bold text-white mb-1">₹{stats?.totalRevenue || '0.00'}</h2>
            <span className="small text-success"><i className="fas fa-arrow-trend-up"></i> Lifetime sales</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="card glass-premium border-0 p-4 h-100" style={{ borderRadius: '16px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="small text-muted fw-bold">TOTAL ORDERS</span>
              <div className="rounded-circle p-2 bg-primary bg-opacity-10 text-primary">
                <i className="fas fa-shopping-bag fa-lg"></i>
              </div>
            </div>
            <h2 className="fw-bold text-white mb-1">{stats?.totalOrders || 0}</h2>
            <span className="small text-info"><i className="fas fa-box"></i> Placed orders</span>
          </div>
        </div>

        {/* Total Users */}
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="card glass-premium border-0 p-4 h-100" style={{ borderRadius: '16px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="small text-muted fw-bold">TOTAL USERS</span>
              <div className="rounded-circle p-2 bg-success bg-opacity-10 text-success">
                <i className="fas fa-users fa-lg"></i>
              </div>
            </div>
            <h2 className="fw-bold text-white mb-1">{stats?.totalUsers || 0}</h2>
            <span className="small text-muted">Registered accounts</span>
          </div>
        </div>

        {/* Conversion Info */}
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="card glass-premium border-0 p-4 h-100" style={{ borderRadius: '16px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="small text-muted fw-bold">STATUS SPLIT</span>
              <div className="rounded-circle p-2 bg-warning bg-opacity-10 text-warning">
                <i className="fas fa-chart-pie fa-lg"></i>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-1">
              {stats?.ordersByStatus?.map((s) => (
                <span key={s._id} className="badge bg-secondary text-light rounded-pill px-3 py-2 small" style={{ fontSize: '0.7rem' }}>
                  {s._id}: {s.count}
                </span>
              )) || <span className="text-muted small">No orders recorded</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Graph Row */}
      {stats?.salesGraph?.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card glass-premium border-0 p-4" style={{ borderRadius: '16px' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-white mb-0">Sales Activity (Last 7 Days)</h5>
                <span className="badge bg-info text-white rounded-pill px-3 py-2">
                  <i className="fas fa-chart-area me-1"></i> Revenue
                </span>
              </div>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart
                    data={stats.salesGraph}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis 
                      stroke="#64748b" 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(val) => `₹${val}`}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => [`₹${value.toFixed(2)}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lists Row */}
      <div className="row">
        {/* Recent Orders */}
        <div className="col-12 col-lg-8 mb-4">
          <div className="card glass-premium border-0 p-4 h-100" style={{ borderRadius: '16px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold text-white mb-0">Recent Orders</h5>
              <Link href="/admin/orders" className="text-info text-decoration-none small fw-semibold">View All Orders →</Link>
            </div>
            <div className="table-responsive">
              <table className="table table-dark table-hover border-0 align-middle mb-0">
                <thead>
                  <tr className="text-muted small border-bottom" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <th className="py-3 bg-transparent border-0">Order ID</th>
                    <th className="py-3 bg-transparent border-0">Customer</th>
                    <th className="py-3 bg-transparent border-0">Date</th>
                    <th className="py-3 bg-transparent border-0">Total</th>
                    <th className="py-3 bg-transparent border-0">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <tr key={order._id} className="border-bottom" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                        <td className="py-3 bg-transparent border-0 fw-semibold text-info">{order.orderId}</td>
                        <td className="py-3 bg-transparent border-0">
                          <div className="fw-semibold text-white">{order.shippingInfo?.fullName || 'N/A'}</div>
                          <span className="small text-muted">{order.userId?.email || 'N/A'}</span>
                        </td>
                        <td className="py-3 bg-transparent border-0 text-muted small">{order.date}</td>
                        <td className="py-3 bg-transparent border-0 fw-bold text-white">{order.total}</td>
                        <td className="py-3 bg-transparent border-0">
                          <span className={`badge rounded-pill px-3 py-2 small ${
                            order.status === 'Delivered' ? 'bg-success' :
                            order.status === 'Shipped' ? 'bg-primary' :
                            order.status === 'Cancelled' ? 'bg-danger' :
                            'bg-warning text-dark'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted bg-transparent border-0">No orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Registered Users */}
        <div className="col-12 col-lg-4 mb-4">
          <div className="card glass-premium border-0 p-4 h-100" style={{ borderRadius: '16px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold text-white mb-0">Recent Registrations</h5>
              <Link href="/admin/users" className="text-info text-decoration-none small fw-semibold">View All →</Link>
            </div>
            <div className="d-flex flex-column gap-3">
              {stats?.recentUsers?.length > 0 ? (
                stats.recentUsers.map((user) => (
                  <div key={user._id} className="d-flex align-items-center justify-content-between p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="d-flex align-items-center overflow-hidden">
                      <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', minWidth: '36px' }}>
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="ms-3 overflow-hidden">
                        <h6 className="mb-0 text-white fw-semibold text-truncate small">{user.username}</h6>
                        <span className="text-muted d-block text-truncate" style={{ fontSize: '0.75rem' }}>{user.email}</span>
                      </div>
                    </div>
                    <div>
                      {user.isAdmin && <span className="badge bg-info small" style={{ fontSize: '0.6rem' }}>ADMIN</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted small">No recent user registrations</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
