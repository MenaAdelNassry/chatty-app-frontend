import { render, screen, waitFor } from '@root/test.utils';
import Register from '@pages/auth/register/Register';
import userEvent from '@testing-library/user-event';
import { Utils } from '@services/utils/utils.services';
import { authService } from '@services/api/auth/auth.service';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Register', () => {
  it('signup form should have its labels', () => {
    render(<Register />);

    const usernameLabel = screen.getByLabelText('Username');
    const emailLabel = screen.getByLabelText('Email');
    const passwordLabel = screen.getByLabelText('Password');

    expect(usernameLabel).toBeInTheDocument();
    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
  });
});

describe('Button', () => {
  it('should be disabled', () => {
    render(<Register />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });

  it('should be enabled with input values', () => {
    render(<Register />);

    const buttonElement = screen.getByRole('button');
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    userEvent.type(usernameInput, 'Mena');
    userEvent.type(emailInput, 'test@test.com');
    userEvent.type(passwordInput, '12345');

    expect(buttonElement).toBeEnabled();
  });

  it('should change label when clicked', async () => {
    jest.spyOn(Utils, 'generateAvatarImage').mockReturnValue('avatar image');
    jest.spyOn(authService, 'signUp').mockResolvedValue({
      data: {
        message: 'User created successfully',
        token: 'fake-token',
        user: { username: 'Mena', email: 'test@test.com' },
      },
    });

    render(<Register />);
    const buttonElement = screen.getByRole('button');
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    userEvent.type(usernameInput, 'Mena');
    userEvent.type(emailInput, 'test@test.com');
    userEvent.type(passwordInput, '12345');

    userEvent.click(buttonElement);

    await waitFor(() => {
      const newButtonElement = screen.getByRole('button');
      expect(newButtonElement.textContent).toEqual('SIGNUP IN PROGRESS...');
    });
  });
});

describe('Success', () => {
  it('should navigate to streams page', async () => {
    jest.spyOn(Utils, 'generateAvatarImage').mockReturnValue('avatar image');
    jest.spyOn(authService, 'signUp').mockResolvedValue({
      data: {
        message: 'User created successfully',
        token: 'fake-token',
        user: { username: 'Mena', email: 'test@test.com' },
      },
    });

    render(<Register />);

    const buttonElement = screen.getByRole('button');
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    userEvent.type(usernameInput, 'Mena');
    userEvent.type(emailInput, 'test@test.com');
    userEvent.type(passwordInput, '12345');

    userEvent.click(buttonElement);

    await waitFor(() =>
      expect(mockedUseNavigate).toHaveBeenCalledWith('/app/social/streams')
    );
  });
});

describe('Error', () => {
  it('should display error alert and border', async () => {
    jest.spyOn(Utils, 'generateAvatarImage').mockReturnValue('avatar image');
    jest.spyOn(authService, 'signUp').mockRejectedValue({
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    });

    render(<Register />);

    const buttonElement = screen.getByRole('button');
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    userEvent.type(usernameInput, 'Mena');
    userEvent.type(emailInput, 'test@test.com');
    userEvent.type(passwordInput, '12345');

    userEvent.click(buttonElement);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert.textContent).toEqual('Invalid credentials');

    await waitFor(() =>
      expect(usernameInput).toHaveStyle({ border: '1px solid #fa9b8a' })
    );
    await waitFor(() =>
      expect(emailInput).toHaveStyle({ border: '1px solid #fa9b8a' })
    );
    await waitFor(() =>
      expect(passwordInput).toHaveStyle({ border: '1px solid #fa9b8a' })
    );
  });
});
