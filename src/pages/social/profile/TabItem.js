import { Link } from 'react-router-dom';
const TabItem = ({ name, icon, active, type }) => (
  <Link to={`?tab=${type}`} className={`nav-item ${active ? 'active' : ''}`}>
    {icon} <span>{name}</span>
  </Link>
);

export default TabItem;
