import Login from '@pages/auth/login/Login';
import { render, screen, waitFor } from '@root/test.utils';
import { authService } from '@services/api/auth/auth.service';
import userEvent from '@testing-library/user-event';
import { existingUser, userJwt } from '@mocks/data/user.mock';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('SignIn', () => {
  it('signin form should have its labels', () => {
    render(<Login />);

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const checkboxElement = screen.getByLabelText('Keep me signed in');

    expect(checkboxElement).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
  });

  it('checkbox should be unchecked', () => {
    render(<Login />);
    const checkboxElement = screen.getByLabelText('Keep me signed in');
    expect(checkboxElement).not.toBeChecked();
  });

  it('checkbox should be checked when clicked', () => {
    render(<Login />);

    const checkboxElement = screen.getByLabelText('Keep me signed in');
    expect(checkboxElement).not.toBeChecked();

    userEvent.click(checkboxElement);

    expect(checkboxElement).toBeChecked();
  });

  describe('Button', () => {
    it('should be disabled', () => {
      render(<Login />);
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();
    });

    it('should be enabled with inputs', () => {
      render(<Login />);

      const buttonElement = screen.getByRole('button');
      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');

      expect(buttonElement).toBeDisabled();

      userEvent.type(usernameInput, 'Mena');
      userEvent.type(passwordInput, '123456');

      expect(buttonElement).toBeEnabled();
    });

    it('should change label when clicked', async () => {
      jest.spyOn(authService, 'signIn').mockResolvedValue({});
      render(<Login />);

      const buttonElement = screen.getByRole('button');
      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');

      userEvent.type(usernameInput, 'Mena');
      userEvent.type(passwordInput, '123456');

      userEvent.click(buttonElement);

      await waitFor(() => {
        const newButtonElement = screen.getByRole('button');
        expect(newButtonElement.textContent).toEqual('SIGNIN IN PROGRESS...');
      });
    });
  });

  describe('Success', () => {
    it('should navigate to streams page', async () => {
      jest.spyOn(authService, 'signIn').mockResolvedValue({
        data: {
          message: 'User login successfully',
          user: existingUser,
          token: userJwt,
        },
      });
      render(<Login />);

      const buttonElement = screen.getByRole('button');
      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');

      userEvent.type(usernameInput, 'Mena');
      userEvent.type(passwordInput, '123456');

      userEvent.click(buttonElement);

      await waitFor(() => {
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/app/social/streams');
      });
    });
  });

  describe('Error', () => {
    it('should display error alert and border', async () => {
      jest.spyOn(authService, 'signIn').mockRejectedValue({
        response: { data: { message: 'Invalid credentials' } },
      });

      render(<Login />);
      const buttonElement = screen.getByRole('button');
      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');

      userEvent.type(usernameInput, 'Mena');
      userEvent.type(passwordInput, '123456');
      userEvent.click(buttonElement);

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert.textContent).toEqual('Invalid credentials');

      await waitFor(() =>
        expect(usernameInput).toHaveStyle({ border: '1px solid #fa9b8a' })
      );
      await waitFor(() =>
        expect(passwordInput).toHaveStyle({ border: '1px solid #fa9b8a' })
      );
    });
  });
});
