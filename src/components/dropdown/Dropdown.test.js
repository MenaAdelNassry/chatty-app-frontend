import { render, screen } from '@testing-library/react';
import Dropdown from './Dropdown'; // تأكد من المسار صح

describe('Dropdown Component', () => {
  const props = {
    title: 'Notifications',
    subTitle: 5,
    style: { top: '50px' },
    height: 300,
    children: <div data-testid="child-item">Notification Item</div>,
    footer: <button>Load More</button>
  };

  test('should render dropdown component correctly', () => {
    render(<Dropdown {...props} />);

    const dropdownElement = screen.getByTestId('dropdown');
    expect(dropdownElement).toBeInTheDocument();

    expect(dropdownElement).toHaveStyle({ top: '50px' });
  });

  test('should display title and subtitle', () => {
    render(<Dropdown {...props} />);

    expect(screen.getByText('Notifications')).toBeInTheDocument();

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('should render children content', () => {
    render(<Dropdown {...props} />);

    const childElement = screen.getByTestId('child-item');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Notification Item');
  });

  test('should apply correct height style to info container', () => {
    render(<Dropdown {...props} />);

    const infoContainer = screen.getByTestId('info-container');
    expect(infoContainer).toHaveStyle({ maxHeight: '300px' });
  });

  test('should render footer if provided', () => {
    render(<Dropdown {...props} />);

    const button = screen.getByRole('button', { name: /Load More/i });
    expect(button).toBeInTheDocument();
  });

  test('should NOT render footer if prop is missing', () => {
    const { footer, ...propsWithoutFooter } = props;
    render(<Dropdown {...propsWithoutFooter} />);

    const button = screen.queryByRole('button'); 
    expect(button).not.toBeInTheDocument();
  });
});
