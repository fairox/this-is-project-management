import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface Equipment {
  id: string;
  name: string;
  type: "heavy" | "light" | "tool";
  status: "available" | "in-use" | "maintenance";
  project?: string;
  condition: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  project?: string;
  reorderPoint: number;
}

const equipment: Equipment[] = [
  {
    id: "1",
    name: "Excavator CAT 320",
    type: "heavy",
    status: "in-use",
    project: "Office Tower Development",
    condition: 85,
    lastMaintenance: "2024-02-15",
    nextMaintenance: "2024-03-15"
  },
  {
    id: "2",
    name: "Concrete Mixer",
    type: "heavy",
    status: "available",
    condition: 90,
    lastMaintenance: "2024-02-20",
    nextMaintenance: "2024-03-20"
  },
  {
    id: "3",
    name: "Power Drill Set",
    type: "tool",
    status: "maintenance",
    condition: 60,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-02-15"
  }
];

const materials: Material[] = [
  {
    id: "1",
    name: "Cement",
    category: "Building Materials",
    quantity: 500,
    unit: "bags",
    project: "Office Tower Development",
    reorderPoint: 100
  },
  {
    id: "2",
    name: "Steel Rebar",
    category: "Structural",
    quantity: 1000,
    unit: "pieces",
    project: "Retail Complex Phase 1",
    reorderPoint: 200
  },
  {
    id: "3",
    name: "Bricks",
    category: "Building Materials",
    quantity: 5000,
    unit: "pieces",
    reorderPoint: 1000
  }
];

export function EquipmentMaterial() {
  const { toast } = useToast();

  const getStatusColor = (status: Equipment["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "in-use":
        return "bg-blue-500";
      case "maintenance":
        return "bg-yellow-500";
    }
  };

  const getQuantityStatus = (quantity: number, reorderPoint: number) => {
    if (quantity <= reorderPoint) return "bg-red-500";
    if (quantity <= reorderPoint * 1.5) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleEquipmentClick = (equipment: Equipment) => {
    toast({
      title: "Equipment Details",
      description: `${equipment.name} is ${equipment.status}${equipment.project ? ` and assigned to ${equipment.project}` : ""}. Next maintenance: ${new Date(equipment.nextMaintenance).toLocaleDateString()}`,
    });
  };

  const handleMaterialClick = (material: Material) => {
    toast({
      title: "Material Details",
      description: `${material.name}: ${material.quantity} ${material.unit} available${material.project ? ` (allocated to ${material.project})` : ""}`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Equipment Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Equipment</h2>
          <Badge variant="outline" className="px-4">
            {equipment.length} Items
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {equipment.map((item) => (
            <Card
              key={item.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleEquipmentClick(item)}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Condition</span>
                    <span>{item.condition}%</span>
                  </div>
                  <Progress value={item.condition} className="h-2" />
                </div>
                {item.project && (
                  <p className="text-sm text-gray-500">
                    Assigned to: {item.project}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Materials Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Materials</h2>
          <Badge variant="outline" className="px-4">
            {materials.length} Items
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {materials.map((item) => (
            <Card
              key={item.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleMaterialClick(item)}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <Badge className={getQuantityStatus(item.quantity, item.reorderPoint)}>
                    {item.quantity} {item.unit}
                  </Badge>
                </div>
                {item.project && (
                  <p className="text-sm text-gray-500">
                    Allocated to: {item.project}
                  </p>
                )}
                <div className="text-sm text-gray-500">
                  Reorder Point: {item.reorderPoint} {item.unit}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}