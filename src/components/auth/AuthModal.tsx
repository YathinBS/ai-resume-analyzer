import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot-password';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { login, register } = useAuth();
  const toast = useToast();

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setResetSent(false);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (mode === 'register' && !name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (mode !== 'forgot-password') {
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (mode === 'register' && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password, rememberMe);
        toast.success('Signed in successfully');
        onClose();
        if (onSuccess) onSuccess();
      } else if (mode === 'register') {
        await register(name, email, password);
        toast.success('Account created successfully. Welcome to ResumeAI!');
        onClose();
        if (onSuccess) onSuccess();
      } else if (mode === 'forgot-password') {
        setResetSent(true);
        toast.info('Password reset instructions sent to your email');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'login'
          ? 'Sign in to ResumeAI'
          : mode === 'register'
          ? 'Create your ResumeAI account'
          : 'Reset your password'
      }
      description={
        mode === 'login'
          ? 'Enter your credentials to access your resume analyses.'
          : mode === 'register'
          ? 'Start optimizing your resume with AI and ATS intelligence.'
          : "We'll send password recovery instructions to your email."
      }
      maxWidth="md"
    >
      <div className="space-y-4 pt-2">
        {resetSent ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Check your inbox</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              We've dispatched a recovery link to <span className="font-semibold">{email}</span>.
            </p>
            <div className="pt-2">
              <Button size="sm" variant="outline" onClick={() => { setMode('login'); setResetSent(false); }}>
                Back to Sign In
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <Input
                label="Full Name"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            {mode !== 'forgot-password' && (
              <Input
                label="Password"
                type="password"
                showPasswordToggle
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
              />
            )}

            {mode === 'register' && (
              <Input
                label="Confirm Password"
                type="password"
                showPasswordToggle
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                required
              />
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-0"
                  />
                  <span>Remember me for 30 days</span>
                </label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot-password'); setErrors({}); }}
                  className="font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
            >
              {mode === 'login'
                ? 'Sign In'
                : mode === 'register'
                ? 'Create Account'
                : 'Send Reset Link'}
            </Button>
          </form>
        )}

        {/* Switch mode links */}
        <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setErrors({}); }}
                className="font-semibold text-slate-900 dark:text-white underline underline-offset-4"
              >
                Sign up
              </button>
            </p>
          ) : mode === 'register' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrors({}); }}
                className="font-semibold text-slate-900 dark:text-white underline underline-offset-4"
              >
                Sign in
              </button>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => { setMode('login'); setErrors({}); }}
              className="font-semibold text-slate-900 dark:text-white underline underline-offset-4"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
