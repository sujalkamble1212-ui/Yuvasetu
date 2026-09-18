import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, Building2, Calendar, MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.getMyApplications();
        if (res.success) {
          setApplications(res.applications || []);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStepIndex = (status) => {
    if (status === 'Applied') return 1;
    if (status === 'Shortlisted') return 2;
    if (status === 'Selected' || status === 'Rejected') return 3;
    return 1;
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="top-header">
        <div>
          <h1 className="greeting-title">My Applications History</h1>
          <p className="greeting-sub">
            Track real-time recruitment progression, screening results, and interview calls.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Loading your applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <FileCheck2 size={40} color="var(--primary)" style={{ margin: '0 auto 14px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No Applications Submitted Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px', marginBottom: '20px' }}>
            Check out open placement drives and apply before their application deadlines.
          </p>
          <Link to="/drives" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Explore Placement Drives
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {applications.map((app) => {
            const drive = app.drive || {};
            const step = getStepIndex(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div key={app._id} className="card" style={{ padding: '24px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '20px',
                      }}
                    >
                      {drive.companyName ? drive.companyName.charAt(0) : 'C'}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                        {drive.companyName || 'Company Drive'}
                      </h3>
                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                        {drive.jobRole} • <strong style={{ color: '#10B981' }}>{drive.salaryPackage}</strong>
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={app.status} />
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Progress Step Pipeline */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '18px 24px',
                    borderRadius: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    {/* Line Connector */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '40px',
                        right: '40px',
                        top: '14px',
                        height: '3px',
                        backgroundColor: '#E2E8F0',
                        zIndex: 1,
                      }}
                    />

                    {/* Step 1: Applied */}
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: step >= 1 ? '#6C5CE7' : '#E2E8F0',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 6px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E1B4B' }}>
                        Applied
                      </span>
                    </div>

                    {/* Step 2: Shortlisted */}
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor:
                            step >= 2 ? (isRejected ? '#94A3B8' : '#7C3AED') : '#E2E8F0',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 6px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        {step >= 2 ? '✓' : '2'}
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: step >= 2 ? 700 : 500,
                          color: step >= 2 ? '#1E1B4B' : '#94A3B8',
                        }}
                      >
                        Shortlisted
                      </span>
                    </div>

                    {/* Step 3: Selected / Final */}
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor:
                            step >= 3
                              ? isRejected
                                ? '#EF4444'
                                : '#10B981'
                              : '#E2E8F0',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 6px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        {step >= 3 ? (isRejected ? '✕' : '★') : '3'}
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: step >= 3 ? 700 : 500,
                          color: isRejected
                            ? '#EF4444'
                            : step >= 3
                            ? '#10B981'
                            : '#94A3B8',
                        }}
                      >
                        {isRejected ? 'Not Selected' : 'Selected Offer'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recruiter / Placement Officer Remarks */}
                {app.remarks && (
                  <div
                    style={{
                      borderLeft: '3px solid var(--primary)',
                      paddingLeft: '12px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <strong>Placement Cell Remarks:</strong> {app.remarks}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
