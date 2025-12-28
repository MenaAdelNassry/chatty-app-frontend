import PropTypes from 'prop-types';
import '@components/dropdown/Dropdown.scss';

const Dropdown = ({
  title,
  subTitle,
  children,
  style,
  height,
  footer
}) => {
  return (
    <div className="social-dropdown" style={style} data-testid="dropdown">
      <div className="social-card">

        {/* --- 1. Header --- */}
        <div className="social-card-body">
          <div className="social-bg-primary">
            <h5>
              {title}
              {subTitle?.toString() && <small className="social-count">{subTitle}</small>}
            </h5>
          </div>

          <div className="social-card-body-info">
            {/* --- 2. Body (Dynamic Content) --- */}
            <div
              data-testid="info-container"
              className="social-card-body-info-container"
              style={{ maxHeight: `${height}px` }}
            >
              {children}
            </div>

            {/* --- 3. Footer (Optional) --- */}
            {footer && (
              <div className="social-sub-button">
                {footer}
              </div>
            )}
          </div>
        </div>
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

export default Dropdown;
