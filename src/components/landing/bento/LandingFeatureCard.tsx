import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface LandingFeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  variant?: "default" | "accent" | "dark" | "muted";
  size?: "default" | "large";
}

export function LandingFeatureCard({
  title,
  description,
  icon: Icon,
  link,
  variant = "default",
  size = "default",
}: LandingFeatureCardProps) {
  const bgClass = {
    default: "bg-card",
    accent: "bg-[hsl(65,70%,75%)]",
    dark: "bg-foreground",
    muted: "bg-[hsl(80,15%,70%)]",
  }[variant];

  const textClass = variant === "dark" ? "text-background" : "text-foreground";
  const subTextClass = variant === "dark" ? "text-background/70" : "text-muted-foreground";
  const iconBgClass = {
    default: "bg-muted",
    accent: "bg-foreground/10",
    dark: "bg-background/10",
    muted: "bg-foreground/10",
  }[variant];

  return (
    <Link
      to={link}
      className={`${bgClass} rounded-3xl p-6 flex flex-col justify-between h-full ${
        size === "large" ? "min-h-[240px]" : "min-h-[180px]"
      } group transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in`}
    >
      <div className="flex items-start justify-between">
        <div className={`${iconBgClass} h-14 w-14 rounded-2xl flex items-center justify-center`}>
          <Icon className={`h-7 w-7 ${textClass}`} />
        </div>
        <div className={`h-10 w-10 rounded-full ${iconBgClass} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0`}>
          <ArrowRight className={`h-5 w-5 ${textClass}`} />
        </div>
      </div>

      <div className="mt-auto">
        <h3 className={`font-bold text-xl ${textClass}`}>{title}</h3>
        <p className={`text-sm mt-2 ${subTextClass}`}>{description}</p>
      </div>
    </Link>
  );
}
