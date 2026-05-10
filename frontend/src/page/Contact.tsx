import React, { useState } from "react";
import { submitContactApi } from "@/apis/contactApi";

function Contact() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await submitContactApi(form);
      if (res.success) {
        setStatus("success");
        setMsg("Your message was sent successfully. We will respond as soon as possible.");
        setForm({ full_name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setMsg(res.message || "Something went wrong.");
      }
    } catch (err: any) {
      setStatus("error");
      setMsg(err.response?.data?.message || "Could not send your message.");
    }
  };

  return (
    <div className="flex">

      <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ marginBottom: 8 }}>Contact</h1>
        <p style={{ color: "#666", marginBottom: 24 }}>
          Send us a message and we will respond as soon as possible.
        </p>

        {status === "success" && (
          <div style={{ background: "#d4edda", color: "#155724", padding: "12px 16px", borderRadius: 8, marginBottom: 16 }}>
            ✅ {msg}
          </div>
        )}
        {status === "error" && (
          <div style={{ background: "#f8d7da", color: "#721c24", padding: "12px 16px", borderRadius: 8, marginBottom: 16 }}>
            ❌ {msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Full name *</label>
            <input
              name="full_name" value={form.full_name} onChange={handleChange} required
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #ccc", borderRadius: 6 }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Email *</label>
            <input
              name="email" type="email" value={form.email} onChange={handleChange} required
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #ccc", borderRadius: 6 }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Subject</label>
            <input
              name="subject" value={form.subject} onChange={handleChange}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #ccc", borderRadius: 6 }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Message *</label>
            <textarea
              name="message" value={form.message} onChange={handleChange} required rows={5}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #ccc", borderRadius: 6, resize: "vertical" }}
            />
          </div>
          <button
            type="submit" disabled={status === "loading"}
            style={{
              padding: "12px 32px", background: "#2563eb", color: "#fff", border: "none",
              borderRadius: 8, cursor: "pointer", fontSize: 16, fontWeight: 600,
              opacity: status === "loading" ? 0.6 : 1,
            }}
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.0926371280025!2d106.80281137581046!3d10.880558489274618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a5568c997f%3A0xdeac05f17a166e0c!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBCw6FjaCBraG9hIC0gxJBIUUcgVFAuSENN!5e0!3m2!1svi!2s!4v1778403296306!5m2!1svi!2s"
        width="600" height="800" loading="lazy"></iframe>
    </div>
  );
}

export default Contact;
