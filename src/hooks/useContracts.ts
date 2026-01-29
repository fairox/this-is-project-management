import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type {
  Contract,
  Claim,
  DocumentSubmission,
  Disagreement,
  ContractNotice,
  FidicRole,
} from '@/types/fidic';

export function useContracts() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [documents, setDocuments] = useState<DocumentSubmission[]>([]);
  const [disagreements, setDisagreements] = useState<Disagreement[]>([]);
  const [notices, setNotices] = useState<ContractNotice[]>([]);
  const [userRoles, setUserRoles] = useState<FidicRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserRoles = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user roles:', error);
      return;
    }

    setUserRoles((data || []).map((r: { role: FidicRole }) => r.role));
  }, [user]);

  const fetchContracts = useCallback(async () => {
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        *,
        projects(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contracts:', error);
      return;
    }

    const formatted = (data || []).map((c: Contract & { projects: { name: string } | null }) => ({
      ...c,
      project_name: c.projects?.name || 'No Project',
    }));

    setContracts(formatted);
  }, []);

  const fetchClaims = useCallback(async () => {
    const { data, error } = await supabase
      .from('claims')
      .select(`
        *,
        contracts(title)
      `)
      .order('notice_date', { ascending: false });

    if (error) {
      console.error('Error fetching claims:', error);
      return;
    }

    const formatted = (data || []).map((c: Claim & { contracts: { title: string } | null }) => ({
      ...c,
      contract_title: c.contracts?.title || 'Unknown Contract',
    }));

    setClaims(formatted);
  }, []);

  const fetchDocuments = useCallback(async () => {
    const { data, error } = await supabase
      .from('document_submissions')
      .select(`
        *,
        contracts(title)
      `)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return;
    }

    const formatted = (data || []).map((d: DocumentSubmission & { contracts: { title: string } | null }) => ({
      ...d,
      contract_title: d.contracts?.title || 'Unknown Contract',
    }));

    setDocuments(formatted);
  }, []);

  const fetchDisagreements = useCallback(async () => {
    const { data, error } = await supabase
      .from('disagreements')
      .select(`
        *,
        contracts(title)
      `)
      .order('raised_at', { ascending: false });

    if (error) {
      console.error('Error fetching disagreements:', error);
      return;
    }

    const formatted = (data || []).map((d: Disagreement & { contracts: { title: string } | null }) => ({
      ...d,
      contract_title: d.contracts?.title || 'Unknown Contract',
    }));

    setDisagreements(formatted);
  }, []);

  const fetchNotices = useCallback(async () => {
    const { data, error } = await supabase
      .from('contract_notices')
      .select(`
        *,
        contracts(title)
      `)
      .order('issued_at', { ascending: false });

    if (error) {
      console.error('Error fetching notices:', error);
      return;
    }

    const formatted = (data || []).map((n: ContractNotice & { contracts: { title: string } | null }) => ({
      ...n,
      contract_title: n.contracts?.title || 'Unknown Contract',
    }));

    setNotices(formatted);
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchUserRoles(),
      fetchContracts(),
      fetchClaims(),
      fetchDocuments(),
      fetchDisagreements(),
      fetchNotices(),
    ]);
    setLoading(false);
  }, [fetchUserRoles, fetchContracts, fetchClaims, fetchDocuments, fetchDisagreements, fetchNotices]);

  useEffect(() => {
    if (user) {
      fetchAll();
    }
  }, [user, fetchAll]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const claimsChannel = supabase
      .channel('claims-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'claims' }, (payload) => {
        console.log('Claim change:', payload);
        if (payload.eventType === 'UPDATE') {
          const updated = payload.new as Claim;
          setClaims((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));

          if (updated.status === 'approved') {
            toast({ title: 'Claim Approved', description: `Claim ${updated.claim_number} approved` });
          } else if (updated.status === 'rejected') {
            toast({ title: 'Claim Rejected', description: `Claim ${updated.claim_number} rejected`, variant: 'destructive' });
          } else if (updated.status === 'time_barred') {
            toast({ title: 'Claim Time-Barred', description: `Claim ${updated.claim_number} is time-barred`, variant: 'destructive' });
          }
        } else if (payload.eventType === 'INSERT') {
          fetchClaims();
        } else if (payload.eventType === 'DELETE') {
          setClaims((prev) => prev.filter((c) => c.id !== (payload.old as { id: string }).id));
        }
      })
      .subscribe();

    const documentsChannel = supabase
      .channel('documents-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'document_submissions' }, (payload) => {
        console.log('Document change:', payload);
        if (payload.eventType === 'UPDATE') {
          const updated = payload.new as DocumentSubmission;
          setDocuments((prev) => prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d)));

          if (updated.status === 'approved') {
            toast({ title: 'Document Approved', description: `${updated.title} has been approved` });
          } else if (updated.status === 'rejected') {
            toast({ title: 'Document Rejected', description: `${updated.title} was rejected`, variant: 'destructive' });
          } else if (updated.status === 'no_objection') {
            toast({ title: 'No Objection', description: `${updated.title} - No objection (auto-approved)` });
          }
        } else if (payload.eventType === 'INSERT') {
          fetchDocuments();
        }
      })
      .subscribe();

    const disagreementsChannel = supabase
      .channel('disagreements-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'disagreements' }, (payload) => {
        console.log('Disagreement change:', payload);
        if (payload.eventType === 'UPDATE') {
          const updated = payload.new as Disagreement;
          setDisagreements((prev) => prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d)));

          if (updated.status === 'determination_issued') {
            toast({ title: 'Determination Issued', description: `Disagreement ${updated.reference_number} determined` });
          } else if (updated.status === 'resolved') {
            toast({ title: 'Disagreement Resolved', description: `${updated.reference_number} has been resolved` });
          }
        } else if (payload.eventType === 'INSERT') {
          fetchDisagreements();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(claimsChannel);
      supabase.removeChannel(documentsChannel);
      supabase.removeChannel(disagreementsChannel);
    };
  }, [user, fetchClaims, fetchDocuments, fetchDisagreements]);

  // Contract CRUD
  const createContract = async (contractData: {
    contract_number: string;
    title: string;
    accepted_contract_amount: number;
    time_for_completion: number;
    project_id?: string;
    contractor_id?: string;
    engineer_id?: string;
    employer_id?: string;
    advance_payment_percentage?: number;
    retention_percentage?: number;
    delay_damages_rate?: number;
    delay_damages_cap_percentage?: number;
    commencement_date?: string;
    defects_notification_period?: number;
  }) => {
    const { error } = await supabase.from('contracts').insert(contractData);

    if (error) {
      toast({ title: 'Error creating contract', description: error.message, variant: 'destructive' });
      return false;
    }

    toast({ title: 'Contract Created', description: 'New contract has been created' });
    await fetchContracts();
    return true;
  };

  // Claims CRUD
  const submitClaim = async (claimData: {
    contract_id: string;
    claim_number: string;
    claimant_type: 'contractor' | 'employer';
    title: string;
    description?: string;
    clause_reference?: string;
    amount_claimed?: number;
    time_extension_days?: number;
  }) => {
    if (!user) return false;

    const { error } = await supabase.from('claims').insert({
      ...claimData,
      submitted_by: user.id,
    });

    if (error) {
      toast({ title: 'Error submitting claim', description: error.message, variant: 'destructive' });
      return false;
    }

    toast({ title: 'Claim Submitted', description: 'Your claim notice has been submitted' });
    await fetchClaims();
    return true;
  };

  const updateClaimStatus = async (claimId: string, status: Claim['status'], determination?: string, amountApproved?: number, timeApproved?: number) => {
    const updateData: Record<string, unknown> = { status };
    if (determination) updateData.engineer_determination = determination;
    if (amountApproved !== undefined) updateData.amount_approved = amountApproved;
    if (timeApproved !== undefined) updateData.time_approved_days = timeApproved;
    if (status === 'approved' || status === 'rejected' || status === 'partially_approved') {
      updateData.determination_date = new Date().toISOString();
    }

    const { error } = await supabase.from('claims').update(updateData).eq('id', claimId);

    if (error) {
      toast({ title: 'Error updating claim', description: error.message, variant: 'destructive' });
      return false;
    }

    toast({ title: 'Claim Updated', description: `Claim status updated to ${status}` });
    return true;
  };

  // Document submission CRUD
  const submitDocument = async (docData: {
    contract_id: string;
    document_type: string;
    reference_number: string;
    title: string;
    description?: string;
    file_url?: string;
  }) => {
    if (!user) return false;

    const { error } = await supabase.from('document_submissions').insert({
      contract_id: docData.contract_id,
      document_type: docData.document_type,
      reference_number: docData.reference_number,
      title: docData.title,
      description: docData.description,
      file_url: docData.file_url,
      submitted_by: user.id,
    });

    if (error) {
      toast({ title: 'Error submitting document', description: error.message, variant: 'destructive' });
      return false;
    }

    toast({ title: 'Document Submitted', description: 'Document submitted for review' });
    await fetchDocuments();
    return true;
  };

  const reviewDocument = async (docId: string, status: DocumentSubmission['status'], comments?: string) => {
    if (!user) return false;

    const { error } = await supabase.from('document_submissions').update({
      status,
      review_comments: comments,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    }).eq('id', docId);

    if (error) {
      toast({ title: 'Error reviewing document', description: error.message, variant: 'destructive' });
      return false;
    }

    toast({ title: 'Document Reviewed', description: `Document ${status}` });
    return true;
  };

  // Disagreement CRUD
  const raiseDisagreement = async (data: {
    contract_id: string;
    reference_number: string;
    subject: string;
    description?: string;
    claim_id?: string;
  }) => {
    if (!user) return false;

    const { error } = await supabase.from('disagreements').insert({
      contract_id: data.contract_id,
      reference_number: data.reference_number,
      subject: data.subject,
      description: data.description,
      claim_id: data.claim_id,
      raised_by: user.id,
    });

    if (error) {
      toast({ title: 'Error raising disagreement', description: error.message, variant: 'destructive' });
      return false;
    }

    toast({ title: 'Disagreement Raised', description: 'Disagreement has been recorded' });
    await fetchDisagreements();
    return true;
  };

  const issueEngineerDetermination = async (disagreementId: string, determination: string, status: Disagreement['status'] = 'determination_issued') => {
    const { error } = await supabase.from('disagreements').update({
      status,
      engineer_determination: determination,
      determination_date: new Date().toISOString(),
    }).eq('id', disagreementId);

    if (error) {
      toast({ title: 'Error issuing determination', description: error.message, variant: 'destructive' });
      return false;
    }

    toast({ title: 'Determination Issued', description: 'Engineer determination has been issued' });
    return true;
  };

  // Helper to check roles
  const hasRole = (role: FidicRole) => userRoles.includes(role);
  const isEngineer = hasRole('engineer');
  const isContractor = hasRole('contractor');
  const isEmployer = hasRole('employer');
  const isProjectArchitect = hasRole('project_architect');

  return {
    contracts,
    claims,
    documents,
    disagreements,
    notices,
    userRoles,
    loading,
    // Role helpers
    hasRole,
    isEngineer,
    isContractor,
    isEmployer,
    isProjectArchitect,
    // Contract operations
    createContract,
    // Claim operations
    submitClaim,
    updateClaimStatus,
    // Document operations
    submitDocument,
    reviewDocument,
    // Disagreement operations
    raiseDisagreement,
    issueEngineerDetermination,
    // Refetch
    refetch: fetchAll,
  };
}
