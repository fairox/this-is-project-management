import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Shield, UserCog, Users, Loader2, Crown, Briefcase, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  department: string | null;
  created_at: string;
  role: 'employee' | 'manager' | 'admin';
}

const roleConfig = {
  employee: { label: 'Employee', icon: User, color: 'bg-gray-500' },
  manager: { label: 'Manager', icon: Briefcase, color: 'bg-blue-500' },
  admin: { label: 'Admin', icon: Crown, color: 'bg-purple-500' },
};

export function UserRoleManager() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user is admin
  const checkAdminStatus = async () => {
    if (!user) return;
    
    const { data, error } = await supabase.rpc('is_app_admin', { _user_id: user.id });
    
    if (!error && data) {
      setIsAdmin(true);
      setCurrentUserRole('admin');
    } else {
      // Get actual role
      const { data: roleData } = await supabase.rpc('get_app_user_role', { _user_id: user.id });
      setCurrentUserRole(roleData || 'employee');
      setIsAdmin(false);
    }
  };

  const fetchUsers = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, user_id, full_name, email, department, created_at')
      .order('full_name');

    if (profilesError) {
      console.error('Error fetching users:', profilesError);
      toast({
        title: 'Error loading users',
        description: profilesError.message,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // Fetch roles from app_user_roles table
    const { data: roles, error: rolesError } = await supabase
      .from('app_user_roles')
      .select('user_id, role');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
    }

    // Create role map
    const roleMap = new Map<string, 'employee' | 'manager' | 'admin'>();
    roles?.forEach(r => {
      const roleValue = r.role as 'employee' | 'manager' | 'admin';
      roleMap.set(r.user_id, roleValue);
    });

    // Combine profiles with roles
    const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => ({
      ...profile,
      role: roleMap.get(profile.user_id) || 'employee'
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole || !user) return;

    // Prevent self-demotion check
    if (selectedUser.user_id === user.id && newRole !== 'admin') {
      toast({
        title: 'Warning',
        description: 'Changing your own admin role. Make sure there are other admins.',
        variant: 'destructive',
      });
    }

    setUpdating(true);
    
    // Use the secure RPC function instead of direct table update
    // Cast newRole to the expected type for the RPC function
    const { data, error } = await supabase.rpc('update_user_role', {
      _target_user_id: selectedUser.user_id,
      _new_role: newRole as 'employee' | 'manager' | 'admin'
    });

    setUpdating(false);

    if (error) {
      toast({
        title: 'Error updating role',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    // Check the response from the function
    const result = data as { success: boolean; error?: string; old_role?: string; new_role?: string };
    
    if (!result.success) {
      toast({
        title: 'Role Update Failed',
        description: result.error || 'Unknown error occurred',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Role Updated',
      description: `${selectedUser.full_name} is now a ${newRole}. Change has been logged.`,
    });

    setSelectedUser(null);
    setNewRole('');
    fetchUsers();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const roleCounts = {
    admin: users.filter((u) => u.role === 'admin').length,
    manager: users.filter((u) => u.role === 'manager').length,
    employee: users.filter((u) => u.role === 'employee').length,
  };

  // Access denied for non-admins
  if (!loading && !isAdmin) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Access denied. Only administrators can manage user roles.
          Your current role: {currentUserRole || 'Unknown'}
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">User Role Management</h3>
          <p className="text-sm text-muted-foreground">
            Securely manage user roles with audit logging
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          All role changes are logged for security auditing. 
          Roles are stored in a separate secure table with RLS protection.
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-purple-500" />
              <CardDescription>Admins</CardDescription>
            </div>
            <CardTitle className="text-2xl">{roleCounts.admin}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-500" />
              <CardDescription>Managers</CardDescription>
            </div>
            <CardTitle className="text-2xl">{roleCounts.manager}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <CardDescription>Employees</CardDescription>
            </div>
            <CardTitle className="text-2xl">{roleCounts.employee}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            Click on a user's role to change it (changes are audited)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((userItem) => {
                const config = roleConfig[userItem.role] || roleConfig.employee;
                const RoleIcon = config.icon;
                const isSelf = userItem.user_id === user?.id;

                return (
                  <TableRow key={userItem.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(userItem.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{userItem.full_name}</span>
                          {isSelf && (
                            <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {userItem.email}
                    </TableCell>
                    <TableCell>{userItem.department || 'Not set'}</TableCell>
                    <TableCell>
                      <Badge className={`${config.color} flex items-center gap-1 w-fit`}>
                        <RoleIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(userItem);
                          setNewRole(userItem.role);
                        }}
                      >
                        Change Role
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.full_name}. This action will be logged.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Avatar>
                <AvatarFallback>
                  {selectedUser ? getInitials(selectedUser.full_name) : ''}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedUser?.full_name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
              </div>
            </div>

            {selectedUser?.user_id === user?.id && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Warning: You are changing your own role. 
                  If you remove admin access, you won't be able to undo this change.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">New Role</label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Employee
                    </div>
                  </SelectItem>
                  <SelectItem value="manager">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Manager
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <p className="font-medium mb-1">Role Permissions:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• <strong>Employee:</strong> Can submit timesheets</li>
                <li>• <strong>Manager:</strong> Can approve/reject timesheets</li>
                <li>• <strong>Admin:</strong> Can manage users and all features</li>
              </ul>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This change will be recorded in the audit log with your user ID and timestamp.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedUser(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleRoleChange}
                disabled={updating || newRole === selectedUser?.role}
              >
                {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
