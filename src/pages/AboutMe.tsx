import React from 'react';
import { Linkedin, Instagram, Phone, Briefcase } from 'lucide-react';

const AboutMe: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 p-8 border-b">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img 
              src="https://avatars.githubusercontent.com/u/77529454?v=4"
              alt="Krrish Bajaj"
              className="w-32 h-32 rounded-full border-4 border-white shadow-md"
            />
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">Krrish Bajaj</h1>
              <p className="text-lg text-blue-600 font-semibold mt-1">Security Researcher & Developer</p>
            </div>
          </div>
        </div>
        <div className="p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-500" />
              About Me
            </h2>
            <p className="text-gray-600 leading-relaxed">
              I'm a passionate cybersecurity enthusiast and developer with a focus on finding vulnerabilities and building secure applications. My goal is to contribute to a safer digital ecosystem. This toolkit is a collection of utilities I've found helpful in my own work, and I'm excited to share it with the community.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Connect with Me</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SocialLink 
                icon={<Linkedin />}
                platform="LinkedIn"
                handle="krrish-bajaj"
                url="https://www.linkedin.com/in/krrish-bajaj"
                colorClasses="bg-sky-100 text-sky-700 hover:bg-sky-200"
              />
              <SocialLink 
                icon={<img src="https://hackerone.com/favicon.ico" alt="HackerOne" className="w-5 h-5" />}
                platform="HackerOne"
                handle="krrishbajaj"
                url="https://hackerone.com/krrishbajaj?type=user"
                colorClasses="bg-gray-100 text-gray-700 hover:bg-gray-200"
              />
              <SocialLink 
                icon={<Instagram />}
                platform="Instagram"
                handle="@krrish_hack"
                url="https://www.instagram.com/krrish_hack"
                colorClasses="bg-pink-100 text-pink-700 hover:bg-pink-200"
              />
               <SocialLink 
                icon={<Phone />}
                platform="WhatsApp"
                handle="+91 9818012911"
                url="https://wa.me/919818012911"
                colorClasses="bg-green-100 text-green-700 hover:bg-green-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SocialLinkProps {
    icon: React.ReactNode;
    platform: string;
    handle: string;
    url: string;
    colorClasses: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, platform, handle, url, colorClasses }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`p-4 rounded-lg flex items-center gap-4 transition-transform hover:-translate-y-1 ${colorClasses}`}>
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <p className="font-bold">{platform}</p>
            <p className="text-sm font-mono">{handle}</p>
        </div>
    </a>
)

export default AboutMe;
