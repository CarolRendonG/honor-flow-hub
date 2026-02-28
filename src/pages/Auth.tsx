import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Zap, Heart, Building2, Shield, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const roleOptions: { role: UserRole; label: string; desc: string; icon: React.ElementType }[] = [
  { role: 'donor', label: 'Donante', desc: 'Explora y dona a proyectos', icon: Heart },
  { role: 'receptor', label: 'Receptor', desc: 'Gestiona proyectos', icon: Building2 },
];

export default function Auth() {
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await login(email, password);
      if (error) {
        toast({ title: 'Error al iniciar sesión', description: error, variant: 'destructive' });
      }
    } else {
      const { error } = await signup(email, password, fullName, selectedRole);
      if (error) {
        toast({ title: 'Error al registrarse', description: error, variant: 'destructive' });
      } else {
        toast({ title: '¡Cuenta creada!', description: 'Revisa tu correo para confirmar tu cuenta.' });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(82,100%,36%,0.08),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center glow-green">
            <Zap className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gradient-green mb-2">Cashed</h1>
        <p className="text-muted-foreground text-lg">Transparencia social que transforma</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="glass p-8 rounded-2xl">
          <h2 className="text-xl font-semibold mb-6 text-center">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre completo"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50"
                minLength={6}
                required
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tipo de cuenta:</p>
                <div className="grid grid-cols-2 gap-2">
                  {roleOptions.map(r => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setSelectedRole(r.role)}
                      className={`p-3 rounded-xl text-left text-sm transition-all border ${
                        selectedRole === r.role
                          ? 'border-primary bg-primary/15 text-primary'
                          : 'border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      <r.icon className="w-4 h-4 mb-1" />
                      <div className="font-medium">{r.label}</div>
                      <div className="text-xs opacity-70">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLogin ? 'Entrar' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 mt-6 text-xs text-muted-foreground"
      >
        Plataforma de donaciones con cumplimiento LFPIORPI
      </motion.p>
    </div>
  );
}
