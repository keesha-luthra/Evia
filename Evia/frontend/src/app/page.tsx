"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaStethoscope, FaCamera, FaHeartbeat, FaRegHospital, FaLock, FaCheckCircle } from 'react-icons/fa';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="bg-[--background] min-h-screen text-[--foreground] font-sans selection:bg-brand-200 selection:text-brand-500">
      {/* Minimalist Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-brand-100/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-lg shadow-sm">
                  <Image src="/logo.png" alt="Evia Logo" fill className="object-cover" />
                </div>
                <span className={`text-xl font-semibold tracking-tight ${scrolled ? 'text-[--foreground]' : 'text-[--foreground]'}`}>Evia</span>
              </Link>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <Link href="/scan/upload/" className="text-sm font-medium text-[--foreground]/80 hover:text-brand-500 transition-colors">Skin Analyzer</Link>
              <Link href="/women" className="text-sm font-medium text-[--foreground]/80 hover:text-brand-500 transition-colors">Women's Health</Link>
              <a href={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/live_ar`} className="text-sm font-medium text-[--foreground]/80 hover:text-brand-500 transition-colors">Live AR</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium text-[--foreground]/80 hover:text-[--foreground] hidden md:block">Log in</Link>
              <Link href="/register" className="text-sm font-medium px-4 py-2 bg-brand-500 text-white rounded-full hover:brightness-110 transition-all shadow-sm">
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section with Clean Background & Doctor Image */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-200 text-[#4a3b2c] text-xs font-bold uppercase tracking-wider mb-6">
                <FaCheckCircle className="text-brand-500" /> Clinically Validated AI
              </div>
              <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight text-[--foreground] leading-[1.1] mb-6">
                Professional skin health analysis, <span className="text-brand-500">instantly.</span>
              </h1>
              <p className="text-lg text-[--foreground]/80 mb-8 leading-relaxed max-w-lg">
                Upload a photo to detect potential skin conditions with medical-grade AI accuracy. Get personalized recommendations and take control of your dermatological health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/scan/upload/" className="px-8 py-4 bg-brand-400 text-[#4a3b2c] rounded-full font-bold text-center hover:brightness-105 transition-colors shadow-sm flex items-center justify-center gap-2">
                  <FaCamera /> Start Analysis
                </Link>
                <Link href="/women" className="px-8 py-4 bg-brand-100 text-[--foreground] border border-brand-300 rounded-full font-bold text-center hover:bg-brand-200 transition-colors flex items-center justify-center gap-2">
                  <FaHeartbeat className="text-brand-500" /> Women's Health
                </Link>
              </div>
            </div>

            {/* User Provided Background Image Integration */}
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-brand-200 animate-pulse"></div>
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/hero-bg.jpg')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[--foreground]/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-brand-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-[--foreground] mb-4">A complete view of your skin health.</h2>
            <p className="text-[--foreground]/70">Advanced machine learning designed to give you clarity and peace of mind.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-brand-100 rounded-3xl p-8 border border-brand-300 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-brand-500 text-xl">
                <FaStethoscope />
              </div>
              <h3 className="text-xl font-semibold text-[--foreground] mb-3">Instant Diagnosis</h3>
              <p className="text-[--foreground]/80 leading-relaxed text-sm">
                Get accurate assessments for over 11 common skin conditions within seconds.
              </p>
            </div>

            <div className="bg-brand-100 rounded-3xl p-8 border border-brand-300 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-brand-400 text-xl">
                <FaHeartbeat />
              </div>
              <h3 className="text-xl font-semibold text-[--foreground] mb-3">Women's Health</h3>
              <p className="text-[--foreground]/80 leading-relaxed text-sm">
                A dedicated, integrated space for personalized female health consultations and video visits.
              </p>
            </div>

            <div className="bg-brand-100 rounded-3xl p-8 border border-brand-300 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-brand-500 text-xl">
                <FaLock />
              </div>
              <h3 className="text-xl font-semibold text-[--foreground] mb-3">Secure & Private</h3>
              <p className="text-[--foreground]/80 leading-relaxed text-sm">
                Your medical data is encrypted. We adhere strictly to modern health privacy standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-100 border-t border-brand-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-8 w-8 overflow-hidden rounded-lg shadow-sm">
                  <Image src="/logo.png" alt="Evia Logo" fill className="object-cover" />
                </div>
                <span className="text-lg font-semibold text-[--foreground]">Evia</span>
              </div>
              <p className="text-[--foreground]/70 text-sm max-w-xs">
                Empowering individuals with clinical-grade AI for better dermatological decisions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[--foreground] mb-4 text-sm">Services</h4>
              <ul className="space-y-3 text-sm text-[--foreground]/80">
                <li><Link href="/scan/upload/" className="hover:text-brand-500">Skin Analysis</Link></li>
                <li><Link href="/women" className="hover:text-brand-500">Women's Health</Link></li>
                <li><a href={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/live_ar`} className="hover:text-brand-500">Live AR Consult</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[--foreground] mb-4 text-sm">Legal</h4>
              <ul className="space-y-3 text-sm text-[--foreground]/80">
                <li><Link href="/privacy" className="hover:text-brand-500">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-brand-500">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-brand-200 flex flex-col md:flex-row items-center justify-between">
            <p className="text-[--foreground]/60 text-xs text-center md:text-left">
              * Evia provides AI analysis. Always consult a certified healthcare professional for formal diagnosis.
            </p>
            <p className="text-[--foreground]/60 text-xs mt-4 md:mt-0">© {new Date().getFullYear()} Evia.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}