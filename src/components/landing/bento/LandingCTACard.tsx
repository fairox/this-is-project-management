import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function LandingCTACard() {
  return (
    <div className="bg-[hsl(65,70%,75%)] rounded-3xl p-8 h-full min-h-[200px] flex flex-col justify-between relative overflow-hidden animate-fade-in group">
      {/* Decorative element */}
      <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-foreground/5" />
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-foreground">Ready to transform your project management?</h3>
        <p className="text-foreground/70 mt-2">Join leading construction firms today.</p>
      </div>

      <Link 
        to="/dashboard"
        className="relative z-10 inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-medium w-fit hover:gap-4 transition-all mt-4"
      >
        Start Now
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
