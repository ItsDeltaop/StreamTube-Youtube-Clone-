import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('streamtube_token')) api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => localStorage.removeItem('streamtube_token')).finally(() => setReady(true));
    else setReady(true);
  }, []);
  const signIn = data => { localStorage.setItem('streamtube_token', data.token); setUser(data.user); };
  const signOut = () => { localStorage.removeItem('streamtube_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, ready, signIn, signOut }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
