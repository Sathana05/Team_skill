import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function CertificationsPage() {
  const { token } = useAuth();
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState({ name: "", issuer: "", year: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    api.getProfile(token).then((d) => setCerts(d.certifications || []));
  }, []);

  const add = async (e) => {
    e.preventDefault();
    setError("");
    const data = await api.addCert(token, { ...form, year: form.year ? Number(form.year) : undefined });
    if (data.error) return setError(data.error);
    setCerts(data.certifications);
    setForm({ name: "", issuer: "", year: "" });
  };

  const remove = async (certId) => {
    const data = await api.deleteCert(token, certId);
    setCerts(data.certifications);
  };

  return (
    <div className="page">
      <div className="page-header"><h2>My Certifications</h2></div>
      <div className="card form-card">
        <h3>Add Certification</h3>
        <form onSubmit={add} className="inline-form">
          <input placeholder="Certification name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Issuer (e.g. AWS, Google)" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
          <input type="number" placeholder="Year" min="1990" max={new Date().getFullYear()} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} style={{ width: 90 }} />
          <button type="submit" className="btn-primary">Add</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      {certs.length === 0 ? (
        <div className="empty">No certifications added yet.</div>
      ) : (
        <div className="certs-list">
          {certs.map((c) => (
            <div key={c._id} className="cert-card">
              <div className="cert-icon">🏆</div>
              <div className="cert-info">
                <div className="cert-name">{c.name}</div>
                {c.issuer && <div className="cert-issuer">{c.issuer}</div>}
                {c.year && <div className="cert-year">{c.year}</div>}
              </div>
              <button className="btn-icon btn-danger" onClick={() => remove(c._id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
