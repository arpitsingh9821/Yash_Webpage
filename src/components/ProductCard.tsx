import React, { useState } from 'react';
import { Product, ContactSettings } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  contactSettings: ContactSettings;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, contactSettings }) => {
  const { addInquiry } = useApp();
  const [showContact, setShowContact] = useState(false);

  const handleContact = (platform: 'whatsapp' | 'instagram' | 'telegram') => {
    addInquiry({
      productId: product.id,
      productName: product.name,
      platform,
    });

    let url = '';
    const message = encodeURIComponent(`Hi! I'm interested in ${product.name} (${product.price})`);

    switch (platform) {
      case 'whatsapp':
        const cleanNumber = contactSettings.whatsapp.replace(/[^0-9]/g, '');
        url = `https://wa.me/${cleanNumber}?text=${message}`;
        break;
      case 'instagram':
        url = `https://instagram.com/${contactSettings.instagram}`;
        break;
      case 'telegram':
        url = `https://t.me/${contactSettings.telegram}`;
        break;
    }

    window.open(url, '_blank');
    setShowContact(false);
  };

  return (
    <div className="group bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 hover:border-red-900/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
            {product.category}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-2xl font-bold text-white">{product.price}</p>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="relative">
          <button
            onClick={() => setShowContact(!showContact)}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Contact to Buy
          </button>

          {showContact && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-xl p-3 shadow-xl border border-gray-700 animate-fade-in">
              <p className="text-xs text-gray-400 mb-3 text-center">Choose your preferred platform</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleContact('whatsapp')}
                  className="flex flex-col items-center gap-1 p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-[10px] text-white font-medium">WhatsApp</span>
                </button>
                <button
                  onClick={() => handleContact('instagram')}
                  className="flex flex-col items-center gap-1 p-2 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-[10px] text-white font-medium">Instagram</span>
                </button>
                <button
                  onClick={() => handleContact('telegram')}
                  className="flex flex-col items-center gap-1 p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="text-[10px] text-white font-medium">Telegram</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
