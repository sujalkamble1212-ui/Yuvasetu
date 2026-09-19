import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const DrivesPage = () => {
  const { profile } = useAuth();
  const toast = useToast();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedDrive, setSelectedDrive] = useState(null);
  const [applying, setApplying] = useState(false);

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const res = await api.getDrives({
        search,
        status: statusFilter,
      });
      if (res.success) {
        setDrives(res.drives || []);
      }
    } catch (err) {
      console.error('Failed to load placement drives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDrives();
  };

  const handleApply = async (drive) => {
    setApplying(true);
    try {
      const res = await api.applyForDrive(drive._id);
      if (res.success) {
        toast.success(
          `Your application for ${drive.jobRole} at ${drive.companyName} has been submitted!`,
          'Application Submitted 🎉'
        );
        // Update local drives list
        setDrives((prev) =>
          prev.map((d) => (d._id === drive._id ? { ...d, isApplied: true } : d))
        );
        if (selectedDrive && selectedDrive._id === drive._id) {
          setSelectedDrive((prev) => ({ ...prev, isApplied: true }));
        }
      }
    } catch (err) {
      toast.error(err.message || 'Application submission failed.', 'Error');
    } finally {
      setApplying(false);
    }
  };

  const hasResume = Boolean(profile?.resume?.filePath);

  return (
    <div>
      <div className="top-header">
        <div>
          <h1 className="greeting-title">Placement Drives</h1>
          <p className="greeting-sub">
            Explore verified on-campus opportunities and submit applications directly.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, job role, skills or location..."
              className="form-control"
              style={{ paddingLeft: '38px', borderRadius: '12px' }}
            />
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8',
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0 18px', borderRadius: '12px' }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#64748B" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', padding: '8px 14px', borderRadius: '10px', fontSize: '13px' }}
          >
            <option value="All">All Drives</option>
            <option value="Active">Active Only</option>
            <option value="Upcoming">Upcoming Only</option>
          </select>
        </div>
      </div>

      {/* Drives Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Loading drives...
        </div>
      ) : drives.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <Briefcase size={36} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>No Placement Drives Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginTop: '4px' }}>
            Try adjusting your search keywords or filter options.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {drives.map((drive) => {
            const isDeadlinePassed = new Date(drive.applicationDeadline) < new Date();

            return (
              <div
                key={drive._id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '20px',
                  position: 'relative',
                  borderTop: drive.isEligible ? '4px solid #10B981' : '4px solid #CBD5E1',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '14px',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '18px',
                        }}
                      >
                        {drive.companyName.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)' }}>
                          {drive.companyName}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                          <MapPin size={13} /> {drive.location}
                        </div>
                      </div>
                    </div>

                    <StatusBadge status={drive.driveStatus} />
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {drive.jobRole}
                  </h4>

                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      fontWeight: 800,
                      fontSize: '13px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    {drive.salaryPackage}
                  </div>

                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '14px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {drive.jobDescription}
                  </p>

                  {/* Required Skills */}
                  {drive.requiredSkills?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {drive.requiredSkills.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '11.5px',
                            background: '#F1F5F9',
                            color: '#475569',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: 600,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                      {drive.requiredSkills.length > 3 && (
                        <span style={{ fontSize: '11px', color: '#94A3B8', alignSelf: 'center' }}>
                          +{drive.requiredSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Eligibility Status Alert */}
                  <div style={{ marginBottom: '16px' }}>
                    {drive.isEligible ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          color: '#15803D',
                          fontWeight: 700,
                        }}
                      >
                        <CheckCircle2 size={15} /> You meet all eligibility criteria
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          color: '#DC2626',
                          fontWeight: 600,
                        }}
                      >
                        <AlertCircle size={15} />{' '}
                        {drive.ineligibilityReasons?.[0] || 'Criteria mismatch'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Apply by: {new Date(drive.applicationDeadline).toLocaleDateString()}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDrive(drive);
                        setApplyMessage({ type: '', text: '' });
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Details
                    </button>

                    {drive.isApplied ? (
                      <span
                        className="badge badge-applied"
                        style={{ padding: '6px 12px' }}
                      >
                        ✓ Applied
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApply(drive)}
                        disabled={
                          !drive.isEligible ||
                          isDeadlinePassed ||
                          drive.driveStatus === 'Closed' ||
                          !hasResume ||
                          applying
                        }
                        className="btn btn-primary btn-sm"
                        style={{
                          opacity:
                            !drive.isEligible || isDeadlinePassed || !hasResume
                              ? 0.6
                              : 1,
                        }}
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drive Details Modal */}
      {selectedDrive && (
        <Modal
          isOpen={Boolean(selectedDrive)}
          onClose={() => setSelectedDrive(null)}
          title={`${selectedDrive.companyName} - ${selectedDrive.jobRole}`}
          maxWidth="640px"
        >


          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{selectedDrive.companyName}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  {selectedDrive.location} • Drive Date: {new Date(selectedDrive.driveDate).toLocaleDateString()}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-selected" style={{ fontSize: '14px', padding: '6px 14px' }}>
                  {selectedDrive.salaryPackage}
                </span>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Job Description</h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {selectedDrive.jobDescription}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Required Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedDrive.requiredSkills?.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '16px', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                Eligibility Requirements
              </h4>
              <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: 1.6 }}>
                <li>Minimum CGPA: <strong>{selectedDrive.minCgpa || 'No minimum'}</strong></li>
                <li>Maximum Allowed Backlogs: <strong>{selectedDrive.maxBacklogs}</strong></li>
                {selectedDrive.eligibilityCriteria && (
                  <li>Additional Criteria: {selectedDrive.eligibilityCriteria}</li>
                )}
                <li>Application Deadline: <strong>{new Date(selectedDrive.applicationDeadline).toLocaleDateString()}</strong></li>
              </ul>
            </div>

            {/* Resume status warning */}
            {!hasResume && (
              <div style={{ color: '#DC2626', fontSize: '12.5px', fontWeight: 600 }}>
                ⚠️ You must upload a resume before submitting this application.{' '}
                <Link to="/resume" style={{ textDecoration: 'underline' }}>
                  Go to Resume section
                </Link>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setSelectedDrive(null)}
                className="btn btn-secondary"
              >
                Close
              </button>

              {selectedDrive.isApplied ? (
                <button disabled className="btn btn-secondary" style={{ opacity: 0.8 }}>
                  ✓ Already Applied
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApply(selectedDrive)}
                  disabled={
                    !selectedDrive.isEligible ||
                    new Date(selectedDrive.applicationDeadline) < new Date() ||
                    !hasResume ||
                    applying
                  }
                  className="btn btn-primary"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DrivesPage;
