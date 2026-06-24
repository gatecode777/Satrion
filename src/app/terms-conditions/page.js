import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions - Satrion Shop',
  description: 'Terms & Conditions for Satrion. Review website usage guidelines, payment policies, warranties, and legal jurisdictions.',
  openGraph: {
    title: 'Terms & Conditions - Satrion Shop',
    description: 'Terms & Conditions for Satrion. Review website usage guidelines, payment policies, warranties, and legal jurisdictions.',
    type: 'website',
    url: 'https://satrion.in/terms-conditions',
  }
};

export default function TermsConditions() {
  return (
    <main className="position-relative min-vh-100 py-5" style={{ backgroundColor: '#0f172a', overflow: 'hidden' }}>
      {/* Decorative neon background glow circles */}
      <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0) 70%)', top: '-10%', right: '-10%', zIndex: 1 }}></div>
      <div className="position-absolute rounded-circle" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, rgba(192,132,252,0) 70%)', bottom: '-10%', left: '-10%', zIndex: 1 }}></div>

      <div className="container position-relative py-5" style={{ zIndex: 2 }}>
        {/* Page Header */}
        <div className="text-center mb-5 animate-fade-in-up">
          <h1 className="fw-extrabold text-white mb-2" style={{ fontSize: '3rem', letterSpacing: '-0.5px' }}>
            Terms &amp; <span className="text-info">Conditions</span>
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
              Welcome to <strong>Satrion Technologies Pvt. Ltd.</strong> ("Satrion", "Company", "we", "our", or "us").
            </p>
            <p className="mb-0 text-muted small">
              These Terms &amp; Conditions govern your access to and use of our e-commerce website, products, and services related to computer parts, hardware products, custom PCs, accessories, and technology solutions. By accessing or using our website, you agree to comply with these terms.
            </p>
          </div>

          <div className="d-flex flex-column gap-5 text-start">
            {/* Sections 1 & 2 */}
            <div className="row g-4">
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <i className="far fa-user text-info fs-4"></i>
                  <h4 className="fw-bold mb-0 text-white">1. Website Usage</h4>
                </div>
                <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
                  <li>• You must be at least 18 years old or using under adult supervision.</li>
                  <li>• You will provide fully accurate, truthful, and complete details on signup.</li>
                  <li>• You will not misuse the e-commerce website for any illegal operations.</li>
                  <li>• You will not attempt to hack, damage, or compromise website security.</li>
                </ul>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <i className="fas fa-boxes text-info fs-4"></i>
                  <h4 className="fw-bold mb-0 text-white">2. Products &amp; Services</h4>
                </div>
                <p className="text-muted small lh-lg mb-2">
                  We supply premium Computer Parts, Hardwares, PC Components, and Accessories. All catalog products are subject to stock availability.
                </p>
                <ul className="list-unstyled small text-muted d-flex flex-column gap-1 mb-0">
                  <li>• We reserve the right to alter pricing or discontinue units at any time.</li>
                  <li>• We reserve the right to limit quantities or reject orders at our discretion.</li>
                </ul>
              </div>
            </div>

            {/* Sections 3 & 4 */}
            <div className="row g-4">
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <i className="far fa-credit-card text-info fs-4"></i>
                  <h4 className="fw-bold mb-0 text-white">3. Pricing &amp; Payments</h4>
                </div>
                <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
                  <li>• All listed prices are subject to applicable commercial taxes (GST).</li>
                  <li>• Payments must be completed through our approved checkout methods.</li>
                  <li>• We are not liable for transaction failures caused by external bank systems.</li>
                  <li>• Orders are only pushed to processing once payment is successfully verified.</li>
                </ul>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <i className="fas fa-truck text-info fs-4"></i>
                  <h4 className="fw-bold mb-0 text-white">4. Shipping &amp; Delivery</h4>
                </div>
                <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
                  <li>• Dispatch and delivery timelines are estimates handled by log partners.</li>
                  <li>• We are not liable for courier network delays or force majeure conditions.</li>
                  <li>• Customers must supply complete shipping coordinates upon checkout.</li>
                  <li>• Extra remote-area delivery charges may apply to specific ZIP codes.</li>
                </ul>
              </div>
            </div>

            {/* Sections 5 & 6 */}
            <div className="row g-4">
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <i className="fas fa-undo text-info fs-4"></i>
                  <h4 className="fw-bold mb-0 text-white">5. Returns &amp; Refunds</h4>
                </div>
                <p className="text-muted small lh-lg mb-0">
                  All requests for returns or refunds must align with our Return Policy. Returns are strictly eligible only for wrong, damaged, or manufacturing-defective products within the valid 7-day post-delivery window.
                </p>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <i className="fas fa-screwdriver-wrench text-info fs-4"></i>
                  <h4 className="fw-bold mb-0 text-white">6. Warranty Disclaimer</h4>
                </div>
                <p className="text-muted small lh-lg mb-0">
                  All hardware warranties are provided and governed by their respective manufacturers. Satrion does not independently guarantee hardware compatibility, overclocking thresholds, or software performance.
                </p>
              </div>
            </div>

            {/* Sections 7 & 9 Banner */}
            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-4 rounded-4 h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h5 className="fw-bold text-white mb-2 d-flex align-items-center gap-2">
                    <i className="far fa-user-circle text-info"></i> 7. User Accounts
                  </h5>
                  <p className="text-muted small lh-lg mb-0">
                    Users maintain absolute liability for keeping credentials and account passwords secure. Satrion is not responsible for any password leaks or unauthorized profile edits. Fraudulent profiles are suspended immediately.
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-4 rounded-4 h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h5 className="fw-bold text-white mb-2 d-flex align-items-center gap-2">
                    <i className="fas fa-ban text-info"></i> 8. Limitation of Liability
                  </h5>
                  <p className="text-muted small lh-lg mb-0">
                    Satrion is not liable for any indirect commercial loss, technical downtime, server lags, or data corruptions. Purchasing and assembling hardware parts is executed at the customer's own discretion and risk.
                  </p>
                </div>
              </div>
            </div>

            {/* Grid of Sections 8, 10-14 */}
            <div className="row g-4">
              <div className="col-md-6">
                <h5 className="fw-bold text-white mb-2">9. Intellectual Property</h5>
                <p className="text-muted small lh-lg mb-0">
                  All website contents, product images, graphics, vector icons, custom code, and satrion branding remain the property of Satrion and may not be copied without written consent.
                </p>
              </div>

              <div className="col-md-6">
                <h5 className="fw-bold text-white mb-2">10. Third-Party Services</h5>
                <p className="text-muted small lh-lg mb-0">
                  We integrate third-party payment grids and courier tracking interfaces. We hold no liability for their direct system failures or policy implementations.
                </p>
              </div>

              <div className="col-md-6">
                <h5 className="fw-bold text-white mb-2">11. Prohibited Activities</h5>
                <p className="text-muted small lh-lg mb-0">
                  You are prohibited from uploading malware, spam scripts, exploiting website bugs, or launching DDoS attacks. Violations lead to immediate legal action.
                </p>
              </div>

              <div className="col-md-6">
                <h5 className="fw-bold text-white mb-2">12. Privacy</h5>
                <p className="text-muted small lh-lg mb-0">
                  Your navigation session is also governed by our Privacy Policy. By accessing the site, you consent to the terms outlined in our privacy frameworks.
                </p>
              </div>

              <div className="col-md-12">
                <h5 className="fw-bold text-white mb-2">13 &amp; 14. Changes &amp; Law</h5>
                <p className="text-muted small lh-lg mb-0">
                  We may edit or adjust these Terms and Conditions dynamically. All active disputes are governed exclusively by the laws of India and subject strictly to the courts of Jaipur, Rajasthan.
                </p>
              </div>
            </div>

            {/* Contact Info Widget */}
            <div className="p-4 rounded-4 mt-3" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h5 className="fw-bold text-info mb-3 d-flex align-items-center gap-2">
                <i className="far fa-envelope"></i> 15. Contact Information
              </h5>
              <p className="text-muted small mb-4">
                For questions, clarifications, or support regarding these Terms &amp; Conditions, please connect with us:
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
