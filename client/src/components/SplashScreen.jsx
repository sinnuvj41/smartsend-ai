function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center shadow-2xl animate-pulse">
          <span className="text-4xl">✈️</span>
        </div>

        <h1 className="text-4xl font-extrabold mb-2">SmartSend AI</h1>
        <p className="text-slate-400 mb-6">Advanced Contact Form</p>

        <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 animate-[loading_1.8s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;