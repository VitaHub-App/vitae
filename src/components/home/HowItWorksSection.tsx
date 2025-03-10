
import { cn } from '@/lib/utils';
import { Check, Edit, Github, Upload } from 'lucide-react';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
  index: number;
}

function Step({ number, title, description, icon: Icon, index }: StepProps) {
  return (
    <div 
      className="relative flex animate-fade-in animate-in"
      style={{ ['--index' as any]: index }}
    >
      <div className="flex flex-col items-center mr-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
          {number}
        </div>
        {number < 3 && (
          <div className="h-full w-0.5 bg-border mt-2" />
        )}
      </div>
      <div className="pt-1 pb-8">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mr-3">
            <Icon size={18} className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground max-w-lg">{description}</p>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Create Your CV in Markdown',
      description: 'Write your professional information using simple markdown syntax in a text editor of your choice.',
      icon: Edit
    },
    {
      number: 2,
      title: 'Push to Git Repository',
      description: 'Submit your CV to our Git repository via a pull request. Our system will automatically parse your markdown.',
      icon: Github
    },
    {
      number: 3,
      title: 'Your CV is Live',
      description: 'Once approved, your CV is instantly published with our elegant design, ready to be shared with the world.',
      icon: Upload
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-accent/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            A straightforward process designed for simplicity and efficiency.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <Step 
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              index={index}
            />
          ))}
        </div>
        
        <div 
          className="mt-12 p-6 border border-border rounded-xl bg-card max-w-3xl mx-auto animate-fade-in"
          style={{ ['--index' as any]: 3 }}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Check size={20} className="text-primary mr-2" />
            Why Choose This Approach?
          </h3>
          <p className="text-muted-foreground mb-4">
            Using Git and markdown together provides several advantages over traditional CV builders:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Check size={18} className="text-primary mr-2 mt-1 flex-shrink-0" />
              <span>Version control and history of all changes to your CV</span>
            </li>
            <li className="flex items-start">
              <Check size={18} className="text-primary mr-2 mt-1 flex-shrink-0" />
              <span>No proprietary formats - your data remains in simple text</span>
            </li>
            <li className="flex items-start">
              <Check size={18} className="text-primary mr-2 mt-1 flex-shrink-0" />
              <span>Easy collaboration and feedback through pull requests</span>
            </li>
            <li className="flex items-start">
              <Check size={18} className="text-primary mr-2 mt-1 flex-shrink-0" />
              <span>Demonstrates technical fluency for tech-related positions</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
