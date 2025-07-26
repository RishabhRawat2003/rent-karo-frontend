"use client";

import { getAllProducts } from "@/store/productSlice";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";
import { LoadingSpinnerWithOverlay } from "@/components/Loading";
import Link from "next/link";

interface RentalPricing {
  day: number;
  discount: number;
  discountPrice: number;
  realPrice: number;
  _id: string;
}

interface DataType {
  searchedName?: string;
  category?: string;
  wanted_to_sell?: boolean;
}


export interface Product {
  _id: string;
  title: string;
  subTitle: string;
  category: string;
  sub_category: string;
  images: string[];
  rentalPricing: RentalPricing[];
  realSellingPrice: number;
  sellingPrice: number;
  discountOnSellingPrice: number;
  stocks: number;
  createdAt: string;
  updatedAt: string;
  wanted_to_sell: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalProducts: number;
}

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    totalPages: 1,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productTypeFilter, setProductTypeFilter] = useState(""); // "rent", "sale", or ""
  const [sortBy, setSortBy] = useState("");
  const dispatch = useDispatch();

  // Debounce hook for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchInput);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchInput]);

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data:DataType = {
        ...pagination,
        searchedName: '',
        category: '',
      };
      
      // Add search filter
      if (debouncedSearchTerm.trim()) data.searchedName = debouncedSearchTerm.trim();
      
      // Add category filter
      if (selectedCategory) data.category = selectedCategory;
      
      // Add product type filter
      if (productTypeFilter === "rent") {
        data.wanted_to_sell = false;
      } else if (productTypeFilter === "sale") {
        data.wanted_to_sell = true;
      }
      // If productTypeFilter is empty, don't add wanted_to_sell filter (show all)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await dispatch(getAllProducts(data as any) as any);
      if (response?.error) {
        toast.error(response.error.message);
      } else {
        setProducts(response.payload.products);
        setPagination(prev => ({
          ...prev,
          totalPages: response.payload.totalPages,
          totalProducts: response.payload.totalProducts,
        }));
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to load products');
    }
    setLoading(false);
  }, [dispatch, pagination.page, pagination.limit, debouncedSearchTerm, selectedCategory, productTypeFilter]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // Reset to first page when filters change
  useEffect(() => {
    if (debouncedSearchTerm !== searchInput) return; // Don't reset page during debounce
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearchTerm, selectedCategory, productTypeFilter]);

  const { sortedProducts, paginatedProducts, totalProducts } = useMemo(() => {
    let filtered = [...products];

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "price_low_to_high":
            const aPrice = a.wanted_to_sell ? a.sellingPrice : 
              (a.rentalPricing?.length ? Math.min(...a.rentalPricing.map(p => p.discountPrice)) : 0);
            const bPrice = b.wanted_to_sell ? b.sellingPrice : 
              (b.rentalPricing?.length ? Math.min(...b.rentalPricing.map(p => p.discountPrice)) : 0);
            return aPrice - bPrice;
          
          case "price_high_to_low":
            const aPriceHigh = a.wanted_to_sell ? a.sellingPrice : 
              (a.rentalPricing?.length ? Math.min(...a.rentalPricing.map(p => p.discountPrice)) : 0);
            const bPriceHigh = b.wanted_to_sell ? b.sellingPrice : 
              (b.rentalPricing?.length ? Math.min(...b.rentalPricing.map(p => p.discountPrice)) : 0);
            return bPriceHigh - aPriceHigh;
          
          case "newest_first":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          
          case "rental_first":
            return a.wanted_to_sell === b.wanted_to_sell ? 0 : a.wanted_to_sell ? 1 : -1;
          
          case "sale_first":
            return a.wanted_to_sell === b.wanted_to_sell ? 0 : a.wanted_to_sell ? -1 : 1;
          
          default:
            return 0;
        }
      });
    }

    // Calculate pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginated = filtered.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filtered.length / pagination.limit);

    return {
      sortedProducts: filtered,
      paginatedProducts: paginated,
      totalProducts: filtered.length,
      totalPages
    };
  }, [products, sortBy, pagination.page, pagination.limit]);

  useEffect(() => {
    const totalPages = Math.ceil(totalProducts / pagination.limit);
    setPagination(prev => ({
      ...prev,
      totalPages,
      totalProducts
    }));
  }, [totalProducts, pagination.limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleProductTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductTypeFilter(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setDebouncedSearchTerm("");
    setSelectedCategory("");
    setProductTypeFilter("");
    setSortBy("");
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Count product types for statistics
  const rentalCount = products.filter(p => !p.wanted_to_sell).length;
  const saleCount = products.filter(p => p.wanted_to_sell).length;

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#eff6ff' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
            <p className="text-gray-600 mt-1">
              Browse our collection of rental and sale items
            </p>
            <div className="flex items-center mt-2 space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                {rentalCount} Rental Items
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                {saleCount} Sale Items
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center space-x-2 gap-3 sm:gap-0">
            {/* Search box with debouncing indicator */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={handleSearchChange}
                className="px-3 py-1.5 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Product Type Filter */}
            <select
              value={productTypeFilter}
              onChange={handleProductTypeChange}
              className="bg-white border border-gray-300 rounded-md px-3 py-1.5"
            >
              <option value="">All Products</option>
              <option value="rent">Rental Only</option>
              <option value="sale">Sale Only</option>
            </select>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="bg-white border border-gray-300 rounded-md px-3 py-1.5"
            >
              <option value="">All Categories</option>
              <option value="clothing">Clothing</option>
              <option value="shoes">Shoes</option>
              <option value="electronics">Electronics</option>
              <option value="smartphones">Smartphones</option>
              <option value="laptops">Laptops</option>
              <option value="pc">PCs</option>
              <option value="gaming-accessories">Gaming Accessories</option>
              <option value="furniture">Furniture</option>
              <option value="camera">Cameras</option>
              <option value="tools">Tools & Equipment</option>
              <option value="vehicles">Vehicles</option>
              <option value="books">Books</option>
              <option value="musical-instruments">Musical Instruments</option>
              <option value="sports">Sports & Fitness</option>
              <option value="home-appliances">Home Appliances</option>
              <option value="baby-products">Baby Products</option>
              <option value="travel">Travel & Luggage</option>
              <option value="others">Others</option>
            </select>

            {/* Sort by */}
            <span className="text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="bg-white border border-gray-300 rounded-md px-3 py-1.5"
            >
              <option value="">Default</option>
              <option value="price_low_to_high">Price: Low to High</option>
              <option value="price_high_to_low">Price: High to Low</option>
              <option value="newest_first">Newest First</option>
              <option value="rental_first">Rentals First</option>
              <option value="sale_first">Sales First</option>
            </select>
          </div>
        </div>

        {/* Show loading overlay during debounce */}
        {searchInput !== debouncedSearchTerm && (
          <LoadingSpinnerWithOverlay />
        )}

        {loading ? (
          <LoadingSpinnerWithOverlay />
        ) : (
          <>
            {paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Available</h3>
                  <p className="text-gray-600 mb-4">
                    {debouncedSearchTerm || selectedCategory || productTypeFilter
                      ? "No products match your current filters. Try adjusting your search or filter selections."
                      : "There are currently no products available."
                    }
                  </p>
                  {(debouncedSearchTerm || selectedCategory || productTypeFilter || sortBy) && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                <PaginationControls
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Unified Product Card Component
function ProductCard({ product }: { product: Product }) {
  const isForSale = product.wanted_to_sell;
  
  // For rental products, find the best deal
  const bestRentalDeal = product.rentalPricing?.length 
    ? product.rentalPricing.reduce((prev, current) => 
        (current.discountPrice < prev.discountPrice) ? current : prev
      )
    : null;
  
  // For sale products, calculate savings
  const savings = product.realSellingPrice - product.sellingPrice;
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative h-52">
        {product.images.length > 0 ? (
          <Image
            width={400}
            height={400}
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          {isForSale ? (
            product.discountOnSellingPrice > 0 && (
              <span 
                className="px-2.5 py-1 rounded-full text-xs font-bold text-white" 
                style={{ backgroundColor: '#1447e6' }}
              >
                {product.discountOnSellingPrice}% OFF
              </span>
            )
          ) : bestRentalDeal && bestRentalDeal.discount > 0 && (
            <span 
              className="px-2.5 py-1 rounded-full text-xs font-bold text-white" 
              style={{ backgroundColor: '#1447e6' }}
            >
              {bestRentalDeal.discount}% OFF
            </span>
          )}
        </div>
        
        <div className="absolute bottom-3 left-3">
          <span 
            className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ${
              isForSale ? 'bg-green-600' : 'bg-blue-600'
            }`}
          >
            {isForSale ? 'FOR SALE' : 'FOR RENT'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-800 line-clamp-1">{product.title}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-1">{product.subTitle}</p>
          </div>
          <span 
            className="text-xs font-medium px-2 py-1 text-center rounded-full" 
            style={{ backgroundColor: '#eff6ff', color: '#1447e6' }}
          >
            {product.sub_category}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">
              {isForSale ? 'Price:' : 'Daily Rate:'}
            </span>
            <div className="flex items-center space-x-2">
              {isForSale ? (
                <>
                  {product.discountOnSellingPrice > 0 && (
                    <span className="text-gray-400 text-sm line-through">
                      ₹{product.realSellingPrice}
                    </span>
                  )}
                  <span className="font-bold text-lg" style={{ color: '#1447e6' }}>
                    ₹{product.sellingPrice}
                  </span>
                </>
              ) : bestRentalDeal ? (
                <>
                  {bestRentalDeal.discount > 0 && (
                    <span className="text-gray-400 text-sm line-through">
                      ₹{bestRentalDeal.realPrice}
                    </span>
                  )}
                  <span className="font-bold text-lg" style={{ color: '#1447e6' }}>
                    ₹{bestRentalDeal.discountPrice}
                  </span>
                </>
              ) : (
                <span className="text-gray-500">Not available</span>
              )}
            </div>
          </div>

          {isForSale ? (
            product.discountOnSellingPrice > 0 && (
              <div className="mt-1 flex justify-between">
                <span className="text-gray-500 text-sm">You save:</span>
                <span className="text-green-600 font-medium text-sm">
                  ₹{savings}
                </span>
              </div>
            )
          ) : bestRentalDeal && bestRentalDeal.discount > 0 && (
            <div className="mt-1 flex justify-between">
              <span className="text-gray-500 text-sm">You save:</span>
              <span className="text-green-600 font-medium text-sm">
                ₹{bestRentalDeal.realPrice - bestRentalDeal.discountPrice}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center text-sm">
          <span className={`inline-flex items-center ${product.stocks > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span className={`w-2 h-2 rounded-full mr-1 ${product.stocks > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {product.stocks > 0 ? `${product.stocks} available` : 'Out of stock'}
          </span>
          <Link href={isForSale ? `/pages/buy/${product._id}` : `/pages/rent/${product._id}`} className="font-medium px-3 py-1.5 rounded-md hover:underline" style={{ color: '#1447e6' }}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

// Pagination Controls Component
function PaginationControls({
  pagination,
  onPageChange
}: {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-600">
        Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
        <span className="font-medium">
          {Math.min(pagination.page * pagination.limit, pagination.totalProducts)}
        </span>{' '}
        of <span className="font-medium">{pagination.totalProducts}</span> products
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className={`px-4 py-2 rounded-md ${pagination.page === 1
              ? 'bg-gray-200 cursor-not-allowed text-gray-400'
              : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
            }`}
        >
          Previous
        </button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            let pageNum;
            if (pagination.totalPages <= 5) {
              pageNum = i + 1;
            } else if (pagination.page <= 3) {
              pageNum = i + 1;
            } else if (pagination.page > pagination.totalPages - 3) {
              pageNum = pagination.totalPages - 4 + i;
            } else {
              pageNum = pagination.page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-10 h-10 rounded-md ${pagination.page === pageNum
                    ? 'text-white font-bold'
                    : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
                  }`}
                style={{
                  backgroundColor: pagination.page === pageNum ? '#1447e6' : 'white',
                  borderColor: pagination.page === pageNum ? '#1447e6' : '#d1d5db'
                }}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
          className={`px-4 py-2 rounded-md ${pagination.page >= pagination.totalPages
              ? 'bg-gray-200 cursor-not-allowed text-gray-400'
              : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-700'
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
