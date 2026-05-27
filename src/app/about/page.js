import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us - Satrion Shop',
  description: 'Learn more about Satrion. We are dedicated to providing premium gaming hardware, custom PCs, and precision accessories.',
  openGraph: {
    title: 'About Us - Satrion Shop',
    description: 'Learn more about Satrion. We are dedicated to providing premium gaming hardware, custom PCs, and precision accessories.',
    type: 'website',
    url: 'https://satrion.in/about',
  }
};

const About = () => {
  return (
    <main>
      {/* About Banner Section */}
      <section className="position-relative py-5" style={{ backgroundColor: '#0f172a', overflow: 'hidden' }}>
        {/* Decorative background elements */}
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(15,23,42,0) 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(192,132,252,0.2) 0%, rgba(15,23,42,0) 70%)', borderRadius: '50%' }}></div>
        
        <div className="container position-relative z-1">
          <div className="row align-items-center py-5">
            <div className="col-lg-6 text-white mb-5 mb-lg-0 animate-fade-in-up" style={{ zIndex: 2 }}>
              <h1 className="display-3 fw-bold mb-4" style={{ letterSpacing: '-1px' }}>
                About <span style={{ background: 'linear-gradient(to right, #38bdf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Satrion</span>
              </h1>
              <p className="lead mb-4" style={{ opacity: 0.85, lineHeight: '1.8' }}>
                Your trusted partner in premium IT solutions. We are dedicated to providing innovative, high-performance technology services that empower individuals and businesses to thrive in the digital age.
              </p>
              <div className="d-flex gap-3">
                <a href="#services" className="btn btn-primary-gradient px-4 py-3 rounded-pill fw-bold hover-lift text-decoration-none text-white">Explore Services</a>
                <Link href="/contact" className="btn btn-outline-light px-4 py-3 rounded-pill fw-bold hover-lift text-decoration-none" style={{ border: '2px solid rgba(255,255,255,0.2)' }}>Contact Us</Link>
              </div>
            </div>
            <div className="col-lg-6 position-relative">
              <div className="glass-premium p-2 about-hero-card">
                <img src="/about-hero-premium.png" alt="Premium Tech Office" className="img-fluid" style={{ borderRadius: '24px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Close Banner */}

      {/* Services Section */}
      <section className="container py-5" id="services">
        <div className="row text-center pt-5 pb-3">
          <div className="col-lg-6 m-auto">
            <h1 className="h1 text-dark">Our Services</h1>
            <p className="text-muted">
              We offer a range of IT services to help businesses thrive in the digital age. From web development to IT support, our expert team is dedicated to providing tailored solutions that meet your unique needs and drive success.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-3 pb-5">
            <div className="h-100 py-5 services-icon-wap shadow-sm hover-lift" style={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '24px', transition: 'all 0.3s ease' }}>
              <div className="h1 text-center" style={{ color: '#38bdf8' }}>
                <i className="fa fa-truck fa-lg"></i>
              </div>
              <h2 className="h5 mt-4 text-center text-dark fw-bold">Delivery Services</h2>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 pb-5">
            <div className="h-100 py-5 services-icon-wap shadow-sm hover-lift" style={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '24px', transition: 'all 0.3s ease' }}>
              <div className="h1 text-center" style={{ color: '#818cf8' }}>
                <i className="fas fa-exchange-alt"></i>
              </div>
              <h2 className="h5 mt-4 text-center text-dark fw-bold">Shipping & Return</h2>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 pb-5">
            <div className="h-100 py-5 services-icon-wap shadow-sm hover-lift" style={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '24px', transition: 'all 0.3s ease' }}>
              <div className="h1 text-center" style={{ color: '#c084fc' }}>
                <i className="fa fa-percent"></i>
              </div>
              <h2 className="h5 mt-4 text-center text-dark fw-bold">Promotion</h2>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 pb-5">
            <div className="h-100 py-5 services-icon-wap shadow-sm hover-lift" style={{ backgroundColor: '#ffffff', border: 'none', borderRadius: '24px', transition: 'all 0.3s ease' }}>
              <div className="h1 text-center" style={{ color: '#f472b6' }}>
                <i className="fa fa-user"></i>
              </div>
              <h2 className="h5 mt-4 text-center text-dark fw-bold">24 Hours Service</h2>
            </div>
          </div>
        </div>
      </section>
      {/* End Services Section */}

      {/* Brands Section */}
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container my-4">
          <div className="row text-center py-3">
            <div className="col-lg-6 m-auto">
              <h1 className="h1 text-dark">Our Brands</h1>
              <p className="text-muted">
                We are proud to partner with leading brands in the industry to provide our customers with the best products and services.
              </p>
            </div>
            <div className="col-lg-9 m-auto tempaltemo-carousel">
              <div className="row d-flex flex-row">
                {/* Controls - Previous */}
                <div className="col-1 align-self-center">
                  <a
                    className="h1"
                    href="#templatemo-slide-brand"
                    role="button"
                    data-bs-slide="prev"
                  >
                    <i className="text-dark fas fa-chevron-left"></i>
                  </a>
                </div>

                {/* Carousel Wrapper */}
                <div className="col">
                  <div
                    className="carousel slide carousel-multi-item pt-2 pt-md-0"
                    id="templatemo-slide-brand"
                    data-bs-ride="carousel"
                  >
                    {/* Slides */}
                    <div className="carousel-inner product-links-wap" role="listbox">
                      {/* First slide */}
                      <div className="carousel-item active">
                        <div className="row">
                          <div className="col-3 p-md-5">
                            <Link href="#">
                              <img
                                className="img-fluid brand-img"
                                src="/brand_01.png"
                                alt="Brand Logo"
                              />
                            </Link>
                          </div>
                          <div className="col-3 p-md-5">
                            <Link href="#">
                              <img
                                className="img-fluid brand-img"
                                src="/brand_02.png"
                                alt="Brand Logo"
                              />
                            </Link>
                          </div>
                          <div className="col-3 p-md-5">
                            <Link href="#">
                              <img
                                className="img-fluid brand-img"
                                src="/brand_03.png"
                                alt="Brand Logo"
                              />
                            </Link>
                          </div>
                          <div className="col-3 p-md-5">
                            <Link href="#">
                              <img
                                className="img-fluid brand-img"
                                src="/brand_04.png"
                                alt="Brand Logo"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Second slide */}
                      <div className="carousel-item">
                        <div className="row">
                          <div className="col-3 p-md-5">
                            <Link href="#">
                              <img
                                className="img-fluid brand-img"
                                src="/brand_01.png"
                                alt="Brand Logo"
                              />
                            </Link>
                          </div>
                          <div className="col-3 p-md-5">
                            <Link href="#">
                              <img
                                className="img-fluid brand-img"
                                src="/brand_02.png"
                                alt="Brand Logo"
                              />
                            </Link>
                          </div>
                          <div className="col-3 p-md-5">
                            <Link href="#">
                              <img
                                className="img-fluid brand-img"
                                src="/brand_03.png"
                                alt="Brand Logo"
                              />
                            </Link>
                          </div>
                          <div className="col-3 p-md-5">
                            <Link href="#">
                              <img
                                className="img-fluid brand-img"
                                src="/brand_04.png"
                                alt="Brand Logo"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Third slide */}
                      <div className="carousel-item">
                        <div className="row">
                          <div className="col-3 p-md-5">
                            <Link href="#">
                              <img
                                className="img-fluid brand-img"
                                src="/brand_01.png"
                                alt="Brand Logo"
                              />
                            </Link>
                          </div>
                          <div className="col-3 p-md-5">
                            <Link href="#">
                              <img
                                className="img-fluid brand-img"
                                src="/brand_02.png"
                                alt="Brand Logo"
                              />
                            </Link>
                          </div>
                          <div className="col-3 p-md-5">
                            <Link href="#">
                              <img
                                className="img-fluid brand-img"
                                src="/brand_03.png"
                                alt="Brand Logo"
                              />
                            </Link>
                          </div>
                          <div className="col-3 p-md-5">
                            <Link href="#">
                              <img
                                className="img-fluid brand-img"
                                src="/brand_04.png"
                                alt="Brand Logo"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls - Next */}
                <div className="col-1 align-self-center">
                  <a
                    className="h1"
                    href="#templatemo-slide-brand"
                    role="button"
                    data-bs-slide="next"
                  >
                    <i className="text-dark fas fa-chevron-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Brands Section */}
    </main>
  );
};

export default About;
