import { t } from './i18n/index.js';

export const STATUS_KEYS = [
  'RECEIVED',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export function getStatusLabel(status) {
  return t(`status.${status}`);
}

export const STATUS_LABELS = new Proxy(
  {},
  {
    get(_, status) {
      if (typeof status === 'string' && STATUS_KEYS.includes(status)) {
        return t(`status.${status}`);
      }
      return undefined;
    },
    ownKeys() {
      return STATUS_KEYS;
    },
    getOwnPropertyDescriptor(_, prop) {
      if (typeof prop === 'string' && STATUS_KEYS.includes(prop)) {
        return {
          value: t(`status.${prop}`),
          writable: false,
          enumerable: true,
          configurable: true,
        };
      }
      return undefined;
    },
  },
);

export const STATUS_BADGE_CLASSES = {
  RECEIVED: 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 dark:border dark:border-orange-800/60',
  PICKED_UP: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 dark:border dark:border-blue-800/60',
  IN_TRANSIT: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 dark:border dark:border-blue-800/60',
  OUT_FOR_DELIVERY: 'bg-green-100 text-green-800 dark:bg-green-950/70 dark:text-green-300 dark:border dark:border-green-800/60',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-950/70 dark:text-green-300 dark:border dark:border-green-800/60',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 dark:border dark:border-red-800/60',
};
