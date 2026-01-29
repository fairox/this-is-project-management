import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCheck, Save } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  notes: string;
}

export function DigitalInspection() {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "1", label: "Structural integrity verified", checked: false, notes: "" },
    { id: "2", label: "Material quality checked", checked: false, notes: "" },
    { id: "3", label: "Safety equipment in place", checked: false, notes: "" },
    { id: "4", label: "Environmental compliance verified", checked: false, notes: "" },
  ]);

  const handleSave = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Inspection Saved",
      description: `Completed items: ${checklist.filter(item => item.checked).length}/${checklist.length}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          Digital Inspection Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checklist.map((item) => (
            <div key={item.id} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={(checked) => {
                    setChecklist(checklist.map((i) =>
                      i.id === item.id ? { ...i, checked: checked as boolean } : i
                    ));
                  }}
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {item.label}
                </label>
              </div>
              <Input
                placeholder="Add notes..."
                value={item.notes}
                onChange={(e) => {
                  setChecklist(checklist.map((i) =>
                    i.id === item.id ? { ...i, notes: e.target.value } : i
                  ));
                }}
                className="ml-6"
              />
            </div>
          ))}
          
          <Button onClick={handleSave} className="w-full mt-4">
            <Save className="h-4 w-4 mr-2" />
            Save Inspection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}