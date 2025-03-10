
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

function FAQItem({ question, answer, isOpen, onClick, index }: FAQItemProps) {
  return (
    <div 
      className={cn(
        "border border-border rounded-lg mb-4 overflow-hidden transition-all duration-300 animate-fade-in animate-in",
        isOpen ? "shadow-sm" : ""
      )}
      style={{ ['--index' as any]: index }}
    >
      <button
        className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-medium">{question}</h3>
        <span className="text-primary">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <p className="px-6 pb-6 text-muted-foreground">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  
  const faqs = [
    {
      question: "How do I get started with creating my CV?",
      answer: "To get started, simply fork our GitHub repository, create your CV using our markdown template, and submit a pull request. Your CV will be reviewed and published once approved."
    },
    {
      question: "Do I need to know Git to use this platform?",
      answer: "Basic Git knowledge is helpful but not required. We provide detailed documentation to guide you through the process, and you can also use GitHub's web interface for simple edits."
    },
    {
      question: "How can I update my CV after it's published?",
      answer: "You can update your CV at any time by submitting a new pull request with your changes. Once approved, your CV will be automatically updated on our platform."
    },
    {
      question: "Is there a cost to use this service?",
      answer: "Our basic service is completely free. We offer premium features for organizations and power users, but the core functionality of creating and hosting your CV is available at no cost."
    },
    {
      question: "Can I customize the design of my CV?",
      answer: "While the overall design is consistent across all CVs for a professional look, you can customize certain elements like colors and layout options through configuration in your markdown file."
    }
  ];

  return (
    <section id="faq" className="py-20 px-6 bg-accent/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about our platform.
          </p>
        </div>
        
        <div>
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              index={index}
            />
          ))}
        </div>
        
        <div className="mt-10 text-center animate-fade-in" style={{ ['--index' as any]: 5 }}>
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help.
          </p>
          <a 
            href="#" 
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
