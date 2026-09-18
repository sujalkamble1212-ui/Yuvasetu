import React, { useState, useEffect } from 'react';
import { GraduationCap, Save, Award, School, BookOpen } from 'lucide-react';
import { useToast } from '../components/Toast';
import { api } from '../services/api';

const EducationPage = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('graduation');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [education, setEducation] = useState({
    tenth: { school: '', board: '', passingYear: '', percentage: '' },
    twelfth: { college: '', board: '', passingYear: '', percentage: '' },
    diploma: { institute: '', course: '', universityOrBoard: '', passingYear: '', percentageOrCgpa: '' },
    graduation: { degree: '', college: '', university: '', specialization: '', passingYear: '', cgpaOrPercentage: '' },
    postGraduation: { degree: '', college: '', university: '', specialization: '', passingYear: '', cgpaOrPercentage: '' },
  });

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await api.getEducation();
        if (res.success && res.education) {
          setEducation({
            tenth: res.education.tenth || {},
            twelfth: res.education.twelfth || {},
            diploma: res.education.diploma || {},
            graduation: res.education.graduation || {},
            postGraduation: res.education.postGraduation || {},
          });
        }
      } catch (err) {
        console.error('Failed to load education details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

  const handleFieldChange = (tier, field, value) => {
    setEducation((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: value,
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateEducation(education);
      if (res.success) {
        toast.success('Education records have been saved successfully.', 'Education Saved');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update education records.', 'Save Failed');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'graduation', label: 'Graduation', icon: GraduationCap },
    { id: 'twelfth', label: '12th Standard', icon: School },
    { id: 'tenth', label: '10th Standard', icon: Award },
    { id: 'diploma', label: 'Diploma (Optional)', icon: BookOpen },
    { id: 'postGraduation', label: 'Post-Graduation (Optional)', icon: GraduationCap },
  ];

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading education history...</div>;
  }

  return (
    <div style={{ width: '100%' }}>
      <div className="top-header">
        <div>
          <h1 className="greeting-title">Education History</h1>
          <p className="greeting-sub">
            Add or update your academic milestones. All levels are optional based on your path.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '20px',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '14px',
                border: '1px solid',
                borderColor: isActive ? 'var(--primary)' : 'var(--border-light)',
                backgroundColor: isActive ? 'var(--primary)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="card">
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Fields marked with <span style={{ color: '#EF4444', fontWeight: 700 }}>*</span> are compulsory for each completed academic milestone.
        </p>

        {/* 10th */}
        {activeTab === 'tenth' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
              10th Standard Secondary Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">School Name <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.tenth.school || ''}
                  onChange={(e) => handleFieldChange('tenth', 'school', e.target.value)}
                  placeholder="e.g. St. Xavier High School"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Board <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.tenth.board || ''}
                  onChange={(e) => handleFieldChange('tenth', 'board', e.target.value)}
                  placeholder="e.g. CBSE / ICSE / State Board"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Passing Year <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number"
                  value={education.tenth.passingYear || ''}
                  onChange={(e) => handleFieldChange('tenth', 'passingYear', e.target.value)}
                  placeholder="2020"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Percentage (%) <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number"
                  step="0.01"
                  value={education.tenth.percentage || ''}
                  onChange={(e) => handleFieldChange('tenth', 'percentage', e.target.value)}
                  placeholder="e.g. 88.5"
                  className="form-control"
                />
              </div>
            </div>
          </div>
        )}

        {/* 12th */}
        {activeTab === 'twelfth' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
              12th Standard Higher Secondary Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">College / School Name <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.twelfth.college || ''}
                  onChange={(e) => handleFieldChange('twelfth', 'college', e.target.value)}
                  placeholder="e.g. DPS Senior Secondary"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Board <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.twelfth.board || ''}
                  onChange={(e) => handleFieldChange('twelfth', 'board', e.target.value)}
                  placeholder="e.g. CBSE / ISC / State Board"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Passing Year <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number"
                  value={education.twelfth.passingYear || ''}
                  onChange={(e) => handleFieldChange('twelfth', 'passingYear', e.target.value)}
                  placeholder="2022"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Percentage (%) <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number"
                  step="0.01"
                  value={education.twelfth.percentage || ''}
                  onChange={(e) => handleFieldChange('twelfth', 'percentage', e.target.value)}
                  placeholder="e.g. 89.2"
                  className="form-control"
                />
              </div>
            </div>
          </div>
        )}

        {/* Diploma */}
        {activeTab === 'diploma' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
              Polytechnic / Diploma Details (Optional)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Institute Name <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.diploma.institute || ''}
                  onChange={(e) => handleFieldChange('diploma', 'institute', e.target.value)}
                  placeholder="e.g. Govt Polytechnic Institute"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Course / Stream <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.diploma.course || ''}
                  onChange={(e) => handleFieldChange('diploma', 'course', e.target.value)}
                  placeholder="e.g. Diploma in Computer Engineering"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">University / Board <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.diploma.universityOrBoard || ''}
                  onChange={(e) => handleFieldChange('diploma', 'universityOrBoard', e.target.value)}
                  placeholder="e.g. State Board of Technical Education"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Passing Year <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number"
                  value={education.diploma.passingYear || ''}
                  onChange={(e) => handleFieldChange('diploma', 'passingYear', e.target.value)}
                  placeholder="2023"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Percentage / CGPA <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number"
                  step="0.01"
                  value={education.diploma.percentageOrCgpa || ''}
                  onChange={(e) => handleFieldChange('diploma', 'percentageOrCgpa', e.target.value)}
                  placeholder="e.g. 84.5"
                  className="form-control"
                />
              </div>
            </div>
          </div>
        )}

        {/* Graduation */}
        {activeTab === 'graduation' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
              Undergraduate Degree (Graduation)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Degree <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.graduation.degree || ''}
                  onChange={(e) => handleFieldChange('graduation', 'degree', e.target.value)}
                  placeholder="e.g. B.Tech / B.E. / BCA / B.Sc"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">College Name <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.graduation.college || ''}
                  onChange={(e) => handleFieldChange('graduation', 'college', e.target.value)}
                  placeholder="e.g. Apex Institute of Technology"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">University <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.graduation.university || ''}
                  onChange={(e) => handleFieldChange('graduation', 'university', e.target.value)}
                  placeholder="e.g. State Technical University"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Specialization <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.graduation.specialization || ''}
                  onChange={(e) => handleFieldChange('graduation', 'specialization', e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Passing Year <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number"
                  value={education.graduation.passingYear || ''}
                  onChange={(e) => handleFieldChange('graduation', 'passingYear', e.target.value)}
                  placeholder="2027"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">CGPA / Percentage <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number"
                  step="0.01"
                  value={education.graduation.cgpaOrPercentage || ''}
                  onChange={(e) => handleFieldChange('graduation', 'cgpaOrPercentage', e.target.value)}
                  placeholder="e.g. 8.7"
                  className="form-control"
                />
              </div>
            </div>
          </div>
        )}

        {/* Post Graduation */}
        {activeTab === 'postGraduation' && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
              Post-Graduate Degree (Optional)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Degree <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.postGraduation.degree || ''}
                  onChange={(e) => handleFieldChange('postGraduation', 'degree', e.target.value)}
                  placeholder="e.g. M.Tech / MCA / MBA"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">College Name <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.postGraduation.college || ''}
                  onChange={(e) => handleFieldChange('postGraduation', 'college', e.target.value)}
                  placeholder="e.g. Institute of Management & Technology"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">University <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.postGraduation.university || ''}
                  onChange={(e) => handleFieldChange('postGraduation', 'university', e.target.value)}
                  placeholder="e.g. Central University"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Specialization <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  value={education.postGraduation.specialization || ''}
                  onChange={(e) => handleFieldChange('postGraduation', 'specialization', e.target.value)}
                  placeholder="e.g. Data Analytics"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Passing Year <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number"
                  value={education.postGraduation.passingYear || ''}
                  onChange={(e) => handleFieldChange('postGraduation', 'passingYear', e.target.value)}
                  placeholder="2029"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">CGPA / Percentage <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="number"
                  step="0.01"
                  value={education.postGraduation.cgpaOrPercentage || ''}
                  onChange={(e) => handleFieldChange('postGraduation', 'cgpaOrPercentage', e.target.value)}
                  placeholder="e.g. 9.1"
                  className="form-control"
                />
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ minWidth: '160px' }}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save All Education'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationPage;
