import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Sparkles,
  Calendar,
  Building2,
  MapPin,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drivesRes, appsRes] = await Promise.all([
          api.getDrives({ status: 'Active' }),
          api.getMyApplications(),
        ]);
        if (drivesRes.success) setDrives(drivesRes.drives || []);
        if (appsRes.success) setApplications(appsRes.applications || []);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cgpa = profile?.currentAcademic?.currentCgpa || 0;
  const backlogs = profile?.currentAcademic?.backlogs || 0;
  const hasResume = Boolean(profile?.resume?.filePath);
  const skillsCount = profile?.skills?.length || 0;

  // Compute profile completion percentage
  let completionPoints = 0;
  if (profile?.fullName) completionPoints += 20;
  if (profile?.profilePhoto) completionPoints += 15;
  if (profile?.currentAcademic?.course) completionPoints += 20;
  if (skillsCount > 0) completionPoints += 20;
  if (hasResume) completionPoints += 25;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      {/* Top Header matching Ref Image 1 */}
      <div className="top-header">
        <div>
          <h1 className="greeting-title">
            Hello, {user?.name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="greeting-sub">Today is {todayStr}</p>
        </div>

        <div className="header-actions">
          <Link to="/drives" className="btn btn-primary" style={{ borderRadius: '12px' }}>
            <Briefcase size={16} /> Explore All Drives
          </Link>
        </div>
      </div>

      {/* Hero 3-Card Carousel/Grid (Ref Image 1 Colorful Top Cards) */}
      <div className="hero-card-grid">
        {/* Card 1: Purple - Profile & Career Readiness */}
        <div className="hero-card purple">
          <div>
            <div className="hero-card-header">
              <span className="hero-badge">
                <Sparkles size={13} /> Yuva Readiness
              </span>
              <span style={{ fontSize: '13px', opacity: 0.85 }}>Profile Score</span>
            </div>
            <h3 className="hero-card-title">Placement Readiness</h3>
            <p className="hero-card-desc">
              {completionPoints >= 80
                ? 'Profile complete! You are eligible for drives.'
                : 'Complete your academics and resume to apply.'}
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginTop: '12px' }}>
              <span>Completion</span>
              <span style={{ fontWeight: 700 }}>{completionPoints}%</span>
            </div>
            <div className="hero-progress-bar">
              <div
                className="hero-progress-fill"
                style={{ width: `${completionPoints}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Teal - Active Drives & Opportunities */}
        <div className="hero-card teal">
          <div>
            <div className="hero-card-header">
              <span className="hero-badge">
                <TrendingUp size={13} /> Active Openings
              </span>
              <span style={{ fontSize: '13px', opacity: 0.85 }}>Campus Drives</span>
            </div>
            <h3 className="hero-card-title">{drives.length} Drives Active</h3>
            <p className="hero-card-desc">
              {drives.filter((d) => d.isEligible).length} drives match your CGPA & criteria.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginTop: '12px' }}>
              <span>Eligible Ratio</span>
              <span style={{ fontWeight: 700 }}>
                {drives.length > 0
                  ? Math.round(
                      (drives.filter((d) => d.isEligible).length / drives.length) * 100
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="hero-progress-bar">
              <div
                className="hero-progress-fill"
                style={{
                  width: `${
                    drives.length > 0
                      ? (drives.filter((d) => d.isEligible).length / drives.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Coral - Application Pipeline */}
        <div className="hero-card coral">
          <div>
            <div className="hero-card-header">
              <span className="hero-badge">
                <CheckCircle2 size={13} /> Application Pipeline
              </span>
              <span style={{ fontSize: '13px', opacity: 0.85 }}>Status</span>
            </div>
            <h3 className="hero-card-title">
              {applications.length} Drives Applied
            </h3>
            <p className="hero-card-desc">
              {applications.filter((a) => a.status === 'Shortlisted' || a.status === 'Selected').length} moving forward in rounds.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginTop: '12px' }}>
              <span>Pipeline Health</span>
              <span style={{ fontWeight: 700 }}>
                {applications.filter((a) => a.status === 'Selected').length > 0 ? 'Selected 🎉' : 'In Progress'}
              </span>
            </div>
            <div className="hero-progress-bar">
              <div
                className="hero-progress-fill"
                style={{
                  width: `${Math.min(100, applications.length * 33)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Content + Right Calendar/Deadlines */}
      <div className="dashboard-grid">
        <div className="dashboard-main">
          {/* Missing Resume Alert if student hasn't uploaded */}
          {!hasResume && (
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertCircle size={24} color="#D97706" />
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#92400E' }}>
                    Resume Required for Placement Applications
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#B45309' }}>
                    Companies require a verified resume. Upload your resume (PDF/DOC) in the Resume section.
                  </p>
                </div>
              </div>
              <Link to="/resume" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                Upload Now
              </Link>
            </div>
          )}

          {/* Recommended Placement Drives */}
          <div className="card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
                  Featured Placement Drives
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Active campus hiring drives open for your stream
                </p>
              </div>
              <Link
                to="/drives"
                style={{
                  color: 'var(--primary)',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                View all <ChevronRight size={16} />
              </Link>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading placement drives...</p>
            ) : drives.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No active drives currently available.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {drives.slice(0, 3).map((drive) => (
                  <div
                    key={drive._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      borderRadius: '16px',
                      border: '1px solid var(--border-light)',
                      backgroundColor: '#FFFFFF',
                      transition: 'var(--transition)',
                      gap: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #F0EEFF, #E0F2FE)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary)',
                          fontWeight: 800,
                          fontSize: '18px',
                        }}
                      >
                        {drive.companyName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 700 }}>
                            {drive.companyName}
                          </h4>
                          {drive.isApplied && (
                            <span className="badge badge-applied">Applied</span>
                          )}
                          {!drive.isEligible && (
                            <span
                              style={{
                                fontSize: '11px',
                                color: '#EF4444',
                                backgroundColor: '#FEE2E2',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontWeight: 600,
                              }}
                            >
                              Ineligible
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {drive.jobRole} • <strong style={{ color: '#10B981' }}>{drive.salaryPackage}</strong>
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Drive Date
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>
                          {new Date(drive.driveDate).toLocaleDateString()}
                        </div>
                      </div>
                      <Link
                        to={`/drives/${drive._id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ borderRadius: '10px' }}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Applications Recent Progress */}
          <div className="card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
                My Applications Status
              </h3>
              <Link
                to="/applications"
                style={{
                  color: 'var(--primary)',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                All Applications <ChevronRight size={16} />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                <p>You haven't applied to any drives yet.</p>
                <Link to="/drives" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                  Browse Opportunities
                </Link>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Company & Role</th>
                      <th>Applied Date</th>
                      <th>Current Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 4).map((app) => (
                      <tr key={app._id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            {app.drive?.companyName}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {app.drive?.jobRole}
                          </div>
                        </td>
                        <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                        <td style={{ fontSize: '12.5px', color: '#64748B' }}>
                          {app.remarks || 'Application under review'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Rail: Calendar & Deadlines (Ref Image 1 Calendar Panel) */}
        <div className="dashboard-side">
          {/* Quick Academic Snapshot */}
          <div className="card">
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
              Academic Stats
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '16px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#6C5CE7' }}>
                  {cgpa > 0 ? cgpa.toFixed(1) : 'N/A'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Current CGPA
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '16px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: backlogs === 0 ? '#10B981' : '#EF4444',
                  }}
                >
                  {backlogs}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Active Backlogs
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Skills Added:</span>
                <span style={{ fontWeight: 700 }}>{skillsCount} Skills</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Resume Status:</span>
                <span style={{ fontWeight: 700, color: hasResume ? '#10B981' : '#EF4444' }}>
                  {hasResume ? '✓ Attached' : '✗ Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Drive Deadlines (Ref Image 1 Calendar Panel style) */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Calendar size={18} color="var(--primary)" />
              <h4 style={{ fontSize: '16px', fontWeight: 700 }}>
                Drive Schedule & Deadlines
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {drives.slice(0, 3).map((drive) => {
                const deadline = new Date(drive.applicationDeadline);
                const isUrgent = (deadline - new Date()) / (1000 * 60 * 60 * 24) <= 3;

                return (
                  <div
                    key={drive._id}
                    style={{
                      borderLeft: `4px solid ${isUrgent ? '#FF7675' : '#6C5CE7'}`,
                      paddingLeft: '12px',
                    }}
                  >
                    <div style={{ fontSize: '11.5px', color: isUrgent ? '#EF4444' : 'var(--text-muted)', fontWeight: 700 }}>
                      Deadline: {deadline.toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {drive.companyName}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      {drive.jobRole}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* College Placement Cell Notice Widget */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
              color: '#FFFFFF',
              borderRadius: '20px',
              padding: '22px',
              boxShadow: '0 10px 25px rgba(30, 27, 75, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Building2 size={18} color="#00CEC9" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#00CEC9', textTransform: 'uppercase' }}>
                Placement Notice
              </span>
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
              Keep Profile & Resumes Updated
            </h4>
            <p style={{ fontSize: '12.5px', opacity: 0.85, lineHeight: 1.5 }}>
              Companies shortlist students based on updated semester CGPA and technical skill tags. Verify your information before upcoming drives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
