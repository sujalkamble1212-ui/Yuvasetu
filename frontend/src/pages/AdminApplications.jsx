import React, { useState, useEffect } from 'react';
import { FileCheck2, Filter, Download, User, Eye } from 'lucide-react';
import { useToast } from '../components/Toast';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ResumePreviewModal from '../components/ResumePreviewModal';

const AdminApplications = () => {
  const toast = useToast();
  const [applications, setApplications] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driveFilter, setDriveFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [previewResume, setPreviewResume] = useState(null);
  const [newStatus, setNewStatus] = useState('Shortlisted');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchDrives = async () => {
    try {
      const res = await api.getDrives({ status: 'All' });
      if (res.success) setDrives(res.drives || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.getAllApplications({
        driveId: driveFilter,
        status: statusFilter,
      });
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [driveFilter, statusFilter]);

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status || 'Shortlisted');
    setRemarks(app.remarks || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setUpdating(true);
    try {
      const res = await api.updateApplicationStatus(selectedApp._id, { status: newStatus, remarks });
      if (res.success) {
        toast.success(`Application status updated to "${newStatus}".`, 'Status Updated');
        setSelectedApp(null);
        fetchApplications();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status.', 'Update Failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div className="top-header">
        <div>
          <h1 className="greeting-title">Applications Evaluation Hub</h1>
          <p className="greeting-sub">
            Review student candidates, inspect academic profiles, download resumes, and update recruitment status.
          </p>
        </div>
      </div>


      {/* Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#64748B" />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Filter by Drive:</span>
          <select
            value={driveFilter}
            onChange={(e) => setDriveFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', padding: '8px 14px', borderRadius: '10px', fontSize: '13px' }}
          >
            <option value="">All Placement Drives</option>
            {drives.map((d) => (
              <option key={d._id} value={d._id}>
                {d.companyName} ({d.jobRole})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', padding: '8px 14px', borderRadius: '10px', fontSize: '13px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading candidate applications...</div>
      ) : applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <FileCheck2 size={36} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h3>No Applications Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginTop: '6px' }}>
            No candidate submissions match your selected filter criteria.
          </p>
        </div>
      ) : (
        <div className="table-container card" style={{ padding: 0 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Candidate Details</th>
                <th>Placement Drive</th>
                <th>Academic Standing</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Remarks</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const student = app.student || {};
                const profile = app.studentProfile || {};
                const academics = profile.currentAcademic || {};
                const resume = profile.resume;

                return (
                  <tr key={app._id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {student.email} • {student.mobile}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700 }}>{app.drive?.companyName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {app.drive?.jobRole}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '13px' }}>
                        CGPA: <strong style={{ color: '#6C5CE7' }}>{academics.currentCgpa || 'N/A'}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: academics.backlogs > 0 ? '#EF4444' : '#10B981' }}>
                        Backlogs: {academics.backlogs || 0}
                      </div>
                    </td>

                    <td>
                      {resume?.filePath ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewResume({
                              url: resume.filePath.startsWith('/') ? resume.filePath : `/${resume.filePath}`,
                              fileName: resume.originalName || `${student.name || 'Candidate'}_Resume.pdf`,
                              studentName: student.name,
                            })
                          }
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                        >
                          <Eye size={13} /> View Resume
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#EF4444' }}>Missing</span>
                      )}
                    </td>

                    <td>
                      <StatusBadge status={app.status} />
                    </td>

                    <td style={{ fontSize: '12.5px', color: '#64748B', maxWidth: '200px' }}>
                      {app.remarks || '—'}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenStatusModal(app)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '6px 12px' }}
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Status & Remarks Update */}
      {selectedApp && (
        <Modal
          isOpen={Boolean(selectedApp)}
          onClose={() => setSelectedApp(null)}
          title={`Update Status: ${selectedApp.student?.name}`}
          maxWidth="500px"
        >
          <form onSubmit={handleUpdateStatus}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Drive:</div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>
                {selectedApp.drive?.companyName} - {selectedApp.drive?.jobRole}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Application Status *</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="form-control"
              >
                <option value="Applied">Applied (Initial)</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Selected">Selected (Offer Rolled Out)</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Placement Cell / Recruiter Remarks</label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Cleared technical screening round. Final HR scheduled."
                className="form-control"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" disabled={updating} className="btn btn-primary">
                {updating ? 'Updating...' : 'Save Decision'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <ResumePreviewModal
        isOpen={Boolean(previewResume)}
        onClose={() => setPreviewResume(null)}
        resumeUrl={previewResume?.url}
        fileName={previewResume?.fileName}
        studentName={previewResume?.studentName}
      />
    </div>
  );
};

export default AdminApplications;
