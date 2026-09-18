import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2, RefreshCw, AlertCircle, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import ResumePreviewModal from '../components/ResumePreviewModal';
import { api } from '../services/api';

const ResumePage = () => {
  const { profile, refreshProfile } = useAuth();
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const resume = profile?.resume;
  const hasResume = Boolean(resume && resume.filePath);

  const handleFileUpload = async (file) => {
    if (!file) return;

    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error('Only PDF, DOC and DOCX documents are accepted.', 'Invalid Format');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File exceeds the 5 MB maximum upload size.', 'File Too Large');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const res = await api.uploadResume(formData);
      if (res.success) {
        toast.success('Resume uploaded successfully.', 'Resume Uploaded');
        await refreshProfile();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload resume.', 'Upload Failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await api.deleteResume();
      if (res.success) {
        toast.success('Resume removed from your profile.', 'Resume Deleted');
        setConfirmOpen(false);
        await refreshProfile();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete resume.', 'Delete Failed');
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="top-header">
        <div>
          <h1 className="greeting-title">Resume Management</h1>
          <p className="greeting-sub">Your resume is automatically attached when you apply to placement drives.</p>
        </div>
      </div>


      {/* Current Resume Card if Available */}
      {hasResume ? (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  backgroundColor: '#EDE9FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                }}
              >
                <FileText size={28} />
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
                  {resume.originalName || 'My Resume'}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {formatFileSize(resume.fileSize)} • Uploaded{' '}
                  {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : 'Recently'}
                </p>
                <div style={{ marginTop: '4px', fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
                  ✓ Active & Ready for Applications
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="btn btn-primary btn-sm"
              >
                <Eye size={15} /> Preview &amp; Download
              </button>

              <label
                htmlFor="replace-resume-input"
                className="btn btn-secondary btn-sm"
                style={{ cursor: 'pointer' }}
              >
                <RefreshCw size={15} /> Replace
                <input
                  id="replace-resume-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </label>

              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={deleting}
                className="btn btn-danger btn-sm"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Upload Zone */}
      <div
        className="card"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
        style={{
          border: dragOver ? '2px dashed var(--primary)' : '2px dashed #CBD5E1',
          backgroundColor: dragOver ? 'var(--primary-light)' : '#FFFFFF',
          padding: '48px 24px',
          textAlign: 'center',
          transition: 'var(--transition)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Upload size={28} />
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
          {hasResume ? 'Upload a New Resume File' : 'Upload Your Resume'}
        </h3>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px' }}>
          Drag and drop your PDF or DOCX file here, or click browse from your computer. Max file size: 5MB.
        </p>

        <label
          htmlFor="resume-upload-input"
          className="btn btn-primary"
          style={{ cursor: 'pointer', padding: '12px 28px' }}
        >
          <Upload size={16} /> {uploading ? 'Uploading to Server...' : 'Browse Local Files'}
          <input
            id="resume-upload-input"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Stored Resume?"
        message="Are you sure you want to permanently delete your resume from the database? You will need to upload a new resume to apply for placement drives."
        confirmText="Yes, Delete Resume"
        loading={deleting}
      />

      <ResumePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        resumeUrl={resume?.filePath ? (resume.filePath.startsWith('/') ? resume.filePath : `/${resume.filePath}`) : ''}
        fileName={resume?.originalName || 'My_Resume.pdf'}
        studentName={profile?.fullName || 'Student'}
      />
    </div>
  );
};

export default ResumePage;
