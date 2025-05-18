
import React from 'react';
import MinimalistHero from '@/components/MinimalistHero';
import MinimalistWaitlistForm from '@/components/MinimalistWaitlistForm';
import MinimalistFooter from '@/components/MinimalistFooter';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow flex flex-col">
        <MinimalistHero />
        <MinimalistWaitlistForm />
      </main>
      <MinimalistFooter />
    </div>
  );
};

export default Index;
