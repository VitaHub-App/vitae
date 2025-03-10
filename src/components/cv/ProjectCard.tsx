
import { Project } from '@/types/cv';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="border border-border rounded-lg p-5 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <span className="text-sm text-muted-foreground">{project.period}</span>
      </div>
      <p className="text-foreground/80 mb-3">{project.description}</p>
      {project.details && project.details.length > 0 && (
        <ul className="list-disc pl-5 pb-5 space-y-1 text-foreground/80">
          {project.details.map((detail, idx) => (
            <li key={idx}>{detail}</li>
          ))}
        </ul>
      )}
      <div className="mb-2">
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, idx) => (
            <span key={idx} className="px-2 py-1 bg-accent text-xs rounded-md">
              {tech}
            </span>
          ))}
          {project.link && (
            <a 
              href={`https://${project.link}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary pl-10 hover:text-primary/80 transition-colors"
            >
              View Project →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
