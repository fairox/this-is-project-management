import { AppLayout } from "@/components/AppLayout";
import {
  FileText, FileImage, FileCheck, FileSpreadsheet,
  FolderOpen, Clock, HardDrive, Download, Upload, Search
} from "lucide-react";
import {
  DocumentsHeroCard,
  RecentUploadsCard,
  DocumentCategoriesCard,
  DocumentTypeCard,
  DocumentStatsCard,
  StorageChartCard,
} from "@/components/documents/bento";
import {
  TeamMemberCard,
} from "@/components/projects/bento";

const Documents = () => {
  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        {/* Striking Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 auto-rows-auto">

          {/* Row 1 - Hero Section */}
          {/* Hero Card - spans 3 cols, 2 rows */}
          <div className="md:col-span-2 lg:col-span-3 lg:row-span-2">
            <DocumentsHeroCard />
          </div>

          {/* Big Stats - 2 cols */}
          <div className="lg:col-span-2 lg:row-span-2">
            <div className="bg-foreground rounded-3xl p-8 h-full min-h-[320px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[hsl(65,70%,75%)]/20" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[hsl(65,70%,75%)]/10" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-[hsl(65,70%,75%)] flex items-center justify-center">
                    <FolderOpen className="h-7 w-7 text-foreground" />
                  </div>
                  <div>
                    <p className="text-background/70 text-sm">Total Storage</p>
                    <p className="text-background text-3xl font-bold">100 GB</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-background/70">Used</span>
                    <span className="text-background font-medium">34 GB</span>
                  </div>
                  <div className="h-3 bg-background/20 rounded-full overflow-hidden">
                    <div className="h-full w-[34%] bg-[hsl(65,70%,75%)] rounded-full" />
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[hsl(65,70%,75%)]" />
                    <span className="text-background/70">Documents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-background/30" />
                    <span className="text-background/70">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="lg:col-span-1 lg:row-span-2">
            <div className="bg-[hsl(65,70%,75%)] rounded-3xl p-6 h-full min-h-[320px] flex flex-col justify-between">
              <div className="space-y-4">
                <button className="w-full bg-foreground text-background rounded-2xl p-4 flex items-center gap-3 hover:bg-foreground/90 transition-colors">
                  <Upload className="h-5 w-5" />
                  <span className="font-medium">Upload</span>
                </button>
                <button className="w-full bg-card text-foreground rounded-2xl p-4 flex items-center gap-3 hover:bg-card/80 transition-colors">
                  <Search className="h-5 w-5" />
                  <span className="font-medium">Search</span>
                </button>
              </div>
              
              <div>
                <p className="text-foreground/70 text-sm mb-2">Quick Stats</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-foreground/70 text-sm">This week</span>
                    <span className="text-foreground font-bold">+23 files</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70 text-sm">Shared</span>
                    <span className="text-foreground font-bold">48 files</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 - Categories & Recent */}
          {/* Document Categories - spans 4 cols */}
          <div className="md:col-span-2 lg:col-span-4">
            <DocumentCategoriesCard />
          </div>

          {/* Storage Chart - spans 2 cols */}
          <div className="lg:col-span-2">
            <StorageChartCard percentage={34} />
          </div>

          {/* Row 3 - Document Types Grid */}
          <div className="lg:col-span-2">
            <DocumentTypeCard
              title="Contracts"
              count={24}
              icon={FileCheck}
              variant="dark"
            />
          </div>

          <div className="lg:col-span-2">
            <DocumentTypeCard
              title="Drawings"
              count={45}
              icon={FileImage}
              variant="accent"
            />
          </div>

          <div className="lg:col-span-2">
            <DocumentTypeCard
              title="Permits"
              count={18}
              icon={FileSpreadsheet}
              variant="default"
            />
          </div>

          {/* Row 4 - Recent Uploads & Stats */}
          <div className="md:col-span-2 lg:col-span-3">
            <RecentUploadsCard />
          </div>

          <div className="lg:col-span-1">
            <DocumentStatsCard
              icon={FileText}
              label="Total Files"
              value={156}
              trend="+12"
              variant="accent"
            />
          </div>

          <div className="lg:col-span-1">
            <DocumentStatsCard
              icon={Clock}
              label="Last Updated"
              value={2}
              suffix="h"
              variant="muted"
            />
          </div>

          <div className="lg:col-span-1">
            <TeamMemberCard
              name="Smart"
              role="Document AI"
            />
          </div>

          {/* Row 5 - Bottom Stats */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-3xl p-6 h-full min-h-[140px] flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Downloads Today</p>
                <p className="text-4xl font-bold text-foreground">89</p>
                <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">+15 from yesterday</span>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-[hsl(65,70%,75%)] flex items-center justify-center">
                <Download className="h-8 w-8 text-foreground" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <DocumentStatsCard
              icon={HardDrive}
              label="Available Space"
              value={66}
              suffix="GB"
              variant="default"
            />
          </div>

          <div className="lg:col-span-2">
            <DocumentStatsCard
              icon={FolderOpen}
              label="Active Folders"
              value={24}
              variant="dark"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Documents;
