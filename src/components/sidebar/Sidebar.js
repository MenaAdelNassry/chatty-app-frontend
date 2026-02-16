import { sideBarItems, fontAwesomeIcons } from "@root/constants";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "@components/sidebar/Sidebar.scss";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { profile } = useSelector((state) => state.user);

  const location = useLocation();
  const navigate = useNavigate();

  const checkUrl = useCallback((name) => {
    return location.pathname.includes(name.toLowerCase());
  }, [location.pathname]);

  const navigateToPage = (name, url) => {
    if(name === "Profile") {
      url = `${url}/${profile.username}/${profile?._id}`
    }

    navigate(url);
  }

  return (
    <div className="app-side-menu">
      <div className="side-menu">
        <ul className="list-unstyled">
          {sideBarItems.map((data) => (
            <li key={data.index} onClick={() => navigateToPage(data.name, data.url)}>
              <div data-testid="sidebar-list" className={`sidebar-link ${checkUrl(data.name) ? 'active' : ''}`}>
                <div className="menu-icon">{fontAwesomeIcons[data.iconName]}</div>
                <div className="menu-link">
                  <span>{data.name}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
