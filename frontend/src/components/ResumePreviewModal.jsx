import React from 'react';
import { Download, ExternalLink, FileText, X } from 'lucide-react';

const ResumePreviewModal = ({
  isOpen,
  onClose,
  resumeUrl,
  fileName = 'Resume.pdf',
  studentName = 'Student',
}) => {
  if (!isOpen || !resumeUrl) return null;

  const isPdf =
    (fileName && fileName.toLowerCase().endsWith('.pdf')) ||
    (resumeUrl && (resumeUrl.toLowerCase().endsWith('.pdf') || resumeUrl.toLowerCase().includes('.pdf')));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '920px',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'fadeInUp 0.22s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(124, 92, 252, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {studentName ? `${studentName} — Resume` : 'Resume Preview'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {fileName} • {isPdf ? 'PDF Document' : 'Word Document'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              title="Open in new browser tab"
              style={{ padding: '6px 12px', fontSize: '12.5px' }}
            >
              <ExternalLink size={14} /> Open Tab
            </a>
            <a
              href={resumeUrl}
              download={fileName}
              className="btn btn-primary btn-sm"
              style={{ padding: '6px 14px', fontSize: '12.5px' }}
            >
              <Download size={14} /> Download Resume
            </a>
            <button
              onClick={onClose}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
                marginLeft: '4px',
              }}
              title="Close Preview"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Preview Viewer Body */}
        <div style={{ flex: 1, padding: '16px', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
          {isPdf ? (
            <iframe
              src={resumeUrl}
              title={`Resume Preview - ${fileName}`}
              style={{
                width: '100%',
                flex: 1,
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
              }}
            />
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
              }}
            >
              <FileText size={56} color="var(--primary)" style={{ marginBottom: '16px' }} />
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                Word Document (.docx) Preview
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '440px', marginBottom: '24px' }}>
                This file is a Word document. You can open it in Microsoft Office Online or download it directly to view.
              </p>
              <a
                href={resumeUrl}
                download={fileName}
                className="btn btn-primary"
                style={{ padding: '10px 24px' }}
              >
                <Download size={16} /> Download {fileName}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewModal;
