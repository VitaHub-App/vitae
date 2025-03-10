
import { Plugin } from 'vite';
import { generateCVDataFromMarkdown } from '../utils/markdownProcessor';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve(process.env.OUTPUT_DIR || './src/data/generated');

// This plugin will process markdown files at build time
export function markdownCVPlugin(): Plugin {
  return {
    name: 'markdown-cv-plugin',
    
    // This hook runs before the build starts
    buildStart: async () => {
      // Create the output directory if it doesn't exist
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }
      
      // Process the markdown files
      const cvs = await generateCVDataFromMarkdown();
      
      // Write the result to a JSON file
      fs.writeFileSync(
        path.resolve(OUTPUT_DIR, 'cvs.json'),
        JSON.stringify(cvs, null, 2)
      );
    },
  };
}
