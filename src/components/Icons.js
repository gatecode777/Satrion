import React from 'react';

export const UserIcon = ({ className = '', style = {}, size = 20 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const ShoppingBagIcon = ({ className = '', style = {}, size = 20 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    {/* Curved Handle */}
    <path 
      d="M8 8V6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6V8" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    {/* Filled Bag Body */}
    <rect x="4" y="8" width="16" height="14" rx="3.5" fill="currentColor" />
    {/* Rivets / Studs */}
    <circle cx="8.5" cy="12.5" r="1" fill="#fff" />
    <circle cx="15.5" cy="12.5" r="1" fill="#fff" />
  </svg>
);
