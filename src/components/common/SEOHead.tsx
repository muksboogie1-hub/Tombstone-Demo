import { useEffect } from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';

interface SEOHeadProps {
  title: string;
  description: string;
}

export function SEOHead({ title, description }: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_CONFIG.brandName}`;
    document.title = fullTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update OG title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    // Update OG description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, [title, description]);

  return null;
}
