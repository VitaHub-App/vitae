import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

const ThankYou = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("Thank you page accessed from:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/30">
      <div className="text-center max-w-md px-4">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Your message has been successfully submitted. We'll get back to you shortly.
        </p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default ThankYou;
