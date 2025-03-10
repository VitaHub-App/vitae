
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 md:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-accent/30 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6">
        <div 
          className="flex flex-col justify-center"
          style={{['--index' as any]: 0}}
        >
          <div className="flex items-center space-x-2 mb-6 animate-fade-in animate-in">
            <div className="px-3 py-1 rounded-full bg-accent text-xs font-semibold text-primary">
              Version 1.0 Released
            </div>
          </div>
          
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance animate-fade-in animate-in"
            style={{['--index' as any]: 1}}
          >
            Showcase Your <span className="text-primary">Professional Journey</span> With Elegance
          </h1>
          
          <p 
            className="text-lg text-foreground/80 mb-8 max-w-xl animate-fade-in animate-in"
            style={{['--index' as any]: 2}}
          >
            Create beautiful, responsive CVs that stand out. Publish directly from markdown via Git, and present your professional story with clarity and sophistication.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 animate-fade-in animate-in"
            style={{['--index' as any]: 3}}
          >
            <a 
              href="/template" 
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              View CV Template
              <ArrowRight size={18} className="ml-2" />
            </a>
            <a 
              href="#how-it-works" 
              className="px-6 py-3 border border-border bg-background hover:bg-accent/50 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              Learn How It Works
            </a>
          </div>
        </div>
        
        <div 
          className="relative lg:mt-0 flex items-center justify-center animate-fade-in animate-in"
          style={{['--index' as any]: 4}}
        >
          <div className={cn(
            "w-full max-w-md relative rounded-xl overflow-hidden border border-border shadow-xl",
            "before:absolute before:inset-0 before:bg-gradient-to-t before:from-background/80 before:via-transparent before:to-transparent before:z-10"
          )}>
            <div className="absolute top-0 left-0 right-0 h-8 bg-secondary/80 flex items-center px-4 z-20">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop"
              alt="CV Template Preview" 
              className="w-full h-auto object-cover animate-float"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 -z-10 w-72 h-72 bg-accent/20 rounded-full blur-xl" />
        </div>
      </div>
    </section>
  );
}
