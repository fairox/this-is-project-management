
import { AppLayout } from "@/components/AppLayout";
import { BudgetChart } from "@/features/analytics/components/BudgetChart";
import { CostVarianceChart } from "@/features/analytics/components/CostVarianceChart";
import { BudgetForecast } from "@/features/analytics/components/BudgetForecast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Download, ArrowLeft } from "lucide-react";

const Budget = () => {
  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/tools">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Budget Analysis</h1>
            </div>
            <p className="text-muted-foreground">
              Track and analyze project budgets with detailed variance reporting
            </p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <BudgetChart />
          <CostVarianceChart />
        </div>
        
        <div className="grid gap-6">
          <BudgetForecast />
        </div>
      </div>
    </AppLayout>
  );
};

export default Budget;
