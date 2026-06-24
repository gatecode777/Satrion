import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Satrion Shop',
  description: 'Privacy Policy for Satrion. This document explains how we collect, protect, and use your personal data.',
  openGraph: {
    title: 'Privacy Policy - Satrion Shop',
    description: 'Privacy Policy for Satrion. This document explains how we collect, protect, and use your personal data.',
    type: 'website',
    url: 'https://satrion.in/privacy-policy',
  }
};

export default function PrivacyPolicy() {
  return (
    <main className="position-relative min-vh-100 py-5" style={{ backgroundColor: '#0f172a', overflow: 'hidden' }}>
      {/* Decorative neon background glow circles */}
      <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0) 70%)', top: '-10%', right: '-10%', zIndex: 1 }}></div>
      <div className="position-absolute rounded-circle" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, rgba(192,132,252,0) 70%)', bottom: '-10%', left: '-10%', zIndex: 1 }}></div>

      <div className="container position-relative py-5" style={{ zIndex: 2 }}>
        {/* Page Header */}
        <div className="text-center mb-5 animate-fade-in-up">
          <h1 className="fw-extrabold text-white mb-2" style={{ fontSize: '3rem', letterSpacing: '-0.5px' }}>
            Privacy <span className="text-info">Policy</span>
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
              Welcome to <strong>Satrion Technologies Pvt. Ltd.</strong> ("Satrion", "we", "our", or "us"). We value your privacy and are committed to protecting your personal information.
            </p>
            <p className="mb-0 text-muted small">
              This Privacy Policy explains how we collect, use, store, and safeguard the information you provide while using our e-commerce platform. By accessing or using our website, you agree to the terms of this Privacy Policy.
            </p>
          </div>

          <div className="d-flex flex-column gap-5 text-start">
            {/* Section 1 */}
            <div>
              <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <i className="far fa-folder-open text-info fs-4"></i>
                <h4 className="fw-bold mb-0 text-white">1. Information We Collect</h4>
              </div>
              <p className="text-muted small mb-3">We may collect the following types of information:</p>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 rounded-3 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <h6 className="fw-bold text-info mb-3 d-flex align-items-center gap-2">
                      <i className="far fa-user"></i> Personal Information
                    </h6>
                    <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
                      <li>• Full Name &amp; Email Address</li>
                      <li>• Mobile/Phone Number</li>
                      <li>• Billing &amp; Shipping Address</li>
                      <li>• Company Name &amp; GST Details (if applicable)</li>
                      <li>• Payment parameters (mock transactions log)</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded-3 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <h6 className="fw-bold text-info mb-3 d-flex align-items-center gap-2">
                      <i className="fas fa-laptop-code"></i> Technical Information
                    </h6>
                    <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
                      <li>• IP Address &amp; Browser parameters</li>
                      <li>• Device specifications &amp; Operating System</li>
                      <li>• Website session patterns &amp; usage statistics</li>
                      <li>• Cookies &amp; tracking identifiers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <i className="far fa-check-circle text-info fs-4"></i>
                <h4 className="fw-bold mb-0 text-white">2. How We Use Your Information</h4>
              </div>
              <p className="text-muted small mb-3">We use the collected information for the following operational workflows:</p>

              <div className="row g-2">
                {[
                  "Processing and delivering e-commerce orders",
                  "Managing and configuring customer setup profiles",
                  "Providing technical and configuration client support",
                  "Sending real-time order updates and status notifications",
                  "Improving security protections and website speed optimizations",
                  "Detecting, preventing, and mitigating fraudulent transactions",
                  "Distributing marketing newsletter communications (if opt-in)",
                  "Ensuring compliance with local commercial legal frameworks"
                ].map((item, idx) => (
                  <div key={idx} className="col-md-6">
                    <div className="p-2.5 rounded-3 d-flex align-items-center gap-2 small text-muted" style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <i className="far fa-check-circle text-success small"></i>
                      <span>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3 & 4 */}
            <div className="row g-4">
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <i className="fas fa-shield-alt text-info fs-4"></i>
                  <h4 className="fw-bold mb-0 text-white">3. Payment Information</h4>
                </div>
                <p className="text-muted small lh-lg">
                  Satrion does not directly save or store your complete credit/debit card numbers or passwords. All digital payments are securely routed and handled by verified third-party payment gateway providers adhering to the highest industry-standard encryption practices.
                </p>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <i className="fas fa-cookie text-info fs-4"></i>
                  <h4 className="fw-bold mb-0 text-white">4. Cookies Policy</h4>
                </div>
                <p className="text-muted small lh-lg">
                  We use cookies to maintain your shopping cart session, memorize interface preferences, and analyze anonymized site traffic metrics. You retain the privilege to block or delete cookies through browser settings, though doing so might affect checkout functionalities.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <i className="fas fa-share-nodes text-info fs-4"></i>
                <h4 className="fw-bold mb-0 text-white">5. Data Sharing &amp; Security</h4>
              </div>
              <p className="text-muted small lh-lg mb-3">
                We strictly prohibit the sale or renting of customer details to advertising groups. Anonymized data is shared with essential operational partners (such as courier delivery networks, SMS servers, and payment interfaces) only to complete delivery transactions.
              </p>

              <div className="p-3 rounded-4 small text-warning d-flex align-items-start gap-2 border-0" style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                <i className="fas fa-triangle-exclamation mt-1"></i>
                <span>We deploy standard SSL encryption blocks to keep information secure. However, please remember that no channel of communication over the internet can claim 100% security against aggressive threats.</span>
              </div>
            </div>

            {/* Grid of Sections 6-9 */}
            <div className="row g-4">
              <div className="col-md-6">
                <h5 className="fw-bold text-white mb-2">6. User Rights</h5>
                <p className="text-muted small lh-lg mb-0">
                  You possess the privilege to fetch, correct, or request the deletion of your account parameters under local privacy regulations. Submit configuration requests directly to our email.
                </p>
              </div>

              <div className="col-md-6">
                <h5 className="fw-bold text-white mb-2">7. Third-Party Links</h5>
                <p className="text-muted small lh-lg mb-0">
                  Our site may render external links to delivery dashboards or tech sites. Satrion is not responsible for the privacy setups of these external networks; review their terms upon redirect.
                </p>
              </div>

              <div className="col-md-6">
                <h5 className="fw-bold text-white mb-2">8. Children's Privacy</h5>
                <p className="text-muted small lh-lg mb-0">
                  Our e-commerce pipeline is restricted to individuals at or above 18 years of age. We do not deliberately index details belonging to minors.
                </p>
              </div>

              <div className="col-md-6">
                <h5 className="fw-bold text-white mb-2">9. Policy Changes</h5>
                <p className="text-muted small lh-lg mb-0">
                  Satrion reserves the right to modify or restructure elements of this policy document. Revised versions are declared active immediately upon their publication here.
                </p>
              </div>
            </div>

            {/* Contact Info Widget */}
            <div className="p-4 rounded-4 mt-3" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h5 className="fw-bold text-info mb-3 d-flex align-items-center gap-2">
                <i className="far fa-envelope"></i> 10. Contact Information
              </h5>
              <p className="text-muted small mb-4">
                If you have questions, queries, or requests regarding this Privacy Policy document, feel free to contact us:
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
