import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Project } from '@/types';

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching projects:', error);
                return;
            }

            // Supabase returns the raw row shape. 
            // Our frontend 'Project' type in src/types/index.ts is quite extensive.
            // We'll cast it for now, but note that some fields like 'budget' might need to be joined or inferred.
            // For the description parsing logic, we'll handle that in the UI or here.
            setProjects(data as unknown as Project[]);
        } catch (error) {
            console.error('Unexpected error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { projects, loading, refetch: fetchProjects };
}
