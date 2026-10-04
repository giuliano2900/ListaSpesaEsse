/**
 * Haptic feedback utility for mobile smartphones (iOS & Android)
 * Uses navigator.vibrate where supported (Android Chrome/Firefox, Progressive Web Apps)
 * Fails silently and safely on platforms without vibration support (e.g. standard Safari).
 */

export function triggerHaptic(type: 'light' | 'medium' | 'success' | 'warning' | 'selection' = 'light'): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      switch (type) {
        case 'light':
        case 'selection':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(25);
          break;
        case 'success':
          navigator.vibrate([15, 30, 25]);
          break;
        case 'warning':
          navigator.vibrate([30, 40, 30]);
          break;
      }
    }
  } catch {
    // Ignore any browser security restrictions
  }
}
