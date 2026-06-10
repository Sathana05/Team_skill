import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.getProfile(token).then((data) => {
      setProfile(data);
      setForm({ name: data.name, department: data.department, jobTitle: data.jobTitle, yearsOfExperience: data.yearsOfExperience });
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const updated = await api.updateProfile(token, { ...form, yearsOfExperience: Number(form.yearsOfExperience) });
    setProfile(updated);
    setEditing(false);
    setMsg("Profile updated!");
    setTimeout(() => setMsg(""), 2000);
  };

  if (!profile) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>My Profile</h2>
        {!editing && <button className="btn-secondary" onClick={() => setEditing(true)}>Edit Profile</button>}
      </div>
      {msg && <div className="toast success">{msg}</div>}
      {editing ? (
        <form onSubmit={save} className="card form-card">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. Engineering" />
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <input value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} placeholder="e.g. Frontend Developer" />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input type="number" min="0" value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="card profile-card">
          <div className="profile-avatar">{profile.name?.charAt(0).toUpperCase()}</div>
          <div className="profile-details">
            <h3>{profile.name}</h3>
            <p className="profile-email">{profile.email}</p>
            <div className="profile-meta">
              {profile.jobTitle && <span className="badge">{profile.jobTitle}</span>}
              {profile.department && <span className="badge badge-dept">{profile.department}</span>}
              {profile.yearsOfExperience > 0 && <span className="badge badge-exp">{profile.yearsOfExperience} yrs exp</span>}
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat"><span className="stat-val">{profile.skills?.length || 0}</span><span className="stat-lbl">Skills</span></div>
            <div className="stat"><span className="stat-val">{profile.certifications?.length || 0}</span><span className="stat-lbl">Certs</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
