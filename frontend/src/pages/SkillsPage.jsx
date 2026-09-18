import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, X, Save, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { api } from '../services/api';

const suggestedSkills = [
  'Python',
  'Java',
  'JavaScript',
  'React',
  'SQL',
  'Data Analytics',
  'Machine Learning',
  'Node.js',
  'C++',
  'TypeScript',
  'Spring Boot',
  'Docker',
  'AWS',
  'Git',
  'HTML/CSS',
  'Data Structures',
  'REST APIs',
  'MongoDB',
];

const SkillsPage = () => {
  const { profile, refreshProfile } = useAuth();
  const toast = useToast();
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile && Array.isArray(profile.skills)) {
      setSkills(profile.skills);
    }
  }, [profile]);

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkill).trim();
    if (!trimmed) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.warning(`"${trimmed}" is already in your skills list.`, 'Already Added');
      return;
    }
    setSkills((prev) => [...prev, trimmed]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSave = async () => {
    if (skills.length === 0) {
      toast.warning('Add at least one skill before saving.', 'Action Required');
      return;
    }
    setSaving(true);
    try {
      const res = await api.updateSkills(skills);
      if (res.success) {
        toast.success(`${skills.length} skill(s) saved to your profile.`, 'Skills Updated');
        await refreshProfile();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save skills.', 'Save Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="top-header">
        <div>
          <h1 className="greeting-title">Skills &amp; Technical Badges</h1>
          <p className="greeting-sub">
            Add your programming languages, frameworks, and tools to match company requirements.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '14px' }}>
          Add Custom Skill
        </h3>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Python, Machine Learning, React Native..."
              className="form-control"
              style={{ paddingLeft: '40px' }}
            />
            <Tag size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          </div>
          <button
            type="button"
            onClick={() => handleAddSkill()}
            className="btn btn-primary"
            style={{ borderRadius: '12px', padding: '0 24px' }}
          >
            <Plus size={18} /> Add Skill
          </button>
        </div>

        {/* Current Active Skills */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Your Active Skills ({skills.length})
          </h4>

          {skills.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              No skills added yet. Choose from popular skills below or type one above.
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {skills.map((skill) => (
                <div
                  key={skill}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '24px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    border: '1px solid rgba(108, 92, 231, 0.2)',
                  }}
                >
                  <Sparkles size={14} />
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0,
                    }}
                    title="Remove skill"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggested Skills Pill Drawer */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px' }}>
            Recommended Placement Skills (Click to add)
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {suggestedSkills.map((item) => {
              const alreadyHas = skills.some((s) => s.toLowerCase() === item.toLowerCase());
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => !alreadyHas && handleAddSkill(item)}
                  disabled={alreadyHas}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px dashed',
                    borderColor: alreadyHas ? '#CBD5E1' : '#A29BFE',
                    backgroundColor: alreadyHas ? '#F1F5F9' : '#FFFFFF',
                    color: alreadyHas ? '#94A3B8' : 'var(--primary)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: alreadyHas ? 'default' : 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  {alreadyHas ? `✓ ${item}` : `+ ${item}`}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ minWidth: '160px' }}
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Skills'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
