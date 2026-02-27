import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-white font-bold text-lg">My SaaS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-white text-zinc-900 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Build your next{" "}
            <span className="gradient-text">SaaS product</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            A production-ready template with Next.js, FastAPI, Supabase, and Stripe.
            Authentication, payments, and a dashboard — all wired up and ready to go.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-6 py-3 bg-white text-zinc-900 rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-colors shadow-lg shadow-white/10"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="px-6 py-3 border border-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Authentication",
                description: "Google OAuth via Supabase. Login, signup, and session management out of the box.",
              },
              {
                title: "Payments",
                description: "Stripe Checkout with subscription management, webhooks, and mock mode for development.",
              },
              {
                title: "Dashboard",
                description: "Beautiful sidebar layout with Catalyst UI components, dark mode support, and responsive design.",
              },
              {
                title: "API Layer",
                description: "FastAPI backend with Supabase Data API client, JWT auth middleware, and CORS configured.",
              },
              {
                title: "Type Safety",
                description: "Full TypeScript on frontend, Pydantic models on backend. End-to-end type safety.",
              },
              {
                title: "Developer Experience",
                description: "Mock modes for Stripe, hot reload on both ends, and env files ready to fill in.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.07] transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Ready to build?</h2>
          <p className="mt-4 text-zinc-400">
            Start building your SaaS product today.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block px-8 py-3 bg-white text-zinc-900 rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <p className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} My SaaS App</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </>
  );
}
