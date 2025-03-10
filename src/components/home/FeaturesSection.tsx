
import { FileText, GitPullRequest, Globe, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ElementType;
  index: number;
}

function Feature({ title, description, icon: Icon, index }: FeatureProps) {
  return (
    <div 
      className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-300 animate-fade-in animate-in"
      style={{ ['--index' as any]: index }}
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="text-primary" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      title: 'Markdown-Based',
      description: 'Create and edit your CV using simple markdown syntax, making it easy to maintain and version.',
      icon: FileText
    },
    {
      title: 'Git Workflow',
      description: 'Publish and update your CV using Git and pull requests, perfect for developers and tech professionals.',
      icon: GitPullRequest
    },
    {
      title: 'Multi-Language Support',
      description: 'Present your CV in multiple languages with an elegant language selector built in.',
      icon: Globe
    },
    {
      title: 'Mobile-First Design',
      description: 'Your CV looks perfect on all devices, especially mobile, ensuring it can be viewed anywhere.',
      icon: Smartphone
    }
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            Powerful Features
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to create a professional, elegant CV that stands out from the crowd.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Feature 
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
