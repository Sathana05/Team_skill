import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const LEVEL_COLOR = { Beginner: "badge-beginner", Intermediate: "badge-intermediate", Advanced: "badge-advanced" };
export default function SkillsPage() {
  const { token } = useAuth();
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name: "", proficiency: "Beginner", yearsUsed: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    api.getProfile(token).then((d) => setSkills(d.skills || []));
  }, []);

  const add = async (e) => {
    e.preventDefault();
    setError("");
    const data = await api.addSkill(token, { ...form, yearsUsed: Number(form.yearsUsed) || 0 });
    if (data.error) return setError(data.error);
    setSkills(data.skills);
    setForm({ name: "", proficiency: "Beginner", yearsUsed: "" });
  };

  const save = async (skillId) => {
    const data = await api.updateSkill(token, skillId, { ...editForm, yearsUsed: Number(editForm.yearsUsed) || 0 });
    setSkills(data.skills);
    setEditId(null);
  };

  const remove = async (skillId) => {
    const data = await api.deleteSkill(token, skillId);
    setSkills(data.skills);
  };

  return (
    <div className="page">
      <div className="page-header"><h2>My Skills</h2></div>
      <div className="card form-card">
        <h3>Add Skill</h3>
        <form onSubmit={add} className="inline-form">
          <input placeholder="Skill name (e.g. React)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <select value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: e.target.value })}>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
          <input type="number" min="0" placeholder="Years used" value={form.yearsUsed} onChange={(e) => setForm({ ...form, yearsUsed: e.target.value })} style={{ width: 110 }} />
          <button type="submit" className="btn-primary">Add</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      {skills.length === 0 ? (
        <div className="empty">No skills added yet. Add your first skill above!</div>
      ) : (
        <div className="skills-grid">
          {skills.map((s) => (
            <div key={s._id} className="skill-card">
              {editId === s._id ? (
                <div className="skill-edit">
                  <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  <select value={editForm.proficiency} onChange={(e) => setEditForm({ ...editForm, proficiency: e.target.value })}>
                    {LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                  <input type="number" min="0" value={editForm.yearsUsed} onChange={(e) => setEditForm({ ...editForm, yearsUsed: e.target.value })} style={{ width: 80 }} />
                  <div className="skill-actions">
                    <button className="btn-primary btn-sm" onClick={() => save(s._id)}>Save</button>
                    <button className="btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="skill-name">{s.name}</div>
                  <span className={`badge ${LEVEL_COLOR[s.proficiency]}`}>{s.proficiency}</span>
                  {s.yearsUsed > 0 && <span className="skill-years">{s.yearsUsed} yr{s.yearsUsed !== 1 ? "s" : ""}</span>}
                  <div className="skill-actions">
                    <button className="btn-icon" onClick={() => { setEditId(s._id); setEditForm({ name: s.name, proficiency: s.proficiency, yearsUsed: s.yearsUsed }); }} title="Edit">✏️</button>
                    <button className="btn-icon btn-danger" onClick={() => remove(s._id)} title="Delete">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
