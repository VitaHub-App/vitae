import { useState } from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import CookiePopup from './CookiePopup';
import TermsOfServicePopup from './TermsOfServicePopup.tsx';
import PrivacyPolicyPopup from './PrivacyPolicyPopup.tsx';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [cookiePopupOpen, setCookiePopupOpen] = useState(false);
  const [termsOfServicePopupOpen, setTermsOfServicePopupOpen] = useState(false);
  const [privacyPolicyPopupOpen, setPrivacyPolicyPopupOpen] = useState(false);

  return (
    <footer className="bg-secondary text-secondary-foreground py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center space-x-2 text-xl font-semibold mb-4">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold">CV</span>
              </div>
              <span>Vita<span className="text-primary">Hub</span></span>
            </div>
            <p className="text-secondary-foreground/80 max-w-md">
              A modern platform for creating and sharing professional CVs. Built with simplicity and elegance in mind.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com/vitahub-app" className="text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
                <Github size={20} />
                <span className="sr-only">Github</span>
              </a>
            </div>
          </div>
          
          <div className="md:ml-auto">
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#showcase" className="text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
                  Showcase
                </a>
              </li>
              <li>
                <a href="#faq" className="text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="/template" className="text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
                  CV Template
                </a>
              </li>
              <li>
                <a href="https://github.com/VitaHub-App/vitae#readme" className="text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/VitaHub-App/vitae" className="text-secondary-foreground/80 hover:text-primary-foreground transition-colors">
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-secondary-foreground/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-secondary-foreground/60 mb-4 md:mb-0">
            © {currentYear} VitaHub. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <button 
              onClick={() => setTermsOfServicePopupOpen(true)}
              className="text-sm text-secondary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              Privacy
            </button>
            <button 
              onClick={() => setCookiePopupOpen(true)}
              className="text-sm text-secondary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              Cookies
            </button>
            <button 
              onClick={() => setPrivacyPolicyPopupOpen(true)}
              className="text-sm text-secondary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              Privacy
            </button>
          </div>
        </div>
      </div>
      
      <CookiePopup open={cookiePopupOpen} onOpenChange={setCookiePopupOpen} />
      <PrivacyPolicyPopup open={privacyPolicyPopupOpen} onOpenChange={setPrivacyPolicyPopupOpen} />
      <TermsOfServicePopup open={termsOfServicePopupOpen} onOpenChange={setTermsOfServicePopupOpen} />
    </footer>
  );
}
