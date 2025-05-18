
import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

const HeroSection: React.FC = () => {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-voomics-saffron to-voomics-red text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-30"></div>
        {/* Comic style background patterns */}
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-voomics-mint opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-voomics-indigo opacity-20"></div>
      </div>
      
      {/* Social links banner - removing from here */}
      
      <div className="container relative z-10 pt-16 pb-16 md:pt-28 md:pb-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl font-medium mb-3 md:mb-4">Bharat ki kahaniyan, panel-by-panel.</p>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            India's Home for Webcomics & Webtoons
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 md:mb-10 max-w-2xl mx-auto">
            Join the waitlist for Voomics – built by desi creators, for desi readers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={scrollToWaitlist}
              size="lg"
              className="bg-white text-voomics-red hover:bg-voomics-offwhite text-lg px-6 py-6 h-auto"
            >
              Join the Waitlist
            </Button>
          </div>
          
          {/* Moving social links here and making them bigger */}
          <div className="flex justify-center space-x-8 mt-12">
            <a 
              href="https://facebook.com/voomics" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={32} />
            </a>
            <a 
              href="https://instagram.com/voomics" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={32} />
            </a>
            <a 
              href="https://linkedin.com/company/voomics" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={32} />
            </a>
          </div>
          
          <div className="mt-10 pt-6 border-t border-white/20 flex flex-wrap justify-center items-center gap-6">
            <span className="flex items-center text-sm md:text-base">
              <span className="mr-2">Made in</span>
              <span className="text-lg">🇮🇳</span>
            </span>
            <span className="flex items-center text-sm md:text-base">
              <span className="mr-2">Mobile-First</span>
              <span className="text-lg">🤳</span>
            </span>
            <span className="flex items-center text-sm md:text-base">
              <span className="mr-2">Creator-Friendly</span>
              <span className="text-lg">🎨</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
