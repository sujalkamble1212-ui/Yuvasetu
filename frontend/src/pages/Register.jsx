import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Register = () => {
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [mobile, setMobile]           = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();
  const toast        = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.warning('Full name is required.', 'Action Required');
      return;
    }
    if (!email.trim()) {
      toast.warning('Email address is required.', 'Action Required');
      return;
    }
    if (!mobile.trim()) {
      toast.warning('Mobile number is required.', 'Action Required');
      return;
    }
    if (!/^\d{10}$/.test(mobile.trim())) {
      toast.warning('Enter a valid 10-digit mobile number.', 'Action Required');
      return;
    }
    if (password.length < 8) {
      toast.warning('Password must be at least 8 characters long.', 'Action Required');
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>/?])/.test(password)) {
      toast.warning(
        'Password must include uppercase, lowercase, a number, and a special character.',
        'Weak Password'
      );
      return;
    }

    setLoading(true);
    try {
      const data = await register({ name, email, mobile, password, role: 'student' });
      toast.success('Your account has been created. Welcome aboard!', 'Account Created 🎉');
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      toast.error(msg, 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  // Required label helper
  const RequiredLabel = ({ children }) => (
    <label className="form-label" style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '4px' }}>
      {children}
      <span style={{ color: '#F87171', fontSize: '15px', lineHeight: 1 }}>*</span>
    </label>
  );

  // Field style helper
  const inputStyle = {
    backgroundColor: '#1C1E26',
    borderColor: '#2D313E',
    color: '#FFFFFF',
    paddingLeft: '42px',
  };

  return (
    <div className="auth-page">
      {/* ── Left Form Panel ─────────────────────────────────────────────── */}
      <div className="auth-form-panel">
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '26px' }}>
            <img src="/logo-icon.svg" alt="YuvaSetu" style={{ height: '36px', width: '36px' }} />
            <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '22px' }}>
              Yuva<span style={{ color: '#7C5CFC' }}>Setu</span>
            </span>
          </div>

          <h2 style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
            Create Account
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '13.5px', marginBottom: '22px' }}>
            Join YuvaSetu to explore placements &amp; track applications
          </p>

          {/* Hint row */}
          <p style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '18px' }}>
            Fields marked with{' '}
            <span style={{ color: '#F87171', fontWeight: 700 }}>*</span>{' '}
            are compulsory
          </p>

          <form onSubmit={handleSubmit} autoComplete="on" noValidate>


            {/* Full Name */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <RequiredLabel>Full Name</RequiredLabel>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  id="register-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className="form-control"
                  style={inputStyle}
                />
                <User size={18} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'#64748B', pointerEvents:'none' }} />
              </div>
            </div>

            {/* Email */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <RequiredLabel>Email Address</RequiredLabel>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  id="register-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter college email address"
                  required
                  autoComplete="username"
                  className="form-control"
                  style={inputStyle}
                />
                <Mail size={18} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'#64748B', pointerEvents:'none' }} />
              </div>
            </div>

            {/* Mobile */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <RequiredLabel>Mobile Number</RequiredLabel>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="mobile"
                  id="register-mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit mobile number"
                  required
                  autoComplete="tel"
                  className="form-control"
                  style={inputStyle}
                />
                <Phone size={18} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'#64748B', pointerEvents:'none' }} />
              </div>
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <RequiredLabel>Password</RequiredLabel>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="register-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars, uppercase, number, special char"
                  required
                  autoComplete="new-password"
                  className="form-control"
                  style={{ ...inputStyle, paddingRight: '46px' }}
                />
                <Lock size={18} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'#64748B', pointerEvents:'none' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Strength meter — checks all 4 criteria */}
              {password.length > 0 && (() => {
                const checks = [
                  password.length >= 8,
                  /[A-Z]/.test(password),
                  /\d/.test(password),
                  /[!@#$%^&*()\-_=+{};:,<.>/?]/.test(password),
                ];
                const score = checks.filter(Boolean).length;
                const color = score <= 1 ? '#EF4444' : score === 2 ? '#F59E0B' : score === 3 ? '#3B82F6' : '#22C55E';
                const label = score <= 1 ? 'Weak' : score === 2 ? 'Fair' : score === 3 ? 'Good' : 'Strong';
                return (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[...Array(4)].map((_, i) => (
                        <div key={i} style={{
                          flex: 1, height: '3px', borderRadius: '4px',
                          background: i < score ? color : '#2D313E',
                          transition: 'background 0.3s',
                        }} />
                      ))}
                    </div>
                    <p style={{ fontSize: '11px', color, margin: 0 }}>
                      {label} — use uppercase, lowercase, number &amp; special character
                    </p>
                  </div>
                );
              })()}
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
                      width: '16px', height: '16px',
                      border: '2px solid rgba(255,255,255,0.35)',
                      borderTopColor: '#fff', borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  Creating Account...
                </>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '13.5px' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: '#7C5CFC', fontWeight: 700, marginLeft: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Log in <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right Brand Panel (Pure Image) ────────────────────────────────── */}
      <div
        className="auth-brand-panel"
        style={{
          position: 'relative',
          backgroundImage: `url('/auth-illustration.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Register;
