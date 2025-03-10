
import { Building2, MapPin } from 'lucide-react';

interface TimelineItemProps {
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string[];
}

export default function TimelineItem({
  title,
  organization,
  location,
  period,
  description
}: TimelineItemProps) {
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
        {description.map((desc, idx) => (
          <li key={idx}>{desc}</li>
        ))}
      </ul>
    </div>
  );
}
