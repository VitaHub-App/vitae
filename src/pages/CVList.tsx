
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, FileText, ChevronRight } from 'lucide-react';
import { availableLanguages } from '@/data/languages';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// In a real implementation, this would be populated from build-time processing of markdown files
const availableCVs = [
  {
    name: 'Alex Morgan',
    title: 'Senior Product Designer',
    slug: 'alex-morgan',
    languages: ['en', 'es', 'fr', 'de'],
    updatedAt: '2023-10-15'
  },
  {
    name: 'Jamie Smith',
    title: 'Full Stack Developer',
    slug: 'jamie-smith',
    languages: ['en', 'de'],
    updatedAt: '2023-09-28'
  },
  {
    name: 'Taylor Johnson',
    title: 'Marketing Manager',
    slug: 'taylor-johnson',
    languages: ['en', 'fr'],
    updatedAt: '2023-10-05'
  }
];

const CVList = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 bg-accent/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">CV Repository</h1>
            <p className="text-lg text-muted-foreground">
              Browse our collection of professionally formatted CVs, published and maintained through Git.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCVs.map((cv) => (
              <div key={cv.slug} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-1">{cv.name}</h2>
                  <p className="text-primary mb-4">{cv.title}</p>
                  
                  <div className="flex items-center mb-4 text-sm text-muted-foreground">
                    <FileText size={16} className="mr-1" />
                    <span>Last updated: {cv.updatedAt}</span>
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <Globe size={16} className="text-primary mr-2" />
                    <div className="flex flex-wrap gap-2">
                      {cv.languages.map(lang => {
                        const langInfo = availableLanguages.find(l => l.code === lang);
                        return langInfo ? (
                          <span key={lang} className="inline-flex items-center">
                            {langInfo.flag} <span className="ml-1 text-sm">{langInfo.name}</span>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  <Link 
                    to={`/template?name=${cv.slug}`} 
                    className="flex items-center text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>View CV</span>
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-card border border-border rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Publish Your Own CV</h2>
            <p className="mb-4">
              Want to add your CV to our repository? It's easy! Just follow these steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2 mb-6">
              <li>Fork our GitHub repository</li>
              <li>Create your CV using our markdown template</li>
              <li>Add translations by creating language-specific files (e.g., <code>your_name_fr.md</code>)</li>
              <li>Submit a pull request</li>
            </ol>
            <a 
              href="https://github.com/example/cv-repository" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Get Started on GitHub
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CVList;
