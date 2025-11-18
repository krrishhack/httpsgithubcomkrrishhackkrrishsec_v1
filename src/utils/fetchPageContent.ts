import axios from 'axios';

// A temporary public key for cors.sh
const CORS_SH_API_KEY = 'temp_031eda32534e23437508998d24905891';

const corsProxies = [
  `https://proxy.cors.sh/`,
  `https://corsproxy.io/?`,
  `https://api.allorigins.win/raw?url=`,
];

/**
 * Fetches the HTML content of a URL by trying multiple CORS proxies in parallel.
 * Resolves with the content from the first proxy that succeeds.
 * @param url The target URL to fetch.
 * @returns A promise that resolves to the HTML string or null if all proxies fail.
 */
export const fetchPageContent = async (url: string): Promise<string | null> => {
  const fetchWithProxy = (proxyUrl: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const isAllOrigins = proxyUrl.includes('allorigins');
        const isCorsSh = proxyUrl.includes('cors.sh');

        const requestUrl = isAllOrigins ? `${proxyUrl}${encodeURIComponent(url)}` : `${proxyUrl}${url}`;
        
        const headers: any = {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        };

        if (isCorsSh) {
          headers['x-cors-api-key'] = CORS_SH_API_KEY;
        }

        const response = await axios.get(requestUrl, {
          timeout: 15000, // 15-second timeout per request
          headers,
        });

        if (response.data && (typeof response.data === 'string' || typeof response.data === 'object')) {
          resolve(typeof response.data === 'object' ? JSON.stringify(response.data) : response.data);
        } else {
          reject(new Error(`Proxy ${proxyUrl} returned non-string/non-object data.`));
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  try {
    const promises = corsProxies.map(proxy => fetchWithProxy(proxy));
    const result = await Promise.any(promises);
    return result;
  } catch (error) {
    // This is now a warning, not a critical error, as other sources might succeed.
    console.warn(`All CORS proxies failed for url: ${url}`, error);
    return null; // Return null on complete failure for this specific fetch.
  }
};
