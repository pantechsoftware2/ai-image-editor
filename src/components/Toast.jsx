'use client';

/**
 * Toast Component - Notification message
 * @param {Object} props
 * @param {string} props.message - Message text
 * @param {'success'|'error'|'info'} props.type - Toast type
 * @param {Function} props.onClose - Callback to close
 */
export function Toast({ message, type = 'info', onClose }) {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-lg">
        ×
      </button>
    </div>
  );
}
