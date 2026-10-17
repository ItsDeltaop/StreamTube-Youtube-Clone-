import { Link } from 'react-router-dom';
export function formatViews(n) { return Intl.NumberFormat('en', { notation: n >= 1000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(n || 0); }
export default function VideoCard({ video }) {
  return <article className="video-card"><Link to={`/watch/${video._id}`} className="thumbnail"><img src={video.thumbnailUrl} alt="" loading="lazy" onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800'; }}/><span className="play-overlay">▶</span></Link><div className="video-meta"><div className="channel-avatar">{video.channel?.channelName?.[0] || 'S'}</div><div><Link to={`/watch/${video._id}`} className="video-title">{video.title}</Link><p className="channel-name">{video.channel?.channelName || 'StreamTube creator'}</p><p className="video-stats">{formatViews(video.views)} views · {new Date(video.createdAt).toLocaleDateString()}</p></div></div></article>;
}
