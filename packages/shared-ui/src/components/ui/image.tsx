import { useState, ImgHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackClassName?: string;
}

export function Image({ 
  src, 
  alt, 
  className, 
  fallbackSrc = '/Logo-new-01.png', 
  fallbackClassName, 
  loading = 'lazy',
  decoding = 'async',
  ...props 
}: ImageProps) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error || !src ? fallbackSrc : src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={cn(
        className,
        (error || !src) && cn('object-contain bg-navy-50 p-8', fallbackClassName)
      )}
      onError={() => setError(true)}
      {...props}
    />
  );
}
