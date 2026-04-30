import React from "react";

function Settings() {
  const copy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-slate-400">SmartSend AI configuration guide</p>
        </div>

        <a
          href="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
        >
          Dashboard
        </a>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* SMTP */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-bold mb-3">Email SMTP</h2>
          <p className="text-slate-400 mb-3">
            Configure SMTP values inside server/.env file.
          </p>

          <div className="bg-black/40 p-4 rounded-lg text-sm space-y-2">
            <div className="flex justify-between">
              <span>SMTP_HOST=smtp.gmail.com</span>
              <button onClick={() => copy("SMTP_HOST=smtp.gmail.com")} className="text-xs bg-blue-600 px-2 py-1 rounded">Copy</button>
            </div>

            <div className="flex justify-between">
              <span>SMTP_PORT=587</span>
              <button onClick={() => copy("SMTP_PORT=587")} className="text-xs bg-blue-600 px-2 py-1 rounded">Copy</button>
            </div>

            <div className="flex justify-between">
              <span>SMTP_SECURE=false</span>
              <button onClick={() => copy("SMTP_SECURE=false")} className="text-xs bg-blue-600 px-2 py-1 rounded">Copy</button>
            </div>

            <div className="flex justify-between">
              <span>SMTP_USER=your_email@gmail.com</span>
              <button onClick={() => copy("SMTP_USER=your_email@gmail.com")} className="text-xs bg-blue-600 px-2 py-1 rounded">Copy</button>
            </div>

            <div className="flex justify-between">
              <span>SMTP_PASS=your_app_password</span>
              <button onClick={() => copy("SMTP_PASS=your_app_password")} className="text-xs bg-blue-600 px-2 py-1 rounded">Copy</button>
            </div>
          </div>

          <p className="text-yellow-400 text-sm mt-3">
            ⚠️ Do not share your .env file publicly.
          </p>
        </div>

        {/* AI */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-bold mb-3">AI Configuration</h2>

          <div className="bg-black/40 p-4 rounded-lg flex justify-between text-sm">
            <span>GEMINI_API_KEY=your_api_key</span>
            <button onClick={() => copy("GEMINI_API_KEY=your_api_key")} className="text-xs bg-blue-600 px-2 py-1 rounded">Copy</button>
          </div>
        </div>

        {/* Upload */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-bold mb-3">Upload Settings</h2>

          <div className="bg-black/40 p-4 rounded-lg text-sm space-y-2">
            <div className="flex justify-between">
              <span>MAX_FILE_SIZE_MB=5</span>
              <button onClick={() => copy("MAX_FILE_SIZE_MB=5")} className="text-xs bg-blue-600 px-2 py-1 rounded">Copy</button>
            </div>

            <div className="flex justify-between">
              <span>UPLOAD_DIR=uploads</span>
              <button onClick={() => copy("UPLOAD_DIR=uploads")} className="text-xs bg-blue-600 px-2 py-1 rounded">Copy</button>
            </div>
          </div>
        </div>

        {/* Admin */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-bold mb-3">Admin Login</h2>

          <div className="bg-black/40 p-4 rounded-lg text-sm space-y-2">
            <div className="flex justify-between">
              <span>ADMIN_EMAIL=your_email</span>
              <button onClick={() => copy("ADMIN_EMAIL=your_email")} className="text-xs bg-blue-600 px-2 py-1 rounded">Copy</button>
            </div>

            <div className="flex justify-between">
              <span>ADMIN_PASSWORD=your_password</span>
              <button onClick={() => copy("ADMIN_PASSWORD=your_password")} className="text-xs bg-blue-600 px-2 py-1 rounded">Copy</button>
            </div>

            <div className="flex justify-between">
              <span>JWT_SECRET=your_secret_key</span>
              <button onClick={() => copy("JWT_SECRET=your_secret_key")} className="text-xs bg-blue-600 px-2 py-1 rounded">Copy</button>
            </div>
          </div>
        </div>

      </div>

      {/* Setup Steps */}
      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-3">Setup Steps</h2>

        <ul className="list-disc pl-5 text-slate-300 space-y-1">
          <li>Copy .env.example to .env</li>
          <li>Paste SMTP credentials</li>
          <li>Add Gemini API key</li>
          <li>Run server (npm start)</li>
        </ul>
      </div>
    </div>
  );
}

export default Settings;