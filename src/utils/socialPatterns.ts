import { SocialMediaPattern } from '../types';

// Patterns are based on the provided Python script for exact matching behavior.
export const socialMediaPatterns: SocialMediaPattern[] = [
  {
    name: 'Facebook',
    patterns: [/facebook\.com\/[a-zA-Z0-9._-]+/gi],
    icon: 'facebook',
    color: '#1877F2',
  },
  {
    name: 'X / Twitter',
    patterns: [/twitter\.com\/([a-zA-Z0-9._-]+|@[a-zA-Z0-9._-]+)/gi, /x\.com\/[a-zA-Z0-9._-]+/gi],
    icon: 'twitter',
    color: '#000000',
  },
  {
    name: 'LinkedIn',
    patterns: [/linkedin\.com\/(in|company)\/[a-zA-Z0-9._-]+/gi],
    icon: 'linkedin',
    color: '#0A66C2',
  },
  {
    name: 'TikTok',
    patterns: [/tiktok\.com\/@[a-zA-Z0-9._-]+/gi],
    icon: 'music',
    color: '#000000',
  },
  {
    name: 'Instagram',
    patterns: [/instagram\.com\/[a-zA-Z0-9._-]+/gi],
    icon: 'instagram',
    color: '#E4405F',
  },
  {
    name: 'YouTube',
    patterns: [/youtube\.com\/(channel|user|c|@)?[a-zA-Z0-9._-]+/gi, /youtu\.be\/[a-zA-Z0-9._-]+/gi],
    icon: 'youtube',
    color: '#FF0000',
  },
  {
    name: 'Discord',
    patterns: [/discord\.(gg|com\/invite)\/[a-zA-Z0-9_-]+/gi],
    icon: 'discord',
    color: '#5865F2',
  },
  {
    name: 'GitHub',
    patterns: [/github\.com\/[a-zA-Z0-9_-]+/gi],
    icon: 'github',
    color: '#181717',
  },
  {
    name: 'Twitch',
    patterns: [/twitch\.tv\/[a-zA-Z0-9_-]+/gi],
    icon: 'twitch',
    color: '#9146FF',
  },
  {
    name: 'Telegram',
    patterns: [/t\.me\/[a-zA-Z0-9_]+/gi],
    icon: 'telegram',
    color: '#26A5E4',
  },
  {
    name: 'Reddit',
    patterns: [/reddit\.com\/[a-zA-Z0-9._-]+/gi],
    icon: 'reddit',
    color: '#FF4500',
  },
  {
    name: 'Pinterest',
    patterns: [/pinterest\.com\/[a-zA-Z0-9._-]+/gi],
    icon: 'pinterest',
    color: '#E60023',
  },
  {
    name: 'Snapchat',
    patterns: [/snapchat\.com\/[a-zA-Z0-9._-]+/gi],
    icon: 'snapchat',
    color: '#FFFC00',
  },
  {
    name: 'Flickr',
    patterns: [/flickr\.com\/[a-zA-Z0-9._-]+/gi],
    icon: 'flickr',
    color: '#0063DC',
  },
  {
    name: 'Vimeo',
    patterns: [/vimeo\.com\/[a-zA-Z0-9._-]+/gi],
    icon: 'vimeo',
    color: '#1AB7EA',
  },
  {
    name: 'Quora',
    patterns: [/quora\.com\/[a-zA-Z0-9._-]+/gi],
    icon: 'quora',
    color: '#B92B27',
  },
  {
    name: 'Medium',
    patterns: [/medium\.com\/[a-zA-Z0-9._-]+/gi],
    icon: 'medium',
    color: '#000000',
  },
  {
    name: 'Tumblr',
    patterns: [/tumblr\.com\/[a-zA-Z0-9._-]+/gi],
    icon: 'tumblr',
    color: '#36465D',
  },
];
