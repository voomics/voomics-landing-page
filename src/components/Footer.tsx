
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-voomics-indigo text-white py-12">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <img 
              src="/lovable-uploads/a2bbbfc6-d405-4456-b8b3-515cb26020c7.png" 
              alt="Voomics Logo" 
              className="h-8 bg-white p-1 rounded"
            />
            <span className="ml-2 text-lg font-poppins font-semibold">Voomics</span>
          </div>
          
          <p className="text-white/80 text-sm mb-6 md:mb-0 text-center md:text-left max-w-md">
            Bringing Indian stories to life, one panel at a time. 
            <span className="block mt-1">Toon wale desh se, Voomics tak.</span>
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-white/80 hover:text-white transition-colors">About</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Discord</a>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-white/60 text-sm">
            Building Voomics with the community – follow our journey.
          </p>
          <p className="text-white/60 text-xs mt-4">
            © {new Date().getFullYear()} Voomics. All rights reserved.
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
