import React from 'react';

export const CrosshairsIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill={color}
    className={className}
  >
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="1" x2="12" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="1" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="19" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const AnchorIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill={color}
    className={className}
  >
    <circle cx="12" cy="5" r="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="7" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 21 Q5 16 12 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M19 21 Q19 16 12 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const RadarIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill={color}
    className={className}
  >
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
    <line x1="12" y1="12" x2="12" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="15" cy="8" r="1.5" fill="currentColor"/>
    <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
  </svg>
);

export const FleetIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill={color}
    className={className}
  >
    <path d="M2 16 L4 20 L20 20 L22 16 Z" fill="currentColor"/>
    <rect x="5" y="12" width="14" height="4" fill="currentColor"/>
    <rect x="8" y="6" width="8" height="6" fill="currentColor"/>
    <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 2 L18 4 L12 6" fill="currentColor"/>
  </svg>
);

export const ExitIcon = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill={color}
    className={className}
  >
    <rect x="4" y="2" width="12" height="20" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="13" cy="12" r="1.5" fill="currentColor"/>
    <path d="M17 12 L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M19 9 L22 12 L19 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
