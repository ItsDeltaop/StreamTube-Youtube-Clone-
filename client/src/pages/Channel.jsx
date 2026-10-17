import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import VideoCard from '../components/VideoCard.jsx';
const blank = { title: '', description: '', thumbnailUrl: '', videoUrl: '', category: 'Technology' };
export default function Channel() {
  const { user } = useAuth(); const navigate = useNavigate();
  const [channel, setChannel] = useState(null); const [videos, setVideos] = useState([]);
  const [channelForm, setChannelForm] = useState({ channelName: '', description: '' });
  const [form, setForm] = useState(blank); const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const load = async () => { try { const { data } = await api.get('/channels/mine'); setChannel(data); if (data) { const result = await api.get(`/channels/${data._id}`); setVideos(result.data.videos); } } catch(e) { setError(e.response?.data?.message || 'Could not load channel.'); } };
  useEffect(() => { if (user) load(); }, [user]);
  if (!user) return <div className="auth-required"><h1>Your creator studio</h1><p>Sign in to create a channel and manage your videos.</p><button className="primary-button" onClick={() => navigate('/auth')}>Sign in</button></div>;
  const createChannel = async e => { e.preventDefault(); setError(''); try { await api.post('/channels', channelForm); load(); } catch(e) { setError(e.response?.data?.message || 'Could not create channel.'); } };
  const submitVideo = async e => { e.preventDefault(); setBusy(true); setError(''); try { if (editing) await api.patch(`/videos/${editing}`, form); else await api.post('/videos', form); setShowForm(false); setEditing(null); setForm(blank); await load(); } catch(e) { setError(e.response?.data?.message || 'Could not save video.'); } finally { setBusy(false); } };
  const editVideo = v => { setEditing(v._id); setForm({ title:v.title, description:v.description || '', thumbnailUrl:v.thumbnailUrl, videoUrl:v.videoUrl, category:v.category }); setShowForm(true); };
  const removeVideo = async id => { if (!confirm('Delete this video? This cannot be undone.')) return; try { await api.delete(`/videos/${id}`); load(); } catch(e) { setError(e.response?.data?.message || 'Could not delete video.'); } };
  return <div className="channel-page"><div className="channel-banner"><div className="channel-avatar large">{channel?.channelName?.[0] || user.username[0]}</div><div><h1>{channel?.channelName || 'Creator studio'}</h1><p>{channel?.description || 'Set up your channel and start sharing videos.'}</p></div></div>{error && <p className="form-error">{error}</p>}
    {!channel ? <form className="inline-form channel-create" onSubmit={createChannel}><h2>Create your channel</h2><label>Channel name<input value={channelForm.channelName} onChange={e => setChannelForm({...channelForm, channelName:e.target.value})} minLength="3" required/></label><label>Description<textarea value={channelForm.description} onChange={e => setChannelForm({...channelForm, description:e.target.value})}/></label><button className="primary-button">Create channel</button></form> : <>
    <div className="section-heading"><div><h2>Your videos</h2><p className="muted">{videos.length} videos published</p></div><button className="primary-button" onClick={() => { setEditing(null); setForm(blank); setShowForm(v => !v); }}><Plus size={18}/> Upload video</button></div>
    {showForm && <form className="video-editor" onSubmit={submitVideo}><h3>{editing ? 'Edit video' : 'Add a video'}</h3><label>Title<input value={form.title} onChange={e => setForm({...form,title:e.target.value})} maxLength="120" required/></label><label>Description<textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})}/></label><label>Thumbnail URL<input type="url" value={form.thumbnailUrl} onChange={e => setForm({...form,thumbnailUrl:e.target.value})} required/></label><label>Video URL (YouTube embed URL or direct media URL)<input type="url" value={form.videoUrl} onChange={e => setForm({...form,videoUrl:e.target.value})} required/></label><label>Category<select value={form.category} onChange={e => setForm({...form,category:e.target.value})}>{['Technology','Music','Gaming','Nature','Science','Cooking','Design','Travel'].map(c => <option key={c}>{c}</option>)}</select></label><div className="editor-actions"><button className="primary-button" disabled={busy}>{busy ? 'Saving…' : 'Save video'}</button><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button></div></form>}
    <div className="video-grid channel-grid">{videos.map(v => <div className="managed-video" key={v._id}><VideoCard video={v}/><div className="manage-actions"><button onClick={() => editVideo(v)}><Pencil size={15}/> Edit</button><button onClick={() => removeVideo(v._id)}><Trash2 size={15}/> Delete</button></div></div>)}</div></>}</div>;
}
