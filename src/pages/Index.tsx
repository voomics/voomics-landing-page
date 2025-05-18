
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ValueProps from '@/components/ValueProps';
import AudienceSplit from '@/components/AudienceSplit';
import SocialProof from '@/components/SocialProof';
import WaitlistForm from '@/components/WaitlistForm';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <ValueProps />
        <AudienceSplit />
        <SocialProof />
        <WaitlistForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
