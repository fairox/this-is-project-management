-- ============================================
-- SECURITY FIX: Proper Role Storage & Audit Logging
-- ============================================

-- 1. Create app_role enum for proper role typing
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('employee', 'manager', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create separate user_roles table (security best practice)
CREATE TABLE IF NOT EXISTS public.app_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'employee',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.app_user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create audit_log table for tracking security-sensitive operations
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS on audit_log (only admins can read)
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- 4. Create improved has_app_role function with proper security
CREATE OR REPLACE FUNCTION public.has_app_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.app_user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_app_admin(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.app_user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$;

-- 6. Create function to check if user is manager or admin
CREATE OR REPLACE FUNCTION public.is_app_manager_or_admin(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.app_user_roles
    WHERE user_id = _user_id AND role IN ('manager', 'admin')
  )
$$;

-- 7. Create function to get user's highest role
CREATE OR REPLACE FUNCTION public.get_app_user_role(_user_id UUID DEFAULT auth.uid())
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.app_user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'manager' THEN 2
      WHEN 'employee' THEN 3
    END
  LIMIT 1
$$;

-- 8. Create secure role update function with audit logging
CREATE OR REPLACE FUNCTION public.update_user_role(
  _target_user_id UUID,
  _new_role app_role
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _caller_id UUID;
  _old_role app_role;
  _result JSONB;
BEGIN
  -- Get the caller's user ID
  _caller_id := auth.uid();
  
  -- Verify caller is an admin
  IF NOT public.is_app_admin(_caller_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only admins can update user roles');
  END IF;
  
  -- Prevent self-demotion from admin (safety check)
  IF _caller_id = _target_user_id AND _new_role != 'admin' THEN
    -- Check if there are other admins
    IF (SELECT COUNT(*) FROM public.app_user_roles WHERE role = 'admin' AND user_id != _caller_id) = 0 THEN
      RETURN jsonb_build_object('success', false, 'error', 'Cannot remove the last admin');
    END IF;
  END IF;
  
  -- Get current role for audit
  SELECT role INTO _old_role FROM public.app_user_roles WHERE user_id = _target_user_id;
  
  -- Insert or update role
  INSERT INTO public.app_user_roles (user_id, role, updated_at)
  VALUES (_target_user_id, _new_role, now())
  ON CONFLICT (user_id, role) 
  DO UPDATE SET updated_at = now()
  WHERE app_user_roles.user_id = _target_user_id;
  
  -- Delete old roles (user should only have one app role)
  DELETE FROM public.app_user_roles 
  WHERE user_id = _target_user_id AND role != _new_role;
  
  -- Log the action
  INSERT INTO public.audit_log (action, table_name, record_id, old_values, new_values, performed_by)
  VALUES (
    'role_change',
    'app_user_roles',
    _target_user_id,
    jsonb_build_object('role', _old_role),
    jsonb_build_object('role', _new_role),
    _caller_id
  );
  
  RETURN jsonb_build_object('success', true, 'old_role', _old_role, 'new_role', _new_role);
END;
$$;

-- 9. RLS Policies for app_user_roles

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.app_user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.app_user_roles
FOR SELECT
TO authenticated
USING (public.is_app_admin(auth.uid()));

-- Only the update_user_role function can modify roles (via SECURITY DEFINER)
-- No direct insert/update/delete policies for regular users

-- 10. RLS Policies for audit_log

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_log
FOR SELECT
TO authenticated
USING (public.is_app_admin(auth.uid()));

-- No direct inserts allowed - only via functions
-- Audit logs are immutable (no update/delete)

-- 11. Create trigger to auto-assign employee role on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.app_user_roles (user_id, role)
  VALUES (NEW.id, 'employee')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger (if not exists)
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- 12. Migrate existing roles from profiles to app_user_roles
INSERT INTO public.app_user_roles (user_id, role)
SELECT user_id, role::app_role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;