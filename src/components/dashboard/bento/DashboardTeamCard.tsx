import { ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardTeamCardProps {
  name?: string;
  role?: string;
  avatar?: string;
}

export function DashboardTeamCard({
  name = "Smart",
  role = "Assistant",
  avatar = "/lovable-uploads/fd700b65-bb51-4411-90a7-224db2676c90.png",
}: DashboardTeamCardProps) {
  return (
    <div className="bg-card rounded-3xl p-6 flex flex-col h-full min-h-[160px] relative overflow-hidden">
      {/* Arrow button */}
      <button className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[hsl(65,70%,75%)] flex items-center justify-center hover:bg-[hsl(65,70%,70%)] transition-colors">
        <ArrowUpRight className="h-4 w-4 text-foreground" />
      </button>

      {/* Content */}
      <div className="mt-auto">
        <p className="text-sm text-muted-foreground">AI</p>
        <p className="text-lg font-bold text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>

      {/* Avatar */}
      <div className="absolute bottom-0 right-0 w-24 h-24">
        <Avatar className="w-full h-full rounded-none rounded-tl-3xl">
          <AvatarImage src={avatar} className="object-cover" />
          <AvatarFallback className="rounded-none rounded-tl-3xl bg-[hsl(65,70%,75%)]">
            {name[0]}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
