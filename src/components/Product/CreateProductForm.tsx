import { useState } from "react";
import { PlusCircle } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
  images: string[];
  stocks: number;
  realSellingPrice: number;
  discountOnSellingPrice: number;
  sellingPrice: number;
  rentalPricing: Array<{
    day: number;
    realPrice: number;
    discount: number;
    discountPrice: number;
  }>;
  specificationSchema: Array<{
    title: string;
    data: Array<{
      key: string;
      value: string;
    }>;
  }>;
}

export default function CreateProductForm({ onClose, onProductCreated }: {
    onClose: () => void;
    onProductCreated: (product: Product) => void;
}) {
    const [specifications, setSpecifications] = useState([{ title: '', data: [{ key: '', value: '' }] }]);
    const [rentalPlans, setRentalPlans] = useState([{ day: 0, realPrice: 0, discount: 0 }]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [files, setFiles] = useState<FileList | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(e.target.files);
            setImagePreviews(newFiles.map(file => URL.createObjectURL(file)));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        onClose();
    };

    return (
        <div className="fixed inset-0 pt-20 bg-black/50 flex items-center z-20 justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{
                scrollbarWidth: 'none',
            }}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Create New Product</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block mb-2 font-medium">Product Title</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-medium">Subtitle</label>
                            <input type="text" required className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Stock Quantity</label>
                            <input type="number" required className="w-full p-2 border rounded" />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Description</label>
                        <textarea required className="w-full p-2 border rounded h-32" />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Product Images</label>
                        <div className="flex flex-wrap gap-4 mb-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative w-24 h-24">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover rounded border"
                                    />
                                </div>
                            ))}
                            <label className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                                <PlusCircle className="w-8 h-8 text-gray-400" />
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="border-t pt-4">
                            <h3 className="font-medium mb-2">Specifications</h3>
                            {specifications.map((spec, index) => (
                                <div key={index} className="mb-4 space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Specification Title"
                                        className="w-full p-2 border rounded"
                                    />
                                    <div className="space-y-2">
                                        {spec.data.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Key"
                                                    className="w-1/2 p-2 border rounded"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Value"
                                                    className="w-1/2 p-2 border rounded"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Create Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}