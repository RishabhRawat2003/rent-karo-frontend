"use client";
import { Image as ImageIcon, X, Trash2, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import Image from 'next/image';
import { renderPricing } from './RenderPricing';
import { Product } from '@/app/pages/account/my-listing/page';

interface ProductDetailModalProps {
  currentProduct: Product;
  setCurrentProduct: (product: Product | null) => void;
  setUpdatedProduct: (product: Product) => void;
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setProductToDelete: (product: Product) => void;
}

function ProductDetailModal({ currentProduct, setCurrentProduct,setUpdatedProduct, currentImageIndex,setProductToDelete, setCurrentImageIndex }: ProductDetailModalProps) {
    return (
        <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setCurrentProduct(null)}
        >
            <div
                style={{
                    scrollbarWidth: 'none'
                }}
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            {currentProduct.title}
                            {currentProduct.blockedByAdmin && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                    Blocked
                                </span>
                            )}
                        </h2>
                        <button
                            onClick={() => setCurrentProduct(null)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Image Gallery */}
                    <div className="relative rounded-xl overflow-hidden bg-gray-50 mb-6 aspect-video">
                        {currentProduct.images?.[currentImageIndex] ? (
                            <>
                                <Image
                                    width={1000}
                                    height={1000}
                                    src={currentProduct.images[currentImageIndex]}
                                    alt={currentProduct.title}
                                    className="w-full h-full object-contain"
                                />

                                {currentProduct.images?.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentImageIndex(prev =>
                                                    (prev - 1 + currentProduct.images.length) % currentProduct.images.length
                                                );
                                            }}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentImageIndex(prev =>
                                                    (prev + 1) % currentProduct.images.length
                                                );
                                            }}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>

                                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                            {currentProduct.images?.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCurrentImageIndex(idx);
                                                    }}
                                                    className={`w-2.5 h-2.5 rounded-full ${idx === currentImageIndex
                                                        ? 'bg-blue-600'
                                                        : 'bg-gray-300 hover:bg-gray-400'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-8">
                                <ImageIcon className="w-16 h-16" />
                                <p className="mt-2">No images available</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="text-gray-700 whitespace-pre-line">{currentProduct.description}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">Pricing & Inventory</h3>
                                {renderPricing(currentProduct)}

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Category</p>
                                        <p className="font-medium">{currentProduct.category || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Sub Category</p>
                                        <p className="font-medium">{currentProduct.sub_category || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Available Stock</p>
                                        <p className="font-medium">{currentProduct.stocks}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <p className={`font-medium ${currentProduct.blockedByAdmin
                                            ? 'text-red-600'
                                            : 'text-green-600'
                                            }`}>
                                            {currentProduct.blockedByAdmin ? 'Blocked' : 'Active'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Last Updated</p>
                                        <p className="font-medium">
                                            {new Date(currentProduct.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3">Specifications</h3>

                            {currentProduct.specifications?.length > 0 ? (
                                <div className="space-y-4">
                                    {currentProduct.specifications.map((spec, idx) => (
                                        <div key={idx} className="border-b pb-4 last:border-0 last:pb-0">
                                            <h4 className="font-medium text-gray-900 mb-2">{spec.title}</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {spec.data.map((item, itemIdx) => (
                                                    <div key={itemIdx} className="text-sm">
                                                        <span className="text-gray-600">{item.key}:</span>{' '}
                                                        <span className="font-medium">{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-6 text-center">
                                    <p className="text-gray-500">No specifications added</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">
                        <div
                            onClick={() => {
                                setUpdatedProduct({ ...currentProduct });
                                setCurrentProduct(null);
                            }}
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Product
                        </div>
                        <button
                            onClick={() => {
                                setProductToDelete(currentProduct);
                                setCurrentProduct(null);
                            }}
                            className="bg-red-100 text-red-700 px-5 py-2.5 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Trash2 className="w-4 h-4" />
                            Remove Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailModal