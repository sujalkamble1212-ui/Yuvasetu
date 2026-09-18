import React, { useState, useEffect } from 'react';
import { Camera, Save, User, Phone, Mail, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { api } from '../services/api';

/* Reusable required-label */
const RL = ({ children, optional = false }) => (
  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    {children}
    {!optional && <span style={{ color: '#EF4444', fontSize: '15px', lineHeight: 1 }}>*</span>}
    {optional && <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 400 }}>(optional)</span>}
  </label>
);

const StudentProfile = () => {
  const { profile, refreshProfile } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: '', mobile: '', dob: '', gender: '', address: '',
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        mobile:   profile.mobile   || '',
        dob:      profile.dob ? profile.dob.substring(0, 10) : '',
        gender:   profile.gender   || '',
        address:  profile.address  || '',
      });
      if (profile.profilePhoto) {
        setPhotoPreview(profile.profilePhoto.startsWith('/') ? profile.profilePhoto : `/${profile.profilePhoto}`);
      }
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WEBP).', 'Invalid File');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2 MB.', 'File Too Large');
      return;
    }
    setPhotoPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append('photo', file);
    setUploadingPhoto(true);
    try {
      const res = await api.uploadPhoto(fd);
      if (res.success) {
        toast.success('Profile photo updated successfully.', 'Photo Uploaded');
        await refreshProfile();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload photo.', 'Upload Error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.warning('Full name is required.', 'Action Required');
      return;
    }
    if (!formData.mobile.trim()) {
      toast.warning('Mobile number is required.', 'Action Required');
      return;
    }
    if (!formData.gender) {
      toast.warning('Please select your gender.', 'Action Required');
      return;
    }
    setSaving(true);
    try {
      const res = await api.updateProfile(formData);
      if (res.success) {
        toast.success('Your profile details have been updated.', 'Profile Saved');
        await refreshProfile();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.', 'Save Failed');
    } finally {
      setSaving(false);
    }
  };

  const inputBase = { paddingLeft: '40px' };

  return (
    <div style={{ width: '100%' }}>
      <div className="top-header">
        <div>
          <h1 className="greeting-title">Student Profile</h1>
          <p className="greeting-sub">
            Manage your personal details and campus profile photo.&nbsp;
            <span style={{ color: '#EF4444', fontWeight: 700 }}>*</span>
            &nbsp;fields are compulsory.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        {/* Photo Section */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '24px',
            paddingBottom: '24px', borderBottom: '1px solid var(--border-light)',
            marginBottom: '24px', flexWrap: 'wrap',
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden',
                backgroundColor: 'var(--primary-light)', border: '4px solid #FFFFFF',
                boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'var(--primary)', fontSize: '32px', fontWeight: 800,
              }}
            >
              {photoPreview
                ? <img src={photoPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : (formData.fullName?.charAt(0)?.toUpperCase() || 'S')}
            </div>
            <label
              htmlFor="photo-upload"
              style={{
                position: 'absolute', bottom: 0, right: 0,
                backgroundColor: 'var(--primary)', color: '#FFFFFF', borderRadius: '50%',
                width: '34px', height: '34px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)', transition: 'var(--transition)',
              }}
              title="Upload new photo"
            >
              <Camera size={16} />
              <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoSelect} style={{ display: 'none' }} />
            </label>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{formData.fullName || 'Your Name'}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Click the camera icon to update your profile photo.
            </p>
            <label htmlFor="photo-upload" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex' }}>
              <Camera size={14} /> {uploadingPhoto ? 'Uploading…' : 'Change Photo'}
            </label>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>

            <div className="form-group">
              <RL>Full Name</RL>
              <div style={{ position: 'relative' }}>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                  placeholder="Enter your full name" required className="form-control" style={inputBase} />
                <User size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Email Address
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 400 }}>(registered — cannot edit)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input type="email" value={profile?.email || ''} disabled className="form-control"
                  style={{ paddingLeft: '40px', backgroundColor: '#F8FAFC', cursor: 'not-allowed', color: '#94A3B8' }} />
                <Mail size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
              </div>
            </div>

            <div className="form-group">
              <RL>Mobile Number</RL>
              <div style={{ position: 'relative' }}>
                <input type="tel" name="mobile" value={formData.mobile}
                  onChange={(e) => setFormData(p => ({ ...p, mobile: e.target.value.replace(/\D/g,'').slice(0,10) }))}
                  placeholder="Enter 10-digit mobile number" required className="form-control" style={inputBase} />
                <Phone size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              </div>
            </div>

            <div className="form-group">
              <RL>Gender</RL>
              <select name="gender" value={formData.gender} onChange={handleChange} className="form-control">
                <option value="">— Select Gender —</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <RL optional>Date of Birth</RL>
              <div style={{ position: 'relative' }}>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange}
                  className="form-control" style={inputBase} />
                <Calendar size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <RL optional>Permanent / Current Address</RL>
            <textarea name="address" value={formData.address} onChange={handleChange}
              rows={3} placeholder="Enter your complete residence address (street, city, state, pincode)..."
              className="form-control" />
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ minWidth: '180px' }}>
              {saving
                ? <><span style={{ width:'14px', height:'14px', border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} /> Saving…</>
                : <><Save size={15} /> Save Profile Changes</>}
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default StudentProfile;
