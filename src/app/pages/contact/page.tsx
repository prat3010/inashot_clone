'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (e) {
      alert('Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#fdd835] bg-black px-4 py-1.5 rounded-full inline-block mb-3">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-gray-900">
            Contact Us
          </h1>
          <p className="mt-3 text-base text-gray-600 font-medium">
            Have questions about orders, ingredients, or partnerships? We’re always here to chat.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 bg-[#fafafa] rounded-3xl p-8 border border-gray-100 space-y-8">
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">
              Corporate &amp; Order Office
            </h3>

            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-black text-[#fdd835] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase text-gray-400 font-bold block">Email</span>
                  <a
                    href="mailto:cheers@inashot.life"
                    className="text-base font-black text-gray-900 hover:text-amber-800 transition-colors"
                  >
                    cheers@inashot.life
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-black text-[#fdd835] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase text-gray-400 font-bold block">Registered Address</span>
                  <p className="text-sm font-semibold text-gray-700 leading-relaxed mt-0.5">
                    M/S IN&apos;A SHOT, Flat No- 201, Sarika Apartment, Priyadarshi Nagar, Rupaspur, Patna, Bihar - 800014
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400 block mb-2">
                Operational Hours
              </span>
              <p className="text-xs font-semibold text-gray-700">
                Monday to Saturday: 10:00 AM – 7:00 PM IST
              </p>
            </div>
          </div>

          {/* Right: Working Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-6">
              Drop Us a Note
            </h3>

            {isSuccess ? (
              <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h4 className="text-xl font-black uppercase text-gray-900">Message Received!</h4>
                <p className="text-sm text-gray-600 font-medium max-w-sm mx-auto">
                  Thank you for reaching out. We have logged your inquiry into SQLite and our team will get back to you shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 px-6 py-2.5 bg-black text-white rounded-full text-xs font-black uppercase tracking-wider hover:bg-[#fdd835] hover:text-black transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="ContactForm-name" className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="ContactForm-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ContactForm-email" className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="ContactForm-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="priya@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor="ContactForm-phone" className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="ContactForm-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="ContactForm-body" className="text-xs font-black uppercase tracking-wider text-gray-700 block mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="ContactForm-body"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none text-sm font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-black hover:bg-[#fdd835] hover:text-black text-white font-black text-xs uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
