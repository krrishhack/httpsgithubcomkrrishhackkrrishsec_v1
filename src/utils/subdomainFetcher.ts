import axios from 'axios';
import { fetchPageContent } from './fetchPageContent';

const fetchFromCrtSh = async (domain: string): Promise<string[]> => {
  const url = `https://crt.sh/?q=%.${domain}&output=json`;
  const data = await fetchPageContent(url);
  if (!data) return [];
  
  try {
    const json = JSON.parse(data);
    const subdomains = new Set<string>();
    if (Array.isArray(json)) {
      json.forEach((entry: any) => {
        if (entry.name_value) {
          entry.name_value.split('\n').forEach((name: string) => {
            if (name.endsWith(`.${domain}`) && !name.includes('*')) {
              subdomains.add(name.toLowerCase());
            }
          });
        }
      });
    }
    return Array.from(subdomains);
  } catch (error) {
    console.warn(`crt.sh data parsing failed for ${domain}:`, error);
    return [];
  }
};

const fetchFromHackerTarget = async (domain: string): Promise<string[]> => {
  const url = `https://api.hackertarget.com/hostsearch/?q=${domain}`;
  const data = await fetchPageContent(url);
  if (!data) return [];
  
  try {
    return data.split('\n').map(line => line.split(',')[0].trim().toLowerCase()).filter(Boolean);
  } catch (error) {
    console.warn(`HackerTarget data parsing failed for ${domain}:`, error);
    return [];
  }
};

const fetchFromC99 = async (domain: string): Promise<string[]> => {
  const today = new Date();
  for (let i = 0; i < 7; i++) { // Check last 7 days
    const dateToTry = new Date(today);
    dateToTry.setDate(dateToTry.getDate() - i);
    const scanDate = dateToTry.toISOString().split('T')[0];
    const url = `https://subdomainfinder.c99.nl/scans/${scanDate}/${domain}`;
    const html = await fetchPageContent(url);
    if (!html) continue; // Try next date if fetch fails

    try {
      const subdomains = new Set<string>();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = doc.querySelectorAll('table a[target="_blank"]');
      if (links.length > 0) {
        links.forEach(link => {
          const subdomain = link.textContent?.trim().toLowerCase();
          if (subdomain && subdomain.endsWith(`.${domain}`) && !subdomain.includes('*')) {
            subdomains.add(subdomain);
          }
        });
        if (subdomains.size > 0) return Array.from(subdomains);
      }
    } catch (error) { 
        console.warn(`c99.nl data parsing failed for ${scanDate}:`, error);
    }
  }
  return [];
};

const fetchFromThreatMiner = async (domain: string): Promise<string[]> => {
  const url = `https://api.threatminer.org/v2/domain.php?q=${domain}&rt=5`;
  const data = await fetchPageContent(url);
  if (!data) return [];
  
  try {
    const json = JSON.parse(data);
    if (json.status_code === '200' && json.results) {
      return json.results.filter((sub: string) => sub.includes('.')).map((s: string) => s.toLowerCase());
    }
    return [];
  } catch (error) {
    console.warn(`ThreatMiner data parsing failed for ${domain}:`, error);
    return [];
  }
};

const fetchFromUrlScan = async (domain: string): Promise<string[]> => {
  const url = `https://urlscan.io/api/v1/search/?q=domain:${domain}`;
  const data = await fetchPageContent(url);
  if (!data) return [];
  
  try {
    const json = JSON.parse(data);
    if (json.results && json.results.length > 0) {
      const subdomains = new Set<string>();
      json.results.forEach((result: any) => {
        if (result.page && result.page.domain) {
          subdomains.add(result.page.domain.toLowerCase());
        }
      });
      return Array.from(subdomains);
    }
    return [];
  } catch (error) {
    console.warn(`UrlScan.io data parsing failed for ${domain}:`, error);
    return [];
  }
};

const fetchFromAnubis = async (domain: string): Promise<string[]> => {
  const url = `https://jldc.me/anubis/subdomains/${domain}`;
  try {
    // This source has CORS enabled, so we can fetch it directly! This is much more reliable.
    const response = await axios.get<string[]>(url, { timeout: 10000 });
    if (Array.isArray(response.data)) {
      return response.data.map((sub: string) => sub.toLowerCase());
    }
    return [];
  } catch (error) {
    console.warn(`Anubis (direct) fetch failed for ${domain}:`, error);
    return [];
  }
};

const fetchFromAlienVault = async (domain: string): Promise<string[]> => {
  const url = `https://otx.alienvault.com/api/v1/indicators/domain/${domain}/passive_dns`;
  const data = await fetchPageContent(url);
  if (!data) return [];
  
  try {
    const json = JSON.parse(data);
    const subdomains = new Set<string>();
    if (json.passive_dns && Array.isArray(json.passive_dns)) {
      json.passive_dns.forEach((entry: any) => {
        if (entry.hostname) {
          subdomains.add(entry.hostname.toLowerCase());
        }
      });
    }
    return Array.from(subdomains);
  } catch (error) {
    console.warn(`AlienVault OTX data parsing failed for ${domain}:`, error);
    return [];
  }
};


export const fetchSubdomains = async (
  domain: string,
  onDiscoveryProgress?: (message: string) => void
): Promise<string[]> => {
  
  const sources = [
    { name: 'Anubis (Direct)', promise: fetchFromAnubis(domain) },
    { name: 'crt.sh', promise: fetchFromCrtSh(domain) },
    { name: 'AlienVault OTX', promise: fetchFromAlienVault(domain) },
    { name: 'HackerTarget', promise: fetchFromHackerTarget(domain) },
    { name: 'ThreatMiner', promise: fetchFromThreatMiner(domain) },
    { name: 'UrlScan.io', promise: fetchFromUrlScan(domain) },
    { name: 'c99.nl', promise: fetchFromC99(domain) },
  ];

  onDiscoveryProgress?.(`Extracting from ${sources.length} sources in parallel...`);

  const results = await Promise.allSettled(sources.map(s => s.promise));
  const allSubdomains = new Set<string>();
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      result.value.forEach(subdomain => {
        if (subdomain && subdomain.includes('.') && !subdomain.includes('*') && subdomain.endsWith(domain)) {
          allSubdomains.add(subdomain.trim());
        }
      });
    } else if (result.status === 'rejected') {
        // This is now just a warning, as other sources may have succeeded.
        console.warn(`Source ${sources[index].name} promise was rejected:`, result.reason);
    }
  });

  if (allSubdomains.size === 0) {
    // Check if all sources failed to respond at all. This is the only time we should show a major error.
    const allFailed = results.every(r => r.status === 'fulfilled' && r.value.length === 0);
    if (allFailed) {
      // We don't throw an error anymore, just return an empty array. The UI will handle the "not found" case.
      console.warn('All subdomain sources returned no results. The domain might have no public subdomains or services are down.');
    }
  }

  const uniqueSubdomains = Array.from(allSubdomains);
  onDiscoveryProgress?.(`Found ${uniqueSubdomains.length} unique subdomains. You can now check their live status.`);
  
  return uniqueSubdomains.sort();
};
