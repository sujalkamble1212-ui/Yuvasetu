import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Building2, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from '../components/Toast';
import { api } from '../services/api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import StatusBadge from '../components/StatusBadge';

const initialForm = {
  companyName: '',
  jobRole: '',
  jobDescription: '',
  requiredSkills: '',
  eligibilityCriteria: '',
  minCgpa: '',
  minPercentage: '',
  maxBacklogs: '',
  salaryPackage: '',
  location: '',
  driveDate: '',
  applicationDeadline: '',
  driveStatus: 'Active',
};

const AdminDrives = () => {
  const toast = useToast();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDrives = async () => {
    try {
      const res = await api.getDrives({ status: 'All' });
      if (res.success) {
        setDrives(res.drives || []);
      }
    } catch (err) {
      console.error('Failed to load drives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (drive) => {
    setEditingId(drive._id);
    setFormData({
      companyName: drive.companyName || '',
      jobRole: drive.jobRole || '',
      jobDescription: drive.jobDescription || '',
      requiredSkills: Array.isArray(drive.requiredSkills) ? drive.requiredSkills.join(', ') : '',
      eligibilityCriteria: drive.eligibilityCriteria || '',
      minCgpa: drive.minCgpa !== undefined ? String(drive.minCgpa) : '',
      minPercentage: drive.minPercentage !== undefined ? String(drive.minPercentage) : '',
      maxBacklogs: drive.maxBacklogs !== undefined ? String(drive.maxBacklogs) : '0',
      salaryPackage: drive.salaryPackage || '',
      location: drive.location || '',
      driveDate: drive.driveDate ? drive.driveDate.substring(0, 10) : '',
      applicationDeadline: drive.applicationDeadline ? drive.applicationDeadline.substring(0, 10) : '',
      driveStatus: drive.driveStatus || 'Active',
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (id, name) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await api.deleteDrive(deleteTarget.id);
      if (res.success) {
        toast.success(`"${deleteTarget.name}" drive has been removed.`, 'Drive Deleted');
        setDeleteTarget(null);
        fetchDrives();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete drive.', 'Delete Failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const res = await api.updateDrive(editingId, formData);
        if (res.success) {
          toast.success('Placement drive updated successfully.', 'Drive Updated');
          setModalOpen(false);
          fetchDrives();
        }
      } else {
        const res = await api.createDrive(formData);
        if (res.success) {
          toast.success('New placement drive published!', 'Drive Created');
          setModalOpen(false);
          fetchDrives();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save drive.', 'Save Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="top-header">
        <div>
          <h1 className="greeting-title">Placement Drives Management</h1>
          <p className="greeting-sub">Create, edit, manage eligibility criteria, and archive campus drives.</p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary" style={{ borderRadius: '12px' }}>
          <Plus size={16} /> Add Placement Drive
        </button>
      </div>


      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading drives...</div>
      ) : drives.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <Building2 size={36} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h3>No Placement Drives Created</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginTop: '6px' }}>
            Click "Add Placement Drive" to announce the first company drive.
          </p>
        </div>
      ) : (
        <div className="table-container card" style={{ padding: 0 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Company & Role</th>
                <th>Package / Location</th>
                <th>Criteria (CGPA / Backlogs)</th>
                <th>Drive Date / Deadline</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drives.map((drive) => (
                <tr key={drive._id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '15px' }}>
                      {drive.companyName}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {drive.jobRole}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#10B981' }}>{drive.salaryPackage}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{drive.location}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px' }}>Min CGPA: <strong>{drive.minCgpa}</strong></div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Max Backlogs: {drive.maxBacklogs}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px' }}>
                      Date: {new Date(drive.driveDate).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#EF4444' }}>
                      Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={drive.driveStatus} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenEdit(drive)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Drive"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(drive._id, drive.companyName)}
                        className="btn btn-danger btn-sm"
                        title="Delete Drive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Create / Edit Drive */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Placement Drive' : 'Create New Placement Drive'}
        maxWidth="720px"
      >
        <form onSubmit={handleSubmit}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Fields marked with <span style={{ color: '#EF4444', fontWeight: 700 }}>*</span> are compulsory to publish this drive.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Company Name <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter company name (e.g. Google India)"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Role <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="text"
                required
                value={formData.jobRole}
                onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                placeholder="Enter job role / title (e.g. Software Engineer)"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salary / CTC Package <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="text"
                required
                value={formData.salaryPackage}
                onChange={(e) => setFormData({ ...formData, salaryPackage: e.target.value })}
                placeholder="Enter salary package (e.g. 14.5 LPA)"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Location <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter job location (e.g. Bengaluru / Pune / Hybrid)"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Drive Date <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="date"
                required
                value={formData.driveDate}
                onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Application Deadline <span style={{ color: '#EF4444' }}>*</span></label>
              <input
                type="date"
                required
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Minimum CGPA (0-10)</label>
              <input
                type="number"
                step="0.1"
                value={formData.minCgpa}
                onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                placeholder="Enter minimum CGPA (e.g. 7.0)"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Allowed Backlogs</label>
              <input
                type="number"
                value={formData.maxBacklogs}
                onChange={(e) => setFormData({ ...formData, maxBacklogs: e.target.value })}
                placeholder="Enter maximum allowed backlogs (e.g. 0)"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Drive Status</label>
              <select
                value={formData.driveStatus}
                onChange={(e) => setFormData({ ...formData, driveStatus: e.target.value })}
                className="form-control"
              >
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Required Skills (Comma separated)</label>
              <input
                type="text"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                placeholder="Enter required skills (e.g. React, Node.js, SQL, Java)"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '12px' }}>
            <label className="form-label">Job Description <span style={{ color: '#EF4444' }}>*</span></label>
            <textarea
              required
              rows={3}
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              placeholder="Outline responsibilities, team details, interview rounds..."
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Eligibility Criteria Notes</label>
            <input
              type="text"
              value={formData.eligibilityCriteria}
              onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
              placeholder="Enter eligibility criteria notes (e.g. Open to B.Tech CSE & IT students only)"
              className="form-control"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : editingId ? 'Update Drive' : 'Publish Drive'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete "${deleteTarget?.name}" Drive?`}
        message="Are you sure you want to delete this placement drive? All associated student applications and screening states will also be affected."
        confirmText="Yes, Delete Drive"
        loading={deleting}
      />
    </div>
  );
};

export default AdminDrives;
