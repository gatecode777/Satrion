"use client";

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.1)' }} id="tempaltemo_footer" className="text-light pt-4 mt-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-3 pt-5">
                        <div className="border-bottom pb-3 mb-4 d-flex align-items-center" style={{ borderColor: 'rgba(255,255,255,0.1) !important', minHeight: '60px' }}>
                            <Link className="navbar-brand logo h1 align-self-center d-inline-block m-0" href="/">
                                <img src="/satrion.png?v=2" alt="Satrion Logo" style={{ height: '34px', width: '171px' }} />
                            </Link>
                        </div>
                        <ul className="list-unstyled footer-link-list" style={{ opacity: 0.8, lineHeight: '2' }}>
                            <li className="d-flex mb-3">
                                <i className="fas fa-map-marker-alt fa-fw mt-1 me-2 text-info"></i>
                                <span style={{ fontSize: '0.85rem' }}>CAPITAL GALLERIA, KANAKPURA INDUSTRIAL AREA, SIRSI ROAD, JAIPUR, RAJASTHAN, 302034</span>
                            </li>
                            <li className="mb-2">
                                <i className="fa fa-phone fa-fw me-2 text-info"></i>
                                <a className="text-decoration-none text-light footer-hover" href="tel:9116722622" style={{ fontSize: '0.85rem' }}>+91 9116722622</a>
                            </li>
                            <li className="mb-2">
                                <i className="fa fa-envelope fa-fw me-2 text-info"></i>
                                <a className="text-decoration-none text-light footer-hover" href="mailto:info@satrion.in" style={{ fontSize: '0.85rem' }}>info@satrion.in</a>
                            </li>
                        </ul>
                    </div>

                    <div className="col-md-3 pt-5">
                        <h3 className="h4 border-bottom pb-3 mb-4 fw-bold text-white d-flex align-items-center m-0" style={{ borderColor: 'rgba(255,255,255,0.1) !important', minHeight: '60px' }}>Categories</h3>
                        <ul className="list-unstyled footer-link-list" style={{ opacity: 0.8, lineHeight: '2.2', fontSize: '0.9rem' }}>
                            <li><Link className="text-decoration-none text-light footer-hover" href="/shop?category=Processors">Processors</Link></li>
                            <li><Link className="text-decoration-none text-light footer-hover" href="/shop?category=Graphics%20Cards">Graphics Cards</Link></li>
                            <li><Link className="text-decoration-none text-light footer-hover" href="/shop?category=Gaming%20Laptops">Gaming Laptops</Link></li>
                            <li><Link className="text-decoration-none text-light footer-hover" href="/shop?category=Custom%20Gaming%20PCs">Custom Gaming PCs</Link></li>
                            <li><Link className="text-decoration-none text-light footer-hover" href="/shop?category=Monitors">Monitors</Link></li>
                        </ul>
                    </div>

                    <div className="col-md-3 pt-5">
                        <h3 className="h4 border-bottom pb-3 mb-4 fw-bold text-white d-flex align-items-center m-0" style={{ borderColor: 'rgba(255,255,255,0.1) !important', minHeight: '60px' }}>Further Info</h3>
                        <ul className="list-unstyled footer-link-list" style={{ opacity: 0.8, lineHeight: '2.2', fontSize: '0.9rem' }}>
                            <li><Link className="text-decoration-none text-light footer-hover" href="/">Home</Link></li>
                            <li><Link className="text-decoration-none text-light footer-hover" href="/about">About Us</Link></li>
                            <li><Link className="text-decoration-none text-light footer-hover" href="/shop">Shop Locations</Link></li>
                            {/* <li><Link className="text-decoration-none text-light footer-hover" href="/shop">FAQs</Link></li> */}
                            <li><Link className="text-decoration-none text-light footer-hover" href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="col-md-3 pt-5">
                        <h3 className="h4 border-bottom pb-3 mb-4 fw-bold text-white d-flex align-items-center m-0" style={{ borderColor: 'rgba(255,255,255,0.1) !important', minHeight: '60px' }}>Policies</h3>
                        <ul className="list-unstyled footer-link-list" style={{ opacity: 0.8, lineHeight: '2.2', fontSize: '0.9rem' }}>
                            <li><Link className="text-decoration-none text-light footer-hover" href="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link className="text-decoration-none text-light footer-hover" href="/return-policy">Return Policy</Link></li>
                            <li><Link className="text-decoration-none text-light footer-hover" href="/terms-conditions">Terms and Conditions</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="row text-light mb-4 mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="col-auto me-auto mb-3 mb-md-0 d-flex align-items-center">
                        <ul className="list-inline text-left footer-icons mb-0 d-flex gap-3">
                            <li className="list-inline-item m-0">
                                <a className="text-light text-decoration-none social-icon-btn d-flex align-items-center justify-content-center rounded-circle" target="_blank" href="http://facebook.com/" rel="noopener noreferrer" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}>
                                    <i className="fab fa-facebook-f fa-fw"></i>
                                </a>
                            </li>
                            <li className="list-inline-item m-0">
                                <a className="text-light text-decoration-none social-icon-btn d-flex align-items-center justify-content-center rounded-circle" target="_blank" href="https://www.instagram.com/" rel="noopener noreferrer" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}>
                                    <i className="fab fa-instagram fa-fw"></i>
                                </a>
                            </li>
                            <li className="list-inline-item m-0">
                                <a className="text-light text-decoration-none social-icon-btn d-flex align-items-center justify-content-center rounded-circle" target="_blank" href="https://twitter.com/" rel="noopener noreferrer" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}>
                                    <i className="fab fa-twitter fa-fw"></i>
                                </a>
                            </li>
                            <li className="list-inline-item m-0">
                                <a className="text-light text-decoration-none social-icon-btn d-flex align-items-center justify-content-center rounded-circle" target="_blank" href="https://www.linkedin.com/" rel="noopener noreferrer" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}>
                                    <i className="fab fa-linkedin fa-fw"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-auto d-flex align-items-center">
                        <p className="mb-0 text-muted" style={{ opacity: 0.8, fontSize: '0.95rem' }}>
                            &copy; {new Date().getFullYear()} Satrion. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
