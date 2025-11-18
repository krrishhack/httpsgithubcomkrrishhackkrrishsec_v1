import axios from 'axios';

// A more robust list of proxies, ordered by preference for status checking.
const PROXIES_FOR_STATUS_CHECK = [
  { 
    url: 'https://proxy.cors.sh/', 
    keyHeader: 'x-cors-api-key', 
    apiKey: 'temp_031eda32534e23437508998d24905891', // A temporary public key
    statusHeader: 'x-cors-status' // cors.sh returns the target status in this header
  },
  { 
    url: 'https://corsproxy.io/?',
    keyHeader: null,
    apiKey: null,
    statusHeader: null // corsproxy.io should return the status directly
  }
];

/**
 * Checks the HTTP status of a given subdomain by trying multiple intelligent proxies.
 * It prioritizes proxies that return the original status code in a header.
 * @param subdomain The subdomain to check (e.g., 'www.example.com').
 * @returns A promise that resolves to the HTTP status code or 'error' if unreachable.
 */
export const checkUrlStatus = async (subdomain: string): Promise<number | 'error'> => {
  const targetUrl = `https://${subdomain}`;
  
  for (const proxy of PROXIES_FOR_STATUS_CHECK) {
    const requestUrl = `${proxy.url}${encodeURIComponent(targetUrl)}`;
    const headers: any = {};
    if (proxy.keyHeader && proxy.apiKey) {
      headers[proxy.keyHeader] = proxy.apiKey;
    }

    try {
      const response = await axios.get(requestUrl, {
        timeout: 10000,
        // We need to capture the real status, so we tell axios not to throw on non-2xx codes.
        validateStatus: () => true, 
        headers: headers
      });

      // Case 1: The proxy returns the original status in a custom header (most reliable).
      if (proxy.statusHeader && response.headers[proxy.statusHeader]) {
        const status = parseInt(response.headers[proxy.statusHeader], 10);
        if (!isNaN(status)) {
          return status;
        }
      }
      
      // Case 2: The proxy passes the original status directly (less reliable, but better than nothing).
      // We must be careful here. If the proxy itself returns 429 (Too Many Requests) or 500, it's a proxy error, not the target's.
      // We'll consider statuses other than common proxy errors as potentially valid.
      if (response.status !== 429 && response.status !== 502 && response.status !== 503 && response.status !== 504) {
         if (!proxy.statusHeader) { // Only trust the main status if there's no status header expected
            return response.status;
         }
      }

      // If we are here, it means the proxy call was successful (e.g., status 200) but didn't give us the target's status reliably.
      // We log it and try the next proxy.
      console.warn(`Proxy ${proxy.url} returned status ${response.status} for ${subdomain} but couldn't determine original status.`);

    } catch (error) {
      // This catches network errors, timeouts, etc.
      console.warn(`Status check via ${proxy.url} failed for ${subdomain}:`, error);
    }
  }
  
  // If all proxies fail to give a definitive answer.
  return 'error';
};
