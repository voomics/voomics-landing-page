
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full py-4", className)}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/a2bbbfc6-d405-4456-b8b3-515cb26020c7.png" 
            alt="Voomics Logo" 
            className="h-10 md:h-12"
          />
          <span className="ml-2 text-xl font-poppins font-semibold text-voomics-indigo md:block">
            Voomics
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#readers" className="text-voomics-indigo hover:text-voomics-saffron font-medium">For Readers</a>
          <a href="#creators" className="text-voomics-indigo hover:text-voomics-saffron font-medium">For Creators</a>
          <a href="#waitlist" className="px-4 py-2 bg-voomics-red text-white rounded-md hover:bg-opacity-90 transition-colors">
            Join Waitlist
          </a>
        </nav>
        <button className="md:hidden text-voomics-indigo">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
