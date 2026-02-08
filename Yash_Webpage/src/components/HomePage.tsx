import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const HomePage: React.FC = () => {
  const { products, contactSettings, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-black to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px]" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6">
            EMBRACE THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">DARKNESS</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 px-4">
            Discover our exclusive collection of premium streetwear designed for those who dare to be different.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <a href="#products" className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-red-900/30">
              Shop Now
            </a>
            <a href="#about" className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all duration-300">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
              Our <span className="text-red-500">Products</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
              Browse our handpicked selection of premium products. Click to contact us through your preferred platform.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No Products Available</h3>
              <p className="text-gray-400">Check back soon for new arrivals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} contactSettings={contactSettings} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 px-4 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
                About <span className="text-red-500">Always Demon</span>
              </h2>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                We are a premium streetwear brand dedicated to creating unique, high-quality apparel for those who embrace their individuality. Our designs are inspired by darkness, mystery, and the unconventional.
              </p>
              <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
                Every piece is crafted with attention to detail and made from premium materials to ensure comfort and durability. Join the demon family today.
              </p>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-500">500+</div>
                  <div className="text-xs sm:text-sm text-gray-400">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-500">50+</div>
                  <div className="text-xs sm:text-sm text-gray-400">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-500">24/7</div>
                  <div className="text-xs sm:text-sm text-gray-400">Support</div>
                </div>
              </div>
            </div>
            <div className="relative order-first md:order-last">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop"
                  alt="About Always Demon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-center text-xs sm:text-sm">Premium<br/>Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            © 2024 Always Demon. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
