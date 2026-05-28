"use client";

import React, { useEffect, useRef, useState } from 'react';

const ContactClient = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, []);

  const mapRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Initialize map when component mounts
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Leaflet CSS and JS dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    link.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
    link.crossOrigin = '';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    script.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==';
    script.crossOrigin = '';
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    if (!window.L || mapRef.current) return;

    const L = window.L;

    // Create map pointed to R-Tech Capital Galleria, Jaipur
    const mymap = L.map('mapid').setView([26.9226, 75.6880], 15);
    mapRef.current = mymap;
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mymap);

    // Add marker
    L.marker([26.9226, 75.6880]).addTo(mymap)
      .bindPopup("<b>Satrion Support Desk</b><br />R-Tech Capital Galleria, Jaipur").openPopup();

    // Disable scroll wheel and touch zoom
    mymap.scrollWheelZoom.disable();
    mymap.touchZoom.disable();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      alert('Please fill in all fields');
      setLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      
      alert('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Start Content Page */}
      <div className="container-fluid bg-light py-5">
        <div className="col-md-6 m-auto text-center animate-fade-in-up">
          <h1 className="h1 text-dark">Contact Us</h1>
          <p className="text-muted" style={{ lineHeight: '1.8' }}>
            We would love to hear from you! Whether you have a question about our products, need assistance with an order, or just want to say hello, our team is here to help. Please fill out the form below and we will get back to you as soon as possible.
          </p>
        </div>
      </div>

      {/* Start Contact Section */}
      <div className="container py-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '24px', overflow: 'hidden' }}>
              <div className="row g-0">
                
                {/* Left Side: Contact Info & Map */}
                <div className="col-lg-4 text-white" style={{ background: '#0f172a', padding: '40px' }}>
                  <h3 className="fw-bold mb-4" style={{ color: '#38bdf8' }}>Get in Touch</h3>
                  <p className="mb-4" style={{ opacity: 0.8, lineHeight: '1.8' }}>We'd love to hear from you. Our friendly team is always here to chat.</p>
                  
                  <div className="d-flex align-items-center mb-4">
                    <div className="me-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '45px', height: '45px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                      <i className="fas fa-map-marker-alt" style={{ color: '#38bdf8' }}></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Office</h6>
                      <small style={{ opacity: 0.8, display: 'block', lineHeight: '1.4' }}>
                        R-Tech Capital Galleria, Plot No. 3 (A), RIICO INDL. Area, Kanakpura, Sirsi Rd, Vaishali Nagar, Jaipur, Rajasthan 302034
                      </small>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center mb-4">
                    <div className="me-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '45px', height: '45px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                      <i className="fas fa-envelope" style={{ color: '#38bdf8' }}></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Email</h6>
                      <small style={{ opacity: 0.8 }}>info@satrion.in</small>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center mb-5">
                    <div className="me-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '45px', height: '45px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                      <i className="fas fa-phone" style={{ color: '#38bdf8' }}></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Phone</h6>
                      <small style={{ opacity: 0.8 }}>+91 9116722622</small>
                    </div>
                  </div>

                  {/* Map */}
                  <div id="mapid" style={{ width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                </div>

                {/* Right Side: Form */}
                <div className="col-lg-8 p-5 bg-white">
                  <h3 className="fw-bold mb-4 text-dark">Send us a Message</h3>
                  <form onSubmit={handleSubmit} role="form">
                    <div className="row">
                      <div className="form-group col-md-6 mb-4">
                        <label htmlFor="name" className="text-dark fw-bold mb-2">Name</label>
                        <input
                          type="text"
                          className="form-control bg-light border-0"
                          id="name"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          style={{ padding: '15px', borderRadius: '12px', transition: 'box-shadow 0.3s ease' }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.3)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />
                      </div>
                      <div className="form-group col-md-6 mb-4">
                        <label htmlFor="email" className="text-dark fw-bold mb-2">Email</label>
                        <input
                          type="email"
                          className="form-control bg-light border-0"
                          id="email"
                          name="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{ padding: '15px', borderRadius: '12px', transition: 'box-shadow 0.3s ease' }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.3)'}
                          onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="subject" className="text-dark fw-bold mb-2">Subject</label>
                      <input
                        type="text"
                        className="form-control bg-light border-0"
                        id="subject"
                        name="subject"
                        placeholder="Message Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        style={{ padding: '15px', borderRadius: '12px', transition: 'box-shadow 0.3s ease' }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.3)'}
                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="message" className="text-dark fw-bold mb-2">Message</label>
                      <textarea
                        className="form-control bg-light border-0"
                        id="message"
                        name="message"
                        placeholder="How can we help you?"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        style={{ padding: '15px', borderRadius: '12px', transition: 'box-shadow 0.3s ease', resize: 'none' }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.3)'}
                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="col mt-2">
                        <button type="submit" disabled={loading} className="btn btn-primary-gradient px-5 py-3 hover-lift" style={{ borderRadius: '30px', fontWeight: '600', fontSize: '1.1rem' }}>
                          {loading ? 'Sending...' : <><i className="fas fa-paper-plane me-2"></i> Send Message</>}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Contact Section */}
    </main>
  );
};

export default ContactClient;
