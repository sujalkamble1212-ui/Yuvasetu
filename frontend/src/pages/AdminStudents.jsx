import React, { useState, useEffect } from 'react';
import { Users, Search, Download, GraduationCap, Sparkles, BookOpen, User, Phone, Mail, Eye } from 'lucide-react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import ResumePreviewModal from '../components/ResumePreviewModal';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [previewResume, setPreviewResume] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminStudents({ search });
      if (res.success) {
        setStudents(res.students || []);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div>
      <div className="top-header">
        <div>
          <h1 className="greeting-title">Registered Students Directory</h1>
          <p className="greeting-sub">
            Browse student profiles, inspect academic milestones, technical skills, and verify local resumes.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, email, or mobile..."
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
          <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0 20px', borderRadius: '12px' }}>
            Search
          </button>
        </form>
      </div>

      {/* Students Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading student records...</div>
      ) : students.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <Users size={36} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <h3>No Student Records Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>
            Try a different search query.
          </p>
        </div>
      ) : (
        <div className="table-container card" style={{ padding: 0 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Current Stream & College</th>
                <th>CGPA / Backlogs</th>
                <th>Skills Added</th>
                <th>Resume File</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const profile = student.profile || {};
                const academics = profile.currentAcademic || {};
                const resume = profile.resume;

                return (
                  <tr key={student._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '14px',
                          }}
                        >
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                            {student.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {student.email} • {student.mobile}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>{academics.course || 'Degree Not Set'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {academics.college || '—'}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '13px' }}>
                        CGPA: <strong style={{ color: '#6C5CE7' }}>{academics.currentCgpa || '0'}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: academics.backlogs > 0 ? '#EF4444' : '#10B981' }}>
                        Backlogs: {academics.backlogs || 0}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '180px' }}>
                        {(profile.skills || []).slice(0, 2).map((s, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '11px',
                              background: '#F1F5F9',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                        {(profile.skills || []).length > 2 && (
                          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                            +{(profile.skills || []).length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      {resume?.filePath ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewResume({
                              url: resume.filePath.startsWith('/') ? resume.filePath : `/${resume.filePath}`,
                              fileName: resume.originalName || `${student.name || 'Student'}_Resume.pdf`,
                              studentName: student.name,
                            })
                          }
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                        >
                          <Eye size={13} /> View Resume
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>None</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye size={13} /> Full Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Full Student Profile Inspection Modal */}
      {selectedStudent && (
        <Modal
          isOpen={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          title={`Student Profile: ${selectedStudent.name}`}
          maxWidth="700px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-light)',
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
                  fontWeight: 800,
                  fontSize: '22px',
                }}
              >
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{selectedStudent.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {selectedStudent.email} • {selectedStudent.mobile}
                </p>
                {selectedStudent.profile?.gender && (
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    Gender: {selectedStudent.profile.gender}
                  </span>
                )}
              </div>
            </div>

            {/* Current Academic Standing */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: 'var(--primary)' }}>
                Current Academic Standing
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                }}
              >
                <div>Course: <strong>{selectedStudent.profile?.currentAcademic?.course || '—'}</strong></div>
                <div>College: <strong>{selectedStudent.profile?.currentAcademic?.college || '—'}</strong></div>
                <div>Current Year: <strong>{selectedStudent.profile?.currentAcademic?.currentYear || '—'}</strong></div>
                <div>Current Semester: <strong>{selectedStudent.profile?.currentAcademic?.currentSemester || '—'}</strong></div>
                <div>Current CGPA: <strong style={{ color: '#6C5CE7' }}>{selectedStudent.profile?.currentAcademic?.currentCgpa || '0'}</strong></div>
                <div>Active Backlogs: <strong style={{ color: selectedStudent.profile?.currentAcademic?.backlogs > 0 ? '#EF4444' : '#10B981' }}>{selectedStudent.profile?.currentAcademic?.backlogs || 0}</strong></div>
              </div>
            </div>

            {/* Technical Skills */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                Technical Skills ({selectedStudent.profile?.skills?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(selectedStudent.profile?.skills || []).map((skill, i) => (
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

            {/* Education History Snapshot */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
                Education Milestones
              </h4>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedStudent.education?.tenth?.school && (
                  <div>
                    <strong>10th:</strong> {selectedStudent.education.tenth.school} ({selectedStudent.education.tenth.board}) — {selectedStudent.education.tenth.percentage}% ({selectedStudent.education.tenth.passingYear})
                  </div>
                )}
                {selectedStudent.education?.twelfth?.college && (
                  <div>
                    <strong>12th:</strong> {selectedStudent.education.twelfth.college} ({selectedStudent.education.twelfth.board}) — {selectedStudent.education.twelfth.percentage}% ({selectedStudent.education.twelfth.passingYear})
                  </div>
                )}
                {selectedStudent.education?.graduation?.college && (
                  <div>
                    <strong>Graduation:</strong> {selectedStudent.education.graduation.degree} at {selectedStudent.education.graduation.college} — CGPA {selectedStudent.education.graduation.cgpaOrPercentage}
                  </div>
                )}
              </div>
            </div>

            {/* Resume action */}
            {selectedStudent.profile?.resume?.filePath && (
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() =>
                    setPreviewResume({
                      url: selectedStudent.profile.resume.filePath.startsWith('/')
                        ? selectedStudent.profile.resume.filePath
                        : `/${selectedStudent.profile.resume.filePath}`,
                      fileName: selectedStudent.profile.resume.originalName || `${selectedStudent.name}_Resume.pdf`,
                      studentName: selectedStudent.name,
                    })
                  }
                  className="btn btn-primary btn-sm"
                >
                  <Eye size={14} /> Preview &amp; Download Resume ({selectedStudent.profile.resume.originalName})
                </button>
              </div>
            )}
          </div>
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

export default AdminStudents;
