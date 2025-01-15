import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex flex-1 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">BilikKu</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/get-started" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            Sublet Management{' '}
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            The easiest way to manage your sublet properties. Track rooms, tenants, and payments all in one place.
          </p>
          <div className="flex gap-4">
            <Link href="/get-started" className="btn-primary">
              Start Free Trial
            </Link>
            <Link href="/demo" className="btn-secondary">
              View Demo <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl">
            Everything you need to manage your sublets
          </h2>
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            {/* Room Management */}
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-xl font-bold">Room Management</h3>
              <p className="text-muted-foreground">
                Manage multiple rooms with detailed tracking of availability and tenant assignments.
              </p>
            </div>

            {/* Tenant Management */}
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-xl font-bold">Tenant Management</h3>
              <p className="text-muted-foreground">
                Keep track of tenant information, agreements, and payment history in one place.
              </p>
            </div>

            {/* Payment Tracking */}
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-xl font-bold">Payment Tracking</h3>
              <p className="text-muted-foreground">
                Track rental payments and deposits with automated status updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl">
            Simple, transparent pricing
          </h2>
          <div className="mx-auto w-full max-w-sm rounded-lg border border-border bg-card p-8">
            <h3 className="text-2xl font-bold">Free Trial</h3>
            <div className="mt-4 flex items-baseline justify-center gap-x-2">
              <span className="text-5xl font-bold">RM 0</span>
            </div>
            <p className="mt-6 text-muted-foreground">
              Try BilikKu free for 14 days. No credit card required.
            </p>
            <div className="mt-8">
              <h4 className="text-sm font-semibold">What's included</h4>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2">Unlimited rooms</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2">Tenant management</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2">Payment tracking</span>
                </li>
              </ul>
            </div>
            <Link
              href="/get-started"
              className="mt-8 block w-full btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
