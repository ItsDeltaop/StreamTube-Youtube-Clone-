import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api.js';
import VideoCard from '../components/VideoCard.jsx';
const categories = ['All', 'Technology', 'Music', 'Gaming', 'Nature', 'Science', 'Cooking', 'Design', 'Travel'];
export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'All';
  const search = params.get('search') || '';
  useEffect(() => {
    setLoading(true); setError('');
    api.get('/videos', { params: { category, search } }).then(r => setVideos(r.data)).catch(e => setError(e.response?.data?.message || 'Could not load videos. Is the API running?')).finally(() => setLoading(false));
  }, [category, search]);
  return <div className="home-page"><div className="chips">{categories.map(item => <button key={item} className={`chip ${category === item ? 'active' : ''}`} onClick={() => setParams(p => { const n = new URLSearchParams(p); if (item === 'All') n.delete('category'); else n.set('category', item); return n; })}>{item}</button>)}</div>
    <section className="video-grid">{loading ? <p className="state-message">Loading videos…</p> : error ? <p className="state-message error">{error}</p> : videos.length ? videos.map(video => <VideoCard key={video._id} video={video}/>) : <div className="empty-state"><div className="empty-icon">▶</div><h2>No videos found</h2><p>Try another search or category.</p><button className="primary-button" onClick={() => { setParams({}); }}>Clear filters</button></div>}</section>
  </div>;
}
