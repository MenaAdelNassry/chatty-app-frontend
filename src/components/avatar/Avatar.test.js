import { render, screen } from '@root/test.utils';
import Avatar from '@components/avatar/Avatar';

describe('Avatar Component', () => {

  describe('Text Avatar (No Image)', () => {
    it('should render the name initial', () => {
      // 1. Render without image
      render(
        <Avatar
          name="Danny"
          bgColor="red"
          textColor="white"
          size={40}
        />
      );

      // 2. Check for the text container
      const avatarNameElement = screen.getByTestId('avatar-name');

      // 3. Assertions
      expect(avatarNameElement).toBeInTheDocument();
      expect(avatarNameElement).toHaveTextContent('D'); // D for Danny
    });

    it('should have correct background color and dimensions', () => {
      render(
        <Avatar
          name="Danny"
          bgColor="#000000"
          size={50}
          round={true}
        />
      );

      const container = screen.getByTestId('avatar-container');

      expect(container).toHaveStyle({
        backgroundColor: '#000000',
        width: '50px',
        height: '50px',
        borderRadius: '50%'
      });
    });

    it('should be square if round prop is false', () => {
      render(<Avatar name="Danny" size={40} round={false} />);
      const container = screen.getByTestId('avatar-container');

      expect(container.style.borderRadius).toBe('');
    });
  });

  describe('Image Avatar', () => {
    it('should render image when avatarSrc is provided', () => {
      const url = 'https://placekitten.com/200/200';
      render(
        <Avatar
          avatarSrc={url}
          size={40}
        />
      );

      const imageElement = screen.getByTestId('avatar-image');

      expect(imageElement).toBeInTheDocument();
      expect(imageElement).toHaveAttribute('src', url);

      expect(imageElement).toHaveStyle({
        width: '40px',
        height: '40px',
        borderRadius: '50%'
      });
    });

    it('should NOT render initials container when image exists', () => {
      render(<Avatar avatarSrc="valid-url" name="Danny" size={40} />);

      const avatarContainer = screen.queryByTestId('avatar-container');
      expect(avatarContainer).not.toBeInTheDocument();
    });
  });
});
