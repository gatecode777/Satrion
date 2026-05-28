import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Refund & Return Policy - Satrion Shop',
  description: 'Refund & Return Policy for Satrion. Learn about our 7-day return window and the simple step-by-step refund process.',
  openGraph: {
    title: 'Refund & Return Policy - Satrion Shop',
    description: 'Refund & Return Policy for Satrion. Learn about our 7-day return window and the simple step-by-step refund process.',
    type: 'website',
    url: 'https://satrion.in/return-policy',
  }
};

export default function ReturnPolicy() {
  return (
    <main className="position-relative min-vh-100 py-5" style={{ backgroundColor: '#0f172a', overflow: 'hidden' }}>
      {/* Decorative neon background glow circles */}
      <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0) 70%)', top: '-10%', right: '-10%', zIndex: 1 }}></div>
      <div className="position-absolute rounded-circle" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, rgba(192,132,252,0) 70%)', bottom: '-10%', left: '-10%', zIndex: 1 }}></div>

      <div className="container position-relative py-5" style={{ zIndex: 2 }}>
        {/* Page Header */}
        <div className="text-center mb-5 animate-fade-in-up">
          <h1 className="fw-extrabold text-white mb-2" style={{ fontSize: '3rem', letterSpacing: '-0.5px' }}>
            Refund &amp; <span className="text-info">Return Policy</span>
          </h1>
          <span className="badge bg-dark border border-secondary px-3 py-2 text-muted" style={{ fontSize: '0.85rem' }}>
            Effective Date: January 01, 2026
          </span>
        </div>

        {/* Policy Content Card */}
        <div className="card glass-premium p-4 p-md-5 text-white animate-fade-in-up" style={{ borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {/* Welcome Intro Block */}
          <div className="p-4 rounded-4 mb-5 text-start" style={{ backgroundColor: 'rgba(56, 189, 248, 0.05)', border: '1px dashed rgba(56, 189, 248, 0.2)' }}>
            <p className="mb-3 leading-relaxed fs-5">
              At <strong>Satrion Technologies Pvt. Ltd.</strong>, customer satisfaction is important to us.
            </p>
            <p className="mb-0 text-muted small">
              This policy explains the conditions under which returns, replacements, and refunds are accepted and processed.
            </p>
          </div>

          <div className="d-flex flex-column gap-5 text-start">
            {/* Section 1 & 4 Grid */}
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card border-0 p-4 h-100" style={{ backgroundColor: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '16px' }}>
                  <h5 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                    <i className="fas fa-undo"></i> 1. 7-Day Return Policy
                  </h5>
                  <p className="small text-muted mb-3">You may request a return or replacement within 7 days from delivery. To be eligible:</p>
                  <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
                    <li><i className="far fa-check-circle text-success me-1"></i> Product must be unused &amp; in original condition</li>
                    <li><i className="far fa-check-circle text-success me-1"></i> Must include all original packaging &amp; invoice</li>
                    <li><i className="far fa-check-circle text-success me-1"></i> No physical damage or burns from client misuse</li>
                    <li><i className="far fa-check-circle text-success me-1"></i> Request submitted within 7 days window</li>
                  </ul>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 p-4 h-100" style={{ backgroundColor: 'rgba(59, 130, 246, 0.04)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '16px' }}>
                  <h5 className="fw-bold text-info mb-3 d-flex align-items-center gap-2">
                    <i className="fas fa-wallet"></i> 4. Refund Process
                  </h5>
                  <p className="small text-muted mb-3">Once returned product is received and inspected by our warehouse technicians:</p>
                  <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
                    <li><i className="far fa-circle text-info me-1"></i> Approved refunds processed in 5-10 business days</li>
                    <li><i className="far fa-circle text-info me-1"></i> Credited to original source payment gateway</li>
                    <li><i className="far fa-circle text-info me-1"></i> COD orders refunded via target UPI supplied in request</li>
                    <li><i className="far fa-circle text-info me-1"></i> Satrion reserves the right to reject invalid return claims</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Eligible vs Non-Returnable Grid */}
            <div className="row g-4">
              <div className="col-md-6">
                <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                  <i className="far fa-check-circle text-success"></i> Eligible for Return
                </h5>
                <ul className="list-unstyled small text-muted d-flex flex-column gap-2.5">
                  <li>• Wrong product model or size delivered</li>
                  <li>• Damaged or cracked product received upon delivery</li>
                  <li>• Manufacturing defects blocking system operations</li>
                  <li>• Missing system accessories or box parts</li>
                  <li>• Product specifications not matching listing details</li>
                </ul>
              </div>

              <div className="col-md-6">
                <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                  <i className="far fa-times-circle text-danger"></i> Non-Returnable Items
                </h5>
                <ul className="list-unstyled small text-muted d-flex flex-column gap-2.5">
                  <li>• Used, plugged-in, or physically damaged units</li>
                  <li>• Damage due to improper system installations</li>
                  <li>• Software keys, digital codes, or operating licenses</li>
                  <li>• Customized setups or custom PC builds</li>
                  <li>• Missing invoice bills or box labels</li>
                  <li>• Claims filed beyond the 7 days limit</li>
                </ul>
              </div>
            </div>

            {/* Sections 5-7 Cards */}
            <div className="row g-3">
              <div className="col-md-4">
                <div className="p-3.5 rounded-4 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <h6 className="fw-bold text-white mb-2 d-flex align-items-center gap-2">
                    <i className="fas fa-sync text-info"></i> 5. Replacements
                  </h6>
                  <p className="text-muted small mb-0 lh-lg">
                    Request an exchange instead of a refund if the system unit is wrong, damaged, or has defects. Replacements are subject to active catalog stock availability.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3.5 rounded-4 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <h6 className="fw-bold text-white mb-2 d-flex align-items-center gap-2">
                    <i className="fas fa-truck text-info"></i> 6. Return Shipping
                  </h6>
                  <p className="text-muted small mb-0 lh-lg">
                    Operational logistics require secure packaging. Satrion bears return shipment charges for verified defects or shipping mix-ups. Pack securely to avoid transit breakage.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3.5 rounded-4 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <h6 className="fw-bold text-white mb-2 d-flex align-items-center gap-2">
                    <i className="far fa-times-circle text-info"></i> 7. Cancellations
                  </h6>
                  <p className="text-muted small mb-0 lh-lg">
                    Order cancellations are accepted prior to shipment confirmation emails. Once handpicked and shipped, cancellations are blocked, and standard returns apply.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 8 Notes */}
            <div>
              <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <i className="fas fa-triangle-exclamation text-warning fs-5"></i>
                <h4 className="fw-bold mb-0 text-white">8. Important Notes</h4>
              </div>
              <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
                <li>• Satrion reserves the right to audit and verify all hardware return and refund claims.</li>
                <li>• Fraudulent claims or abusive refund requests will lead to system-wide account suspension.</li>
                <li>• Product colors or finishes may vary slightly from catalog photos due to display calibration limits.</li>
              </ul>
            </div>

            {/* Contact Us Widget */}
            <div className="p-4 rounded-4 mt-3" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h5 className="fw-bold text-info mb-3 d-flex align-items-center gap-2">
                <i className="far fa-envelope"></i> 9. Contact Us
              </h5>
              <p className="text-muted small mb-4">
                For return requests, exchanges, or refund tracking updates, connect with our support desk:
              </p>

              <div className="row g-3">
                <div className="col-md-4">
                  <div className="p-3 rounded text-center" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="text-muted d-block small mb-1">EMAIL</span>
                    <a href="mailto:info@satrion.in" className="fw-bold text-info text-decoration-none small">info@satrion.in</a>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 rounded text-center" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="text-muted d-block small mb-1">PHONE</span>
                    <span className="fw-bold text-info small">+91 9116722622</span>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 rounded text-center" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="text-muted d-block small mb-1">WEBSITE</span>
                    <Link href="/" className="fw-bold text-info text-decoration-none small">satrion.co.in</Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
