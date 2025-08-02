import React from 'react';
import { sanitizeHTML } from '@/utils/security';

interface SafeHTMLProps {
  html: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

/**
 * Safe component for displaying HTML content
 * Automatically sanitizes HTML to prevent XSS attacks
 */
export const SafeHTML: React.FC<SafeHTMLProps> = ({ 
  html, 
  className, 
  tag: Tag = 'div' 
}) => {
  const sanitizedHTML = sanitizeHTML(html);

  return (
    <Tag 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}; 