import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShowcaseItemProps {
  title: string;
  role: string;
  image: string;
  index: number;
  target: string;
}

const ShowcaseItem: React.FC<ShowcaseItemProps> = ({ title, role, image, target, index }) => {
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
          href={target} 
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View CV
          <ArrowRight size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

function CTA() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="mt-12 text-center animate-fade-in" style={{ ['--index' as any]: 4 }}>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Create Your CV Now
          <ArrowRight size={18} className="ml-2" />
        </button>
      </div>

      {showModal && <ContributionModal onClose={() => setShowModal(false)} />}
    </>
  );
}

const ContributionModal = ({ onClose }: { onClose: () => void }) => (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    onClick={onClose}
  >
    <div
      className="bg-background rounded-lg p-6 max-w-2xl w-full relative z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Contribution Guide</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          ×
        </button>
      </div>
      <div className="space-y-4 font-mono text-sm">
        <p># Fork and clone the repo</p>
        <p className="bg-accent p-2 rounded">gh repo fork VitaHub-App/vitae --clone && cd vitae</p>

        <p># Create new branch</p>
        <p className="bg-accent p-2 rounded">git checkout -b feat/add-{`<your-name>`}-cv</p>

        <p># Copy template</p>
        <p className="bg-accent p-2 rounded">cp ./contents/cvs/alex-morgan.md ./contents/cvs/{`<your-name>`}.md</p>

        <p># Edit your CV (using VSCode example)</p>
        <p className="bg-accent p-2 rounded">code ./contents/cvs/{`<your-name>`}.md</p>

        <p># Commit and push</p>
        <p className="bg-accent p-2 rounded">git add . && git commit -m "Add {`<your-name>`} CV"</p>
        <p className="bg-accent p-2 rounded">git push -u origin HEAD</p>

        <p># Create pull request</p>
        <p className="bg-accent p-2 rounded">gh pr create --fill</p>
      </div>
    </div>
  </div>
);

const ShowcaseSection: React.FC = () => {
  const showcaseItems = [
    {
      title: "Alex Morgan",
      role: "UX Designer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
      target: "/cv/alex-morgan",
    },
    {
      title: "Jamie Chen",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=1000&auto=format&fit=crop",
      target: "/cv/jamie-chen",
    },
    {
      title: "Taylor Wright",
      role: "Product Manager",
      image: "https://images.unsplash.com/photo-1562788869-4ed32648eb72?q=80&w=1000&auto=format&fit=crop",
      target: "/cv/taylor-wright",
    },
    {
      title: "Sam Rivera",
      role: "Marketing Specialist",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
      target: "/cv/sam-rivera",
    }
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          CV Showcase - See Examples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseItems.map((item, index) => (
            <ShowcaseItem
              key={item.title}
              title={item.title}
              role={item.role}
              image={item.image}
              target={item.target}
              index={index}
            />
          ))}
        </div>

        <CTA/>
        
      </div>
    </section>
  );
};

export default ShowcaseSection;
