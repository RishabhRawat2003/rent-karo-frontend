"use client"
import { useState } from 'react';
import { X, MessageCircle, Truck, RefreshCw, AlertCircle, ChevronDown, HelpCircle, FileText } from 'lucide-react';
import { Order } from '@/app/pages/account/orders/page';
import Image from 'next/image';

export const ContactSupportModal = ({ order, onClose }: { order: Order; onClose: () => void }) => {
    const [supportType, setSupportType] = useState<string>('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formData, setFormData] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);

    const handleItemToggle = (itemId: string) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setAttachments(prev => [...prev, ...files]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // In a real app, this would be an API call
        setTimeout(() => {
            console.log('Support request submitted:', {
                supportType,
                selectedItems,
                formData
            });
            setIsSubmitting(false);
            alert('Your support request has been submitted successfully!');
            onClose();
        }, 1500);
    };

    const renderForm = () => {
        switch (supportType) {
            case 'return':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">Select items to return</h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                                {order.order_items.map((item, index) => (
                                    <div key={item.product_id._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                                        <input
                                            type="checkbox"
                                            id={`item-${index}`}
                                            checked={selectedItems.includes(item.product_id._id)}
                                            onChange={() => handleItemToggle(item.product_id._id)}
                                            className="h-5 w-5 text-blue-600 rounded"
                                        />
                                        <label htmlFor={`item-${index}`} className="flex-1 flex items-center gap-3 cursor-pointer">
                                            <Image
                                                src={item.product_id.images[0] || '/placeholder-product.jpg'}
                                                alt={item.product_id.title}
                                                width={48}
                                                height={48}
                                                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                            />
                                            <div>
                                                <p className="font-medium">{item.product_id.title}</p>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for return
                            </label>
                            <select
                                name="returnReason"
                                value={formData.returnReason || ''}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select a reason</option>
                                <option value="wrongItem">Wrong item received</option>
                                <option value="changedMind">Changed my mind</option>
                                <option value="defective">Defective product</option>
                                <option value="notAsDescribed">Not as described</option>
                                <option value="other">Other reason</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred resolution
                            </label>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="resolution"
                                        value="refund"
                                        checked={formData.resolution === 'refund'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    Refund
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="resolution"
                                        value="exchange"
                                        checked={formData.resolution === 'exchange'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    Exchange
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="resolution"
                                        value="storeCredit"
                                        checked={formData.resolution === 'storeCredit'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    Store credit
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Additional details
                            </label>
                            <textarea
                                name="returnDetails"
                                value={formData.returnDetails || ''}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Please provide any additional information about your return..."
                            ></textarea>
                        </div>
                    </div>
                );

            case 'delivery':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Delivery Issue Type
                            </label>
                            <select
                                name="deliveryIssue"
                                value={formData.deliveryIssue || ''}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Select an issue</option>
                                <option value="delayed">Delivery delayed</option>
                                <option value="behavior">Delivery person behavior</option>
                                <option value="wrongAddress">Delivered to wrong address</option>
                                <option value="notDelivered">Package not delivered</option>
                                <option value="damagedPackage">Package damaged during delivery</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Describe the issue
                            </label>
                            <textarea
                                name="deliveryDetails"
                                value={formData.deliveryDetails || ''}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Please describe the issue you encountered with the delivery..."
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                When did this happen?
                            </label>
                            <input
                                type="date"
                                name="incidentDate"
                                value={formData.incidentDate || ''}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                );

            case 'damage':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">Select damaged items</h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                                {order.order_items.map((item, index) => (
                                    <div key={item.product_id._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                                        <input
                                            type="checkbox"
                                            id={`damaged-${index}`}
                                            checked={selectedItems.includes(item.product_id._id)}
                                            onChange={() => handleItemToggle(item.product_id._id)}
                                            className="h-5 w-5 text-blue-600 rounded"
                                        />
                                        <label htmlFor={`damaged-${index}`} className="flex-1 flex items-center gap-3 cursor-pointer">
                                            <Image
                                                src={item.product_id.images[0] || '/placeholder-product.jpg'}
                                                width={48}
                                                height={48}
                                                alt={item.product_id.title}
                                                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                            />
                                            <div>
                                                <p className="font-medium">{item.product_id.title}</p>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type of issue
                            </label>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="issueType"
                                        value="damaged"
                                        checked={formData.issueType === 'damaged'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    Damaged product
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="issueType"
                                        value="missingParts"
                                        checked={formData.issueType === 'missingParts'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    Missing parts
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="issueType"
                                        value="notWorking"
                                        checked={formData.issueType === 'notWorking'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    Product not working
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description of the issue
                            </label>
                            <textarea
                                name="damageDetails"
                                value={formData.damageDetails || ''}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Please describe the damage or missing parts in detail..."
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload photos (optional)
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB each)</p>
                                    </div>
                                    <input type="file" className="hidden" multiple />
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 'other':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject || ''}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Briefly describe your issue"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Detailed Description
                            </label>
                            <textarea
                                name="otherDetails"
                                value={formData.otherDetails || ''}
                                onChange={handleInputChange}
                                rows={5}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Please describe your issue in detail, including any relevant information that might help us assist you..."
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                How urgent is this issue?
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <label className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="urgency"
                                        value="low"
                                        checked={formData.urgency === 'low'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 mb-2"
                                    />
                                    <div className="text-center">
                                        <span className="font-medium text-gray-900">Low</span>
                                        <p className="text-xs text-gray-500 mt-1">Can wait a few days</p>
                                    </div>
                                </label>

                                <label className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="urgency"
                                        value="medium"
                                        checked={formData.urgency === 'medium'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 mb-2"
                                    />
                                    <div className="text-center">
                                        <span className="font-medium text-gray-900">Medium</span>
                                        <p className="text-xs text-gray-500 mt-1">Need resolution in 1-2 days</p>
                                    </div>
                                </label>

                                <label className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="urgency"
                                        value="high"
                                        checked={formData.urgency === 'high'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 mb-2"
                                    />
                                    <div className="text-center">
                                        <span className="font-medium text-gray-900">High</span>
                                        <p className="text-xs text-gray-500 mt-1">Need immediate attention</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Contact Method
                            </label>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="contactMethod"
                                        value="email"
                                        checked={formData.contactMethod === 'email'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    Email
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="contactMethod"
                                        value="phone"
                                        checked={formData.contactMethod === 'phone'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    Phone Call
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="contactMethod"
                                        value="whatsapp"
                                        checked={formData.contactMethod === 'whatsapp'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    WhatsApp
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="contactMethod"
                                        value="none"
                                        checked={formData.contactMethod === 'none'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    No preference
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Attachments (optional)
                            </label>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 bg-gray-50">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">PDF, DOC, PNG, JPG (MAX. 10MB each)</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            multiple
                                            onChange={handleFileUpload}
                                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                        />
                                    </label>
                                </div>

                                {attachments.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-700">Attached files:</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {attachments.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <FileText size={16} className="text-blue-600" />
                                                        <span className="text-sm truncate max-w-[120px]">{file.name}</span>
                                                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)}MB</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttachment(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                            onClick={() => setSupportType('return')}
                            className="flex flex-col items-center p-6 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                        >
                            <div className="bg-white p-3 rounded-full mb-4">
                                <RefreshCw className="text-blue-600" size={24} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Return, Refund or Exchange</h3>
                            <p className="text-sm text-gray-600 text-center">Request a return, refund, or exchange for items in this order</p>
                        </button>

                        <button
                            onClick={() => setSupportType('delivery')}
                            className="flex flex-col items-center p-6 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
                        >
                            <div className="bg-white p-3 rounded-full mb-4">
                                <Truck className="text-purple-600" size={24} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Delivery Related Issues</h3>
                            <p className="text-sm text-gray-600 text-center">Report problems with delivery personnel or delivery timing</p>
                        </button>

                        <button
                            onClick={() => setSupportType('damage')}
                            className="flex flex-col items-center p-6 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors"
                        >
                            <div className="bg-white p-3 rounded-full mb-4">
                                <AlertCircle className="text-orange-600" size={24} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Damaged Product or Missing Parts</h3>
                            <p className="text-sm text-gray-600 text-center">Report damaged items or missing components from your order</p>
                        </button>

                        <button
                            onClick={() => setSupportType('other')}
                            className="flex flex-col items-center p-6 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <div className="bg-white p-3 rounded-full mb-4">
                                <HelpCircle className="text-gray-600" size={24} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Other Issues</h3>
                            <p className="text-sm text-gray-600 text-center">For any other questions or concerns about your order</p>
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky z-20 top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                <MessageCircle className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Contact Support for Order #{order._id.slice(-8).toUpperCase()}
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    How can we help you with this order?
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="text-gray-500" size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {supportType && (
                        <div className="mb-6">
                            <button
                                onClick={() => setSupportType('')}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                <ChevronDown size={16} className="rotate-90" />
                                Back to support options
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {renderForm()}

                        {(supportType && supportType !== '') && (
                            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Support Request"
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};