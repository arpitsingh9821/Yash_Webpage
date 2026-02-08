import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

const AdminPanel: React.FC = () => {
  const {
    products,
    contactSettings,
    inquiries,
    addProduct,
    updateProduct,
    deleteProduct,
    updateContactSettings,
    deleteInquiry,
    refreshData
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'contacts' | 'inquiries'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: ''
  });
  const [contactForm, setContactForm] = useState(contactSettings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setContactForm(contactSettings);
  }, [contactSettings]);

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', image: '', category: '' });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category
    });
    setShowProductForm(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        image: formData.image,
        category: formData.category
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        setMessage('Product updated successfully!');
      } else {
        await addProduct(productData);
        setMessage('Product added successfully!');
      }
      resetForm();
      await refreshData();
    } catch (error) {
      setMessage('Error saving product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      try {
        await deleteProduct(id);
        setMessage('Product deleted successfully!');
        await refreshData();
      } catch (error) {
        setMessage('Error deleting product.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateContacts = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await updateContactSettings(contactForm);
      setMessage('Contact settings updated successfully!');
    } catch (error) {
      setMessage('Error updating contacts.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    try {
      await deleteInquiry(id);
      setMessage('Inquiry deleted successfully!');
    } catch (error) {
      setMessage('Error deleting inquiry.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-white mb-8">
          Admin <span className="text-red-500">Panel</span>
        </h1>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['products', 'contacts', 'inquiries'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all capitalize ${
                activeTab === tab
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Manage Products</h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                + Add Product
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold text-white mb-6">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  
                  <form onSubmit={handleSubmitProduct} className="space-y-4">
                    <div>
                      <label className="block text-gray-400 mb-2">Product Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2">Price (₹)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2">Image URL</label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Add Product')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="grid gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-grow">
                    <h3 className="text-white font-semibold">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.category}</p>
                    <p className="text-red-500 font-bold">₹{product.price.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Contact Settings</h2>
            
            <form onSubmit={handleUpdateContacts} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-400 mb-2">WhatsApp Number (with country code)</label>
                <input
                  type="text"
                  value={contactForm.whatsapp}
                  onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                  placeholder="919876543210"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Instagram Username</label>
                <input
                  type="text"
                  value={contactForm.instagram}
                  onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                  placeholder="always.demon"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Telegram Username</label>
                <input
                  type="text"
                  value={contactForm.telegram}
                  onChange={(e) => setContactForm({ ...contactForm, telegram: e.target.value })}
                  placeholder="alwaysdemon"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Customer Inquiries</h2>
            
            {inquiries.length === 0 ? (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center text-gray-400">
                No inquiries yet
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-white font-semibold">{inquiry.productName}</p>
                      <p className="text-gray-400 text-sm">Customer: {inquiry.customerName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs ${
                          inquiry.platform === 'whatsapp' ? 'bg-green-600/20 text-green-400' :
                          inquiry.platform === 'instagram' ? 'bg-pink-600/20 text-pink-400' :
                          'bg-blue-600/20 text-blue-400'
                        }`}>
                          {inquiry.platform}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {new Date(inquiry.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteInquiry(inquiry.id)}
                      className="px-3 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors text-sm"
                    >
                      Delete
                    </button>
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

export default AdminPanel;
