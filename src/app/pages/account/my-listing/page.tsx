"use client";

export interface Specification {
    title: string;
    data: {
        key: string;
        value: string;
    }[];
}

export interface RentalPricing {
    day: number;
    realPrice: number;
    discount: number;
    discountPrice: number;
}

export interface Organisation {
    _id: string;
    name: string;
    description: string;
    images: string[];
    user: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // in case there are additional fields
}

export interface Product {
    _id: string;
    title: string;
    subTitle: string;
    description: string;
    images: string[];
    stocks: number;
    wanted_to_sell: boolean;
    realSellingPrice: number;
    discountOnSellingPrice: number;
    sellingPrice: number;
    rentalPricing: RentalPricing[];
    specifications: Specification[];
    category: string;
    sub_category: string;
    organisationId: Organisation;
    blockedByAdmin: boolean;
    createdAt: string;
    updatedAt: string;
}

import { useEffect, useState } from 'react';
import { PlusCircle, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { getProductsByOrganisation, removeSingleProduct, updateProduct } from '@/store/productSlice';
import { toast } from 'react-toastify';
import { getSingleOrganisation } from '@/store/organisationSlice';
import ProductCard from '@/components/product/organisationProducts/ProductCard';
import { PaginationControls } from '@/components/product/organisationProducts/PaginationControls';
import ProductDetailModal from '@/components/product/organisationProducts/ProductDetailModal';
import UpdateProductPopup from '@/components/product/organisationProducts/UpdateProductPopup';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
        totalProducts: 0
    });
    const [organisationId, setOrganisationId] = useState<string | null>(null);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newPreviewImages, setNewPreviewImages] = useState<string[]>([]);
    const dispatch = useDispatch();

    async function getOrganisationDetails() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(getSingleOrganisation() as any);
            if (response?.error) {
                toast.error(response.error.message);
            } else {
                setOrganisationId(response.payload.organisation._id);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to load organization details');
        }
    }

    async function getProducts(id: string) {
        setLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(getProductsByOrganisation({ id, pagination } as any) as any);
            if (response?.error) {
                toast.error(response.error.message);
            } else {
                setProducts(response.payload.products);
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.payload.totalPages,
                    totalProducts: response.payload.totalProducts
                }));
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to load products');
        }
        setLoading(false);
    }

    useEffect(() => {
        getOrganisationDetails();
    }, []);

    useEffect(() => {
        if (organisationId) {
            getProducts(organisationId);
        }
    }, [pagination.page, pagination.limit, organisationId]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        setDeleting(true);

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(removeSingleProduct(productToDelete._id as any) as any);
            if (response?.error) {
                toast.error(response.error.message);
            } else {
                toast.success("Product deleted successfully");
                getOrganisationDetails();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setProductToDelete(null);
            setDeleting(false);
        }
    };

    const handleUpdateProduct = async () => {
        if (!updatedProduct) return;
        setUpdateLoading(true);
        const formData = new FormData();
        formData.append('title', updatedProduct.title);
        formData.append('subTitle', updatedProduct.subTitle);
        formData.append('description', updatedProduct.description);
        formData.append('wanted_to_sell', updatedProduct.wanted_to_sell.toString());
        formData.append('stocks', updatedProduct.stocks.toString());
        formData.append('realSellingPrice', updatedProduct.realSellingPrice.toString());
        formData.append('discountOnSellingPrice', updatedProduct.discountOnSellingPrice.toString());
        formData.append('sellingPrice', updatedProduct.sellingPrice.toString());
        formData.append('rentalPricing', JSON.stringify(updatedProduct.rentalPricing));
        formData.append('specifications', JSON.stringify(updatedProduct.specifications));
        formData.append('category', updatedProduct.category);
        formData.append('sub_category', updatedProduct.sub_category);
        formData.append('existingImages', JSON.stringify(updatedProduct.images))
        formData.append('organisationId', organisationId || '');
        if (newImages.length > 0) {
            for (let i = 0; i < newImages.length; i++) {
                formData.append(`images`, newImages[i]);
            }
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(updateProduct({ id: updatedProduct?._id, data: formData } as any) as any);
            if (response?.error) {
                toast.error(response.error.message);
            } else {
                toast.success("Product updated successfully");
                setUpdateLoading(false);
                setUpdatedProduct(null);
                setNewImages([]);
                setNewPreviewImages([]);
                getOrganisationDetails();
                getProducts(organisationId || '');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to update product');
        }
    };

    return (
        <div className="container min-h-screen py-20 mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-center sm:text-left text-gray-900">My Products</h1>
                    <p className="text-gray-600 mt-1">Manage your rental and sale inventory</p>
                </div>
                <Link
                    href={'/pages/account/my-listing/create-product'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md"
                >
                    <PlusCircle className="w-5 h-5" />
                    Create Product
                </Link>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="mt-4 text-gray-600">Loading your products...</p>
                </div>
            ) : products?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        You haven&apos;t created any products yet. Start by adding your first item to rent or sell.
                    </p>
                    <div className="mt-6">
                        <Link
                            href={'/pages/account/my-listing/create-product'}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Create First Product
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products?.map(product => (
                            <ProductCard setCurrentProduct={setCurrentProduct} key={product._id} product={product} />
                        ))}
                    </div>

                    <PaginationControls handlePageChange={handlePageChange} pagination={pagination} products={products} />
                </>
            )}

            {/* Product Detail Modal */}
            {currentProduct && <ProductDetailModal currentProduct={currentProduct} setProductToDelete={setProductToDelete} setCurrentProduct={setCurrentProduct} setUpdatedProduct={setUpdatedProduct} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} />}

            {/* Delete Confirmation Modal */}
            {productToDelete && (
                <div
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                    onClick={() => setProductToDelete(null)}
                >
                    <div
                        className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>

                            <h2 className="mt-4 text-xl font-bold text-gray-900">Delete Product?</h2>
                            <p className="mt-3 text-gray-600">
                                Are you sure you want to delete <span className="font-semibold">&quot;{productToDelete.title}&quot;</span>?
                                This action cannot be undone.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                                <button
                                    onClick={() => setProductToDelete(null)}
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteProduct}
                                    disabled={deleting}
                                    className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {deleting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    {deleting ? 'Deleting...' : 'Delete Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Product Modal */}
            {updatedProduct && <UpdateProductPopup updatedProduct={updatedProduct} setUpdatedProduct={setUpdatedProduct} newPreviewImages={newPreviewImages} handleUpdateProduct={handleUpdateProduct} updateLoading={updateLoading} setNewPreviewImages={setNewPreviewImages} setNewImages={setNewImages} />}
        </div>
    );
}