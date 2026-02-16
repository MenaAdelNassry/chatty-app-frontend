import PropTypes from 'prop-types';
import '@components/dropdown/Dropdown.scss';
import './Dropdown.scss';

const DropdownItem = ({
  avatar,
  icon,
  title,
  subTitle,
  onClick,
  topBorder = false // عشان لو عايز تفصل بين مجموعات
}) => {
  return (
    <div
      className={`dropdown-item ${topBorder ? 'top-border' : ''}`}
      onClick={onClick}
      data-testid="dropdown-item"
    >
      {/* 1. Avatar or Icon */}
      {(avatar || icon) && (
        <div className="item-icon-wrapper">
          {avatar ? avatar : icon}
        </div>
      )}

      {/* 2. Text */}
      <div className="item-content">
        <h6 className="title">{title}</h6>
        {subTitle && <p className="subtext">{subTitle}</p>}
      </div>

      {/* 3. ممكن تضيف مكان لأيقونة في الآخر (سهم مثلاً) لو حابب مستقبلاً */}
    </div>
  );
};

DropdownItem.propTypes = {
  avatar: PropTypes.node, // لو هتبعت كومبوننت Avatar
  icon: PropTypes.node,   // لو هتبعت أيقونة عادية
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  onClick: PropTypes.func,
  topBorder: PropTypes.bool
};

export default DropdownItem;
