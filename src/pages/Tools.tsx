import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  Wrench, Settings, FolderOpen,
  ListCheck, Clock, BarChart,
  Upload, Download, Leaf, DollarSign,
  FileText, Calculator, Shield, Zap,
  Bell, Info, ChevronDown, Send, Activity,
  ArrowRight, Search, Plus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allTools = [
  { name: "Budget Analysis", icon: BarChart, link: "/contracts", category: "Financial" },
  { name: "Cash Flow", icon: DollarSign, link: "/contracts", category: "Financial" },
  { name: "Invoices", icon: FileText, link: "/contracts", category: "Financial" },
  { name: "Upload Files", icon: Upload, link: "/documents", category: "Documents" },
  { name: "Templates", icon: Download, link: "/documents", category: "Documents" },
  { name: "Reports", icon: FolderOpen, link: "/documents", category: "Documents" },
  { name: "Inspections", icon: ListCheck, link: "/inspections", category: "Quality" },
  { name: "Issue Tracker", icon: Shield, link: "/inspections", category: "Quality" },
  { name: "Checklists", icon: ListCheck, link: "/inspections", category: "Quality" },
  { name: "Timesheets", icon: Clock, link: "/timesheets", category: "Time" },
  { name: "Projects", icon: Wrench, link: "/projects", category: "Management" },
  { name: "Sustainability", icon: Leaf, link: "/projects", category: "Management" },
];

