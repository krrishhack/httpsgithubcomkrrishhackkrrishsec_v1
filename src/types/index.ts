export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface DomainResult {
  domain: string;
  links: SocialLink[];
  error?: string;
}

export interface SocialMediaPattern {
  name: string;
  patterns: RegExp[];
  icon: string;
  color: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  results: DomainResult[];
}

export interface SubdomainWithStatus {
  name: string;
  status: number | 'error' | 'unchecked';
}

export interface SubdomainResult {
  domain: string;
  subdomains: SubdomainWithStatus[];
  error?: string;
}

export interface SubdomainHistoryEntry {
  id: string;
  timestamp: number;
  results: SubdomainResult[];
}

export interface User {
  email: string;
  password?: string; // Optional for security, not stored in frontend state after login
}
