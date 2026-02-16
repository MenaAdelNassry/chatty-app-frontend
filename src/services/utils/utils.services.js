import { clearUser } from '@redux/reducers/user/user.reducer';
import { avatarColors } from '@root/constants/index';
import { clearNotifications } from '@redux/reducers/notifications/notifications.reducer';
import { formatDistanceToNow } from 'date-fns';
import moment from 'moment';
import dayjs from 'dayjs';

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

  static clearStore({ dispatch }) {
    dispatch(clearUser());
    dispatch(clearNotifications());
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
      topText: 'My Profile',
      subText: 'View personal profile',
    };

    items.push(item);
    return items;
  }

  static timeAgo(date) {
    if (!date) return '';
    // addSuffix: true >> عشان يكتب "about 2 hours ago"
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }

  static appResourceUrl(version, id, type = 'image') {
    if (
      typeof version === 'string' &&
      typeof id === 'string' &&
      version &&
      id
    ) {
      version = version.replace(/v/g, '');
      return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/${type}/upload/v${version}/${id}`;
    }
    return null;
  }

  static formatNotificationDate(date) {
    return moment(date).format('DD MMM YYYY [at] h:mm A');
  }

  static shortenLargeNumbers(num, options = {}) {
    // Default options
    const {
      decimals = 1, // عدد الكسور
      locale = 'en-US', // اللغة (للفاصلة والنقطة)
      minNumber = 1000, // أقل رقم للاختصار
      units = ['', 'K', 'M', 'B', 'T'], // الوحدات
      forceDecimals = false, // إظهار الكسور حتى لو .0
      separator = '', // فاصل بين الرقم والوحدة
    } = options;

    // تحقق من أن الرقم صحيح
    if (typeof num !== 'number' || isNaN(num)) {
      return '0';
    }

    // إذا الرقم أقل من الحد الأدنى، ارجعه كما هو
    if (Math.abs(num) < minNumber) {
      return num.toLocaleString(locale);
    }

    // حساب الوحدة المناسبة
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

    // التحقق من عدم تجاوز الوحدات المعرفة
    if (tier >= units.length) {
      return num.toLocaleString(locale);
    }

    // حساب القيمة المختصرة
    const scaled = num / Math.pow(1000, tier);

    // التنسيق مع عدد الكسور المطلوب
    let formatted = scaled.toLocaleString(locale, {
      minimumFractionDigits: forceDecimals ? decimals : 0,
      maximumFractionDigits: decimals,
    });

    // إزالة .0 إذا لم يكن forceDecimals مفعل
    if (!forceDecimals && formatted.includes('.0')) {
      formatted = formatted.replace('.0', '');
    }

    // إضافة الوحدة والفاصل
    return formatted + (separator || '') + units[tier];
  }

  static generateThumbnailUrl(videoUrl, options = {}) {
    // Default options
    const {
      width = 400,
      height = 225,
      crop = 'fill',
      format = 'jpg',
      offset = 'auto', // 'auto' or number of seconds
    } = options;

    // Remove .mp4 or any video extension
    const baseUrl = videoUrl.replace(/\.(mp4|webm|mov|avi)$/i, '');

    // Get the path after /upload/
    const pathParts = baseUrl.split('/upload/');

    if (pathParts.length !== 2) {
      console.error('Invalid Cloudinary video URL');
      return videoUrl;
    }

    // Add transformations
    let transformations = '';

    // Add time offset if specified
    if (offset !== 'auto') {
      transformations += `so_${offset},`;
    }

    transformations += `w_${width},h_${height},c_${crop}`;

    // Reconstruct URL with transformations
    return `${pathParts[0]}/upload/${transformations}/${pathParts[1]}.${format}`;
  }

  static chatDate = (date) => {
    return dayjs(date).format('D MMM YYYY');
  };

  static formatTime = (date) => {
    return dayjs(date).format('h:mm A');
  }
}
