import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { UserPlus, Shield, Building2, Users, Loader2, Mail, Lock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ManagedUser {
  user_id: string;
  role: string;
  full_name: string;
  email: string;
  created_at: string;
}

export default function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'receptor' | 'admin'>('receptor');

  const fetchUsers = async () => {
    setLoading(true);
    const { data: roles } = await supabase.from('user_roles').select('user_id, role, created_at');
    if (roles) {
      const userIds = roles.map(r => r.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      const merged: ManagedUser[] = roles.map(r => {
        const p = profiles?.find(p => p.user_id === r.user_id);
        return {
          user_id: r.user_id,
          role: r.role,
          full_name: p?.full_name || '',
          email: p?.email || '',
          created_at: r.created_at,
        };
      });
      setUsers(merged);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchUsers();
  }, [user]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    // Sign up the user via Supabase Auth
    const { error } = await supabase.auth.signUp({
      email: newEmail,
      password: newPassword,
      options: {
        data: { full_name: newName, role: newRole },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Usuario creado', description: `Se envió invitación a ${newEmail}` });
      setDialogOpen(false);
      setNewEmail('');
      setNewPassword('');
      setNewName('');
      setTimeout(fetchUsers, 2000);
    }
    setCreating(false);
  };

  const roleConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
    admin: { label: 'Admin', icon: Shield, color: 'bg-destructive/15 text-destructive border-destructive/30' },
    receptor: { label: 'Receptor', icon: Building2, color: 'bg-primary/15 text-primary border-primary/30' },
    donor: { label: 'Donante', icon: Users, color: 'bg-accent/15 text-accent border-accent/30' },
  };

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-muted-foreground">Acceso denegado</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground text-sm">Crear y administrar cuentas de receptor y admin</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" /> Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-strong">
            <DialogHeader>
              <DialogTitle>Crear Nueva Cuenta</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre completo"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Contraseña temporal"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="pl-10"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Tipo de cuenta</label>
                <Select value={newRole} onValueChange={v => setNewRole(v as 'receptor' | 'admin')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receptor">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> Receptor
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Admin Secundario
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={creating}>
                {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Crear Cuenta
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-3">
          {users.map(u => {
            const rc = roleConfig[u.role] || roleConfig.donor;
            return (
              <motion.div
                key={u.user_id + u.role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-4 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <rc.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">{u.full_name || 'Sin nombre'}</div>
                    <div className="text-sm text-muted-foreground">{u.email}</div>
                  </div>
                </div>
                <Badge variant="outline" className={rc.color}>{rc.label}</Badge>
              </motion.div>
            );
          })}
          {users.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No hay usuarios registrados aún
            </div>
          )}
        </div>
      )}
    </div>
  );
}
