
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ClipboardList, Save } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  notes: string;
}

export const DigitalChecklist = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "1", label: "Site safety check completed", checked: false, notes: "" },
    { id: "2", label: "Equipment inspection done", checked: false, notes: "" },
    { id: "3", label: "Materials properly stored", checked: false, notes: "" },
    { id: "4", label: "PPE requirements met", checked: false, notes: "" },
    { id: "5", label: "Environmental controls in place", checked: false, notes: "" },
  ]);

  const handleSave = () => {
    const completed = checklist.filter(item => item.checked).length;
    toast({
      title: "Checklist Saved",
      description: `${completed} of ${checklist.length} items completed`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Daily Site Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checklist.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={(checked) => {
                    setChecklist(prev =>
                      prev.map(i =>
                        i.id === item.id ? { ...i, checked: checked as boolean } : i
                      )
                    );
                  }}
                />
                <label className="text-sm font-medium leading-none">
                  {item.label}
                </label>
              </div>
              <Input
                placeholder="Add notes..."
                value={item.notes}
                onChange={(e) => {
                  setChecklist(prev =>
                    prev.map(i =>
                      i.id === item.id ? { ...i, notes: e.target.value } : i
                    )
                  );
                }}
                className="ml-6"
              />
            </div>
          ))}
          
          <Button onClick={handleSave} className="w-full mt-4">
            <Save className="w-4 h-4 mr-2" />
            Save Checklist
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
