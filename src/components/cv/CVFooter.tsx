
import { Link } from 'react-router-dom';

export default function CVFooter() {
  return (
    <div className="mt-10 text-center text-muted-foreground text-sm">
      <p className="mb-2">
        This CV was created using markdown and Git-based publishing.
      </p>
      <p>
        <Link to="/" className="text-primary hover:text-primary/80 transition-colors">
          Learn more about our platform
        </Link>
      </p>
    </div>
  );
}
