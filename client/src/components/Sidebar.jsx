import { Compass, Home, Music2, History, ThumbsUp, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Sidebar({ open }) {
  if (!open) return null;
  return <aside className="sidebar"><Link to="/"><Home/> <span>Home</span></Link><Link to="/?category=Explore"><Compass/><span>Explore</span></Link><Link to="/?category=Music"><Music2/><span>Music</span></Link><Link to="/channel"><UserRound/><span>Your channel</span></Link><div className="side-divider"/><div className="side-caption">Your space</div><Link to="/?category=History"><History/><span>History</span></Link><Link to="/?category=Liked"><ThumbsUp/><span>Liked videos</span></Link><p className="side-note">Discover something worth watching.</p></aside>;
}
