import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
export default function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const { signIn } = useAuth(); const navigate = useNavigate();
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setError(''); setMessage('');
    if (mode === 'register' && form.username.trim().length < 3) return setError('Username must be at least 3 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    setBusy(true);
    try {
      if (mode === 'register') { await api.post('/auth/register', form); setMessage('Account created. Please sign in.'); setMode('login'); }
      else { const { data } = await api.post('/auth/login', form); signIn(data); navigate('/'); }
    } catch (e) { setError(e.response?.data?.message || 'Something went wrong. Please try again.'); } finally { setBusy(false); }
  };
  return <div className="auth-wrap"><form className="auth-card" onSubmit={submit}><div className="auth-logo">▶</div><h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1><p className="muted">Join a community of curious minds.</p>
    {mode === 'register' && <label>Username<input name="username" value={form.username} onChange={change} minLength="3" maxLength="30" required placeholder="Your name"/></label>}
    <label>Email<input name="email" type="email" value={form.email} onChange={change} required placeholder="you@example.com"/></label>
    <label>Password<input name="password" type="password" value={form.password} onChange={change} minLength="8" required placeholder="At least 8 characters"/></label>
    {error && <p className="form-error">{error}</p>}{message && <p className="form-success">{message}</p>}
    <button className="primary-button full-width" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
    <p className="auth-switch">{mode === 'login' ? 'New to StreamTube?' : 'Already have an account?'} <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setMessage(''); }}>{mode === 'login' ? 'Create account' : 'Sign in'}</button></p>
    <Link className="back-home" to="/">← Back to videos</Link>
  </form></div>;
}
