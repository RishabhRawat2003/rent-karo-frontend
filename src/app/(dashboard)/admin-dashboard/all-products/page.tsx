"use client";
import { Ban, Box, Calendar, DollarSign, Filter, Info, Layers, Loader, Search, ShieldAlert, ShoppingCart, Sliders, Tag, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  title: string;
  images: string[];
  stocks: number;
  wanted_to_sell: boolean;
  sellingPrice: number;
  rentalPricing: Array<{
    day: number;
    discountPrice: number;
  }>;
  specifications: Array<{
    title: string;
    data: Array<{ key: string; value: string }>;
  }>;
  blockedByAdmin: boolean;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'sale' | 'rent' | 'blocked'>('all');
  const [loading, setLoading] = useState(true);

  // Mock data fetch
  useEffect(() => {
    setTimeout(() => {
      setProducts([/*... mock products ...*/]);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'sale' && product.wanted_to_sell) ||
      (filter === 'rent' && !product.wanted_to_sell) ||
      (filter === 'blocked' && product.blockedByAdmin);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pt-20 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Box className="w-8 h-8 text-blue-600" />
              Product Inventory
              <span className="text-lg font-normal text-gray-500">
                ({filteredProducts.length} items)
              </span>
            </h1>
            <p className="text-gray-500 mt-1">Manage your product listings and inventory</p>
          </div>

          {/* Search and Filters */}
          <div className="w-full md:w-auto space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <FilterButton
                label="All"
                active={filter === 'all'}
                onClick={() => setFilter('all')}
              />
              <FilterButton
                label="For Sale"
                icon={<ShoppingCart className="w-4 h-4" />}
                active={filter === 'sale'}
                onClick={() => setFilter('sale')}
              />
              <FilterButton
                label="For Rent"
                icon={<Calendar className="w-4 h-4" />}
                active={filter === 'rent'}
                onClick={() => setFilter('rent')}
              />
              <FilterButton
                label="Blocked"
                icon={<ShieldAlert className="w-4 h-4" />}
                active={filter === 'blocked'}
                onClick={() => setFilter('blocked')}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onSelect={setSelectedProduct}
                onToggleBlock={() => {/* API call to toggle block status */ }}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl">
            <Sliders className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">No products found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onToggleBlock={() => {/* API call to toggle block status */ }}
          />
        )}
      </div>
    </div>
  );
};

// Reusable Components
const FilterButton = ({ label, icon, active, onClick }: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${active
        ? 'bg-blue-100 text-blue-600'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
  >
    {icon && <span className="flex items-center">{icon}</span>}
    {label}
  </button>
);

const ProductCard = ({ product, onSelect, onToggleBlock }: {
  product: Product;
  onSelect: (product: Product) => void;
  onToggleBlock: () => void;
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${product.blockedByAdmin ? 'opacity-75 border-red-100' : 'border-gray-100'
      }`}
  >
    <div className="relative">
      <img
        src={product.images[0]}
        alt={product.title}
        className="w-full h-48 object-cover rounded-t-xl cursor-pointer"
        onClick={() => onSelect(product)}
      />
      {product.blockedByAdmin && (
        <div className="absolute top-2 left-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <ShieldAlert className="w-3 h-3" />
          Blocked
        </div>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleBlock(); }}
        className="absolute top-2 right-2 bg-white p-1.5 rounded-lg shadow-sm hover:bg-gray-50"
      >
        {product.blockedByAdmin ? (
          <Ban className="w-5 h-5 text-red-600" />
        ) : (
          <Ban className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        )}
      </button>
    </div>

    <div className="p-4">
      <h3 className="font-semibold truncate">{product.title}</h3>

      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          {product.wanted_to_sell ? (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Sale: ₹{product.sellingPrice}</span>
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              <span>Rent: ₹{product.rentalPricing[0]?.discountPrice}/day</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Layers className="w-4 h-4" />
          <span>{product.stocks} in stock</span>
        </div>
      </div>
    </div>
  </div>
);

const ProductModal = ({ product, onClose, onToggleBlock }: {
  product: Product;
  onClose: () => void;
  onToggleBlock: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
      <div className="p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {product.title}
              {product.blockedByAdmin && (
                <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  Blocked
                </span>
              )}
            </h2>
            <p className="text-gray-500 mt-1">{product.wanted_to_sell ? 'For Sale' : 'For Rent'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div>
            <div className="grid grid-cols-2 gap-3">
              <img
                src={product.images[0]}
                alt="Main"
                className="col-span-2 h-64 w-full object-cover rounded-lg"
              />
              {product.images.slice(1, 5).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Preview ${i + 1}`}
                  className="h-32 w-full object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Pricing Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing Details
              </h3>
              {product.wanted_to_sell ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Selling Price:</span>
                    <span className="font-semibold">₹{product.sellingPrice}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {product.rentalPricing.map((price, i) => (
                    <div key={i} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-center">
                        <span>{price.day} Days</span>
                        <span className="font-semibold">₹{price.discountPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            {product.specifications.map((spec, i) => (
              <div key={i}>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  {spec.title}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {spec.data.map((item, j) => (
                    <div key={j} className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">{item.key}</span>
                      <span className="text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Block Product Section */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Product Status</h3>
                  <p className="text-sm text-gray-500">
                    {product.blockedByAdmin
                      ? 'This product is currently blocked'
                      : 'Product is visible to users'}
                  </p>
                </div>
                <button
                  onClick={onToggleBlock}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${product.blockedByAdmin
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                >
                  <Ban className="w-5 h-5" />
                  {product.blockedByAdmin ? 'Unblock Product' : 'Block Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductsPage;