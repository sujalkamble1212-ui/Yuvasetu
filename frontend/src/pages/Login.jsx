import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Login = () => {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();
  const toast      = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      toast.warning('Email address is required.', 'Action Required');
      return;
    }
    if (!password) {
      toast.warning('Password is required.', 'Action Required');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success('You are now logged in to YuvaSetu.', 'Welcome Back! 🎉');
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      toast.error(msg, 'Login Failed');
    } finally {
      setLoading(false);
    }
  };


  // Inline label component with required star
  const RequiredLabel = ({ children }) => (
    <label className="form-label" style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '4px' }}>
      {children}
      <span style={{ color: '#F87171', fontSize: '15px', lineHeight: 1 }}>*</span>
    </label>
  );

  return (
    <div className="auth-page">
      {/* ── Left Form Panel ─────────────────────────────────────────────── */}
      <div className="auth-form-panel">
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
            <img src="/logo-icon.svg" alt="YuvaSetu" style={{ height: '36px', width: '36px' }} />
            <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '22px' }}>
              Yuva<span style={{ color: '#7C5CFC' }}>Setu</span>
            </span>
          </div>

          <h2 style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>
            Sign In
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '28px' }}>
            Access your campus placement portal
          </p>

          <form onSubmit={handleSubmit} autoComplete="on" noValidate>
            {/* Email */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <RequiredLabel>Email Address</RequiredLabel>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email address"
                  required
                  autoComplete="username"
                  className="form-control"
                  style={{
                    backgroundColor: '#1C1E26',
                    borderColor: '#2D313E',
                    color: '#FFFFFF',
                    paddingLeft: '42px',
                  }}
                />
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748B',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <RequiredLabel>Password</RequiredLabel>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password (min 6 chars)"
                  required
                  autoComplete="current-password"
                  className="form-control"
                  style={{
                    backgroundColor: '#1C1E26',
                    borderColor: '#2D313E',
                    color: '#FFFFFF',
                    paddingLeft: '42px',
                    paddingRight: '46px',
                  }}
                />
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748B',
                    pointerEvents: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: '0',
                    display: 'flex',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p style={{ fontSize: '11.5px', color: '#64748B', marginTop: '5px' }}>
                <span style={{ color: '#F87171' }}>*</span> Required fields must be filled to continue
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: loading
                  ? '#4A3A9E'
                  : 'linear-gradient(135deg, #7C5CFC 0%, #5A3EE8 100%)',
                fontSize: '15px',
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.25s',
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.35)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  Authenticating...
                </>
              ) : (
                <>Login to Portal <ArrowRight size={16} /></>
              )}
            </button>
          </form>


          <div style={{ marginTop: '28px', textAlign: 'center', color: '#94A3B8', fontSize: '13.5px' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#7C5CFC',
                fontWeight: 700,
                marginLeft: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Sign up <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right Brand Panel ────────────────────────────────────────────── */}
      <div
        className="auth-brand-panel"
        style={{
          position: 'relative',
          backgroundImage: `linear-gradient(180deg, rgba(13, 14, 18, 0.15) 0%, rgba(13, 14, 18, 0.6) 100%), url('/auth-illustration.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '48px 40px',
        }}
      >
        {/* Top header badge */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '6px 18px',
              borderRadius: '30px',
              backgroundColor: 'rgba(15, 17, 26, 0.65)',
              backdropFilter: 'blur(12px)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
            }}
          >
            CAMPUS PLACEMENT PORTAL
          </div>
        </div>

        {/* Bottom card with glassmorphism */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '480px',
            backgroundColor: 'rgba(15, 17, 26, 0.82)',
            backdropFilter: 'blur(20px)',
            borderRadius: '22px',
            padding: '24px 28px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
            Empower Your Career Journey
          </h2>
          <p style={{ fontSize: '13.5px', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '16px' }}>
            Direct access to verified campus recruitment drives, automated eligibility validation, and live status updates.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '14px',
            }}
          >
            {[
              ['50+', 'Top Recruiters'],
              ['88%', 'Placement Rate'],
              ['28.5 LPA', 'Highest Pkg'],
            ].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>{val}</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
