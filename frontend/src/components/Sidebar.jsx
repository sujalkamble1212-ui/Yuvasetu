import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FileCheck2, User, GraduationCap,
  BookOpen, Sparkles, FileText, LogOut, X, Users, Building2,
  Activity, ClipboardList,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const studentLinks = [
    { to: '/dashboard',    label: 'Dashboard',          icon: LayoutDashboard },
    { to: '/drives',       label: 'Placement Drives',   icon: Briefcase       },
    { to: '/applications', label: 'My Applications',    icon: FileCheck2      },
    { to: '/profile',      label: 'Student Profile',    icon: User            },
    { to: '/education',    label: 'Education History',  icon: GraduationCap   },
    { to: '/academics',    label: 'Current Academics',  icon: BookOpen        },
    { to: '/skills',       label: 'Skills & Badges',    icon: Sparkles        },
    { to: '/resume',       label: 'Resume Management',  icon: FileText        },
  ];

  const adminLinks = [
    { to: '/admin/dashboard',    label: 'Admin Dashboard',      icon: LayoutDashboard },
    { to: '/admin/drives',       label: 'Manage Drives',        icon: Building2       },
    { to: '/admin/applications', label: 'Applications Hub',     icon: ClipboardList   },
    { to: '/admin/students',     label: 'Registered Students',  icon: Users           },
    { to: '/admin/logs',         label: 'Activity Logs',        icon: Activity        },
  ];

  const links = isAdmin ? adminLinks : studentLinks;
  const photoUrl = profile?.profilePhoto
    ? (profile.profilePhoto.startsWith('/') ? profile.profilePhoto : `/${profile.profilePhoto}`)
    : null;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>

        {/* ── Brand Header (BIG logo) ──────────────────────────────── */}
        <div className="sidebar-brand" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0', padding: '0 6px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {/* Big logo image */}
            <img
              src="/logo.svg"
              alt="YuvaSetu"
              style={{ height: '52px', width: 'auto', maxWidth: '200px' }}
            />
            {/* Mobile close */}
            <button
              onClick={onClose}
              className="mobile-close-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', marginLeft: 'auto' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── User Card ─────────────────────────────────────────────── */}
        <div className="sidebar-user-card">
          <div style={{ position: 'relative' }}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={user?.name}
                className="sidebar-avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="sidebar-avatar"
              style={{ display: photoUrl ? 'none' : 'flex' }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {/* Online dot */}
            <span
              style={{
                position: 'absolute', bottom: '12px', right: '4px',
                width: '12px', height: '12px', backgroundColor: '#10B981',
                borderRadius: '50%', border: '2px solid #FFFFFF',
              }}
              title="Active"
            />
          </div>

          <div className="sidebar-user-name">{user?.name || 'User'}</div>
          <div className="sidebar-user-email">{user?.email}</div>
          <span
            style={{
              marginTop: '6px', fontSize: '11px', fontWeight: 700,
              padding: '2px 10px', borderRadius: '12px',
              backgroundColor: isAdmin ? '#EDE9FE' : '#E0F2FE',
              color: isAdmin ? '#7C3AED' : '#0284C7',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}
          >
            {isAdmin ? '🛡️ Admin Portal' : '🎓 Student'}
          </span>
        </div>

        {/* ── Navigation ────────────────────────────────────────────── */}
        <nav className="sidebar-nav">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* ── Sign Out ──────────────────────────────────────────────── */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={handleLogout} className="nav-item" style={{ color: '#EF4444' }}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
