
import React from 'react';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface TestimonialProps {
  content: string;
  author: string;
  handle: string;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ content, author, handle, className }) => {
  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-md border border-gray-100", className)}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-voomics-saffron to-voomics-red flex items-center justify-center text-white font-bold">
          {author.charAt(0)}
        </div>
        <div className="ml-3">
          <p className="font-medium text-gray-900">{author}</p>
          <p className="text-sm text-gray-500">@{handle}</p>
        </div>
      </div>
      <p className="text-gray-700">{content}</p>
    </div>
  );
};

const SocialProof: React.FC = () => {
  const testimonials = [
    {
      content: "Finally, an Indian webcomics platform that gets our stories! The art style diversity is amazing. Can't wait for the full launch! 🇮🇳🔥",
      author: "Priya Sharma",
      handle: "priyacomics"
    },
    {
      content: "As a creator, I'm excited about Voomics' fair revenue model. Time for our desi stories to shine globally without losing rights!",
      author: "Arjun Menon",
      handle: "artsyarjun"
    },
    {
      content: "The preview access showed such amazing potential. Love seeing Indian mythology reimagined in fresh ways. This is what we needed!",
      author: "Rahul Verma",
      handle: "comicbuff22"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-voomics-indigo mb-12">
          What the community is saying
        </h2>
        
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                content={testimonial.content}
                author={testimonial.author}
                handle={testimonial.handle}
              />
            ))}
          </div>
        </div>
        
        <div className="md:hidden">
          <Carousel>
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <TestimonialCard
                    content={testimonial.content}
                    author={testimonial.author}
                    handle={testimonial.handle}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="static translate-y-0 mr-2" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <span className="text-voomics-indigo bg-gray-100 px-4 py-2 rounded-full text-sm">#Voomics</span>
          <span className="text-voomics-indigo bg-gray-100 px-4 py-2 rounded-full text-sm">#WebtoonIndia</span>
          <span className="text-voomics-indigo bg-gray-100 px-4 py-2 rounded-full text-sm">#BharatKiKahaniyan</span>
          <span className="text-voomics-indigo bg-gray-100 px-4 py-2 rounded-full text-sm">#MadeInIndia</span>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
