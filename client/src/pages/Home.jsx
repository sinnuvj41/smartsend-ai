import ContactForm from "../components/ContactForm";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#2563eb33,transparent_35%),radial-gradient(circle_at_bottom_right,#9333ea33,transparent_35%)]" />

      <main className="relative max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <nav className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-2xl font-bold">SmartSend AI</h2>
            <p className="text-slate-400 text-sm">Advanced Contact Form</p>
          </div>

          <a
            href="/admin"
            className="bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2 rounded-full transition"
          >
            Admin Login
          </a>
        </nav>

        <section className="grid lg:grid-cols-2 gap-10 items-start lg:items-center pb-12">
          <div>
            <span className="inline-block bg-blue-600/20 text-blue-300 border border-blue-500/30 px-4 py-2 rounded-full mb-5">
              AI Powered Contact Form Script
            </span>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Collect messages, files and smart leads beautifully.
            </h1>

            <p className="text-slate-300 text-lg leading-8 mb-8">
              SmartSend AI helps users send professional messages with file
              uploads, email notifications, admin dashboard and AI message
              improvement.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                <h3 className="font-bold">AI Assist</h3>
                <p className="text-slate-400 text-sm">Improve messages</p>
              </div>

              <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                <h3 className="font-bold">File Upload</h3>
                <p className="text-slate-400 text-sm">Send attachments</p>
              </div>

              <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                <h3 className="font-bold">Dashboard</h3>
                <p className="text-slate-400 text-sm">Manage submissions</p>
              </div>
            </div>
          </div>

          <ContactForm />
        </section>
      </main>
    </div>
  );
}

export default Home;