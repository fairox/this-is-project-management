import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Pencil, Save, X, Calendar, User, MapPin, 
  ClipboardCheck, AlertTriangle, CheckCircle2, Clock
} from "lucide-react";
import { format } from "date-fns";
import { Inspection, useUpdateInspection, useDeleteInspection } from "@/hooks/useInspections";
import { toast } from "sonner";

interface InspectionDetailDialogProps {
  inspection: Inspection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const inspectionTypes = [
  { value: "safety", label: "Safety" },
  { value: "structural", label: "Structural" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "fire", label: "Fire Safety" },
  { value: "quality", label: "Quality" },
  { value: "regulatory", label: "Regulatory" },
];

const inspectionStatuses = [
  { value: "scheduled", label: "Scheduled", color: "bg-blue-500" },
  { value: "in_progress", label: "In Progress", color: "bg-yellow-500" },
  { value: "completed", label: "Completed", color: "bg-green-500" },
  { value: "failed", label: "Failed", color: "bg-red-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-muted" },
];

const priorityOptions = [
  { value: "low", label: "Low", color: "bg-muted text-muted-foreground" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
];

export function InspectionDetailDialog({ 
  inspection, 
  open, 
  onOpenChange 
}: InspectionDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    status: "",
    priority: "",
    scheduled_date: "",
    completed_date: "",
    inspector_name: "",
    location: "",
    notes: "",
    pass_rate: "",
  });

  const updateInspection = useUpdateInspection();
  const deleteInspection = useDeleteInspection();

  useEffect(() => {
    if (inspection) {
      setFormData({
        type: inspection.type,
        status: inspection.status,
        priority: inspection.priority,
        scheduled_date: inspection.scheduled_date,
        completed_date: inspection.completed_date || "",
        inspector_name: inspection.inspector_name,
        location: inspection.location || "",
        notes: inspection.notes || "",
        pass_rate: inspection.pass_rate?.toString() || "",
      });
      setIsEditing(false);
    }
  }, [inspection]);

  if (!inspection) return null;

  const handleSave = () => {
    updateInspection.mutate({
      id: inspection.id,
      type: formData.type as Inspection["type"],
      status: formData.status as Inspection["status"],
      priority: formData.priority as Inspection["priority"],
      scheduled_date: formData.scheduled_date,
      completed_date: formData.completed_date || null,
      inspector_name: formData.inspector_name,
      location: formData.location || null,
      notes: formData.notes || null,
      pass_rate: formData.pass_rate ? parseFloat(formData.pass_rate) : null,
    }, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this inspection?")) {
      deleteInspection.mutate(inspection.id, {
        onSuccess: () => {
          onOpenChange(false);
        }
      });
    }
  };

  const handleCancel = () => {
    if (inspection) {
      setFormData({
        type: inspection.type,
        status: inspection.status,
        priority: inspection.priority,
        scheduled_date: inspection.scheduled_date,
        completed_date: inspection.completed_date || "",
        inspector_name: inspection.inspector_name,
        location: inspection.location || "",
        notes: inspection.notes || "",
        pass_rate: inspection.pass_rate?.toString() || "",
      });
    }
    setIsEditing(false);
  };

  const getStatusInfo = (status: string) => {
    return inspectionStatuses.find(s => s.value === status) || inspectionStatuses[0];
  };

  const getPriorityInfo = (priority: string) => {
    return priorityOptions.find(p => p.value === priority) || priorityOptions[1];
  };

  const statusInfo = getStatusInfo(formData.status);
  const priorityInfo = getPriorityInfo(formData.priority);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-0 rounded-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {isEditing ? "Edit Inspection" : "Inspection Details"}
            </DialogTitle>
            {!isEditing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 rounded-full"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status and Priority Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {isEditing ? (
              <>
                <Select 
                  value={formData.status} 
                  onValueChange={(v) => setFormData({...formData, status: v})}
                >
                  <SelectTrigger className="w-32 h-8 rounded-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {inspectionStatuses.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  value={formData.priority} 
                  onValueChange={(v) => setFormData({...formData, priority: v})}
                >
                  <SelectTrigger className="w-24 h-8 rounded-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <>
                <Badge className={`${statusInfo.color} text-white rounded-full px-3`}>
                  {statusInfo.label}
                </Badge>
                <Badge className={`${priorityInfo.color} rounded-full px-3`}>
                  {priorityInfo.label} Priority
                </Badge>
              </>
            )}
          </div>

          <Separator />

          {/* Type */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Inspection Type
            </Label>
            {isEditing ? (
              <Select 
                value={formData.type} 
                onValueChange={(v) => setFormData({...formData, type: v})}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {inspectionTypes.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="font-medium capitalize">{formData.type} Inspection</p>
            )}
          </div>

          {/* Scheduled Date */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled Date
            </Label>
            {isEditing ? (
              <Input
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                className="rounded-xl"
              />
            ) : (
              <p className="font-medium">
                {format(new Date(formData.scheduled_date), 'EEEE, MMMM d, yyyy')}
              </p>
            )}
          </div>

          {/* Completed Date (only show if completed or in edit mode) */}
          {(formData.status === 'completed' || formData.status === 'failed' || isEditing) && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Completed Date
              </Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.completed_date}
                  onChange={(e) => setFormData({...formData, completed_date: e.target.value})}
                  className="rounded-xl"
                />
              ) : formData.completed_date ? (
                <p className="font-medium">
                  {format(new Date(formData.completed_date), 'EEEE, MMMM d, yyyy')}
                </p>
              ) : (
                <p className="text-muted-foreground italic">Not yet completed</p>
              )}
            </div>
          )}

          {/* Inspector */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Inspector
            </Label>
            {isEditing ? (
              <Input
                value={formData.inspector_name}
                onChange={(e) => setFormData({...formData, inspector_name: e.target.value})}
                placeholder="Inspector name"
                className="rounded-xl"
              />
            ) : (
              <p className="font-medium">{formData.inspector_name}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            {isEditing ? (
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Inspection location"
                className="rounded-xl"
              />
            ) : (
              <p className="font-medium">{formData.location || "No location specified"}</p>
            )}
          </div>

          {/* Pass Rate (only for completed inspections) */}
          {(formData.status === 'completed' || formData.status === 'failed' || isEditing) && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Pass Rate
              </Label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.pass_rate}
                    onChange={(e) => setFormData({...formData, pass_rate: e.target.value})}
                    placeholder="0-100"
                    className="rounded-xl w-24"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              ) : (
                <p className="font-medium">
                  {formData.pass_rate ? `${formData.pass_rate}%` : "Not evaluated"}
                </p>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Notes</Label>
            {isEditing ? (
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes..."
                className="rounded-xl min-h-[80px]"
              />
            ) : (
              <p className="text-sm">{formData.notes || "No notes added"}</p>
            )}
          </div>

          {/* Timestamps */}
          {!isEditing && (
            <div className="pt-2 text-xs text-muted-foreground flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Created: {format(new Date(inspection.created_at), 'MMM d, yyyy')}
              </span>
              <span>
                Updated: {format(new Date(inspection.updated_at), 'MMM d, yyyy')}
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="rounded-full"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateInspection.isPending}
                className="rounded-full bg-[hsl(65,70%,75%)] text-foreground hover:bg-[hsl(65,70%,65%)]"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateInspection.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteInspection.isPending}
                className="rounded-full"
              >
                {deleteInspection.isPending ? "Deleting..." : "Delete"}
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="rounded-full"
              >
                Close
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
