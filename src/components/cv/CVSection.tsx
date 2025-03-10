
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CVSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function CVSection({
  title,
  icon: Icon,
  children,
  isExpanded,
  onToggle
}: CVSectionProps) {
  return (
    <div className={cn(
      "border border-border rounded-lg mb-6 overflow-hidden section-transition",
      isExpanded ? "expanded shadow-sm" : "collapsed"
    )}>
      <button
        className={cn(
          "w-full flex items-center justify-between p-4 md:p-6 focus:outline-none transition-colors",
          isExpanded ? "bg-accent/50" : "hover:bg-accent/20"
        )}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-primary/10 mr-4">
            <Icon size={20} className="text-primary" />
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="text-primary">
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>
      
      <div className={cn(
        "transition-all duration-500",
        isExpanded ? "opacity-100" : "opacity-0 h-0"
      )}>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
