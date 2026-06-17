'use client';

import React from 'react';
import Link from 'next/link';

export default function ResourcesPage() {
  const articles = [
    {
      title: "Understanding Eczema vs Psoriasis",
      category: "Education",
      description: "Learn to distinguish between two of the most common chronic skin conditions and their specific triggers.",
      icon: "🔍"
    },
    {
      title: "Daily Skincare Routine for Sensitive Skin",
      category: "Prevention",
      description: "A dermatologist-approved daily routine to minimize breakouts and protect your skin barrier.",
      icon: "🧴"
    },
    {
      title: "When to See a Doctor",
      category: "Guidelines",
      description: "Recognize the warning signs of serious dermatological issues that require immediate professional care.",
      icon: "⚕️"
    },
    {
      title: "The Impact of Diet on Skin Health",
      category: "Lifestyle",
      description: "How hydration, sugar intake, and vitamins directly affect your complexion and long-term skin health.",
      icon: "🥗"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-brand-400 to-brand-500 flex items-center justify-center text-white font-bold text-sm shadow-md mr-2">A</div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-brand-400">Evia</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-brand-500 transition-colors">
              Dashboard
            </Link>
            <Link href="/scan/upload" className="text-sm font-medium text-white bg-brand-500 hover:brightness-110 px-4 py-2 rounded-md transition-colors shadow-sm">
              New Scan
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Skin Care Resources</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-300">
            Empowering you with expert knowledge to understand, protect, and care for your skin.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {articles.map((article, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-100 text-[--foreground]/80">
                    {article.category}
                  </span>
                  <span className="text-2xl">{article.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-600 flex-1">{article.description}</p>
                <div className="mt-6 pt-4 border-t border-gray-50">
                  <button className="text-brand-500 font-medium hover:text-[--foreground] text-sm flex items-center transition-colors">
                    Read Article
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 rounded-2xl p-8 border border-blue-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need personalized advice?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Our AI-powered Skin Analyzer can help identify potential conditions and recommend the next steps for your skincare journey.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/scan/upload" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-500 hover:brightness-110 transition-colors">
              Start Free Scan
            </Link>
            <Link href="/scan/clinics" className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Find a Dermatologist
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
