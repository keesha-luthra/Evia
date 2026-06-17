'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';

const TeamMembers = [
  {
    name: 'Keesha Luthra',
    role: 'Full Stack & AI Developer',
    expertise: 'Web Development, Machine Learning, System Design',
    background: 'Undergraduate, Indian Institute of Information Technology, Allahabad',
    image: '/keesha.jpg', // TODO: add your photo later
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Contact Section */}
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="grid md:grid-cols-2">
            
            {/* Left Side */}
            <div className="bg-brand-500 p-10 text-white">
              <h2 className="text-3xl font-bold mb-6">Contact Evia</h2>
              <p className="text-brand-200 mb-6">
                Have questions or need support? Reach out and I'll get back to you.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@frontend.ai</span>
                </div>

                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-10">
              {submitted ? (
                <div className="text-center text-green-600 font-semibold text-lg">
                  Thank you! Your message has been sent 💌
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">Your Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-500 text-white py-3 rounded-lg hover:brightness-110 transition duration-300"
                  >
                    Send Message
                  </button>

                </form>
              )}
            </div>

          </div>
        </div>

        {/* Team Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Meet the Developer
          </h2>

          <div className="flex justify-center">
            {TeamMembers.map((member) => (
              <div 
                key={member.name} 
                className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 w-80"
              >
                <div className="p-6">
                  
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-200">
                      <Image 
                        src={member.image} 
                        alt={member.name} 
                        width={64} 
                        height={64} 
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                      <p className="text-brand-500 font-medium">{member.role}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-2">{member.background}</p>
                  <p className="text-sm text-gray-500">{member.expertise}</p>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}