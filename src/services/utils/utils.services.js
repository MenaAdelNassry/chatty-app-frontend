import { clearUser } from '@redux/reducers/user/user.reducer';
import { avatarColors } from '@root/constants/index';

export class Utils {
  static getRandomAvatarColor() {
    const randomIndex = Math.floor(Math.random() * avatarColors.length);
    return avatarColors[randomIndex];
  }

  static generateAvatarImage(text, backgroundColor, foregroundColor = 'white') {
    const canavas = document.createElement('canvas');
    const context = canavas.getContext('2d');

    canavas.width = 200;
    canavas.height = 200;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canavas.width, canavas.height);

    // Draw text
    context.font = 'normal 80px sans-serif';
    context.fillStyle = foregroundColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canavas.width / 2, canavas.height / 2);

    return canavas.toDataURL('image/png');
  }

  static clearStore({
    dispatch,
    deleteStorageUsername,
    setLoggedIn,
  }) {
    dispatch(clearUser());
    // dispatch clear notification action
    deleteStorageUsername();
    setLoggedIn(false);
  }

  static appEnvironment() {
    const env = process.env.REACT_APP_ENVIRONMENT;
    if (env === 'development') {
      return 'DEV';
    } else if (env === 'staging') {
      return 'STG';
    }
  }

  static generateString(length) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static mapSettingsDropdownItems() {
    const items = [];
    const item = {
      topText: "My Profile",
      subText: "View personal profile"
    }

    items.push(item);
    return items
  }
}
