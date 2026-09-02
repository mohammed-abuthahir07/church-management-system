/**
 * Formats a date string to a user-friendly format (e.g., 01 Sep 2026)
 * @param {string|Date} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return String(dateStr);

    const day = String(date.getDate()).padStart(2, '0');
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  } catch {
    return String(dateStr);
  }
};

/**
 * Formats a time string (e.g. "06:00:00" or ISO date) to 12-hour AM/PM format (e.g., 06:00 AM)
 * @param {string} timeStr
 * @returns {string}
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return '—';

  // If timeStr is HH:MM or HH:MM:SS
  if (typeof timeStr === 'string' && timeStr.includes(':')) {
    const parts = timeStr.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1] ? parts[1].padStart(2, '0') : '00';

    if (isNaN(hours)) return timeStr;

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    const strHours = String(hours).padStart(2, '0');

    return `${strHours}:${minutes} ${ampm}`;
  }

  try {
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return String(timeStr);

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, '0');

    return `${strHours}:${minutes} ${ampm}`;
  } catch {
    return String(timeStr);
  }
};

/**
 * Formats a date for standard HTML date input (YYYY-MM-DD)
 * @param {string|Date} dateStr
 * @returns {string}
 */
export const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};
