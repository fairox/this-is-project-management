import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function LandingImageCard() {
  return (
    <div className="rounded-3xl overflow-hidden h-full min-h-[280px] relative group animate-fade-in">
      <img
        src="/lovable-uploads/d1d073aa-cd5c-4e38-ad99-553bb30c41bc.png"
        alt="Modern Construction"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-background/70 text-sm mb-2">Featured Project</p>
        <h3 className="text-background text-2xl font-bold">Metro Tower Complex</h3>
      </div>

      <Link 
        to="/projects"
        className="absolute top-4 right-4 h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center hover:bg-background/30 transition-colors"
      >
        <ArrowUpRight className="h-5 w-5 text-background" />
      </Link>
    </div>
  );
}
