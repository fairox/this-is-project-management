
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Stakeholder } from "@/types";
import { UserPlus } from "lucide-react";

interface AddStakeholderDialogProps {
  onAdd: (stakeholder: Stakeholder) => void;
}

export function AddStakeholderDialog({ onAdd }: AddStakeholderDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Stakeholder>>({
    role: "contractor",
    status: "active",
    onboardingStatus: "pending",
    projects: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStakeholder: Stakeholder = {
      id: crypto.randomUUID(),
      name: formData.name || "",
      role: formData.role || "contractor",
      organization: formData.organization || "",
      email: formData.email || "",
      phone: formData.phone || "",
      projects: formData.projects || [],
      status: formData.status || "active",
      onboardingStatus: formData.onboardingStatus || "pending",
      lastContact: new Date().toISOString(),
      notes: formData.notes || ""
    };
    onAdd(newStakeholder);
    setOpen(false);
    setFormData({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Stakeholder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Stakeholder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              required
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select
              value={formData.role}
              onValueChange={(value: Stakeholder["role"]) => 
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="authority">Authority</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="architect">Architect</SelectItem>
                <SelectItem value="engineer">Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Organization</label>
            <Input
              required
              value={formData.organization || ""}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              required
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input
              required
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full">Add Stakeholder</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
