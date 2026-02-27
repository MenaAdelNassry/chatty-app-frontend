import { sideBarItems, fontAwesomeIcons } from "@root/constants";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "@components/sidebar/Sidebar.scss";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@redux/reducers/user/user.reducer";

const Sidebar = ({ isSidebarActive }) => {
  const { profile } = useSelector((state) => state.user);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkUrl = useCallback((name) => {
    return location.pathname.includes(name.toLowerCase());
  }, [location.pathname]);

  const navigateToPage = (name, url) => {
    if(name === "Profile") {
      url = `${url}/${profile.username}/${profile?._id}`
    }

    dispatch(toggleSidebar(false));
    navigate(url);
  }
  console.log(isSidebarActive)

  return (
    <div className={`app-side-menu ${isSidebarActive ? 'sidebar-open' : ''}`}>
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
