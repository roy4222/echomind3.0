import { SVGProps } from 'react'

export function LoginIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="transform transition-transform hover:scale-110"
      {...props}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        filter="url(#glow)"
      >
        <path
          strokeDasharray="36"
          strokeDashoffset="36"
          d="M13 4l7 0c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-7"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            dur="0.6s"
            values="36;0"
          />
          <animate
            attributeName="opacity"
            dur="2s"
            values="0.4;1;0.4"
            repeatCount="indefinite"
          />
        </path>
        <path
          strokeDasharray="14"
          strokeDashoffset="14"
          d="M3 12h11.5"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="0.7s"
            dur="0.3s"
            values="14;0"
          />
          <animate
            attributeName="stroke-width"
            dur="1.5s"
            values="2;3;2"
            repeatCount="indefinite"
          />
        </path>
        <path
          strokeDasharray="6"
          strokeDashoffset="6"
          d="M14.5 12l-3.5 -3.5M14.5 12l-3.5 3.5"
        >
          <animate
            fill="freeze"
            attributeName="stroke-dashoffset"
            begin="1s"
            dur="0.3s"
            values="6;0"
          />
          <animate
            attributeName="opacity"
            dur="1.5s"
            values="1;0.6;1"
            repeatCount="indefinite"
            begin="1.3s"
          />
        </path>
      </g>
    </svg>
  )
} 