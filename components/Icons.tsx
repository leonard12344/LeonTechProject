
import React from 'react';

const iconProps: React.SVGProps<SVGSVGElement> = {
  strokeWidth: 2,
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
};

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M18 6 6 18M6 6l12 12" /></svg>
);

export const PromptIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="m12 3-5 4 4 4-5 4 4 4 5-4-4-4 5-4-4-4z" /><path d="m20 12-5 4 4 4" /><path d="m4 12 5 4-4 4" /></svg>
);

export const PublishIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);

export const ProjectIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M20 13.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7.5" /><path d="M16 4.5V2" /><path d="M8 4.5V2" /><path d="M4 10h16" /><path d="M19 16l-2 3-2-3" /><path d="M19 22v-6" /></svg>
);

export const TranslateIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></svg>
);
export const WorldIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
);

export const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
export const AssetIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
);
export const SongIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
);
export const AdvancedChatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9.06 9.06 1.42 1.42L9.06 11.9l1.42 1.42 1.41-1.42L13.3 11.9l1.42-1.42-1.42-1.41L11.9 9.06l-1.42 1.42z"/><path d="m14.94 14.94-1.42-1.42 1.42-1.41-1.42-1.42-1.41 1.42-1.42-1.42-1.42 1.42 1.42 1.41-1.42 1.42 1.42 1.42 1.41-1.42 1.42 1.42z"/></svg>
);
export const MapsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
export const TTSIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
);
