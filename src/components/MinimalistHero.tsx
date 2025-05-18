
import React from 'react';

const MinimalistHero: React.FC = () => {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section className="py-16 md:py-24 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-voomics-indigo">
          India's Home for Webcomics
        </h1>
        
        <p className="text-xl mb-8 text-gray-700 max-w-xl mx-auto">
          Be the first to experience Voomics – built by desi creators, for desi readers.
        </p>
        
        <button 
          onClick={scrollToWaitlist}
          className="bg-voomics-red text-white px-8 py-3 rounded-md transition-colors hover:bg-voomics-red/90 text-lg font-medium"
        >
          Join the Waitlist
        </button>

        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <span>Made in 🇮🇳</span>
          <span>Mobile-First</span>
          <span>Creator-Friendly</span>
        </div>
      </div>
    </section>
  );
};

export default MinimalistHero;
