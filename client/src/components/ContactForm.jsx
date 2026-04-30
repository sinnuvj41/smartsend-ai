import { useState } from "react";
import api from "../services/api";

function ContactForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const improveWithAI = async () => {
    if (!form.message.trim()) {
      setMsg("❌ Please type a message first.");
      return;
    }

    setAiLoading(true);
    setMsg("");

    try {
      const res = await api.post("/ai/improve-message", {
        message: form.message
      });

      setForm({ ...form, message: res.data.improvedMessage });
      setMsg("✨ Message improved with AI!");
    } catch {
      setMsg("❌ AI improvement failed.");
    }

    setAiLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      await api.post("/submissions", formData);

      setMsg("✅ Message sent successfully!");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setFiles([]);
    } catch {
      setMsg("❌ Failed to send message.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Send a Message</h2>
        <p className="text-slate-400 text-sm">
          Attach files and improve your message using AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-xl bg-slate-900/70 border border-white/10 outline-none focus:border-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-xl bg-slate-900/70 border border-white/10 outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-900/70 border border-white/10 outline-none focus:border-blue-500"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-xl bg-slate-900/70 border border-white/10 outline-none focus:border-blue-500"
          />
        </div>

        <textarea
          name="message"
          placeholder="Write your message..."
          value={form.message}
          onChange={handleChange}
          required
          rows="6"
          className="w-full p-4 rounded-xl bg-slate-900/70 border border-white/10 outline-none focus:border-blue-500"
        />

        <button
          type="button"
          onClick={improveWithAI}
          disabled={aiLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition p-4 rounded-xl font-bold"
        >
          {aiLoading ? "Improving..." : "✨ Improve Message with AI"}
        </button>

        <label className="block border border-dashed border-white/20 rounded-xl p-5 text-center cursor-pointer hover:border-blue-500 transition bg-slate-900/40">
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="hidden"
          />

          <span className="font-semibold">Click to upload files</span>
          <p className="text-slate-400 text-sm mt-1">
            JPG, PNG, WEBP, PDF, DOC, DOCX, TXT up to 5MB
          </p>

          {files.length > 0 && (
            <p className="text-blue-300 text-sm mt-3">
              {files.length} file(s) selected
            </p>
          )}
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-xl font-bold"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        {msg && (
          <p className="text-center bg-slate-900/70 border border-white/10 rounded-xl p-3">
            {msg}
          </p>
        )}
      </form>
    </div>
  );
}

export default ContactForm;