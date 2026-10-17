import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Send, Pencil, Trash2 } from 'lucide-react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatViews } from '../components/VideoCard.jsx';
export default function Watch() {
  const { id } = useParams(); const { user } = useAuth();
  const [video, setVideo] = useState(null); const [error, setError] = useState('');
  const [comment, setComment] = useState(''); const [editing, setEditing] = useState(null); const [editText, setEditText] = useState('');
  const load = () => api.get(`/videos/${id}`).then(r => setVideo(r.data)).catch(e => setError(e.response?.data?.message || 'Video could not be loaded.'));
  useEffect(() => { load(); }, [id]);
  const react = async type => { if (!user) return setError('Sign in to react to videos.'); try { await api.post(`/videos/${id}/reaction`, { type }); load(); } catch(e) { setError(e.response?.data?.message || 'Reaction failed.'); } };
  const addComment = async e => { e.preventDefault(); if (!user) return setError('Sign in to comment.'); try { await api.post(`/videos/${id}/comments`, { text: comment }); setComment(''); load(); } catch(e) { setError(e.response?.data?.message || 'Could not add comment.'); } };
  const saveEdit = async commentId => { try { await api.patch(`/videos/${id}/comments/${commentId}`, { text: editText }); setEditing(null); load(); } catch(e) { setError(e.response?.data?.message || 'Could not edit comment.'); } };
  const deleteComment = async commentId => { try { await api.delete(`/videos/${id}/comments/${commentId}`); load(); } catch(e) { setError(e.response?.data?.message || 'Could not delete comment.'); } };
  if (!video) return <div className="page-padding">{error || 'Loading video…'}</div>;
  const embed = video.videoUrl.includes('youtube.com/watch') ? video.videoUrl.replace('watch?v=', 'embed/') : video.videoUrl;
  return <div className="watch-layout"><div className="watch-main"><div className="player-frame">{embed.includes('youtube.com/embed/') || embed.includes('youtu.be/') ? <iframe src={embed.replace('youtu.be/', 'www.youtube.com/embed/')} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/> : <video src={embed} controls poster={video.thumbnailUrl}/>}</div>
    <h1 className="watch-title">{video.title}</h1><div className="watch-toolbar"><div><strong>{video.channel?.channelName}</strong><p className="video-stats">{formatViews(video.views)} views · {new Date(video.createdAt).toLocaleDateString()}</p></div><div className="reaction-buttons"><button onClick={() => react('like')}><ThumbsUp size={18}/> {video.likes?.length || 0}</button><button onClick={() => react('dislike')}><ThumbsDown size={18}/> {video.dislikes?.length || 0}</button></div></div>
    <div className="description-box">{video.description || 'No description provided.'}</div>{error && <p className="form-error">{error}</p>}
    <section className="comments"><h2>{video.comments?.length || 0} Comments</h2><form className="comment-form" onSubmit={addComment}><input value={comment} onChange={e => setComment(e.target.value)} placeholder={user ? 'Add a comment…' : 'Sign in to join the conversation'} disabled={!user} maxLength="1000"/><button aria-label="Post comment" disabled={!user || !comment.trim()}><Send size={18}/></button></form>
      {[...(video.comments || [])].reverse().map(c => <article className="comment" key={c._id}><div className="channel-avatar">{c.username?.[0] || 'U'}</div><div className="comment-content"><div className="comment-by">{c.username} <span>{new Date(c.createdAt).toLocaleDateString()}</span></div>{editing === c._id ? <><input value={editText} onChange={e => setEditText(e.target.value)}/><button className="text-button" onClick={() => saveEdit(c._id)}>Save</button><button className="text-button" onClick={() => setEditing(null)}>Cancel</button></> : <p>{c.text}</p>}</div>{user?.id === c.user && <div className="comment-actions"><button aria-label="Edit comment" onClick={() => { setEditing(c._id); setEditText(c.text); }}><Pencil size={15}/></button><button aria-label="Delete comment" onClick={() => deleteComment(c._id)}><Trash2 size={15}/></button></div>}</article>)}
    </section></div></div>;
}
