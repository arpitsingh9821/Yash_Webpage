import React from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';

const HomePage: React.FC = () => {
  const { products, isLoading } = useApp();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-red-950">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-[128px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-800 rounded-full filter blur-[128px]" />
          </div>
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Always <span className="text-red-500">Demon</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Unleash your inner demon with our exclusive collection of premium streetwear
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#products"
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-1"
            >
              Shop Now
            </a>
            <a
              href="#about"
              className="px-8 py-4 border-2 border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-500 hover:text-white transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our <span className="text-red-500">Products</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our handpicked collection of premium demon-themed streetwear
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-gray-950 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              About <span className="text-red-500">Us</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Always Demon is more than just a brand - it's a lifestyle. We create premium streetwear 
              for those who dare to be different, who embrace their inner demon and wear it proudly. 
              Our designs are bold, our quality is unmatched, and our community is unstoppable.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="text-4xl font-bold text-red-500 mb-2">1000+</div>
                <div className="text-gray-400">Happy Customers</div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="text-4xl font-bold text-red-500 mb-2">50+</div>
                <div className="text-gray-400">Unique Designs</div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="text-4xl font-bold text-red-500 mb-2">5⭐</div>
                <div className="text-gray-400">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">👹</span>
              </div>
              <span className="text-xl font-bold text-white">
                Always <span className="text-red-500">Demon</span>
              </span>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2024 Always Demon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
