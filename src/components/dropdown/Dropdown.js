import PropTypes from 'prop-types';
import '@components/dropdown/Dropdown.scss';

const Dropdown = ({ title, subTitle, children, style, height, footer }) => {
  return (
    <div className="dropdown-container" style={style} data-testid="dropdown">
      <div className="dropdown-card">

        {/* 1. Header */}
        <div className="dropdown-header">
          <h5>
            {title}
            {(subTitle !== undefined && subTitle !== null) && (
              <small className="count-badge">{subTitle}</small>
            )}
          </h5>
        </div>

        {/* 2. Body (Dynamic Items) */}
        <div className="dropdown-body">
          <div
            className="scrollable-content"
            style={{ maxHeight: `${height}px` }}
          >
            {children}
          </div>
        </div>

        {/* 3. Footer (optional) */}
        {footer && (
          <div className="dropdown-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  height: PropTypes.number,
  footer: PropTypes.node
};

Dropdown.defaultProps = {
  height: 300
};

export default Dropdown;
