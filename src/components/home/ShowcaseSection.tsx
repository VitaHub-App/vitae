
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShowcaseItemProps {
  title: string;
  role: string;
  image: string;
  index: number;
}

function ShowcaseItem({ title, role, image, index }: ShowcaseItemProps) {
  return (
    <div 
      className="group relative overflow-hidden rounded-xl border border-border animate-fade-in animate-in"
      style={{ ['--index' as any]: index }}
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img 
          src={image} 
          alt={`${title}'s CV`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-xl font-semibold mb-1 text-white">{title}</h3>
        <p className="text-white/80 mb-4">{role}</p>
        <a 
          href="#" 
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View CV
          <ArrowRight size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
}

export default function ShowcaseSection() {
  const showcaseItems = [
    {
      title: "Alex Morgan",
      role: "UX Designer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Jamie Chen",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Taylor Wright",
      role: "Product Manager",
      image: "https://images.unsplash.com/photo-1562788869-4ed32648eb72?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Sam Rivera",
      role: "Marketing Specialist",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <section id="showcase" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">CV Showcase</h2>
          <p className="text-muted-foreground text-lg">
            Browse examples from professionals across various industries who are using our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseItems.map((item, index) => (
            <ShowcaseItem 
              key={item.title}
              title={item.title}
              role={item.role}
              image={item.image}
              index={index}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center animate-fade-in" style={{ ['--index' as any]: 4 }}>
          <a 
            href="/template" 
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Create Your CV Now
            <ArrowRight size={18} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}
