
import React from 'react';
import { Button } from '@/components/ui/button';

const AudienceSplit: React.FC = () => {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-voomics-indigo mb-16">
          Join the revolution in Indian storytelling
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Readers */}
          <div id="readers" className="bg-gradient-to-br from-voomics-offwhite to-white p-8 rounded-2xl shadow-md border border-gray-100">
            <div className="text-3xl mb-4">📖</div>
            <h3 className="text-2xl font-semibold mb-4 text-voomics-indigo">For Readers</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-voomics-saffron mr-2">✓</span>
                <span>Binge local heroes with fresh storylines</span>
              </li>
              <li className="flex items-start">
                <span className="text-voomics-saffron mr-2">✓</span>
                <span>Enjoy relatable humor that speaks to you</span>
              </li>
              <li className="flex items-start">
                <span className="text-voomics-saffron mr-2">✓</span>
                <span>Access exclusive drops before anyone else</span>
              </li>
              <li className="flex items-start">
                <span className="text-voomics-saffron mr-2">✓</span>
                <span>From chai-powered chaat jokes to cosmic myth-punk – all in one swipe</span>
              </li>
            </ul>
            <Button
              onClick={scrollToWaitlist}
              variant="outline"
              className="border-voomics-saffron text-voomics-saffron hover:bg-voomics-saffron hover:text-white"
            >
              Join Reader Waitlist
            </Button>
          </div>
          
          {/* For Creators */}
          <div id="creators" className="bg-gradient-to-br from-voomics-indigo to-voomics-indigo/90 p-8 rounded-2xl shadow-md text-white">
            <div className="text-3xl mb-4">✍️</div>
            <h3 className="text-2xl font-semibold mb-4">For Creators</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-voomics-mint mr-2">✓</span>
                <span>Grow your fandom with built-in promotion tools</span>
              </li>
              <li className="flex items-start">
                <span className="text-voomics-mint mr-2">✓</span>
                <span>Monetize your art with flexible revenue options</span>
              </li>
              <li className="flex items-start">
                <span className="text-voomics-mint mr-2">✓</span>
                <span>Own your IP completely - we're just the platform</span>
              </li>
              <li className="flex items-start">
                <span className="text-voomics-mint mr-2">✓</span>
                <span>Own your IP, set your pricing, reach 500M mobile readers</span>
              </li>
            </ul>
            <Button
              onClick={scrollToWaitlist} 
              className="bg-voomics-mint text-voomics-indigo hover:bg-voomics-mint/90"
            >
              Join Creator Waitlist
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudienceSplit;
