'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { ArrowRightIcon, HomeIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { LanguageToggle } from '../components/LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="glass-header">
        <nav className="container flex h-16 items-center">
          <div className="flex flex-1 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">BilikKu</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-secondary">
                {t('nav.login')}
              </Link>
              <Link href="/register" className="btn-primary">
                {t('nav.getStarted')}
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Add padding to account for fixed header */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
              {t('hero.title')}
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              {t('hero.subtitle')}
            </p>
            <div className="flex gap-4 items-center">
              <Link href="/register" className="btn-primary">
                {t('hero.startTrial')}
              </Link>
              <Link href="/login" className="btn-secondary">
                {t('hero.viewDemo')} <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <LanguageToggle />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl">
              {t('features.title')}
            </h2>
            <div className="grid gap-8 md:grid-cols-3 md:gap-12">
              {/* Room Management */}
              <div className="glass-card flex flex-col items-center gap-2 text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <HomeIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">
                  {t('features.roomManagement.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('features.roomManagement.description')}
                </p>
              </div>

              {/* Tenant Management */}
              <div className="glass-card flex flex-col items-center gap-2 text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">
                  {t('features.tenantManagement.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('features.tenantManagement.description')}
                </p>
              </div>

              {/* Payment Tracking */}
              <div className="glass-card flex flex-col items-center gap-2 text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <CurrencyDollarIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">
                  {t('features.paymentTracking.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('features.paymentTracking.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Emotional Appeal Section */}
        <section className="container py-12 md:py-24 lg:py-32 bg-accent/5">
          <div className="mx-auto max-w-[980px] space-y-12">
            {/* Success Stories */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('appeal.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('appeal.subtitle')}
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Time Savings */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-2">
                  {t('appeal.timeSaving.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('appeal.timeSaving.description')}
                </p>
              </div>

              {/* Stress Reduction */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-2">
                  {t('appeal.stressReduction.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('appeal.stressReduction.description')}
                </p>
              </div>

              {/* Financial Control */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-2">
                  {t('appeal.financialControl.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('appeal.financialControl.description')}
                </p>
              </div>

              {/* Growth Potential */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-2">
                  {t('appeal.growth.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('appeal.growth.description')}
                </p>
              </div>
            </div>

            {/* Testimonial */}
            <div className="glass-card p-8 mt-12">
              <blockquote className="text-lg text-center italic">
                "Before BilikKu, I was drowning in paperwork and constantly chasing payments.
                Now, I manage twice as many properties in half the time. It's completely transformed
                how I run my business."
              </blockquote>
              <div className="text-center mt-4">
                <p className="font-semibold">Sarah Chen</p>
                <p className="text-sm text-muted-foreground">Property Manager, Kuala Lumpur</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <Link
                href="/register"
                className="btn-primary inline-flex items-center text-lg px-8 py-3"
              >
                {t('nav.getStarted')}
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                {t('appeal.joinCommunity')}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold leading-tight tracking-tighter md:text-4xl">
              {t('pricing.title')}
            </h2>
            <div className="mx-auto w-full max-w-sm rounded-lg border border-border bg-card p-8">
              <h3 className="text-2xl font-bold">
                {t('pricing.freeTrial')}
              </h3>
              <div className="mt-4 flex items-baseline justify-center gap-x-2">
                <span className="text-5xl font-bold">
                  {t('pricing.price')}
                </span>
              </div>
              <p className="mt-6 text-muted-foreground">
                {t('pricing.trialDescription')}
              </p>
              <div className="mt-8">
                <h4 className="text-sm font-semibold">
                  {t('pricing.includes')}
                </h4>
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
                href="/register"
                className="mt-8 block w-full btn-primary"
              >
                {t('pricing.getStarted')}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
