import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import Watch from './pages/Watch.jsx';
import Channel from './pages/Channel.jsx';
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return <><Header onMenu={() => setSidebarOpen(v => !v)} /><div className="app-shell"><Sidebar open={sidebarOpen} /><main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}><Routes><Route path="/" element={<Home />} /><Route path="/auth" element={<Auth />} /><Route path="/watch/:id" element={<Watch />} /><Route path="/channel" element={<Channel />} /><Route path="*" element={<Home />} /></Routes></main></div></>;
}
