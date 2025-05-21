import React from "react";

interface SpinnerProps {
  size?: number;
  className?: string;
}

// Add keyframes to a style element that will be injected once
const spinnerStyles = `
  @keyframes spinner-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes spinner-dash {
    0% {
      stroke-dashoffset: 11;
    }
    100% {
      stroke-dashoffset: 44;
    }
  }
`;

// Add the styles to the document head
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = spinnerStyles;
  document.head.appendChild(styleEl);
}

export function Spinner({ size = 16, className = "" }: SpinnerProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        animation: "spinner-spin 0.5s linear infinite"
      }}
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="44"
        strokeLinecap="round"
        style={{
          animation: "spinner-dash 0.8s linear alternate infinite"
        }}
      />
    </svg>
  );
} 