import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, AlertCircle } from "lucide-react";
import { addItem } from "@/lib/localStorage";

const projectSchema = z.object({
  name: z.string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must not exceed 100 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  budget: z.string()
    .refine((val) => !isNaN(Number(val)), "Must be a valid number")
    .refine((val) => Number(val) > 0, "Budget must be greater than 0"),
  startDate: z.string()
    .min(1, "Start date is required")
    .refine((date) => new Date(date) >= new Date(), "Start date must be in the future"),
  endDate: z.string()
    .min(1, "End date is required")
    .refine((date) => new Date(date) >= new Date(), "End date must be in the future"),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Priority is required",
  }),
  hasRequiredPermits: z.enum(["yes", "no", "pending"], {
    required_error: "Permit status is required",
  }),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectIntakeForm() {
  const [open, setOpen] = useState(false);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      budget: "",
      startDate: "",
      endDate: "",
      priority: "medium",
      hasRequiredPermits: "pending",
    },
  });

  const onSubmit = (values: ProjectFormValues) => {
    // Validate dates
    const startDate = new Date(values.startDate);
    const endDate = new Date(values.endDate);
    
    if (endDate <= startDate) {
      form.setError("endDate", {
        type: "manual",
        message: "End date must be after start date",
      });
      return;
    }

    // Create new project with vetting status
    const newProject = {
      id: crypto.randomUUID(),
      name: values.name,
      description: values.description,
      status: 'active' as const,
      vettingStatus: 'pending' as const,
      progress: 0,
      startDate: values.startDate,
      endDate: values.endDate,
      budget: Number(values.budget),
      priority: values.priority,
      hasRequiredPermits: values.hasRequiredPermits,
      reviewNotes: '',
      reviewedBy: '',
      reviewDate: '',
    };

    // Add project to localStorage
    addItem('projects', newProject);
    
    toast.success("Project submitted for review!", {
      description: "Your project has been created and is pending approval.",
    });
    
    setOpen(false);
    form.reset();
  };

  const requirements = [
    { id: 1, label: "Project name (3-100 characters)" },
    { id: 2, label: "Detailed description (10-500 characters)" },
    { id: 3, label: "Valid budget amount (greater than 0)" },
    { id: 4, label: "Future start date" },
    { id: 5, label: "End date after start date" },
    { id: 6, label: "Priority level" },
    { id: 7, label: "Required permits status" },
  ];

  const checkRequirement = (id: number): boolean => {
    const values = form.getValues();
    switch (id) {
      case 1:
        return values.name.length >= 3 && values.name.length <= 100;
      case 2:
        return values.description.length >= 10 && values.description.length <= 500;
      case 3:
        return !isNaN(Number(values.budget)) && Number(values.budget) > 0;
      case 4:
        return new Date(values.startDate) >= new Date();
      case 5:
        return new Date(values.endDate) > new Date(values.startDate);
      case 6:
        return !!values.priority;
      case 7:
        return !!values.hasRequiredPermits;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Requirements Checklist:</h3>
          <ul className="space-y-2">
            {requirements.map((req) => (
              <li key={req.id} className="flex items-center text-sm">
                {checkRequirement(req.id) ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-gray-300 mr-2" />
                )}
                {req.label}
              </li>
            ))}
          </ul>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter project description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter budget" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="low" />
                        </FormControl>
                        <FormLabel className="font-normal">Low</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="medium" />
                        </FormControl>
                        <FormLabel className="font-normal">Medium</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="high" />
                        </FormControl>
                        <FormLabel className="font-normal">High</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasRequiredPermits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Permits Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="pending" />
                        </FormControl>
                        <FormLabel className="font-normal">Pending</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Submit for Review</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
