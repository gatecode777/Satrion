"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useShop } from '../../../context/ShopContext';
import { toast } from 'react-toastify';
import Portal from '../../../components/Portal';

// ── Image uploader (drag & drop + URL fallback) ────────────────────────────
function ImageUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) uploadFile(f); }}
        style={{
          border: `2px dashed ${dragOver ? '#38bdf8' : 'rgba(71,85,105,0.5)'}`,
          borderRadius: '10px', padding: '16px', textAlign: 'center',
          cursor: uploading ? 'wait' : 'pointer',
          background: dragOver ? 'rgba(56,189,248,0.05)' : 'rgba(30,41,59,0.5)',
          transition: 'all 0.2s', minHeight: '100px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '6px',
        }}
      >
        {uploading ? (
          <><div className="spinner-border spinner-border-sm text-info" /><span style={{ color: '#64748b', fontSize: '0.82rem' }}>Uploading...</span></>
        ) : value ? (
          <><img src={value} alt="preview" style={{ maxHeight: '90px', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px' }} /><span style={{ color: '#64748b', fontSize: '0.75rem' }}>Click to change image</span></>
        ) : (
          <><i className="fas fa-cloud-upload-alt" style={{ fontSize: '1.6rem', color: '#475569' }} /><span style={{ color: '#64748b', fontSize: '0.82rem' }}>Click or drag to upload product image</span><span style={{ color: '#334155', fontSize: '0.72rem' }}>JPG, PNG, WebP — max 5MB</span></>
        )}
      </div>
      <input
        type="text" value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL"
        className="form-control bg-dark border-0 text-white shadow-none mt-2"
        style={{ fontSize: '0.82rem', borderRadius: '8px' }}
      />
      <input ref={inputRef} type="file" accept="image/*" className="d-none"
        onChange={(e) => e.target.files[0] && uploadFile(e.target.files[0])} />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '', price: '', originalPrice: '', description: '',
  image: '', category: '', brand: '', stock: '10', homepageSection: 'None',
};

export default function AdminProducts() {
  const { token } = useShop();
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [pages, setPages]           = useState(1);
  const [search, setSearch]         = useState('');
  const [filterCat, setFilterCat]   = useState('');
  const [loading, setLoading]       = useState(true);

  const [showModal, setShowModal]           = useState(false);
  const [editTarget, setEditTarget]         = useState(null);
  const [form, setForm]                     = useState(EMPTY_FORM);
  const [submitting, setSubmitting]         = useState(false);

  // ── Fetch categories for dropdown ──────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {}
  };

  // ── Fetch products ─────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/products?page=${page}&search=${search}&category=${filterCat}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) { fetchCategories(); fetchProducts(); }
  }, [token, page, filterCat]);

  const handleSearchSubmit = (e) => { e.preventDefault(); setPage(1); fetchProducts(); };

  const field = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const openAdd = () => {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, category: categories[0]?.name || '' });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditTarget(p);
    setForm({
      name: p.name || '', price: p.price?.toString() || '',
      originalPrice: p.originalPrice?.toString() || '', description: p.description || '',
      image: p.image || '', category: p.category || '',
      brand: p.brand || '', stock: p.stock?.toString() || '0',
      homepageSection: p.homepageSection || 'None',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      toast.error('Name, price and category are required'); return;
    }
    setSubmitting(true);
    try {
      const url    = editTarget ? `/api/admin/products/${editTarget._id}` : '/api/admin/products';
      const method = editTarget ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          price:         parseFloat(form.price),
          originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
          stock:         parseInt(form.stock || 0),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success(editTarget ? 'Product updated!' : 'Product created!');
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) { toast.error(err.message); }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in-up">

      {/* Toolbar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="d-flex gap-2" style={{ maxWidth: '380px', flex: 1 }}>
          <input
            type="text" placeholder="Search products..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control bg-dark text-white border-0 py-2 px-3"
            style={{ borderRadius: '10px' }}
          />
          <button type="submit" className="btn btn-dark border-0 py-2 px-3"
            style={{ borderRadius: '10px', background: 'rgba(255,255,255,0.05)' }}>
            <i className="fas fa-search" />
          </button>
        </form>

        <div className="d-flex gap-2">
          <select
            value={filterCat}
            onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}
            className="form-select bg-dark text-white border-0 py-2"
            style={{ borderRadius: '10px', cursor: 'pointer', minWidth: '160px' }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
          <button onClick={openAdd} className="btn btn-vibrant-gradient px-4 py-2 fw-semibold">
            <i className="fas fa-plus me-2" />Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card glass-premium border-0 p-4" style={{ borderRadius: '16px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted small">{total} products total</span>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover border-0 align-middle mb-0">
            <thead>
              <tr className="text-muted small border-bottom" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <th className="py-3 bg-transparent border-0">Image</th>
                <th className="py-3 bg-transparent border-0">Product</th>
                <th className="py-3 bg-transparent border-0">Category</th>
                <th className="py-3 bg-transparent border-0">Price</th>
                <th className="py-3 bg-transparent border-0">Stock</th>
                <th className="py-3 bg-transparent border-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5 bg-transparent border-0">
                  <div className="spinner-border text-info" />
                </td></tr>
              ) : products.length > 0 ? products.map((p) => (
                <tr key={p._id} className="border-bottom" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <td className="py-3 bg-transparent border-0">
                    <div className="rounded d-flex align-items-center justify-content-center overflow-hidden"
                      style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.04)' }}>
                      {p.image
                        ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <i className="fas fa-box text-muted" />}
                    </div>
                  </td>
                  <td className="py-3 bg-transparent border-0 fw-semibold text-white">
                    <div>{p.name}</div>
                    <span className="small text-muted">{p.brand || 'No Brand'}</span>
                    {p.isFeatured && <span className="badge bg-info ms-2" style={{ fontSize: '0.6rem' }}>FEATURED</span>}
                  </td>
                  <td className="py-3 bg-transparent border-0">
                    <span className="badge rounded-pill bg-secondary text-light px-3 py-2" style={{ fontSize: '0.75rem' }}>{p.category}</span>
                  </td>
                  <td className="py-3 bg-transparent border-0 fw-bold text-white">
                    ₹{p.price?.toLocaleString('en-IN')}
                    {p.originalPrice && <div className="small text-muted text-decoration-line-through">₹{p.originalPrice?.toLocaleString('en-IN')}</div>}
                  </td>
                  <td className="py-3 bg-transparent border-0">
                    <span className={`badge py-2 px-3 rounded-pill ${p.stock > 5 ? 'bg-success' : p.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-3 bg-transparent border-0 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button onClick={() => openEdit(p)} className="btn btn-sm border-0 text-info p-2"
                        style={{ background: 'rgba(56,189,248,0.08)', borderRadius: '8px' }}>
                        <i className="fas fa-edit" />
                      </button>
                      <button onClick={() => handleDelete(p._id, p.name)} className="btn btn-sm border-0 text-danger p-2"
                        style={{ background: 'rgba(239,68,68,0.08)', borderRadius: '8px' }}>
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="text-center py-5 text-muted bg-transparent border-0">
                  <i className="fas fa-box-open fa-2x mb-2 d-block" style={{ color: '#334155' }} />
                  No products found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav><ul className="pagination mb-0">
              {[...Array(pages)].map((_, i) => (
                <li key={i} className="page-item">
                  <button onClick={() => setPage(i + 1)}
                    className={`page-link border-0 mx-1 px-3 py-2 bg-dark ${page === i + 1 ? 'active bg-info text-white' : 'text-muted'}`}
                    style={{ borderRadius: '8px' }}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul></nav>
          </div>
        )}
      </div>

      {/* ── Modal ────────────────────────────────────────────────────────────── */}
      {showModal && (
        <Portal>
          <div
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 9999, overflowY: 'auto', padding: '24px 16px',
            }}
            onClick={() => setShowModal(false)}
          >
          <div
            className="card glass-premium p-4 text-white"
            style={{ maxWidth: '700px', width: '94%', borderRadius: '24px', maxHeight: '92vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">{editTarget ? 'Edit Product' : 'Add New Product'}</h5>
              <button onClick={() => setShowModal(false)} className="btn btn-sm border-0 text-muted" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                {/* Product Name */}
                <div className="col-12">
                  <label className="form-label small text-muted fw-bold" style={{ letterSpacing: '0.4px', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                    Product Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" value={form.name} onChange={(e) => field('name', e.target.value)}
                    required placeholder="e.g. NVIDIA RTX 4090 GPU"
                    className="form-control bg-dark border-0 text-white shadow-none" style={{ borderRadius: '10px' }} />
                </div>

                {/* Category */}
                <div className="col-md-6">
                  <label className="form-label small text-muted fw-bold" style={{ letterSpacing: '0.4px', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                    Category <span className="text-danger">*</span>
                  </label>
                  {categories.length > 0 ? (
                    <select value={form.category} onChange={(e) => field('category', e.target.value)}
                      required className="form-select bg-dark border-0 text-white shadow-none" style={{ borderRadius: '10px' }}>
                      <option value="">Select a category</option>
                      {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  ) : (
                    <div className="d-flex align-items-center gap-2 p-2 rounded" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px' }}>
                      <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '0.85rem' }} />
                      <span className="text-warning small">No categories found. <a href="/admin/categories" className="text-warning fw-bold">Create one first.</a></span>
                    </div>
                  )}
                </div>

                {/* Brand */}
                <div className="col-md-6">
                  <label className="form-label small text-muted fw-bold" style={{ letterSpacing: '0.4px', textTransform: 'uppercase', fontSize: '0.72rem' }}>Brand</label>
                  <input type="text" value={form.brand} onChange={(e) => field('brand', e.target.value)}
                    placeholder="e.g. ASUS, Intel, AMD"
                    className="form-control bg-dark border-0 text-white shadow-none" style={{ borderRadius: '10px' }} />
                </div>

                {/* Price */}
                <div className="col-md-4">
                  <label className="form-label small text-muted fw-bold" style={{ letterSpacing: '0.4px', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                    Price (₹) <span className="text-danger">*</span>
                  </label>
                  <input type="number" value={form.price} onChange={(e) => field('price', e.target.value)}
                    required min="0" placeholder="25000"
                    className="form-control bg-dark border-0 text-white shadow-none" style={{ borderRadius: '10px' }} />
                </div>

                {/* Original Price */}
                <div className="col-md-4">
                  <label className="form-label small text-muted fw-bold" style={{ letterSpacing: '0.4px', textTransform: 'uppercase', fontSize: '0.72rem' }}>Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={(e) => field('originalPrice', e.target.value)}
                    min="0" placeholder="29000"
                    className="form-control bg-dark border-0 text-white shadow-none" style={{ borderRadius: '10px' }} />
                </div>

                {/* Stock */}
                <div className="col-md-4">
                  <label className="form-label small text-muted fw-bold" style={{ letterSpacing: '0.4px', textTransform: 'uppercase', fontSize: '0.72rem' }}>Stock Qty</label>
                  <input type="number" value={form.stock} onChange={(e) => field('stock', e.target.value)}
                    min="0" placeholder="10"
                    className="form-control bg-dark border-0 text-white shadow-none" style={{ borderRadius: '10px' }} />
                </div>

                {/* Product Image */}
                <div className="col-12">
                  <label className="form-label small text-muted fw-bold" style={{ letterSpacing: '0.4px', textTransform: 'uppercase', fontSize: '0.72rem' }}>Product Image</label>
                  <ImageUploader value={form.image} onChange={(url) => field('image', url)} />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label small text-muted fw-bold" style={{ letterSpacing: '0.4px', textTransform: 'uppercase', fontSize: '0.72rem' }}>Description</label>
                  <textarea value={form.description} onChange={(e) => field('description', e.target.value)}
                    rows="3" placeholder="Product specs, warranty info, features..."
                    className="form-control bg-dark border-0 text-white shadow-none" style={{ borderRadius: '10px', resize: 'vertical' }} />
                </div>

                {/* Homepage Display Section Selection */}
                <div className="col-12">
                  <div className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <label htmlFor="homepageSection" className="form-label small text-muted fw-bold" style={{ letterSpacing: '0.4px', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                      Homepage Section Display
                    </label>
                    <select
                      id="homepageSection"
                      value={form.homepageSection}
                      onChange={(e) => field('homepageSection', e.target.value)}
                      className="form-select bg-dark text-white border-0 py-2 shadow-none"
                      style={{ borderRadius: '10px', cursor: 'pointer' }}
                    >
                      <option value="None">None (Standard Product)</option>
                      <option value="Featured Products">Featured Products</option>
                      <option value="Bestsellers">Bestsellers</option>
                      <option value="Our Range of Gaming Products">Our Range of Gaming Products</option>
                    </select>
                    <span className="text-muted small d-block mt-2">Select which section this product should show up on the homepage.</span>
                  </div>
                </div>

                {/* Submit */}
                <div className="col-12 d-flex gap-2 mt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="btn flex-grow-1 border-0 text-muted"
                    style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="btn btn-vibrant-gradient flex-grow-1 fw-bold" style={{ borderRadius: '10px' }}>
                    {submitting
                      ? <><i className="fas fa-circle-notch fa-spin me-2" />Saving...</>
                      : editTarget ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
        </Portal>
      )}
    </div>
  );
}
