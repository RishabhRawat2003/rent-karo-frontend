"use client";
import { Product } from '@/app/pages/account/my-listing/page';
import { PlusCircle, Image as ImageIcon, X, Trash2, CreditCard, List, Edit3, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface UpdateProductPopupProps {
    updatedProduct: Product;
    setUpdatedProduct: (product: Product | null) => void;
    newPreviewImages: string[];
    handleUpdateProduct: () => void;
    setNewPreviewImages: React.Dispatch<React.SetStateAction<string[]>>;
    setNewImages: React.Dispatch<React.SetStateAction<File[]>>;
    updateLoading: boolean
}

function UpdateProductPopup({ updatedProduct, setUpdatedProduct, newPreviewImages, handleUpdateProduct, updateLoading, setNewPreviewImages, setNewImages }: UpdateProductPopupProps) {
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 pb-3 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">Update {updatedProduct.title}</h2>
                        <button
                            onClick={() => setUpdatedProduct(null)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateProduct();
                    }}>
                        {/* Image Upload Section */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                Product Images
                            </h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                                {[...updatedProduct.images, ...newPreviewImages].map((img, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        {typeof img === 'string' ? (
                                            <div className="relative w-full h-full rounded-lg overflow-hidden border">
                                                <Image
                                                    fill
                                                    src={img}
                                                    alt={`Product ${index}`}
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages = [...updatedProduct.images];
                                                            newImages.splice(index, 1);
                                                            setUpdatedProduct({
                                                                ...updatedProduct,
                                                                images: newImages
                                                            });
                                                        }}
                                                        className="bg-red-500 text-white rounded-full p-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-100 border-2 border-dashed rounded-lg w-full h-full flex flex-col items-center justify-center p-4">
                                                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                                <span className="text-xs text-gray-500 text-center">Uploading...</span>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Add Image Button */}
                                <label className="aspect-square cursor-pointer">
                                    <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                                        <PlusCircle className="w-8 h-8 text-gray-400" />
                                        <span className="text-sm mt-2 text-gray-500">Add Image</span>
                                    </div>
                                    <input
                                        type="file"
                                        name="images"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                const newFiles = Array.from(e.target.files);
                                                setNewImages(prev => [...prev, ...newFiles]);
                                                setNewPreviewImages(prev => [...prev, ...newFiles.map(file => URL.createObjectURL(file))]);
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, or WEBP (MAX. 5MB each)
                            </p>
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Product Title*
                                </label>
                                <input
                                    type="text"
                                    value={updatedProduct.title}
                                    onChange={(e) => setUpdatedProduct({
                                        ...updatedProduct,
                                        title: e.target.value
                                    })}
                                    className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Subtitle
                                </label>
                                <input
                                    type="text"
                                    value={updatedProduct.subTitle}
                                    onChange={(e) => setUpdatedProduct({
                                        ...updatedProduct,
                                        subTitle: e.target.value
                                    })}
                                    className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Description*
                                </label>
                                <textarea
                                    value={updatedProduct.description}
                                    onChange={(e) => setUpdatedProduct({
                                        ...updatedProduct,
                                        description: e.target.value
                                    })}
                                    rows={4}
                                    className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Category*
                                </label>
                                <select
                                    value={updatedProduct.category}
                                    onChange={(e) =>
                                        setUpdatedProduct({
                                            ...updatedProduct,
                                            category: e.target.value,
                                        })
                                    }
                                    className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
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
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Sub Category*
                                </label>
                                <input
                                    type="text"
                                    placeholder='Enter Your Sub Category'
                                    value={updatedProduct.sub_category}
                                    onChange={(e) => setUpdatedProduct({
                                        ...updatedProduct,
                                        sub_category: e.target.value
                                    })}
                                    className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 col-span-2 text-sm font-medium text-gray-700">
                                    Stock Quantity*
                                </label>
                                <input
                                    type="number"
                                    value={updatedProduct.stocks || ''}
                                    onChange={(e) => setUpdatedProduct({
                                        ...updatedProduct,
                                        stocks: parseInt(e.target.value)
                                    })}
                                    min="0"
                                    className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="bg-gray-50 p-5 rounded-xl mb-8">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Pricing
                            </h3>

                            <div className="flex items-center mb-6">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        checked={updatedProduct.wanted_to_sell}
                                        onChange={(e) => setUpdatedProduct({
                                            ...updatedProduct,
                                            wanted_to_sell: e.target.checked
                                        })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                                <label className="ml-2 text-sm font-medium text-gray-700">
                                    Available for Sale
                                </label>
                            </div>

                            {/* Sale Pricing (only shown when wanted_to_sell is true) */}
                            {updatedProduct.wanted_to_sell ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-white rounded-lg border">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Original Price (₹)*
                                        </label>
                                        <input
                                            type="number"
                                            value={updatedProduct.realSellingPrice || ''}
                                            onChange={(e) => {
                                                const price = parseFloat(e.target.value) || 0;
                                                const discount = updatedProduct.discountOnSellingPrice;
                                                setUpdatedProduct({
                                                    ...updatedProduct,
                                                    realSellingPrice: price,
                                                    sellingPrice: price * (1 - discount / 100)
                                                });
                                            }}
                                            min="0"
                                            step="0.01"
                                            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Discount (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={updatedProduct.discountOnSellingPrice || ''}
                                            onChange={(e) => {
                                                const discount = parseFloat(e.target.value) || 0;
                                                const price = updatedProduct.realSellingPrice;
                                                setUpdatedProduct({
                                                    ...updatedProduct,
                                                    discountOnSellingPrice: discount,
                                                    sellingPrice: price * (1 - discount / 100)
                                                });
                                            }}
                                            min="0"
                                            max="100"
                                            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Selling Price (₹)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={updatedProduct.sellingPrice.toFixed(2)}
                                                readOnly
                                                className="w-full p-3 border rounded-lg bg-gray-100 font-medium"
                                            />
                                            <span className="absolute right-3 top-3.5 text-gray-500">₹</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Rental Pricing (only shown when wanted_to_sell is false) */
                                <div className="p-4 bg-white rounded-lg border">
                                    <h4 className="font-medium mb-4 text-gray-700">Rental Pricing</h4>

                                    {updatedProduct.rentalPricing.map((pricing, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 last:mb-0">
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Days*
                                                </label>
                                                <input
                                                    type="number"
                                                    value={pricing.day || ''}
                                                    onChange={(e) => {
                                                        const newPricing = [...updatedProduct.rentalPricing];
                                                        newPricing[index].day = parseInt(e.target.value) || 0;
                                                        setUpdatedProduct({
                                                            ...updatedProduct,
                                                            rentalPricing: newPricing
                                                        });
                                                    }}
                                                    min="0"
                                                    className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Original Price (₹)*
                                                </label>
                                                <input
                                                    type="number"
                                                    value={pricing.realPrice || ''}
                                                    onChange={(e) => {
                                                        const price = parseFloat(e.target.value) || 0;
                                                        const discount = pricing.discount;
                                                        const newPricing = [...updatedProduct.rentalPricing];
                                                        newPricing[index].realPrice = price;
                                                        newPricing[index].discountPrice = price * (1 - discount / 100);
                                                        setUpdatedProduct({
                                                            ...updatedProduct,
                                                            rentalPricing: newPricing
                                                        });
                                                    }}
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Discount (%)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={pricing.discount || ''}
                                                    onChange={(e) => {
                                                        const discount = parseFloat(e.target.value) || 0;
                                                        const price = pricing.realPrice;
                                                        const newPricing = [...updatedProduct.rentalPricing];
                                                        newPricing[index].discount = discount;
                                                        newPricing[index].discountPrice = price * (1 - discount / 100);
                                                        setUpdatedProduct({
                                                            ...updatedProduct,
                                                            rentalPricing: newPricing
                                                        });
                                                    }}
                                                    min="0"
                                                    max="100"
                                                    className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Final Price (₹)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={pricing.discountPrice.toFixed(2)}
                                                        readOnly
                                                        className="w-full p-3 border rounded-lg bg-gray-100 font-medium"
                                                    />
                                                    <span className="absolute right-3 top-3.5 text-gray-500">₹</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUpdatedProduct({
                                                ...updatedProduct,
                                                rentalPricing: [
                                                    ...updatedProduct.rentalPricing,
                                                    { day: 0, realPrice: 0, discount: 0, discountPrice: 0 }
                                                ]
                                            });
                                        }}
                                        className="mt-4 text-blue-600 text-sm flex items-center gap-1.5 font-medium"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Add Rental Period
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Specifications */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                                <List className="w-5 h-5" />
                                Specifications
                            </h3>

                            {updatedProduct.specifications.map((spec, specIndex) => (
                                <div key={specIndex} className="mb-6 p-5 border rounded-lg bg-gray-50">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-medium text-gray-700">Section {specIndex + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newSpecs = [...updatedProduct.specifications];
                                                newSpecs.splice(specIndex, 1);
                                                setUpdatedProduct({
                                                    ...updatedProduct,
                                                    specifications: newSpecs
                                                });
                                            }}
                                            className="text-red-600 text-sm flex items-center gap-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Remove Section
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Section Title
                                        </label>
                                        <input
                                            type="text"
                                            value={spec.title}
                                            onChange={(e) => {
                                                const newSpecs = [...updatedProduct.specifications];
                                                newSpecs[specIndex].title = e.target.value;
                                                setUpdatedProduct({
                                                    ...updatedProduct,
                                                    specifications: newSpecs
                                                });
                                            }}
                                            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        {spec.data.map((item, itemIndex) => (
                                            <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                                        Key*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.key}
                                                        onChange={(e) => {
                                                            const newSpecs = [...updatedProduct.specifications];
                                                            newSpecs[specIndex].data[itemIndex].key = e.target.value;
                                                            setUpdatedProduct({
                                                                ...updatedProduct,
                                                                specifications: newSpecs
                                                            });
                                                        }}
                                                        className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                                        Value*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.value}
                                                        onChange={(e) => {
                                                            const newSpecs = [...updatedProduct.specifications];
                                                            newSpecs[specIndex].data[itemIndex].value = e.target.value;
                                                            setUpdatedProduct({
                                                                ...updatedProduct,
                                                                specifications: newSpecs
                                                            });
                                                        }}
                                                        className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>

                                                <div className="flex items-end pb-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newSpecs = [...updatedProduct.specifications];
                                                            newSpecs[specIndex].data.splice(itemIndex, 1);
                                                            setUpdatedProduct({
                                                                ...updatedProduct,
                                                                specifications: newSpecs
                                                            });
                                                        }}
                                                        className="text-red-600 text-sm flex items-center"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSpecs = [...updatedProduct.specifications];
                                            newSpecs[specIndex].data.push({ key: '', value: '' });
                                            setUpdatedProduct({
                                                ...updatedProduct,
                                                specifications: newSpecs
                                            });
                                        }}
                                        className="mt-4 text-blue-600 text-sm flex items-center gap-1.5 font-medium"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Add Specification
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => {
                                    setUpdatedProduct({
                                        ...updatedProduct,
                                        specifications: [
                                            ...updatedProduct.specifications,
                                            {
                                                title: '',
                                                data: [{ key: '', value: '' }]
                                            }
                                        ]
                                    });
                                }}
                                className="text-blue-600 text-sm flex items-center gap-1.5 font-medium"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Add Specification Section
                            </button>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => setUpdatedProduct(null)}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={updateLoading}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-70 font-medium transition-colors"
                            >
                                {updateLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Edit3 className="w-5 h-5" />
                                )}
                                {updateLoading ? 'Updating...' : 'Update Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdateProductPopup