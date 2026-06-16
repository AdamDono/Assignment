import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiLogin, apiRegister } from '../api/auth';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: Props) {
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (tab === 'register' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res =
        tab === 'login'
          ? await apiLogin(email, password)
          : await apiRegister(email, password);

      login(res.access_token, res.user);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-header">
          <h2 className="modal-title">
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="modal-subtitle">
            {tab === 'login'
              ? 'Sign in to complete your purchase'
              : 'Sign up to complete your purchase'}
          </p>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Login
          </button>
          <button
            className={`modal-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              className="form-input"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-confirm">Confirm Password</label>
              <input
                id="auth-confirm"
                type="password"
                className="form-input"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="form-submit-btn"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : tab === 'login'
              ? 'Sign In & Place Order'
              : 'Register & Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
