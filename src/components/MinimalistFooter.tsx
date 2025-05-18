
import React from 'react';

const MinimalistFooter: React.FC = () => {
  return (
    <footer className="py-8 border-t border-gray-100">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center mb-4">
            <img 
              src="/lovable-uploads/a2bbbfc6-d405-4456-b8b3-515cb26020c7.png" 
              alt="Voomics Logo" 
              className="h-8"
            />
            <span className="ml-2 text-lg font-medium text-voomics-indigo">Voomics</span>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Bringing Indian stories to life, one panel at a time.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-voomics-saffron">Twitter</a>
            <a href="#" className="text-gray-600 hover:text-voomics-saffron">Instagram</a>
            <a href="#" className="text-gray-600 hover:text-voomics-saffron">Discord</a>
            <a href="#" className="text-gray-600 hover:text-voomics-saffron">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MinimalistFooter;