const Tools = () => {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleToolSelect = (toolName: string) => {
    const tool = allTools.find(t => t.name === toolName);
    if (tool) {
      setSelectedTool(toolName);
      toast.success(`Opening ${toolName}...`);
      navigate(tool.link);
    }
  };

  const handleQuickAction = (action: string) => {
    toast.success(`${action} initiated`);
  };

  const filteredTools = allTools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        {/* Striking 6-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 auto-rows-auto">

          {/* Row 1 - Hero Section */}
          {/* Main Hero - 3 cols, 2 rows */}
          <div className="md:col-span-2 lg:col-span-3 lg:row-span-2">
            <div className="bg-[hsl(65,70%,75%)] rounded-3xl p-8 flex flex-col h-full min-h-[380px] relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-foreground/5" />
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14 border-2 border-background/20">
                    <AvatarImage src="/lovable-uploads/169f31b7-148d-45f3-aa09-967fbcae3b16.png" />
                    <AvatarFallback className="bg-background/20 text-foreground text-lg">PT</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-foreground text-lg">Project Tools</p>
                    <p className="text-sm text-foreground/70">Management Suite</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickAction("Notifications opened")}
                    className="h-11 w-11 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-colors hover:scale-105"
                  >
                    <Bell className="h-5 w-5 text-foreground" />
                  </button>
                  <button
                    onClick={() => handleQuickAction("Help center opened")}
                    className="h-11 w-11 rounded-full bg-card flex items-center justify-center hover:bg-card/80 transition-colors hover:scale-105"
                  >
                    <Info className="h-5 w-5 text-foreground" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 relative z-10">
                <h2 className="text-4xl font-bold text-foreground mb-2">Construction Tools</h2>
                <p className="text-foreground/70 mb-6">12 tools available • 8 active</p>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground/70">Tools Usage</span>
                    <span className="font-bold text-foreground">67%</span>
                  </div>
                  <div className="h-3 bg-foreground/20 rounded-full overflow-hidden">
                    <div className="h-full w-[67%] bg-foreground rounded-full transition-all duration-500" />
                  </div>
                </div>
              </div>

              {/* Tool Selector */}
              <div className="flex gap-3 items-center relative z-10">
                <Select value={selectedTool} onValueChange={handleToolSelect}>
                  <SelectTrigger className="flex-1 h-14 bg-card/90 backdrop-blur-sm border-0 rounded-full shadow-sm text-base">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                        <Zap className="h-5 w-5" />
                      </div>
                      <SelectValue placeholder="Select a tool to launch" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-card border shadow-lg z-50">
                    {allTools.map((tool) => (
                      <SelectItem key={tool.name} value={tool.name}>
                        <div className="flex items-center gap-2">
                          <tool.icon className="h-4 w-4" />
                          {tool.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  onClick={() => selectedTool && handleToolSelect(selectedTool)}
                  className="h-14 w-14 rounded-full bg-foreground flex items-center justify-center hover:bg-foreground/90 transition-all hover:scale-105"
                >
                  <Send className="h-6 w-6 text-background" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel - 2 cols, 2 rows */}
          <div className="lg:col-span-2 lg:row-span-2">
            <div className="bg-foreground rounded-3xl p-6 h-full min-h-[380px] flex flex-col">
              <h3 className="text-xl font-bold text-background mb-6">Quick Actions</h3>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-background/50" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background/10 text-background placeholder:text-background/50 rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(65,70%,75%)]"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 flex-1">
                <Link
                  to="/documents"
                  className="flex items-center gap-3 bg-[hsl(65,70%,75%)] text-foreground rounded-2xl p-4 hover:opacity-90 transition-all hover:scale-[1.02]"
                >
                  <Upload className="h-5 w-5" />
                  <span className="font-medium">Upload Files</span>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>

                <Link
                  to="/inspections"
                  className="flex items-center gap-3 bg-background/10 text-background rounded-2xl p-4 hover:bg-background/20 transition-all hover:scale-[1.02]"
                >
                  <ListCheck className="h-5 w-5" />
                  <span className="font-medium">New Inspection</span>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>

                <Link
                  to="/contracts"
                  className="flex items-center gap-3 bg-background/10 text-background rounded-2xl p-4 hover:bg-background/20 transition-all hover:scale-[1.02]"
                >
                  <Calculator className="h-5 w-5" />
                  <span className="font-medium">Financial Report</span>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>

                <Link
                  to="/timesheets"
                  className="flex items-center gap-3 bg-background/10 text-background rounded-2xl p-4 hover:bg-background/20 transition-all hover:scale-[1.02]"
                >
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Log Time</span>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mt-4 pt-4 border-t border-background/10">
                <div>
                  <p className="text-3xl font-bold text-background">8</p>
                  <p className="text-sm text-background/70">Active</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[hsl(65,70%,75%)]">12</p>
                  <p className="text-sm text-background/70">Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Card - 1 col, 2 rows */}
          <div className="lg:col-span-1 lg:row-span-2">
            <div className="bg-card rounded-3xl p-5 h-full min-h-[380px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-foreground" />
                <h3 className="font-bold text-foreground">Activity</h3>
              </div>

              <div className="space-y-3 flex-1">
                {[
                  { tool: "Budget", action: "Report generated", time: "2h" },
                  { tool: "Documents", action: "5 files added", time: "4h" },
                  { tool: "Timeline", action: "Updated", time: "1d" },
                  { tool: "Inspection", action: "Completed", time: "2d" },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <p className="font-medium text-sm text-foreground">{item.tool}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-muted-foreground">{item.action}</p>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => toast.info("View all activity")}
                className="w-full mt-4 py-3 rounded-full bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                View All
              </button>
            </div>
          </div>

          {/* Row 2 - Tool Categories */}
          {/* Financial Tools */}
          <div className="lg:col-span-2">
            <div className="bg-[hsl(65,70%,75%)] rounded-3xl p-6 h-full min-h-[220px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Financial Tools</h3>
                <Link to="/contracts" className="text-sm font-medium text-foreground/70 hover:text-foreground flex items-center gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Budget", icon: BarChart },
                  { name: "Cash Flow", icon: DollarSign },
                  { name: "Invoices", icon: FileText },
                  { name: "Reports", icon: Calculator },
                ].map((tool) => (
                  <Link
                    key={tool.name}
                    to="/contracts"
                    className="flex items-center gap-2 bg-card/80 rounded-2xl p-3 hover:bg-card transition-all hover:scale-[1.02]"
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <tool.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Document Tools */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-3xl p-6 h-full min-h-[220px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Document Tools</h3>
                <Link to="/documents" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Upload", icon: Upload },
                  { name: "Templates", icon: Download },
                  { name: "Search", icon: Search },
                  { name: "Archive", icon: FolderOpen },
                ].map((tool) => (
                  <Link
                    key={tool.name}
                    to="/documents"
                    className="flex items-center gap-2 bg-muted/50 rounded-2xl p-3 hover:bg-muted transition-all hover:scale-[1.02]"
                  >
                    <div className="h-8 w-8 rounded-full bg-card shadow-sm flex items-center justify-center">
                      <tool.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quality Tools */}
          <div className="lg:col-span-2">
            <div className="bg-[hsl(80,15%,70%)] rounded-3xl p-6 h-full min-h-[220px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Quality Control</h3>
                <Link to="/inspections" className="text-sm font-medium text-foreground/70 hover:text-foreground flex items-center gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Inspect", icon: ListCheck },
                  { name: "Issues", icon: Shield },
                  { name: "Checklists", icon: ListCheck },
                  { name: "Safety", icon: Shield },
                ].map((tool) => (
                  <Link
                    key={tool.name}
                    to="/inspections"
                    className="flex items-center gap-2 bg-card/80 rounded-2xl p-3 hover:bg-card transition-all hover:scale-[1.02]"
                  >
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <tool.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3 - Navigation Cards */}
          <div className="lg:col-span-2">
            <Link to="/projects" className="block bg-card rounded-3xl p-6 h-full min-h-[160px] group hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="h-14 w-14 rounded-2xl bg-[hsl(65,70%,75%)] flex items-center justify-center">
                  <Wrench className="h-7 w-7 text-foreground" />
                </div>
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground">Projects</h3>
              <p className="text-sm text-muted-foreground mt-1">Manage all construction projects</p>
            </Link>
          </div>

          <div className="lg:col-span-2">
            <Link to="/timesheets" className="block bg-foreground rounded-3xl p-6 h-full min-h-[160px] group hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="h-14 w-14 rounded-2xl bg-background/10 flex items-center justify-center">
                  <Clock className="h-7 w-7 text-background" />
                </div>
                <div className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <ArrowRight className="h-5 w-5 text-background" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-background">Timesheets</h3>
              <p className="text-sm text-background/70 mt-1">Track working hours & overtime</p>
            </Link>
          </div>

          <div className="lg:col-span-2">
            <Link to="/contracts" className="block bg-[hsl(65,70%,75%)] rounded-3xl p-6 h-full min-h-[160px] group hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="h-14 w-14 rounded-2xl bg-foreground/10 flex items-center justify-center">
                  <Settings className="h-7 w-7 text-foreground" />
                </div>
                <div className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground">Settings</h3>
              <p className="text-sm text-foreground/70 mt-1">Configure tools & preferences</p>
            </Link>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default Tools;
