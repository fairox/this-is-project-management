import { Building2, ClipboardCheck, FileText, ScrollText, Clock, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import {
  LandingHeroCard,
  LandingFeatureCard,
  LandingStatsCard,
  LandingImageCard,
  LandingChartCard,
  LandingTeamCard,
  LandingCTACard,
} from "@/components/landing/bento";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            Design X Threshold CPM
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link to="/inspections" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Inspections
            </Link>
            <Link to="/documents" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Documents
            </Link>
            <Link to="/contracts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contracts
            </Link>
          </nav>
          <Link
            to="/dashboard"
            className="bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pt-24 pb-12">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
          {/* Row 1 */}
          {/* Hero - spans 2 cols, 2 rows */}
          <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
            <LandingHeroCard />
          </div>

          {/* Stats */}
          <div>
            <LandingStatsCard value="500" suffix="+" label="Projects Completed" variant="accent" />
          </div>
          <div>
            <LandingStatsCard value="98" suffix="%" label="Client Satisfaction" variant="dark" />
          </div>

          {/* Image Card */}
          <div className="md:col-span-2 lg:col-span-2">
            <LandingImageCard />
          </div>

          {/* Row 2 - Features */}
          <div>
            <LandingFeatureCard
              title="Projects"
              description="Track progress and manage timelines"
              icon={Building2}
              link="/projects"
              variant="default"
            />
          </div>
          <div>
            <LandingFeatureCard
              title="Inspections"
              description="Quality control and site checks"
              icon={ClipboardCheck}
              link="/inspections"
              variant="accent"
            />
          </div>
          <div>
            <LandingFeatureCard
              title="Documents"
              description="Centralized file management"
              icon={FileText}
              link="/documents"
              variant="muted"
            />
          </div>
          <div>
            <LandingFeatureCard
              title="Contracts"
              description="FIDIC administration"
              icon={ScrollText}
              link="/contracts"
              variant="dark"
            />
          </div>

          {/* Row 3 */}
          {/* Team Card */}
          <div className="md:col-span-2">
            <LandingTeamCard />
          </div>

          {/* Chart */}
          <div>
            <LandingChartCard title="Growth" percentage={94} />
          </div>

          {/* More Stats */}
          <div>
            <LandingStatsCard value="24" label="Team Members" variant="default" />
          </div>

          {/* Row 4 */}
          <div>
            <LandingFeatureCard
              title="Timesheets"
              description="Track working hours"
              icon={Clock}
              link="/timesheets"
              variant="accent"
            />
          </div>
          <div>
            <LandingFeatureCard
              title="Tools"
              description="Management utilities"
              icon={Wrench}
              link="/tools"
              variant="default"
            />
          </div>

          {/* CTA - spans 2 cols */}
          <div className="md:col-span-2">
            <LandingCTACard />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Design X Threshold CPM. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link to="/contracts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contracts
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
