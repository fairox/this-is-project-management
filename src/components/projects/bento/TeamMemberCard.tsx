import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

interface TeamMemberCardProps {
  name?: string;
  role?: string;
  imageUrl?: string;
}

export function TeamMemberCard({
  name = "Smart",
  role = "Assistant",
  imageUrl = "/lovable-uploads/169f31b7-148d-45f3-aa09-967fbcae3b16.png",
}: TeamMemberCardProps) {
  return (
    <div className="bg-card rounded-3xl overflow-hidden flex flex-col h-full min-h-[200px] relative group">
      {/* Arrow Button */}
      <button 
        onClick={() => toast.info(`${name}`, { description: `Viewing ${role} details...` })}
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-[hsl(65,70%,75%)] flex items-center justify-center z-10 hover:scale-110 transition-transform"
      >
        <ArrowUpRight className="h-5 w-5 text-foreground" />
      </button>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mt-auto">
          <p className="text-sm text-muted-foreground">AI</p>
          <p className="text-xl font-bold text-foreground">{name}</p>
          <p className="text-muted-foreground">{role}</p>
        </div>
      </div>

      {/* Image */}
      <div className="absolute bottom-0 right-0 w-2/3 h-2/3">
        <div 
          className="absolute inset-0 bg-gradient-to-tl from-[hsl(65,70%,75%)]/40 to-transparent rounded-tl-[80px]"
        />
        <img
          src={imageUrl}
          alt={`${name} ${role}`}
          className="w-full h-full object-cover object-top rounded-tl-[60px]"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>
    </div>
  );
}
