
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Upload, Download, Eye } from "lucide-react";

export function ContractDocuments() {
  const isMobile = useIsMobile();
  
  const contracts = [
    {
      id: "1",
      name: "Main Construction Contract",
      type: "Primary Contract",
      status: "Active",
      lastUpdated: "2024-03-20",
      size: "2.4 MB"
    },
    {
      id: "2",
      name: "Subcontractor Agreement",
      type: "Subcontract",
      status: "Under Review",
      lastUpdated: "2024-03-18",
      size: "1.8 MB"
    }
  ];

  // Mobile card view for contracts
  const MobileContractCard = ({ contract }: { contract: typeof contracts[0] }) => (
    <Card className="p-4 mb-3 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="font-medium text-left text-sm">{contract.name}</div>
        <div className="flex">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-xs sm:text-sm grid grid-cols-2 gap-y-2 text-left mt-2">
        <span className="text-muted-foreground">Type:</span>
        <span>{contract.type}</span>
        <span className="text-muted-foreground">Status:</span>
        <span>{contract.status}</span>
        <span className="text-muted-foreground">Updated:</span>
        <span>{contract.lastUpdated}</span>
        <span className="text-muted-foreground">Size:</span>
        <span>{contract.size}</span>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <Card className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-base md:text-xl font-semibold">Contract Documents</h2>
          </div>
          <Button size={isMobile ? "sm" : "default"} className={isMobile ? "h-8 text-xs" : "h-10"}>
            <Upload className="h-3 w-3 mr-1 md:h-4 md:w-4 md:mr-2" />
            {isMobile ? "Upload" : "Upload Contract"}
          </Button>
        </div>

        {isMobile ? (
          <div>
            {contracts.map((contract) => (
              <MobileContractCard key={contract.id} contract={contract} />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium" data-label="Name">{contract.name}</TableCell>
                  <TableCell data-label="Type">{contract.type}</TableCell>
                  <TableCell data-label="Status">{contract.status}</TableCell>
                  <TableCell data-label="Last Updated">{contract.lastUpdated}</TableCell>
                  <TableCell data-label="Size">{contract.size}</TableCell>
                  <TableCell data-label="Actions">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
