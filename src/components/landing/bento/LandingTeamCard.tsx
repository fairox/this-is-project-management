import { ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export function LandingTeamCard() {
  const team = [
    { name: "Sarah Chen", role: "Project Manager", avatar: "/lovable-uploads/169f31b7-148d-45f3-aa09-967fbcae3b16.png" },
    { name: "Michael Torres", role: "Lead Engineer", avatar: "/placeholder.svg" },
    { name: "Alex Rivera", role: "Architect", avatar: "/placeholder.svg" },
  ];

  return (
    <div className="bg-card rounded-3xl p-6 h-full min-h-[240px] flex flex-col animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">Our Team</h3>
          <p className="text-sm text-muted-foreground mt-1">Expert professionals</p>
        </div>
        <Link
          to="/dashboard"
          className="h-10 w-10 rounded-full bg-[hsl(65,70%,75%)] flex items-center justify-center hover:scale-105 transition-transform"
        >
          <ArrowUpRight className="h-4 w-4 text-foreground" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <div className="flex -space-x-4">
          {team.map((member, i) => (
            <Avatar key={i} className="h-16 w-16 border-4 border-card hover:z-10 hover:scale-110 transition-transform cursor-pointer">
              <AvatarImage src={member.avatar} alt={member.name} className="object-cover" />
              <AvatarFallback className="bg-[hsl(65,70%,75%)] text-foreground text-lg font-medium">
                {member.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          ))}
          <div className="h-16 w-16 rounded-full bg-muted border-4 border-card flex items-center justify-center">
            <span className="text-sm font-bold text-muted-foreground">+24</span>
          </div>
        </div>
      </div>
    </div>
  );
}
