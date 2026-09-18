import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, LayoutDashboard, Briefcase, FileCheck2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAdmin } = useAuth();

  return (
    <>
      {/* Mobile Top Header */}
      <header className="mobile-top-bar">
        <button
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#1E1B4B',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        <img
          src="/logo.svg"
          alt="YuvaSetu"
          style={{ height: '30px', width: 'auto' }}
        />

        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#6C5CE7',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </header>

      {/* Mobile Bottom Dock Navigation (Phone screen support) */}
      <nav className="mobile-bottom-nav">
        {isAdmin ? (
          <>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `mobile-nav-btn ${isActive ? 'active' : ''}`
              }
            >
              <LayoutDashboard size={20} />
              <span>Overview</span>
            </NavLink>
            <NavLink
              to="/admin/drives"
              className={({ isActive }) =>
                `mobile-nav-btn ${isActive ? 'active' : ''}`
              }
            >
              <Briefcase size={20} />
              <span>Drives</span>
            </NavLink>
            <NavLink
              to="/admin/applications"
              className={({ isActive }) =>
                `mobile-nav-btn ${isActive ? 'active' : ''}`
              }
            >
              <FileCheck2 size={20} />
              <span>Applicants</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `mobile-nav-btn ${isActive ? 'active' : ''}`
              }
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/drives"
              className={({ isActive }) =>
                `mobile-nav-btn ${isActive ? 'active' : ''}`
              }
            >
              <Briefcase size={20} />
              <span>Drives</span>
            </NavLink>
            <NavLink
              to="/applications"
              className={({ isActive }) =>
                `mobile-nav-btn ${isActive ? 'active' : ''}`
              }
            >
              <FileCheck2 size={20} />
              <span>Applications</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `mobile-nav-btn ${isActive ? 'active' : ''}`
              }
            >
              <User size={20} />
              <span>Profile</span>
            </NavLink>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;
