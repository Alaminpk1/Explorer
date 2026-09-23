
interface IconProps {
  className?: string;
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M6 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FolderIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M1.5 3.5h4l1.5 2h7.5v7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

export function FileIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M4 1.5h5L13 5.5v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M9 1.5V5.5h4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 10.5L14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// Shape, not colour, tells the categories apart, so it still works in greyscale.

export function TextFileIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M4 1.5h5L13 5.5v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M9 1.5V5.5h4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path
        d="M5.5 8.5h5M5.5 10.5h5M5.5 12.5h3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ImageFileIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <rect
        x="1.75"
        y="3"
        width="12.5"
        height="10"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="5.75" cy="6.5" r="1.15" fill="currentColor" />
      <path
        d="M2.5 11.5l3-3 2.25 2.25L10.5 8l3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VideoFileIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <rect
        x="1.75"
        y="3"
        width="12.5"
        height="10"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path d="M6.75 6.1l3.9 1.9-3.9 1.9z" fill="currentColor" />
    </svg>
  );
}

export function AudioFileIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      {/* 16px-এ বারগুলো মিউজিক নোটের চেয়ে ভালো বোঝা যায়। */}
      <path
        d="M3 7v2M5.75 5v6M8.5 2.75v10.5M11.25 5v6M14 7v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CodeFileIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M5.75 5.25L2.5 8l3.25 2.75M10.25 5.25L13.5 8l-3.25 2.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArchiveFileIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M2 4.75h12v8.25a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <rect x="1.5" y="2" width="13" height="2.75" rx="0.75" fill="currentColor" />
      <path d="M7 7.25h2v1.75H7z" fill="currentColor" />
    </svg>
  );
}
