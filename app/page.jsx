import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold">BilikKu</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Sublet Management
              <span className="text-primary block">Made Simple</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              The easiest way to manage your sublet properties. Track rooms, 
              tenants, and payments all in one place.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <Link href="/register" className="btn-primary">
                Start Free Trial
              </Link>
              <Link href="/demo" className="btn-secondary">
                View Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything you need to manage your sublets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 bg-background rounded-lg shadow-sm"
                >
                  <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Simple, transparent pricing
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="p-8 bg-background rounded-lg shadow-sm border">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Free Trial</h3>
                  <p className="text-4xl font-bold mb-6">RM 0</p>
                  <p className="text-muted-foreground mb-6">
                    Try BilikKu free for 14 days. No credit card required.
                  </p>
                  <Link href="/register" className="btn-primary w-full">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>© 2024 BilikKu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Room Management",
    description: "Manage multiple rooms with detailed tracking of availability and tenant assignments."
  },
  {
    title: "Tenant Management",
    description: "Keep track of tenant information, agreements, and payment history in one place."
  },
  {
    title: "Payment Tracking",
    description: "Track rental payments and deposits with automated status updates."
  }
];
