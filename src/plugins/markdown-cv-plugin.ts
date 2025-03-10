
import { Plugin } from 'vite';
import { generateCVDataFromMarkdown } from '../utils/markdownProcessor';
import fs from 'fs';
import path from 'path';

// This plugin will process markdown files at build time
export function markdownCVPlugin(): Plugin {
  return {
    name: 'markdown-cv-plugin',
    
    // This hook runs before the build starts
    buildStart: async () => {
      console.log('Processing markdown CV files...');
      try {
        // Create the output directory if it doesn't exist
        const outputDir = path.resolve('./src/data/generated');
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Process the markdown files
        const cvs = await generateCVDataFromMarkdown();
        
        // Write the result to a JSON file
        fs.writeFileSync(
          path.resolve(outputDir, 'cvs.json'),
          JSON.stringify(cvs, null, 2)
        );
        
        console.log('Successfully processed markdown CV files');
      } catch (error) {
        console.error('Error processing markdown CV files:', error);
      }
    },
  };
}
