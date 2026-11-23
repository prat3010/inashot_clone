'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [searchTerm, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-x-0 top-0 bg-white max-h-[80vh] shadow-2xl rounded-b-3xl overflow-hidden border-b border-gray-200 animate-in slide-in-from-top-6 duration-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Search Products</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-black rounded-full transition-colors"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by flavor, protein, seed mix, or crunchy edamame..."
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-black focus:outline-none text-base font-medium placeholder:text-gray-400"
              autoFocus
            />
          </div>

          {/* Results container */}
          <div className="mt-6 max-h-[50vh] overflow-y-auto divide-y divide-gray-100">
            {isLoading && (
              <div className="py-8 text-center text-sm font-semibold text-gray-500">Searching catalog...</div>
            )}

            {!isLoading && searchTerm.length > 1 && results.length === 0 && (
              <div className="py-8 text-center text-sm font-semibold text-gray-500">
                No products found matching &quot;{searchTerm}&quot;.
              </div>
            )}

            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                onClick={onClose}
                className="search-result-item flex items-center gap-4 py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors group"
              >
                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={product.featuredImage}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 uppercase truncate group-hover:text-amber-800">
                    {product.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Rs. {product.price.toFixed(2)}
                    {product.compareAtPrice && (
                      <span className="line-through ml-2 text-gray-400">
                        Rs. {product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
