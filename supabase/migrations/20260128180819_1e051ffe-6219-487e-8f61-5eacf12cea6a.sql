-- Enable realtime for timesheets and time_entries tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.timesheets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.time_entries;