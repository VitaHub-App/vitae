
import { Mail, Phone, MapPin, Code } from 'lucide-react';
import { PersonalInfo } from '@/types/cv';

interface PersonalInfoCardProps {
  personalInfo: PersonalInfo;
}

export default function PersonalInfoCard({ personalInfo }: PersonalInfoCardProps) {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{personalInfo.name}</h1>
          <h2 className="text-xl text-primary font-medium mb-4">{personalInfo.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <div className="flex items-center text-muted-foreground">
              <Mail size={16} className="mr-2 text-primary" />
              <span>{personalInfo.email}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Phone size={16} className="mr-2 text-primary" />
              <span>{personalInfo.phone}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin size={16} className="mr-2 text-primary" />
              <span>{personalInfo.location}</span>
            </div>
            {personalInfo.website && (
              <div className="flex items-center text-muted-foreground">
                <Code size={16} className="mr-2 text-primary" />
                <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  {personalInfo.website}
                </a>
              </div>
            )}
          </div>
          
          <p className="text-foreground/80">{personalInfo.bio}</p>
        </div>
      </div>
    </div>
  );
}
