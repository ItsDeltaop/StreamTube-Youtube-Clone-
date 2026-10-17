import { Menu, Search, Video, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
export default function Header({ onMenu }) {
  const [query, setQuery] = useState('');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const search = e => { e.preventDefault(); navigate(`/?search=${encodeURIComponent(query)}`); };
  return <header className="topbar">
    <div className="brand-area"><button className="icon-button" onClick={onMenu} aria-label="Toggle sidebar"><Menu /></button><Link className="brand" to="/"><span className="brand-mark">▶</span> StreamTube</Link></div>
    <form className="searchbar" onSubmit={search}><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search videos" aria-label="Search videos" /><button aria-label="Search"><Search size={20}/></button></form>
    <div className="header-actions">{user ? <><Link to="/channel" className="upload-link"><Video size={18}/> <span>Studio</span></Link><span className="username">{user.username}</span><button className="signin-button" onClick={signOut}>Sign out</button></> : <Link className="signin-button" to="/auth"><UserCircle size={18}/> Sign in</Link>}</div>
  </header>;
}
