import { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AngleSelectorProps {
  angles: string[];
  currentAngle: string | null;
  onAngleChange: (angle: string | null) => void;
}

export default function AngleSelector({
  angles,
  currentAngle,
  onAngleChange
}: AngleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!angles || angles.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        <span className="text-foreground">
          {currentAngle ? currentAngle : 'No filter'}
        </span>
        <ChevronDown size={16} className={cn(
          "text-foreground/70 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-36 py-1 rounded-md shadow-lg bg-card border border-border z-50 animate-scale-in">
          <ul role="listbox" className="py-1">
            <li
              role="option"
              className={cn(
                "flex items-center px-3 py-2 cursor-pointer text-primary text-xs",
                "hover:bg-accent/50 transition-colors",
              )}
              onClick={() => {
                onAngleChange(undefined);
                setIsOpen(false);
              }}
            >
              Default
            </li>
            <li
              role="option"
              aria-selected={currentAngle === null}
              className={cn(
                "flex items-center px-3 py-2 cursor-pointer text-primary text-xs",
                "hover:bg-accent/50 transition-colors",
                currentAngle === null && "bg-accent text-accent-foreground"
              )}
              onClick={() => {
                onAngleChange(null);
                setIsOpen(false);
              }}
            >
              No Filter
            </li>
            {angles.map((angle) => (
              <li
                key={angle}
                role="option"
                aria-selected={angle === currentAngle}
                className={cn(
                  "flex items-center px-3 py-2 cursor-pointer",
                  "hover:bg-accent/50 transition-colors",
                  angle === currentAngle && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  onAngleChange(angle);
                  setIsOpen(false);
                }}
              >
                {angle}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
