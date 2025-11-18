import React from 'react';
import * as LucideIcons from 'lucide-react';

interface SocialIconProps {
  iconName: string;
  size?: number;
}

const SocialIcon: React.FC<SocialIconProps> = ({ iconName, size = 20 }) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    facebook: LucideIcons.Facebook,
    twitter: LucideIcons.Twitter,
    instagram: LucideIcons.Instagram,
    linkedin: LucideIcons.Linkedin,
    youtube: LucideIcons.Youtube,
    music: LucideIcons.Music, // for TikTok
    pinterest: LucideIcons.Pin,
    reddit: LucideIcons.Reddit,
    whatsapp: LucideIcons.MessageCircle,
    telegram: LucideIcons.Send,
    snapchat: LucideIcons.Ghost,
    github: LucideIcons.Github,
    twitch: LucideIcons.Twitch,
    discord: LucideIcons.MessageSquare,
    medium: LucideIcons.BookMarked,
    flickr: LucideIcons.Flickr,
    vimeo: LucideIcons.Vimeo,
    quora: LucideIcons.HelpCircle,
    tumblr: LucideIcons.Tumblr,
  };

  const IconComponent = iconMap[iconName.toLowerCase()] || LucideIcons.Link;

  return <IconComponent size={size} />;
};

export default SocialIcon;
