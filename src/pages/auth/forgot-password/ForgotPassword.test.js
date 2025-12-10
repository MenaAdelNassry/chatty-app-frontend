import ForgotPassword from '@pages/auth/forgot-password/ForgotPassword';
import { render, screen, waitFor } from '@root/test.utils';
import { authService } from '@services/api/auth/auth.service';
import userEvent from '@testing-library/user-event';

describe('ForgotPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('form should have email label', () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toBeInTheDocument();
  });

  it('should have "Back to Login" text', () => {
    render(<ForgotPassword />);
    const spanElement = screen.getByText('Back to Login');
    expect(spanElement).toBeInTheDocument();
  });

  describe('Button', () => {
    it('button should be disabled', () => {
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();
    });

    it('should be enabled with input', async () => {
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      const emailInput = screen.getByLabelText('Email');

      userEvent.type(emailInput, 'test@test.com');
      expect(buttonElement).toBeEnabled();
    });

    it('should change label when clicked', async () => {
      jest.spyOn(authService, 'forgotPassword').mockResolvedValue({
        data: { message: 'Password reset email sent.' },
      });
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      const emailInput = screen.getByLabelText('Email');

      userEvent.type(emailInput, 'test@test.com');
      userEvent.click(buttonElement);

      const newButtonElement = screen.getByRole('button');
      expect(newButtonElement.textContent).toEqual(
        'FORGOT PASSWORD IN PROGRESS...'
      );

      await waitFor(() => {
        const newButtonElement = screen.getByRole('button');
        expect(newButtonElement.textContent).toEqual('FORGOT PASSWORD');
      });
    });
  });

  describe('Success', () => {
    it('should display success alert', async () => {
      jest.spyOn(authService, 'forgotPassword').mockResolvedValue({
        data: { message: 'Password reset email sent.' },
      });
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      const emailInput = screen.getByLabelText('Email');

      userEvent.type(emailInput, 'test@test.com');
      userEvent.click(buttonElement);

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-success');
      expect(alert.textContent).toEqual('Password reset email sent.');
    });
  });

  describe('Error', () => {
    it('should display error alert and border', async () => {
      jest.spyOn(authService, 'forgotPassword').mockRejectedValue({
        response: {
          data: { message: 'Field must be valid' },
        },
      });
      render(<ForgotPassword />);
      const buttonElement = screen.getByRole('button');
      const emailInput = screen.getByLabelText('Email');

      userEvent.type(emailInput, 'test');
      userEvent.click(buttonElement);

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-error');
      expect(alert.textContent).toEqual('Field must be valid');

      await waitFor(() =>
        expect(emailInput).toHaveStyle({ border: '1px solid #fa9b8a' })
      );
    });
  });
});
