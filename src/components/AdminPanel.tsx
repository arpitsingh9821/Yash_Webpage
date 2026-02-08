import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    contactSettings, 
    inquiries, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateContactSettings,
    refreshInquiries 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'products' | 'contact' | 'inquiries'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
  });

  const [contactForm, setContactForm] = useState({
    whatsapp: contactSettings.whatsapp,
    instagram: contactSettings.instagram,
    telegram: contactSettings.telegram,
  });

  useEffect(() => {
    setContactForm({
      whatsapp: contactSettings.whatsapp,
      instagram: contactSettings.instagram,
      telegram: contactSettings.telegram,
    });
  }, [contactSettings]);

  useEffect(() => {
    if (activeTab === 'inquiries') {
      refreshInquiries();
    }
  }, [activeTab, refreshInquiries]);

  const handleAddProduct = () => {
    setIsAddingProduct(true);
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAddingProduct(false);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price) {
      alert('Name and price are required!');
      return;
    }

    setIsSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm);
      } else {
        await addProduct(productForm);
      }
      setEditingProduct(null);
      setIsAddingProduct(false);
      setProductForm({ name: '', description: '', price: '', image: '', category: '' });
    } catch (error) {
      alert('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContact = async () => {
    setIsSaving(true);
    try {
      await updateContactSettings(contactForm);
      alert('Contact settings saved successfully!');
    } catch (error) {
      alert('Failed to save contact settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setIsAddingProduct(false);
    setProductForm({ name: '', description: '', price: '', image: '', category: '' });
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage your products, contact settings, and view customer inquiries</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'products'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'contact'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Contact Settings
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'inquiries'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Inquiries ({inquiries.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Add/Edit Product Form */}
            {(isAddingProduct || editingProduct) && (
              <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price *</label>
                    <input
                      type="text"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., $49.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <input
                      type="text"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="e.g., Clothing, Accessories"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
                      placeholder="Enter product description"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    disabled={isSaving}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving && (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                    )}
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg sm:text-xl font-bold text-white">Products List</h3>
                {!isAddingProduct && !editingProduct && (
                  <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                  </button>
                )}
              </div>

              {products.length === 0 ? (
                <div className="p-6 sm:p-12 text-center">
                  <p className="text-gray-400">No products yet. Add your first product!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {products.map((product) => (
                    <div key={product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full sm:w-20 h-40 sm:h-20 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-lg truncate">{product.name}</h4>
                        <p className="text-gray-400 text-sm truncate">{product.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-red-500 font-bold">{product.price}</span>
                          <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded">{product.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:flex-col">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Settings Tab */}
        {activeTab === 'contact' && (
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Contact Settings</h3>
            <p className="text-gray-400 text-sm mb-6">Configure your contact details for customer inquiries</p>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={contactForm.whatsapp}
                  onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+1234567890"
                />
                <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +1 for USA, +91 for India)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram Username
                </label>
                <input
                  type="text"
                  value={contactForm.instagram}
                  onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="username (without @)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Telegram Username
                </label>
                <input
                  type="text"
                  value={contactForm.telegram}
                  onChange={(e) => setContactForm({ ...contactForm, telegram: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="username (without @)"
                />
              </div>

              <button
                onClick={handleSaveContact}
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving && (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                )}
                Save Contact Settings
              </button>
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-800">
              <h3 className="text-lg sm:text-xl font-bold text-white">Customer Inquiries</h3>
              <p className="text-gray-400 text-sm mt-1">Track customer contact requests</p>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-6 sm:p-12 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-400">No inquiries yet. They will appear here when customers contact you.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800 max-h-[60vh] overflow-y-auto">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      inquiry.platform === 'whatsapp' ? 'bg-green-600' :
                      inquiry.platform === 'instagram' ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500' :
                      'bg-blue-500'
                    }`}>
                      {inquiry.platform === 'whatsapp' && (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      )}
                      {inquiry.platform === 'instagram' && (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      )}
                      {inquiry.platform === 'telegram' && (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold truncate">{inquiry.productName}</h4>
                      <p className="text-gray-400 text-sm">
                        via <span className="capitalize">{inquiry.platform}</span>
                      </p>
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm">
                      {new Date(inquiry.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
