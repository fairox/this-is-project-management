import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

export interface Inspection {
  id: string;
  project_id: string | null;
  type: 'safety' | 'structural' | 'electrical' | 'plumbing' | 'fire' | 'quality' | 'regulatory';
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  scheduled_date: string;
  completed_date: string | null;
  inspector_id: string | null;
  inspector_name: string;
  notes: string | null;
  priority: 'low' | 'medium' | 'high';
  location: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checklist_items: any[];
  photos: string[];
  pass_rate: number | null;
  created_at: string;
  updated_at: string;
}

export interface InspectionStats {
  total: number;
  completed: number;
  scheduled: number;
  inProgress: number;
  failed: number;
  averagePassRate: number;
  byType: Record<string, number>;
}

// Hook to set up real-time subscription for inspections
export function useInspectionsRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('inspections-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inspections',
        },
        (payload) => {
          console.log('Inspection change detected:', payload.eventType);
          // Invalidate all inspection-related queries
          queryClient.invalidateQueries({ queryKey: ['inspections'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

export function useInspections() {
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useInspectionsRealtime();

  return useQuery({
    queryKey: ['inspections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return data as Inspection[];
    },
    staleTime: 60000, // 1 minute
  });
}

export function useUpcomingInspections(limit = 10) {
  return useQuery({
    queryKey: ['inspections', 'upcoming', limit],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .gte('scheduled_date', today)
        .in('status', ['scheduled', 'in_progress'])
        .order('scheduled_date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data as Inspection[];
    },
    staleTime: 60000,
  });
}

export function useInspectionStats() {
  return useQuery({
    queryKey: ['inspections', 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspections')
        .select('*');

      if (error) throw error;

      const inspections = data as Inspection[];

      const stats: InspectionStats = {
        total: inspections.length,
        completed: inspections.filter(i => i.status === 'completed').length,
        scheduled: inspections.filter(i => i.status === 'scheduled').length,
        inProgress: inspections.filter(i => i.status === 'in_progress').length,
        failed: inspections.filter(i => i.status === 'failed').length,
        averagePassRate: 0,
        byType: {},
      };

      // Calculate average pass rate
      const completedWithRate = inspections.filter(i => i.pass_rate !== null);
      if (completedWithRate.length > 0) {
        stats.averagePassRate = Math.round(
          completedWithRate.reduce((sum, i) => sum + (i.pass_rate || 0), 0) / completedWithRate.length
        );
      }

      // Count by type
      inspections.forEach(i => {
        stats.byType[i.type] = (stats.byType[i.type] || 0) + 1;
      });

      return stats;
    },
    staleTime: 60000,
  });
}

export function useInspectionsByType(type: string) {
  return useQuery({
    queryKey: ['inspections', 'type', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('type', type)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      return data as Inspection[];
    },
    staleTime: 60000,
  });
}

export function useCreateInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inspection: Omit<Inspection, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('inspections')
        .insert(inspection)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
      toast.success('Inspection created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create inspection', { description: error.message });
    },
  });
}

export function useUpdateInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Inspection> & { id: string }) => {
      const { data, error } = await supabase
        .from('inspections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
      toast.success('Inspection updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update inspection', { description: error.message });
    },
  });
}

export function useDeleteInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inspections')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
      toast.success('Inspection deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete inspection', { description: error.message });
    },
  });
}
