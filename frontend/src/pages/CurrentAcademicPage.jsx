import React, { useState, useEffect } from 'react';
import { BookOpen, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { api } from '../services/api';

const RL = ({ children, optional = false }) => (
  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    {children}
    {!optional && <span style={{ color: '#EF4444', fontSize: '15px', lineHeight: 1 }}>*</span>}
    {optional && <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 400 }}>(optional)</span>}
  </label>
);

const CurrentAcademicPage = () => {
  const { profile, refreshProfile } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    course: '', college: '', university: '', currentYear: '',
    currentSemester: '', division: '', batch: '', specialization: '',
    currentCgpa: '', backlogs: '', expectedGraduationYear: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.currentAcademic) {
      const a = profile.currentAcademic;
      setFormData({
        course:                  a.course                  || '',
        college:                 a.college                 || '',
        university:              a.university              || '',
        currentYear:             a.currentYear             || '',
        currentSemester:         a.currentSemester         || '',
        division:                a.division                || '',
        batch:                   a.batch                   || '',
        specialization:          a.specialization          || '',
        currentCgpa:             a.currentCgpa  !== undefined ? a.currentCgpa  : '',
        backlogs:                a.backlogs     !== undefined ? String(a.backlogs) : '',
        expectedGraduationYear:  a.expectedGraduationYear || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course.trim())   { toast.warning('Current course / degree is required.', 'Action Required'); return; }
    if (!formData.college.trim())  { toast.warning('College name is required.', 'Action Required'); return; }
    if (!formData.currentYear)     { toast.warning('Please select your current year.', 'Action Required'); return; }
    if (formData.currentCgpa === '') { toast.warning('Current CGPA is required for eligibility checks.', 'Action Required'); return; }

    setSaving(true);
    try {
      const res = await api.updateAcademics(formData);
      if (res.success) {
        toast.success('Academic standing saved. Placement eligibility updated.', 'Academics Updated');
        await refreshProfile();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update academic details.', 'Save Failed');
    } finally {
      setSaving(false);
    }
  };

  const sel = (name, opts) => (
    <select name={name} value={formData[name]} onChange={handleChange} className="form-control">
      <option value="">— Select —</option>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div style={{ width: '100%' }}>
      <div className="top-header">
        <div>
          <h1 className="greeting-title">Current Academic Details</h1>
          <p className="greeting-sub">
            These metrics determine your automatic eligibility for placement drives.&nbsp;
            <span style={{ color: '#EF4444', fontWeight: 700 }}>*</span> fields are compulsory.
          </p>
        </div>
      </div>

      {/* Eligibility note */}
      <div style={{
        backgroundColor: 'rgba(108,92,231,0.07)', border: '1px solid rgba(108,92,231,0.18)',
        borderRadius: '16px', padding: '14px 18px', display: 'flex', gap: '12px',
        alignItems: 'center', marginBottom: '24px',
      }}>
        <AlertCircle size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
          <strong>Eligibility Engine:</strong> Ensure your <strong>Current CGPA</strong> and{' '}
          <strong>Active Backlogs</strong> are accurate — company algorithms filter candidates using these values.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>

          <div className="form-group">
            <RL>Current Course / Degree</RL>
            <input type="text" name="course" value={formData.course} onChange={handleChange}
              placeholder="e.g. B.Tech Computer Science" className="form-control" />
          </div>

          <div className="form-group">
            <RL optional>Specialization</RL>
            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange}
              placeholder="e.g. AI & Data Science" className="form-control" />
          </div>

          <div className="form-group">
            <RL>College Name</RL>
            <input type="text" name="college" value={formData.college} onChange={handleChange}
              placeholder="e.g. Apex Institute of Technology" className="form-control" />
          </div>

          <div className="form-group">
            <RL optional>Affiliated University</RL>
            <input type="text" name="university" value={formData.university} onChange={handleChange}
              placeholder="e.g. State Technical University" className="form-control" />
          </div>

          <div className="form-group">
            <RL>Current Year</RL>
            {sel('currentYear', ['1st Year','2nd Year','3rd Year','4th Year'])}
          </div>

          <div className="form-group">
            <RL optional>Current Semester</RL>
            {sel('currentSemester', ['1st Semester','2nd Semester','3rd Semester','4th Semester','5th Semester','6th Semester','7th Semester','8th Semester'])}
          </div>

          <div className="form-group">
            <RL optional>Division / Section</RL>
            <input type="text" name="division" value={formData.division} onChange={handleChange}
              placeholder="e.g. Division A" className="form-control" />
          </div>

          <div className="form-group">
            <RL optional>Academic Batch</RL>
            <input type="text" name="batch" value={formData.batch} onChange={handleChange}
              placeholder="e.g. 2023 – 2027" className="form-control" />
          </div>

          {/* CGPA — highlighted required */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700 }}>
              Current CGPA (out of 10.0)
              <span style={{ color: '#EF4444', fontSize: '15px', lineHeight: 1 }}>*</span>
            </label>
            <input type="number" step="0.01" min="0" max="10" name="currentCgpa"
              value={formData.currentCgpa} onChange={handleChange}
              placeholder="e.g. 8.65" className="form-control"
              style={{ borderColor: 'var(--primary)', fontWeight: 600 }} />
          </div>

          {/* Backlogs — highlighted required */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EF4444', fontWeight: 700 }}>
              Active Backlogs
              <span style={{ fontSize: '15px', lineHeight: 1 }}>*</span>
            </label>
            <input type="number" min="0" name="backlogs"
              value={formData.backlogs} onChange={handleChange}
              placeholder="0 (enter 0 if none)" className="form-control" style={{ fontWeight: 600 }} />
          </div>

          <div className="form-group">
            <RL optional>Expected Graduation Year</RL>
            <input type="number" name="expectedGraduationYear" value={formData.expectedGraduationYear}
              onChange={handleChange} placeholder="e.g. 2027" className="form-control" />
          </div>
        </div>

        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ minWidth: '190px' }}>
            {saving
              ? <><span style={{ width:'14px', height:'14px', border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} /> Saving…</>
              : <><Save size={15} /> Update Academics</>}
          </button>
        </div>
      </form>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CurrentAcademicPage;
