import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Sparkles, Search, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';
import { trackSearchQuery } from '../../lib/analytics';

interface ProductsPageProps {
  onNavigateToCheckout?: () => void;
  selectedProductInitial?: Product | null;
  editorMode?: boolean;
  onUpdateSiteSettings?: (settings: any) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onNavigateToCheckout,
  selectedProductInitial = null,
  editorMode = false,
  onUpdateSiteSettings,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(selectedProductInitial);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [draftProduct, setDraftProduct] = useState<Product | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const { addItem } = useCart();

  const loadProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products);
        }
      })
      .catch(err => console.error('Failed to load products', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const timeout = setTimeout(() => {
        trackSearchQuery(searchQuery, 'products');
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedProductInitial) {
      setActiveModalProduct(selectedProductInitial);
      setSelectedVariant(selectedProductInitial.variants?.[0]);
    }
  }, [selectedProductInitial]);

  const handleOpenProduct = (product: Product) => {
    setActiveModalProduct(product);
    setSelectedVariant(product.variants?.[0]);
    setSelectedQuantity(1);
  };

  const handleBuyNow = (product: Product) => {
    addItem(product, selectedQuantity, selectedVariant);
    setActiveModalProduct(null);
    if (onNavigateToCheckout) {
      onNavigateToCheckout();
    } else {
      window.location.hash = '/checkout';
    }
  };

  const filteredProducts = products.filter(p => {
    if (selectedNumber !== null && p.numerologyNumber !== selectedNumber) {
      return false;
    }
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchPlanet = p.rulingPlanet?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchPlanet) return false;
    }
    return true;
  });

  const saveProduct = async () => {
    if (!draftProduct) return;

    setSaveState('saving');
    setSaveMessage('Saving...');
    const token = localStorage.getItem('shiv_dhara_admin_token') || 'shivdhara';
    const isNew = !products.some(item => item.id === draftProduct.id);

    try {
      const url = isNew ? '/api/editor/products' : `/api/editor/products/${draftProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(draftProduct),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || `Save failed (${response.status})`);
      }

      await loadProducts();
      setDraftProduct(null);
      setSaveState('saved');
      setSaveMessage('Saved successfully');
    } catch (error) {
      console.error('Product save failed', error);
      setSaveState('error');
      setSaveMessage(error instanceof Error ? error.message : 'Save failed. Restart the server and try again.');
    }
  };

  const deleteProduct = async (productId: string) => {
    const token = localStorage.getItem('shiv_dhara_admin_token') || 'shivdhara';
    try {
      const response = await fetch(`/api/editor/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': token,
        },
      });

      if (response.ok) {
        setDraftProduct(null);
        loadProducts();
      }
    } catch (error) {
      console.error('Product delete failed', error);
    }
  };

  const handleProductImageUpload = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      console.error('Please choose an image file');
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      const maxDimension = 1200;
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.65);
      setDraftProduct((previous) => previous ? { ...previous, images: [imageData] } : previous);
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => URL.revokeObjectURL(objectUrl);
    image.src = objectUrl;
  };

  return (
    <div id="page-products" className="min-h-screen bg-[#F7F3EA] text-[#101827] pt-24 pb-20">
      {editorMode && (
        <div className="editor-panel-scroll fixed left-2 right-2 top-20 z-50 flex max-h-[calc(100vh-5.5rem)] w-auto flex-col overflow-y-scroll overscroll-contain rounded-2xl border border-[#D9D2C3] bg-[#FFFDF9]/95 p-4 shadow-2xl backdrop-blur-sm pointer-events-auto sm:left-auto sm:right-4 sm:top-24 sm:max-h-[calc(100vh-7rem)] sm:w-[340px]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A6833D]">Products editor</span>
            <button
              type="button"
              onClick={() => setDraftProduct({
                id: `prod-${Date.now()}`,
                name: 'New Sacred Product',
                slug: 'new-sacred-product',
                description: 'Describe your product story and energetic use.',
                shortDescription: 'A new sacred offer.',
                price: 4999,
                sku: `SKU-${Date.now()}`,
                stock: 10,
                category: 'bracelets',
                featured: false,
                active: true,
                material: 'Natural stone',
                careInstructions: 'Keep away from water and sunlight.',
                traditionalAssociation: 'Sacred ritual',
                images: ['https://images.unsplash.com/photo-1611591475102-4fa0120286eb?auto=format&fit=crop&w=800&q=80'],
                variants: [],
              })}
              className="rounded-full bg-[#101827] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#F7F3EA]"
            >
              + Add
            </button>
          </div>

          {draftProduct ? (
            <div className="space-y-3 text-xs text-[#101827]">
              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Name</span>
                  <input
                    value={draftProduct.name}
                    onChange={(e) => setDraftProduct((prev) => prev ? { ...prev, name: e.target.value } : prev)}
                    className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Price</span>
                  <input
                    type="number"
                    value={draftProduct.price}
                    onChange={(e) => setDraftProduct((prev) => prev ? { ...prev, price: Number(e.target.value) } : prev)}
                    className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Category</span>
                  <select
                    value={draftProduct.category}
                    onChange={(e) => setDraftProduct((prev) => prev ? { ...prev, category: e.target.value as Product['category'] } : prev)}
                    className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
                  >
                    <option value="bracelets">Bracelets</option>
                    <option value="malas">Malas</option>
                    <option value="yantras">Yantras</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Image URL</span>
                  <input
                    value={draftProduct.images?.[0] || ''}
                    onChange={(e) => setDraftProduct((prev) => prev ? { ...prev, images: [e.target.value] } : prev)}
                    className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Or choose from computer</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => handleProductImageUpload(e.target.files?.[0])}
                    className="block w-full rounded-lg border border-[#D9D2C3] bg-white px-2 py-2 text-[10px] text-[#101827] file:mr-2 file:rounded-md file:border-0 file:bg-[#101827] file:px-2 file:py-1 file:text-[10px] file:font-bold file:text-[#F7F3EA]"
                  />
                  {draftProduct.images?.[0] && (
                    <img
                      src={draftProduct.images[0]}
                      alt="Product preview"
                      className="mt-2 h-20 w-full rounded-lg border border-[#D9D2C3] bg-[#EDE8DE] object-contain"
                    />
                  )}
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#101827]/60">Description</span>
                  <textarea
                    rows={4}
                    value={draftProduct.description}
                    onChange={(e) => setDraftProduct((prev) => prev ? { ...prev, description: e.target.value } : prev)}
                    className="w-full rounded-lg border border-[#D9D2C3] bg-white px-3 py-2 focus:border-[#C8A45D] focus:outline-none"
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveProduct}
                  disabled={saveState === 'saving'}
                  className="flex-1 rounded-xl bg-[#101827] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F7F3EA] disabled:cursor-wait disabled:opacity-60"
                >
                  {saveState === 'saving' ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setDraftProduct(null)}
                  className="rounded-xl border border-[#D9D2C3] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#101827]"
                >
                  Cancel
                </button>
              </div>

              {saveMessage && (
                <p className={`max-h-40 overflow-y-auto whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-[10px] leading-relaxed ${saveState === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {saveMessage}
                </p>
              )}

              <button
                type="button"
                onClick={() => deleteProduct(draftProduct.id)}
                className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-red-700"
              >
                Delete product
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {products.slice(0, 5).map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setDraftProduct(product)}
                  className="flex w-full items-center justify-between rounded-xl border border-[#D9D2C3] bg-white px-3 py-2 text-left text-xs"
                >
                  <span className="font-medium text-[#101827]">{product.name}</span>
                  <span className="text-[#A6833D]">₹{product.price.toLocaleString('en-IN')}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-[#101827] text-[#F7F3EA] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,164,93,0.15)_0%,_rgba(16,24,39,1)_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182236] border border-[#C8A45D]/40 text-[#DFC38A] text-xs font-bold uppercase tracking-widest">
            <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Sacred Gemstone Collection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[#F7F3EA] font-light">
            Numerology Bracelets & Malas
          </h1>
          <p className="text-sm sm:text-base text-[#D9D2C3]/80 max-w-2xl mx-auto leading-relaxed font-sans">
            Hand-strung with natural certified gemstones, Nepali rudraksha seeds, and calibrated to planetary frequencies. Energized in traditional ritual ceremonies.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 space-y-6">
        {/* Numerology Number Filter Bar (1 - 9) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D9D2C3] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#A6833D] shrink-0">
              Filter by Number (1-9):
            </span>
            <button
              onClick={() => setSelectedNumber(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedNumber === null
                  ? 'bg-[#101827] text-[#F7F3EA]'
                  : 'bg-[#FAF7F0] text-[#101827] hover:bg-[#EDE8DE]'
              }`}
            >
              All
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11].map(num => (
              <button
                key={num}
                onClick={() => setSelectedNumber(selectedNumber === num ? null : num)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all cursor-pointer ${
                  selectedNumber === num
                    ? 'bg-[#101827] text-[#F7F3EA] shadow-md ring-2 ring-[#C8A45D]'
                    : 'bg-[#FAF7F0] border border-[#D9D2C3] text-[#101827] hover:border-[#C8A45D]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Category Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['ALL', 'bracelets'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#101827] text-[#F7F3EA]'
                    : 'bg-white border border-[#D9D2C3] text-[#101827] hover:border-[#C8A45D]'
                }`}
              >
                {cat === 'ALL' ? 'All Items' : 'Numerology Bracelets'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search gemstone, planet..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-[#D9D2C3] text-xs text-[#101827] focus:outline-none focus:border-[#C8A45D]"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="h-80 rounded-2xl bg-[#EDE8DE] animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#D9D2C3] p-8 max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-[#C8A45D] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-serif font-bold text-[#101827]">
              No items match your filter
            </h3>
            <p className="text-xs text-[#101827]/70 mt-1 mb-6">
              Try resetting your search query or selecting "All Numbers".
            </p>
            <button
              onClick={() => {
                setSelectedNumber(null);
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-full bg-[#101827] text-[#F7F3EA] text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="rounded-2xl bg-white border border-[#D9D2C3] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div
                  className="relative min-h-60 max-h-[28rem] overflow-hidden bg-[#EDE8DE] cursor-pointer flex items-center justify-center"
                  onClick={() => handleOpenProduct(product)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="block h-auto max-h-[28rem] w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {product.numerologyNumber && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#101827]/90 text-[#DFC38A] border border-[#C8A45D]/40 backdrop-blur-sm">
                        Number {product.numerologyNumber}
                      </span>
                    </div>
                  )}

                  {product.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-700 text-white shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Energized</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#A6833D] font-bold mb-1">
                      {product.rulingPlanet || product.category}
                    </div>
                    <h3
                      onClick={() => handleOpenProduct(product)}
                      className="text-base font-serif font-bold text-[#101827] group-hover:text-[#A6833D] transition-colors leading-snug line-clamp-1 cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#101827]/60 font-sans line-clamp-2 mt-1.5 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#D9D2C3]/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#101827]/50 line-through mr-1.5">
                        ₹{(product.price * 1.25).toFixed(0)}
                      </span>
                      <span className="text-base font-serif font-bold text-[#101827]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {editorMode && (
                        <button
                          type="button"
                          onClick={() => setDraftProduct(product)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#D9D2C3] text-[10px] font-bold text-[#101827]"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenProduct(product)}
                        className="px-3 py-1.5 rounded-lg bg-[#FAF7F0] border border-[#D9D2C3] text-[11px] font-bold text-[#101827] hover:bg-[#EDE8DE] transition-colors"
                      >
                        Quick View
                      </button>
                      <button
                        onClick={() => addItem(product, 1)}
                        className="p-2 rounded-lg bg-[#101827] text-[#F7F3EA] hover:bg-[#182236] hover:text-[#C8A45D] transition-colors cursor-pointer"
                        title="Add to Sacred Bag"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {activeModalProduct && (
          <div id="product-detail-modal" className="fixed inset-0 z-50 bg-[#101827]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#F7F3EA] text-[#101827] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#D9D2C3] overflow-hidden my-8"
            >
              <div className="relative">
                <button
                  onClick={() => setActiveModalProduct(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image Gallery */}
                  <div className="relative flex min-h-[320px] max-h-[600px] items-center justify-center overflow-hidden bg-[#182236] p-2">
                    <img
                      src={activeModalProduct.images[0]}
                      alt={activeModalProduct.name}
                      className="block h-auto max-h-[580px] w-auto max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                    {activeModalProduct.numerologyNumber && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#101827]/90 text-[#DFC38A] border border-[#C8A45D]/40">
                          Number {activeModalProduct.numerologyNumber} • {activeModalProduct.rulingPlanet}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6 sm:p-8 space-y-5">
                    <div>
                      <span className="text-xs uppercase font-bold tracking-widest text-[#A6833D] block">
                        {activeModalProduct.category}
                      </span>
                      <h2 className="text-2xl font-serif font-bold text-[#101827] mt-1">
                        {activeModalProduct.name}
                      </h2>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xl font-serif font-bold text-[#101827]">
                          ₹{(selectedVariant?.price || activeModalProduct.price).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          ₹{((selectedVariant?.price || activeModalProduct.price) * 1.25).toFixed(0)}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Free Pan-India Delivery
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#101827]/80 leading-relaxed font-sans">
                      {activeModalProduct.description}
                    </p>

                    {/* Gemstones & Synergy */}
                    {activeModalProduct.material && (
                      <div className="space-y-1 text-xs">
                        <span className="font-bold text-[#101827] block">Natural Certified Materials:</span>
                        <p className="text-[#101827]/70">
                          {activeModalProduct.material}
                        </p>
                      </div>
                    )}

                    {/* Variants if any */}
                    {activeModalProduct.variants && activeModalProduct.variants.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#101827] block">
                          Wrist Size:
                        </span>
                        <div className="flex gap-2">
                          {activeModalProduct.variants.map(v => (
                            <button
                              key={v.id}
                              onClick={() => setSelectedVariant(v)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                selectedVariant?.id === v.id
                                  ? 'bg-[#101827] text-[#F7F3EA] border-[#101827]'
                                  : 'bg-white border-[#D9D2C3] text-[#101827] hover:border-[#C8A45D]'
                              }`}
                            >
                              {v.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-[#EDE8DE] border border-[#D9D2C3] flex items-center gap-2 text-[11px] text-[#101827]/70">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Certified 100% natural authentic gemstones energized in sacred ritual.</span>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => {
                          addItem(activeModalProduct, selectedQuantity, selectedVariant);
                          setActiveModalProduct(null);
                        }}
                        className="flex-1 py-3.5 rounded-xl bg-white border border-[#101827] text-[#101827] text-xs font-bold tracking-wider uppercase hover:bg-[#FAF7F0] transition-colors cursor-pointer"
                      >
                        Add to Bag
                      </button>
                      <button
                        onClick={() => handleBuyNow(activeModalProduct)}
                        className="flex-1 py-3.5 rounded-xl bg-[#101827] text-[#F7F3EA] text-xs font-bold tracking-wider uppercase hover:bg-[#182236] transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Buy Now</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C8A45D]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
