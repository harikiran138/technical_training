export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to <span className="text-primary-600">EduFlex AI</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          AI-Powered Academic Platform for Colleges
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <a 
            href="/login"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Get Started
          </a>
          <a 
            href="/about"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-white transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  )
}
