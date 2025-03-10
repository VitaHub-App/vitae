
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'FAQ', href: '#faq' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 w-full",
        isScrolled ? "glassmorphism" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a 
          href="/" 
          className="flex items-center space-x-2 text-xl font-semibold"
          aria-label="CV Hub Logo"
        >
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold">CV</span>
          </div>
          <span className="hidden sm:inline">Vita<span className="text-primary">Hub</span></span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              {item.label}
            </button>
          ))}
          <a
            href="/template"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            View Template
          </a>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glassmorphism animate-fade-in">
          <div className="px-6 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-foreground hover:text-primary py-2 transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
            <a
              href="/template"
              className="py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors text-center"
            >
              View Template
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
