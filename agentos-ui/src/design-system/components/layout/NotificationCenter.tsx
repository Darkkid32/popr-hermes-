// NotificationCenter Component - Fixed
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

interface NotificationCenterProps {
  isOpen?: boolean;
  onClose: () => void;
  notifications?: Array<{ id: string; title: string; message?: string; time: string; type: 'info' | 'warning' | 'error' | 'success'; read?: boolean; onClick?: () => void }>;
}

export const NotificationCenter = ({
  isOpen = true,
  onClose,
  notifications = [],
}: NotificationCenterProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-notification-center)] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-xl animate-scale-in">
        <div className="bg-[var(--color-surface-container)] border border-[var(--color-border-primary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-level4)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-border-primary)] flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">Notifications</h3>
            <button className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]" onClick={onClose}>
              Close
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[var(--color-text-tertiary)]">No notifications</div>
            ) : (
              <ul role="list" aria-label="Notifications">
                {notifications.map(notification => (
                  <li key={notification.id} className="px-4 py-3 border-b border-[var(--color-border-primary)] hover:bg-[var(--color-surface-container-low)] transition-colors cursor-pointer" onClick={onClose}>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 mt-2 flex-shrink-0 rounded-full bg-cyan-400" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{notification.title}</p>
                        {notification.message && <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5 truncate">{notification.message}</p>}
                        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="px-4 py-3 border-t border-[var(--color-border-primary)]">
            <button className="w-full text-center text-sm text-[var(--color-primary-base)] hover:text-[var(--color-primary-hover)]">View all notifications</button>
          </div>
        </div>
      </div>
    </div>
  );
};

NotificationCenter.displayName = 'NotificationCenter';