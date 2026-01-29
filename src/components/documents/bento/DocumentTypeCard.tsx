import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface DocumentTypeCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  link?: string;
  variant?: "default" | "accent" | "dark";
}

export function DocumentTypeCard({
  title,
  count,
  icon: Icon,
  link = "#",
  variant = "default",
}: DocumentTypeCardProps) {
  const bgClass = {
    default: "bg-card",
    accent: "bg-[hsl(65,70%,75%)]",
    dark: "bg-foreground text-background",
  }[variant];

  return (
    <Link 
      to={link} 
      className={`${bgClass} rounded-3xl p-6 flex flex-col justify-between h-full min-h-[160px] group transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
          variant === "dark" ? "bg-background/10" : variant === "accent" ? "bg-foreground/10" : "bg-muted"
        }`}>
          <Icon className={`h-6 w-6 ${variant === "dark" ? "text-background" : "text-foreground"}`} />
        </div>
        <span className={`text-2xl font-bold ${variant === "dark" ? "text-background" : "text-foreground"}`}>
          {count}
        </span>
      </div>
      
      <div className="flex items-end justify-between">
        <h3 className={`font-bold text-lg ${variant === "dark" ? "text-background" : "text-foreground"}`}>
          {title}
        </h3>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${
          variant === "dark" ? "bg-background/10" : "bg-muted"
        }`}>
          <ArrowRight className={`h-4 w-4 ${variant === "dark" ? "text-background" : "text-foreground"}`} />
        </div>
      </div>
    </Link>
  );
}
