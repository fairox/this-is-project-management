import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Inspection } from "@/hooks/useInspections";
import { format } from "date-fns";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InspectionExportProps {
  inspections: Inspection[];
  disabled?: boolean;
}

export function InspectionExport({ inspections, disabled }: InspectionExportProps) {
  const formatInspectionForExport = (inspection: Inspection) => ({
    type: inspection.type,
    status: inspection.status.replace("_", " "),
    priority: inspection.priority,
    scheduled_date: format(new Date(inspection.scheduled_date), "yyyy-MM-dd"),
    completed_date: inspection.completed_date
      ? format(new Date(inspection.completed_date), "yyyy-MM-dd")
      : "",
    inspector: inspection.inspector_name,
    location: inspection.location || "",
    pass_rate: inspection.pass_rate !== null ? `${inspection.pass_rate}%` : "",
    notes: inspection.notes || "",
  });

  const exportToCSV = () => {
    if (inspections.length === 0) {
      toast.error("No inspections to export");
      return;
    }

    const headers = [
      "Type",
      "Status",
      "Priority",
      "Scheduled Date",
      "Completed Date",
      "Inspector",
      "Location",
      "Pass Rate",
      "Notes",
    ];

    const rows = inspections.map(formatInspectionForExport);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        [
          row.type,
          row.status,
          row.priority,
          row.scheduled_date,
          row.completed_date,
          `"${row.inspector}"`,
          `"${row.location}"`,
          row.pass_rate,
          `"${row.notes.replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `inspections_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${inspections.length} inspections to CSV`);
  };

  const exportToPDF = () => {
    if (inspections.length === 0) {
      toast.error("No inspections to export");
      return;
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Inspection Report", 14, 22);

    // Subtitle with date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`, 14, 30);
    doc.text(`Total inspections: ${inspections.length}`, 14, 36);

    // Table data
    const tableData = inspections.map((inspection) => {
      const formatted = formatInspectionForExport(inspection);
      return [
        formatted.type,
        formatted.status,
        formatted.priority,
        formatted.scheduled_date,
        formatted.inspector,
        formatted.location,
        formatted.pass_rate,
      ];
    });

    autoTable(doc, {
      startY: 42,
      head: [["Type", "Status", "Priority", "Date", "Inspector", "Location", "Pass Rate"]],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [71, 85, 105],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 25 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 35 },
        6: { cellWidth: 20 },
      },
    });

    // Summary stats
    const completed = inspections.filter((i) => i.status === "completed").length;
    const failed = inspections.filter((i) => i.status === "failed").length;
    const avgPassRate = inspections
      .filter((i) => i.pass_rate !== null)
      .reduce((sum, i) => sum + (i.pass_rate || 0), 0) /
      (inspections.filter((i) => i.pass_rate !== null).length || 1);

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || 42;

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text("Summary:", 14, finalY + 10);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`• Completed: ${completed} inspections`, 14, finalY + 18);
    doc.text(`• Failed: ${failed} inspections`, 14, finalY + 24);
    doc.text(`• Average Pass Rate: ${avgPassRate.toFixed(1)}%`, 14, finalY + 30);

    doc.save(`inspections_${format(new Date(), "yyyy-MM-dd")}.pdf`);

    toast.success(`Exported ${inspections.length} inspections to PDF`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full border-0 bg-muted/50"
          disabled={disabled || inspections.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
          {inspections.length > 0 && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({inspections.length})
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
