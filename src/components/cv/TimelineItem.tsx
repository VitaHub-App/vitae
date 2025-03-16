
import { Building2, MapPin } from 'lucide-react';

import { Description } from '@/types/cv';

interface TimelineItemProps {
  title: string;
  organization: string;
  location: string;
  period: string;
  description: Description;
  currentAngle?: string | null;
}

export default function TimelineItem({
  title,
  organization,
  location,
  period,
  description,
  currentAngle = null 
}: TimelineItemProps) {
  // Helper function to determine if an item should be visible based on angle
  const shouldShowItem = (itemAngles?: string[]) => {
    // If no angle is selected or the item has no angles, show it
    if (!currentAngle || !itemAngles || itemAngles.length === 0) {
      return true;
    }
    
    // If an angle is selected, show only items tagged with that angle
    return itemAngles.includes(currentAngle);
  };
  const angleFilteredDescription = description.filter(item => shouldShowItem(item.angles));
  return (
    <div className="relative pl-8 border-l-2 border-border">
      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary"></div>
      <div className="mb-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground mb-2">
          <div className="flex items-center mr-4">
            <Building2 size={14} className="mr-1 text-primary" />
            <span>{organization}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={14} className="mr-1 text-primary" />
            <span>{location}</span>
          </div>
          <span className="sm:ml-auto text-sm">{period}</span>
        </div>
      </div>
      <ul className="list-disc pl-5 space-y-1 text-foreground/80">
        {angleFilteredDescription.map((desc, idx) => (
          <li key={idx}>{desc.value}</li>
        ))}
      </ul>
    </div>
  );
}
