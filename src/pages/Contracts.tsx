import { useIsMobile } from "@/hooks/use-mobile";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContracts } from "@/hooks/useContracts";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { ContractsDashboard } from "@/components/fidic/ContractsDashboard";
import { ClaimsManager } from "@/components/fidic/ClaimsManager";
import { DocumentReview } from "@/components/fidic/DocumentReview";
import { DisagreementManager } from "@/components/fidic/DisagreementManager";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileText, Scale, ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardQuickStatsCard } from "@/components/dashboard/bento";

const Contracts = () => {
  const isMobile = useIsMobile();
  const { user, loading: authLoading } = useAuth();
  const {
    contracts,
    claims,
    documents,
    disagreements,
    loading,
    isEngineer,
    isContractor,
    isEmployer,
    isProjectArchitect,
    createContract,
    submitClaim,
    updateClaimStatus,
    submitDocument,
    reviewDocument,
    raiseDisagreement,
    issueEngineerDetermination,
  } = useContracts();

  if (authLoading) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Sign in to access the FIDIC Contract Administration System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  // Calculate alerts
  const pendingClaims = claims.filter(c =>
    c.status === 'notice_submitted' || c.status === 'detailed_claim_pending'
  ).length;
  const pendingDocuments = documents.filter(d => d.status === 'submitted').length;
  const pendingDisagreements = disagreements.filter(d =>
    d.status === 'open' || d.status === 'determination_pending'
  ).length;

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight">FIDIC Contract Administration</h1>
          <p className="text-muted-foreground mt-1">Manage contracts, claims, and disputes under FIDIC Red Book 2017</p>
        </div>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Role Card - Replaces simple badges */}
          <div className="bg-primary text-primary-foreground p-6 rounded-3xl flex flex-col justify-between shadow-sm">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">Current Role</p>
              <h3 className="text-2xl font-bold mt-1">
                {isEngineer ? 'Engineer' : isContractor ? 'Contractor' : isEmployer ? 'Employer' : isProjectArchitect ? 'Architect' : 'Observer'}
              </h3>
            </div>
            <div className="bg-primary-foreground/10 self-start px-3 py-1 rounded-full text-xs font-medium mt-4 backdrop-blur-sm">
              Active Session
            </div>
          </div>

          {/* Stats Cards using Bento Components */}
          <DashboardQuickStatsCard
            icon={ScrollText}
            label="Active Contracts"
            value={contracts.length}
            trend="+1"
          />

          <DashboardQuickStatsCard
            icon={AlertCircle}
            label="Pending Claims"
            value={pendingClaims}
            trend={pendingClaims > 0 ? "+1" : "0"}
            accentColor={pendingClaims > 0}
          />

          <DashboardQuickStatsCard
            icon={FileText}
            label="Pending Docs"
            value={pendingDocuments}
            trend={pendingDocuments > 2 ? "+2" : "0"}
          />
        </div>

        <Tabs defaultValue="contracts" className="space-y-4">
          <TabsList className={isMobile ? "w-full grid grid-cols-4 mb-3" : "bg-muted/50 rounded-full p-1 h-12"}>
            <TabsTrigger value="contracts" className={isMobile ? "text-xs py-3 px-1" : "rounded-full px-6"}>
              <ScrollText className="h-4 w-4 mr-1 hidden md:inline" />
              Contracts
            </TabsTrigger>
            <TabsTrigger value="claims" className={isMobile ? "text-xs py-3 px-1" : "rounded-full px-6"}>
              <AlertCircle className="h-4 w-4 mr-1 hidden md:inline" />
              Claims
              {pendingClaims > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5">{pendingClaims}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="documents" className={isMobile ? "text-xs py-3 px-1" : "rounded-full px-6"}>
              <FileText className="h-4 w-4 mr-1 hidden md:inline" />
              Documents
              {pendingDocuments > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">{pendingDocuments}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="disputes" className={isMobile ? "text-xs py-3 px-1" : "rounded-full px-6"}>
              <Scale className="h-4 w-4 mr-1 hidden md:inline" />
              Disputes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contracts" className="space-y-4">
            <ContractsDashboard
              contracts={contracts}
              isEngineer={isEngineer}
              isEmployer={isEmployer}
              onCreateContract={createContract}
            />
          </TabsContent>

          <TabsContent value="claims" className="space-y-4">
            <ClaimsManager
              claims={claims}
              contracts={contracts}
              isContractor={isContractor}
              isEngineer={isEngineer}
              onSubmitClaim={submitClaim}
              onUpdateStatus={updateClaimStatus}
            />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <DocumentReview
              documents={documents}
              contracts={contracts}
              isContractor={isContractor}
              isEngineer={isEngineer}
              isProjectArchitect={isProjectArchitect}
              onSubmitDocument={submitDocument}
              onReviewDocument={reviewDocument}
            />
          </TabsContent>

          <TabsContent value="disputes" className="space-y-4">
            <DisagreementManager
              disagreements={disagreements}
              contracts={contracts}
              isEngineer={isEngineer}
              onRaiseDisagreement={raiseDisagreement}
              onIssueDetermination={issueEngineerDetermination}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Contracts;
