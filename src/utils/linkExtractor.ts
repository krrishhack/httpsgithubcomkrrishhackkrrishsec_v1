import { socialMediaPatterns } from './socialPatterns';
import { SocialLink } from '../types';

/**
 * Extracts social media links from an HTML string, mimicking the logic of the provided Python script.
 * It parses <a> tags and matches their href attributes against a list of regex patterns.
 * 
 * @param html The HTML content of the page as a string.
 * @param pageUrl The original URL of the page, used to resolve relative links.
 * @returns An array of unique SocialLink objects found on the page.
 */
export const extractSocialLinks = (html: string, pageUrl: string): SocialLink[] => {
  const foundLinks = new Map<string, SocialLink>();
  let baseUrl: string;

  try {
    baseUrl = new URL(pageUrl).origin;
  } catch (e) {
    console.error("Invalid pageUrl provided to link extractor:", pageUrl);
    return []; // Cannot proceed without a valid base URL
  }

  try {
    // Step 1: Parse the HTML string into a DOM document.
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Step 2: Find all anchor tags with an 'href' attribute.
    const anchors = doc.querySelectorAll('a[href]');

    // Step 3: Iterate over each anchor tag.
    anchors.forEach((anchor) => {
      const href = anchor.getAttribute('href');

      // Skip empty or javascript links
      if (!href || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      let absoluteUrl: string;
      try {
        // Step 4: Resolve the href to an absolute URL.
        absoluteUrl = new URL(href, baseUrl).href;
      } catch (e) {
        // Ignore malformed URLs that can't be resolved.
        return;
      }
      
      // If this URL has already been found, skip further processing.
      if (foundLinks.has(absoluteUrl)) {
        return;
      }

      // Step 5: Check the absolute URL against the social media patterns.
      for (const platform of socialMediaPatterns) {
        const isMatch = platform.patterns.some(pattern => {
          pattern.lastIndex = 0; 
          return pattern.test(absoluteUrl);
        });

        if (isMatch) {
          // Step 6: If a match is found, add it to our results and break the loop.
          foundLinks.set(absoluteUrl, {
            platform: platform.name,
            url: absoluteUrl,
            icon: platform.icon,
          });
          // Break from the 'for (const platform...)' loop to avoid matching one URL to multiple platforms.
          break; 
        }
      }
    });
  } catch (e) {
    console.error('DOM parsing or link extraction failed. Results may be incomplete.', e);
  }

  // Step 7: Convert the Map values to an array and sort alphabetically by platform.
  return Array.from(foundLinks.values()).sort((a, b) => a.platform.localeCompare(b.platform));
};
