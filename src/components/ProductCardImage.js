"use client";

import React, { useState, useEffect } from 'react';

export default function ProductCardImage({ src, alt, fallback }) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setImgSize] = useState([0, 0]);
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia("(hover: hover)");
      setIsHoverable(mediaQuery.matches);
    }
  }, []);

  const handleMouseEnter = (e) => {
    if (!isHoverable) return;
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setImgSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e) => {
    if (!isHoverable) return;
    const elem = e.currentTarget;
    const { top, left, width, height } = elem.getBoundingClientRect();
    
    // Calculate cursor position relative to the container
    let posX = e.clientX - left;
    let posY = e.clientY - top;

    // Constrain position within boundaries
    posX = Math.max(0, Math.min(posX, width));
    posY = Math.max(0, Math.min(posY, height));

    setXY([posX, posY]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const lensSize = 120; // Perfect size for cards and modals
  const zoomScale = 2.2; // 2.2x zoom is highly readable

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="position-relative w-100 h-100 d-flex align-items-center justify-content-center overflow-hidden"
      style={{ cursor: isHoverable ? 'crosshair' : 'pointer' }}
    >
      <img
        src={src || fallback}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="card-img img-fluid"
        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', width: 'auto', height: 'auto', pointerEvents: 'none' }}
      />
      
      {isHoverable && showMagnifier && (
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            borderRadius: '0px', // Strictly square shape of the magnifier lens
            border: '2px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25), inset 0 0 10px rgba(0, 0, 0, 0.1)',
            backgroundImage: `url('${src || fallback}')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${imgWidth * zoomScale}px ${imgHeight * zoomScale}px`,
            left: `${x - lensSize / 2}px`,
            top: `${y - lensSize / 2}px`,
            backgroundPosition: `${-x * zoomScale + lensSize / 2}px ${-y * zoomScale + lensSize / 2}px`,
            zIndex: 20,
            backgroundColor: '#ffffff'
          }}
        />
      )}

      {isHoverable && (
        <span 
          className="position-absolute d-flex align-items-center gap-1 bg-white shadow-sm px-2 py-1"
          style={{
            bottom: '8px',
            right: '8px',
            borderRadius: '20px',
            fontSize: '0.65rem',
            fontWeight: '600',
            color: '#1e293b',
            opacity: showMagnifier ? 0 : 0.85,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none',
            zIndex: 10,
            border: '1px solid rgba(255, 255, 255, 0.5)'
          }}
        >
          <i className="fas fa-search" style={{ fontSize: '0.6rem' }}></i> Hover to zoom
        </span>
      )}
    </div>
  );
}
