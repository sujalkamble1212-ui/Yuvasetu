import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

let toastIdCounter = 0;

// ─── Toast Config ───────────────────────────────────────────────────────────
const TOAST_CONFIG = {
  success: {
    title: 'Saved Successfully',
    borderColor: '#22C55E',
    iconBg: '#22C55E',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  info: {
    title: 'Did you know?',
    borderColor: '#3B82F6',
    iconBg: '#3B82F6',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="8" strokeWidth="4" />
        <line x1="12" y1="12" x2="12" y2="16" />
      </svg>
    ),
  },
  warning: {
    title: 'Action Required',
    borderColor: '#F59E0B',
    iconBg: '#F59E0B',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="4" />
      </svg>
    ),
  },
  error: {
    title: 'Error Occurred',
    borderColor: '#EF4444',
    iconBg: '#EF4444',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = 4500, title = null) => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, message, type, title }]);
      timers.current[id] = setTimeout(() => removeToast(id), duration);
      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (msg, title, dur) => addToast(msg, 'success', dur || 4500, title),
    error:   (msg, title, dur) => addToast(msg, 'error',   dur || 5500, title),
    warning: (msg, title, dur) => addToast(msg, 'warning', dur || 5000, title),
    info:    (msg, title, dur) => addToast(msg, 'info',    dur || 4500, title),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* ── Toast Stack ─────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          pointerEvents: 'none',
          maxWidth: '380px',
          width: 'calc(100vw - 40px)',
        }}
      >
        {toasts.map((t) => {
          const cfg = TOAST_CONFIG[t.type] || TOAST_CONFIG.info;
          const displayTitle = t.title || cfg.title;

          return (
            <div
              key={t.id}
              style={{
                background: '#1A1B23',
                border: '1px solid #2D3142',
                borderLeft: `4px solid ${cfg.borderColor}`,
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
                pointerEvents: 'all',
                animation: 'toastSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: cfg.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                {cfg.icon}
              </div>

              {/* Text block */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: '3px',
                    lineHeight: 1.3,
                  }}
                >
                  {displayTitle}
                </div>
                <div
                  style={{
                    fontSize: '12.5px',
                    color: '#94A3B8',
                    lineHeight: 1.45,
                    wordBreak: 'break-word',
                  }}
                >
                  {t.message}
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  fontSize: '18px',
                  lineHeight: 1,
                  padding: '0',
                  flexShrink: 0,
                  marginTop: '2px',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#CBD5E1')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(50px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
