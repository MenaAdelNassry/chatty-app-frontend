import { avatarColors } from '@root/constants/index'

export class Utils {
  static getRandomAvatarColor() {
    const randomIndex = Math.floor(Math.random() * avatarColors.length);
    return avatarColors[randomIndex];
  }

  static generateAvatarImage(text, backgroundColor, foregroundColor='white') {
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
}
