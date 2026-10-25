import React from 'react';
import '../assets/animated-logo.css';

export function AnimatedLogo({ className = "", size = 36 }) {
  return (
    <div 
      className={`logo-container ${className}`}
      style={{ width: `${size}px`, height: `${size * 1.35}px` }}
    >
      <svg
        viewBox="0 0 200 270"
        className="animated-logo-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. CUERPO */}
        <path
          className="svg-draw body-path"
          d="M 25 260 C 25 180, 60 170, 100 170 C 140 170, 175 180, 175 260"
          stroke="#1D2318"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* 2. CABEZA */}
        <circle
          className="svg-draw head-circle"
          cx="100"
          cy="120"
          r="48"
          stroke="#1D2318"
          strokeWidth="10"
        />

        {/* 3. GORRO + RAYOS (Escalado uniforme para ajustar tamaño) */}
        <g transform="translate(100, 68) scale(0.72) translate(-100, -98)">
          {/* Silueta del Gorro */}
          <path
            className="svg-draw hat-path"
            d="M 78 70 C 74 60, 60 58, 62 45 C 64 30, 80 30, 90 22 C 105 10, 130 15, 138 32 C 148 35, 146 52, 138 58 C 130 64, 126 70, 122 70 Z"
            stroke="#FACC15"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Base del Gorro */}
          <path
            className="svg-draw hat-base"
            d="M 80 70 L 120 70 L 117 82 L 83 82 Z"
            stroke="#FACC15"
            strokeWidth="7"
            strokeLinejoin="round"
          />

          {/* RAYOS SIMÉTRICOS (Alineados al centro matemático del gorro) */}
          <g className="rays-group">
            {/* Superior (90°) */}
            <line x1="100" y1="-8" x2="100" y2="4" stroke="#FACC15" strokeWidth="8" strokeLinecap="round" />
            {/* Superior Derecho (45°) */}
            <line x1="151" y1="6" x2="142" y2="15" stroke="#FACC15" strokeWidth="8" strokeLinecap="round" />
            {/* Derecho (0°) */}
            <line x1="170" y1="48" x2="158" y2="48" stroke="#FACC15" strokeWidth="8" strokeLinecap="round" />
            {/* Superior Izquierdo (135°) */}
            <line x1="55" y1="9" x2="64" y2="18" stroke="#FACC15" strokeWidth="8" strokeLinecap="round" />
            {/* Izquierdo (180°) */}
            <line x1="35" y1="48" x2="47" y2="48" stroke="#FACC15" strokeWidth="8" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}