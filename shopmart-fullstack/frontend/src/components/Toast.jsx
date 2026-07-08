import { useToast } from '../context/ToastContext';

function icon(type) {
  return type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
}

export default function Toast() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`} onClick={() => dismiss(t.id)}>
          <span className="icon">{icon(t.type)}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
