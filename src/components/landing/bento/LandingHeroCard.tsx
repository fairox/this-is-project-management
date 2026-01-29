import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingHeroCard() {
  return (
    <div className="bg-[hsl(65,70%,75%)] rounded-3xl p-8 flex flex-col h-full min-h-[400px] relative overflow-hidden group">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-foreground/5" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-foreground/5" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-8">
          <span className="text-sm font-medium text-foreground/70 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full">
            Construction Management
          </span>
          <Link 
            to="/dashboard" 
            className="h-12 w-12 rounded-full bg-foreground flex items-center justify-center hover:scale-105 transition-transform"
          >
            <ArrowUpRight className="h-5 w-5 text-background" />
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
            Design X
            <br />
            <span className="text-foreground/80">Threshold</span>
          </h1>
          <p className="text-lg text-foreground/70 mt-6 max-w-md">
            Comprehensive project management for architects, contractors, and financial institutions.
          </p>
        </div>

        <div className="flex gap-3 mt-8">
          <Link 
            to="/dashboard"
            className="bg-foreground text-background px-6 py-3 rounded-full font-medium hover:bg-foreground/90 transition-colors"
          >
            Get Started
          </Link>
          <button className="bg-card/80 backdrop-blur-sm text-foreground px-6 py-3 rounded-full font-medium hover:bg-card transition-colors">
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
}
