"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MinimalNavbar() {
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
              <span className={`text-xl font-semibold tracking-tight text-[--foreground]`}>Evia</span>
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
  );
}
