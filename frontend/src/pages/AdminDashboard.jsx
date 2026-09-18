import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  FileCheck2,
  Award,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
} from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.getAdminStats();
        if (res.success) {
          setStats(res.stats);
          setRecentApplications(res.recentApplications || []);
          setUpcomingDrives(res.upcomingDrives || []);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      <div className="top-header">
        <div>
          <h1 className="greeting-title">Placement Cell Dashboard</h1>
          <p className="greeting-sub">Administer campus recruitment drives, student talent, and audit logs • {todayStr}</p>
        </div>

        <div className="header-actions">
          <Link to="/admin/drives" className="btn btn-primary" style={{ borderRadius: '12px' }}>
            <Plus size={16} /> Post New Drive
          </Link>
        </div>
      </div>

      {/* Hero Metrics Cards */}
      <div className="hero-card-grid">
        {/* Card 1: Violet - Registered Students */}
        <div className="hero-card purple">
          <div className="hero-card-header">
            <span className="hero-badge">
              <Users size={14} /> Student Pool
            </span>
            <span style={{ fontSize: '13px', opacity: 0.85 }}>Campus Pool</span>
          </div>
          <div>
            <h3 style={{ fontSize: '32px', fontWeight: 800 }}>
              {stats?.totalStudents || 0}
            </h3>
            <p className="hero-card-desc">Verified Registered Students</p>
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', opacity: 0.9 }}>
            Profiles active with verified CGPA
          </div>
        </div>

        {/* Card 2: Teal - Active Drives */}
        <div className="hero-card teal">
          <div className="hero-card-header">
            <span className="hero-badge">
              <Building2 size={14} /> Recruitment
            </span>
            <span style={{ fontSize: '13px', opacity: 0.85 }}>Drives Active</span>
          </div>
          <div>
            <h3 style={{ fontSize: '32px', fontWeight: 800 }}>
              {stats?.activeDrives || 0}
            </h3>
            <p className="hero-card-desc">Active Placement Drives ({stats?.totalDrives || 0} Total)</p>
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', opacity: 0.9 }}>
            Google, Microsoft, TCS, Zomato & more
          </div>
        </div>

        {/* Card 3: Coral - Total Applications & Placed */}
        <div className="hero-card coral">
          <div className="hero-card-header">
            <span className="hero-badge">
              <Award size={14} /> Success Funnel
            </span>
            <span style={{ fontSize: '13px', opacity: 0.85 }}>Offers</span>
          </div>
          <div>
            <h3 style={{ fontSize: '32px', fontWeight: 800 }}>
              {stats?.totalApplications || 0}
            </h3>
            <p className="hero-card-desc">
              Applications • {stats?.shortlistedCount || 0} Shortlisted • {stats?.selectedCount || 0} Selected
            </p>
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', opacity: 0.9 }}>
            Campus recruitment conversion in progress
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-main">
          {/* Quick Shortcuts */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
            }}
          >
            <Link
              to="/admin/drives"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '18px',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building2 size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: 700 }}>Manage Drives</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Create & update openings</p>
              </div>
            </Link>

            <Link
              to="/admin/applications"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '18px',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileCheck2 size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: 700 }}>Applications Hub</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Screen & shortlist candidates</p>
              </div>
            </Link>

            <Link
              to="/admin/logs"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '18px',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#FEF3C7',
                  color: '#B45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Activity size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: 700 }}>Audit Logs</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Express logging middleware</p>
              </div>
            </Link>
          </div>

          {/* Recent Candidate Submissions Table */}
          <div className="card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Recent Candidate Applications</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Latest student drive applications awaiting recruiter review
                </p>
              </div>
              <Link
                to="/admin/applications"
                style={{
                  color: 'var(--primary)',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Review all <ArrowRight size={14} />
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>No recent applications.</p>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Company & Role</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            {app.student?.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {app.student?.email}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{app.drive?.companyName}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {app.drive?.jobRole}
                          </div>
                        </td>
                        <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Rail: Upcoming Placement Schedule */}
        <div className="dashboard-side">
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Calendar size={18} color="var(--primary)" />
              <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Scheduled Drives</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {upcomingDrives.map((d) => (
                <div
                  key={d._id}
                  style={{
                    borderLeft: '4px solid var(--primary)',
                    paddingLeft: '12px',
                  }}
                >
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Drive: {new Date(d.driveDate).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {d.companyName}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {d.jobRole} • <span style={{ color: '#10B981', fontWeight: 600 }}>{d.salaryPackage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderRadius: '20px',
              padding: '20px',
            }}
          >
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
              Local Security & Storage
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              All uploaded student resumes and photographs are securely persisted inside the local server file system. No third-party clouds are invoked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
