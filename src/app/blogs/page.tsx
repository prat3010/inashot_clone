import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export const metadata = {
  title: "Blogs & Science — Functional Snacking & Seed Cycling | IN'A SHOT",
  description:
    "Explore the science of seed cycling, clean-label plant protein, hormonal harmony, and functional snacking.",
};

const BLOG_POSTS = [
  {
    id: 1,
    slug: 'science-of-seed-cycling-28-day-rhythm',
    title: 'The 28-Day Seed Cycling Rhythm: How Specific Seeds Support Hormonal Harmony',
    excerpt:
      'Discover how alternating Flax + Pumpkin seeds in the follicular phase and Sesame + Sunflower in the luteal phase gently nurtures natural estrogen and progesterone balance.',
    category: 'Hormonal Health',
    readingTime: '5 min read',
    date: 'Nov 14, 2026',
    image: '/scraped/images/Artboard_1_9.png',
    author: "IN'A SHOT Nutrition Team",
  },
  {
    id: 2,
    slug: 'roasted-edamame-vs-traditional-nuts',
    title: 'Edamame vs. Traditional Nuts: Why Roasted Edamame Wins on Plant Protein & Fiber',
    excerpt:
      'With 13g of complete plant protein per serving, 0% added sugar, and lower saturated fat than standard fried nuts, edamame is the smart modern snack pop.',
    category: 'Nutrition & Protein',
    readingTime: '4 min read',
    date: 'Nov 12, 2026',
    image: '/scraped/images/Artboard_3_8.png',
    author: "IN'A SHOT Research Lab",
  },
  {
    id: 3,
    slug: 'clean-label-revolution-no-hidden-ingredients',
    title: 'The Clean Label Standard: What "No Hidden Ingredients" Really Means',
    excerpt:
      'We dissected everyday Indian packaged snacks to prove why zero preservatives, no artificial sweeteners, and whole food ingredients are non-negotiable for metabolic health.',
    category: 'Clean Label',
    readingTime: '6 min read',
    date: 'Nov 09, 2026',
    image: '/scraped/images/IAS_LIFESTYLE_3_1ae956ce-324e-485e-af88-_10.png',
    author: "Founder's Desk",
  },
  {
    id: 4,
    slug: 'snacking-with-pcod-and-thyroid',
    title: 'Managing PCOD, Irregular Cycles & Thyroid with Intentional Daily Seed Portions',
    excerpt:
      'Practical dietary strategies, portion precision, and selenium-rich seeds for women navigating cycle irregularities, insulin sensitivity, and thyroid conversion.',
    category: 'Women’s Wellness',
    readingTime: '7 min read',
    date: 'Nov 05, 2026',
    image: '/scraped/images/IAS_LIFESTYLE_4_05f03d26-5b36-4cd7-b5be-_11.png',
    author: "Clinical Nutrition Advisory",
  },
];

export default function BlogsPage() {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#fdd835] bg-black px-4 py-1.5 rounded-full inline-block mb-3">
            SCIENCE &amp; WELLNESS JOURNAL
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-gray-900">
            IN&apos;A SHOT BLOGS
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
            Evidence-backed insights into seed cycling, gut-friendly fiber, clean plant protein, and portioned purposeful living.
          </p>
        </div>

        {/* Featured Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-[#fafafa] rounded-3xl border border-gray-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-black text-[#fdd835] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  {post.category}
                </span>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {post.readingTime}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900 group-hover:text-amber-800 transition-colors leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500">
                    By <strong className="text-gray-900">{post.author}</strong>
                  </span>
                  <Link
                    href="/pages/about-us"
                    className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-black group-hover:text-amber-700 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-[#1a1a1a] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-white/10">
          <span className="text-xs font-black uppercase tracking-widest text-[#fdd835] bg-white/10 px-4 py-1.5 rounded-full inline-block">
            READY TO EXPERIENCE THE RHYTHM?
          </span>
          <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
            START YOUR 28-DAY SEED CYCLING HABIT
          </h3>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-medium">
            Portioned, purposeful, and personal seed blends delivered directly to your door in fresh protective packaging.
          </p>
          <div className="pt-2">
            <Link
              href="/collections/edamame"
              className="inline-flex items-center justify-center bg-[#fdd835] hover:bg-white text-black font-black text-xs uppercase tracking-wider px-8 py-4 rounded-full transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              Shop Seed Mix Blends
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
