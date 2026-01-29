
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StakeholderCommunication } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { MessageCircle, Calendar, Clock, Paperclip } from "lucide-react";

interface CommunicationLogProps {
  stakeholderId: string;
  projectId: string;
}

const mockCommunications: StakeholderCommunication[] = [
  {
    id: "1",
    stakeholderId: "1",
    projectId: "1",
    type: "meeting",
    date: "2024-03-20",
    summary: "Initial project kickoff meeting",
    nextSteps: "Follow up with detailed timeline",
  },
  {
    id: "2",
    stakeholderId: "1",
    projectId: "1",
    type: "email",
    date: "2024-03-21",
    summary: "Sent project specifications",
    attachments: ["specs.pdf"],
  },
];

export function CommunicationLog({ stakeholderId, projectId }: CommunicationLogProps) {
  const [communications, setCommunications] = useState<StakeholderCommunication[]>(mockCommunications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCommunication, setNewCommunication] = useState<Partial<StakeholderCommunication>>({
    type: "meeting",
    stakeholderId,
    projectId,
  });
  const { toast } = useToast();

  const handleAddCommunication = (e: React.FormEvent) => {
    e.preventDefault();
    const communication: StakeholderCommunication = {
      id: crypto.randomUUID(),
      stakeholderId,
      projectId,
      type: newCommunication.type || "meeting",
      date: newCommunication.date || new Date().toISOString().split("T")[0],
      summary: newCommunication.summary || "",
      nextSteps: newCommunication.nextSteps,
      attachments: newCommunication.attachments,
    };

    setCommunications([communication, ...communications]);
    setIsDialogOpen(false);
    setNewCommunication({ type: "meeting", stakeholderId, projectId });
    
    toast({
      title: "Communication Logged",
      description: "New communication has been successfully recorded.",
    });
  };

  const getTypeColor = (type: StakeholderCommunication["type"]) => {
    const colors = {
      meeting: "bg-blue-100 text-blue-800",
      email: "bg-green-100 text-green-800",
      call: "bg-yellow-100 text-yellow-800",
      "site-visit": "bg-purple-100 text-purple-800",
    };
    return colors[type];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Communication Log</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageCircle className="mr-2 h-4 w-4" />
              Log Communication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Communication Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCommunication} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={newCommunication.type}
                  onValueChange={(value: StakeholderCommunication["type"]) =>
                    setNewCommunication({ ...newCommunication, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="site-visit">Site Visit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={newCommunication.date}
                  onChange={(e) =>
                    setNewCommunication({ ...newCommunication, date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Summary</label>
                <Textarea
                  value={newCommunication.summary}
                  onChange={(e) =>
                    setNewCommunication({ ...newCommunication, summary: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Next Steps</label>
                <Textarea
                  value={newCommunication.nextSteps}
                  onChange={(e) =>
                    setNewCommunication({ ...newCommunication, nextSteps: e.target.value })
                  }
                />
              </div>

              <Button type="submit" className="w-full">Add Entry</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {communications.map((comm) => (
          <Card key={comm.id} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <Badge className={getTypeColor(comm.type)}>{comm.type}</Badge>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {new Date(comm.date).toLocaleDateString()}
                </div>
              </div>

              <p className="text-sm">{comm.summary}</p>

              {comm.nextSteps && (
                <div className="text-sm">
                  <span className="font-medium">Next Steps:</span> {comm.nextSteps}
                </div>
              )}

              {comm.attachments && comm.attachments.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Paperclip className="h-4 w-4" />
                  {comm.attachments.join(", ")}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
