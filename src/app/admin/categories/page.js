"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useShop } from '../../../context/ShopContext';
import { toast } from 'react-toastify';
import Portal from '../../../components/Portal';

// Client-side high-performance image compression using HTML5 Canvas
const compressImage = (file) => {
  return new Promise((resolve) => {
    if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500; // Optimized size for crisp thumbnails and fast loading
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.6); // 0.6 quality results in tiny ~10KB file sizes
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

// ── Reusable image upload component ──────────────────────────────────────────
function ImageUploader({ value, onChange, token, placeholder = 'Click or drag to upload image' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append('file', compressed);
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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? '#38bdf8' : 'rgba(71,85,105,0.5)'}`,
          borderRadius: '10px',
          padding: '16px',
          textAlign: 'center',
          cursor: uploading ? 'wait' : 'pointer',
          background: dragOver ? 'rgba(56,189,248,0.05)' : 'rgba(30,41,59,0.5)',
          transition: 'all 0.2s',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {uploading ? (
          <>
            <div className="spinner-border spinner-border-sm text-info" />
            <span style={{ color: '#64748b', fontSize: '0.82rem' }}>Uploading...</span>
          </>
        ) : value ? (
          <>
            <img src={value} alt="preview" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px' }} />
            <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Click to change</span>
          </>
        ) : (
          <>
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '1.4rem', color: '#475569' }} />
            <span style={{ color: '#64748b', fontSize: '0.82rem' }}>{placeholder}</span>
          </>
        )}
      </div>

      {/* URL input fallback */}
      <input
        type="text"
        value={value}
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
export default function AdminCategories() {
  const { token } = useShop();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ name: '', image: '', description: '' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCategories();
  }, [token]);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: '', image: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditTarget(cat);
    setForm({ name: cat.name, image: cat.image || '', description: cat.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    setSubmitting(true);
    try {
      const url = editTarget ? `/api/admin/categories/${editTarget._id}` : '/api/admin/categories';
      const method = editTarget ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success(editTarget ? 'Category updated!' : 'Category created!');
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? This won't delete existing products.`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${cat._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleActive = async (cat) => {
    try {
      const currentActive = cat.isActive !== false;
      const nextActive = !currentActive;
      const res = await fetch(`/api/admin/categories/${cat._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: nextActive }),
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success(`Category ${currentActive ? 'deactivated' : 'activated'}`);
      setCategories(categories.map(c => c._id === cat._id ? { ...c, isActive: nextActive } : c));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold text-white mb-1">Categories</h5>
          <p className="text-muted small mb-0">{categories.length} categories total</p>
        </div>
        <button onClick={openAdd} className="btn btn-vibrant-gradient px-4 py-2 fw-semibold">
          <i className="fas fa-plus me-2" />Add Category
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" />
        </div>
      ) : categories.length === 0 ? (
        <div className="card glass-premium border-0 p-5 text-center" style={{ borderRadius: '16px' }}>
          <i className="fas fa-layer-group fa-3x mb-3" style={{ color: '#334155' }} />
          <h5 className="text-white fw-bold">No Categories Yet</h5>
          <p className="text-muted small mb-4">Create your first category to organize products</p>
          <button onClick={openAdd} className="btn btn-vibrant-gradient px-4 mx-auto" style={{ width: 'fit-content' }}>
            <i className="fas fa-plus me-2" />Create Category
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {categories.map((cat) => (
            <div key={cat._id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div
                className="card glass-premium border-0 h-100"
                style={{
                  borderRadius: '16px',
                  opacity: cat.isActive !== false ? 1 : 0.55,
                  transition: 'opacity 0.2s',
                  overflow: 'hidden',
                }}
              >
                {/* Image */}
                <div style={{
                  height: '140px', background: 'rgba(30,41,59,0.8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                }}>
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <i className="fas fa-layer-group fa-2x" style={{ color: '#334155' }} />
                  )}
                </div>

                {/* Body */}
                <div className="p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold text-white mb-0">{cat.name}</h6>
                    <span className={`badge rounded-pill ${cat.isActive !== false ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.65rem' }}>
                      {cat.isActive !== false ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-muted small mb-2" style={{ fontSize: '0.78rem', lineHeight: 1.4 }}>
                      {cat.description}
                    </p>
                  )}
                  <p className="text-muted mb-3" style={{ fontSize: '0.72rem' }}>
                    <i className="fas fa-link me-1" />/{cat.slug}
                  </p>

                  {/* Actions */}
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => openEdit(cat)}
                      className="btn btn-sm flex-grow-1 border-0 text-info fw-semibold"
                      style={{ background: 'rgba(56,189,248,0.1)', borderRadius: '8px', fontSize: '0.8rem' }}
                    >
                      <i className="fas fa-edit me-1" />Edit
                    </button>
                    <button
                      onClick={() => toggleActive(cat)}
                      className="btn btn-sm border-0"
                      style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: cat.isActive !== false ? '#f59e0b' : '#22c55e' }}
                      title={cat.isActive !== false ? 'Deactivate' : 'Activate'}
                    >
                      <i className={`fas ${cat.isActive !== false ? 'fa-eye-slash' : 'fa-eye'}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="btn btn-sm border-0 text-danger"
                      style={{ background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}
                      title="Delete"
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Portal>
          <div
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 9999, overflowY: 'auto', padding: '20px',
            }}
            onClick={() => setShowModal(false)}
          >
          <div
            className="card glass-premium text-white p-4"
            style={{ maxWidth: '520px', width: '90%', borderRadius: '20px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">{editTarget ? 'Edit Category' : 'New Category'}</h5>
              <button onClick={() => setShowModal(false)} className="btn btn-sm border-0 text-muted" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <i className="fas fa-times" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              {/* Name */}
              <div>
                <label className="form-label small text-muted fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>
                  Category Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Processors, Gaming Monitors..."
                  className="form-control bg-dark border-0 text-white shadow-none"
                  style={{ borderRadius: '10px' }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="form-label small text-muted fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="2"
                  placeholder="Short description of this category..."
                  className="form-control bg-dark border-0 text-white shadow-none"
                  style={{ borderRadius: '10px', resize: 'none' }}
                />
              </div>

              {/* Image */}
              <div>
                <label className="form-label small text-muted fw-bold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>
                  Category Image
                </label>
                <ImageUploader
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  token={token}
                  placeholder="Click or drag to upload category image"
                />
              </div>

              {/* Actions */}
              <div className="d-flex gap-2 mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn flex-grow-1 border-0 text-muted" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-vibrant-gradient flex-grow-1 fw-bold" style={{ borderRadius: '10px' }}>
                  {submitting ? <><i className="fas fa-circle-notch fa-spin me-2" />Saving...</> : editTarget ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
        </Portal>
      )}
    </div>
  );
}
