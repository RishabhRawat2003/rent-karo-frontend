"use client";
// components/CreateProductForm.tsx
import React, { useState, useEffect } from 'react';

interface RentalPricing {
  day: number;
  realPrice: number;
  discount: number;
  discountPrice: number;
}

interface SpecificationData {
  key: string;
  value: string;
}

interface Specification {
  title: string;
  data: SpecificationData[];
}

interface ProductFormData {
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
  organisationId: string;
}

const CreateProductForm = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    subTitle: '',
    description: '',
    images: [''],
    stocks: 0,
    wanted_to_sell: false,
    realSellingPrice: 0,
    discountOnSellingPrice: 0,
    sellingPrice: 0,
    rentalPricing: [{ day: 0, realPrice: 0, discount: 0, discountPrice: 0 }],
    specifications: [{ title: '', data: [{ key: '', value: '' }] }],
    category: '',
    organisationId: '',
  });

  useEffect(() => {
    // Calculate selling price whenever realSellingPrice or discount changes
    const discountAmount = formData.realSellingPrice * (formData.discountOnSellingPrice / 100);
    const sellingPrice = formData.realSellingPrice - discountAmount;
    setFormData(prev => ({ ...prev, sellingPrice }));
  }, [formData.realSellingPrice, formData.discountOnSellingPrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(val) : val
    }));
  };

  // Image handling
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length <= 1) return;
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  // Rental pricing handling
  const handleRentalPricingChange = (index: number, field: keyof RentalPricing, value: string | number) => {
    const newRentalPricing = [...formData.rentalPricing];
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    
    newRentalPricing[index] = {
      ...newRentalPricing[index],
      [field]: numericValue
    };
    
    // Calculate discount price
    if (field === 'realPrice' || field === 'discount') {
      const discountAmount = newRentalPricing[index].realPrice * (newRentalPricing[index].discount / 100);
      newRentalPricing[index].discountPrice = newRentalPricing[index].realPrice - discountAmount;
    }
    
    setFormData(prev => ({ ...prev, rentalPricing: newRentalPricing }));
  };

  const addRentalPricing = () => {
    setFormData(prev => ({
      ...prev,
      rentalPricing: [...prev.rentalPricing, { day: 0, realPrice: 0, discount: 0, discountPrice: 0 }]
    }));
  };

  const removeRentalPricing = (index: number) => {
    if (formData.rentalPricing.length <= 1) return;
    const newRentalPricing = formData.rentalPricing.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, rentalPricing: newRentalPricing }));
  };

  // Specifications handling
  const handleSpecificationTitleChange = (index: number, value: string) => {
    const newSpecifications = [...formData.specifications];
    newSpecifications[index].title = value;
    setFormData(prev => ({ ...prev, specifications: newSpecifications }));
  };

  const handleSpecificationDataChange = (specIndex: number, dataIndex: number, field: keyof SpecificationData, value: string) => {
    const newSpecifications = [...formData.specifications];
    newSpecifications[specIndex].data[dataIndex] = {
      ...newSpecifications[specIndex].data[dataIndex],
      [field]: value
    };
    setFormData(prev => ({ ...prev, specifications: newSpecifications }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { title: '', data: [{ key: '', value: '' }] }]
    }));
  };

  const removeSpecification = (index: number) => {
    if (formData.specifications.length <= 1) return;
    const newSpecifications = formData.specifications.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, specifications: newSpecifications }));
  };

  const addSpecificationData = (specIndex: number) => {
    const newSpecifications = [...formData.specifications];
    newSpecifications[specIndex].data.push({ key: '', value: '' });
    setFormData(prev => ({ ...prev, specifications: newSpecifications }));
  };

  const removeSpecificationData = (specIndex: number, dataIndex: number) => {
    const newSpecifications = [...formData.specifications];
    if (newSpecifications[specIndex].data.length <= 1) return;
    newSpecifications[specIndex].data = newSpecifications[specIndex].data.filter((_, i) => i !== dataIndex);
    setFormData(prev => ({ ...prev, specifications: newSpecifications }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product Data:', formData);
    // Submit to API here
    alert('Product created successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Create New Product</h1>
          <p className="mt-2 text-gray-600">Fill out the form to add a new product to your inventory</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Basic Information Section */}
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Product title"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle*</label>
                  <input
                    type="text"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Product subtitle"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Detailed product description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Product category"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stocks*</label>
                  <input
                    type="number"
                    name="stocks"
                    value={formData.stocks}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization ID*</label>
                  <input
                    type="text"
                    name="organisationId"
                    value={formData.organisationId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Organization identifier"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="wanted_to_sell"
                    checked={formData.wanted_to_sell}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Mark as wanted to sell
                  </label>
                </div>
              </div>
            </section>
            
            {/* Pricing Section */}
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Pricing Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Real Selling Price ($)*</label>
                  <input
                    type="number"
                    name="realSellingPrice"
                    value={formData.realSellingPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    name="discountOnSellingPrice"
                    value={formData.discountOnSellingPrice}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price ($)</label>
                  <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                    <span className="font-medium text-gray-800">${formData.sellingPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Images Section */}
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Product Images</h2>
              </div>
              
              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={`Image URL ${index + 1}`}
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      disabled={formData.images.length <= 1}
                      className={`ml-2 p-2 rounded-full ${formData.images.length > 1 ? 'text-red-500 hover:bg-red-50' : 'text-gray-400'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addImageField}
                  className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Add Image URL
                </button>
              </div>
            </section>
            
            {/* Rental Pricing Section */}
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Rental Pricing</h2>
              </div>
              
              <div className="space-y-6">
                {formData.rentalPricing.map((pricing, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-700">Rental Option #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeRentalPricing(index)}
                        disabled={formData.rentalPricing.length <= 1}
                        className={`p-1 rounded ${formData.rentalPricing.length > 1 ? 'text-red-500 hover:bg-red-50' : 'text-gray-400'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Days*</label>
                        <input
                          type="number"
                          value={pricing.day}
                          onChange={(e) => handleRentalPricingChange(index, 'day', e.target.value)}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Real Price ($)*</label>
                        <input
                          type="number"
                          value={pricing.realPrice}
                          onChange={(e) => handleRentalPricingChange(index, 'realPrice', e.target.value)}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Discount (%)</label>
                        <input
                          type="number"
                          value={pricing.discount}
                          onChange={(e) => handleRentalPricingChange(index, 'discount', e.target.value)}
                          min="0"
                          max="100"
                          step="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Discount Price ($)</label>
                        <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg">
                          <span className="font-medium">${pricing.discountPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addRentalPricing}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Add Rental Option
                </button>
              </div>
            </section>
            
            {/* Specifications Section */}
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">5</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Product Specifications</h2>
              </div>
              
              <div className="space-y-6">
                {formData.specifications.map((spec, specIndex) => (
                  <div key={specIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-700">Specification Group #{specIndex + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeSpecification(specIndex)}
                        disabled={formData.specifications.length <= 1}
                        className={`p-1 rounded ${formData.specifications.length > 1 ? 'text-red-500 hover:bg-red-50' : 'text-gray-400'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 mb-1">Group Title*</label>
                      <input
                        type="text"
                        value={spec.title}
                        onChange={(e) => handleSpecificationTitleChange(specIndex, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="Specification group title"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-600">Specifications:</h4>
                      
                      {spec.data.map((data, dataIndex) => (
                        <div key={dataIndex} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                          <div className="md:col-span-2">
                            <label className="block text-xs text-gray-500 mb-1">Key*</label>
                            <input
                              type="text"
                              value={data.key}
                              onChange={(e) => handleSpecificationDataChange(specIndex, dataIndex, 'key', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                              placeholder="Specification name"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-xs text-gray-500 mb-1">Value*</label>
                            <input
                              type="text"
                              value={data.value}
                              onChange={(e) => handleSpecificationDataChange(specIndex, dataIndex, 'value', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                              placeholder="Specification value"
                            />
                          </div>
                          
                          <div>
                            <button
                              type="button"
                              onClick={() => removeSpecificationData(specIndex, dataIndex)}
                              disabled={spec.data.length <= 1}
                              className={`w-full p-2 rounded ${spec.data.length > 1 ? 'text-red-500 hover:bg-red-50' : 'text-gray-400'}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => addSpecificationData(specIndex)}
                        className="mt-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Specification
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addSpecification}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Add Specification Group
                </button>
              </div>
            </section>
            
            {/* Submit Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                All fields marked with * are required
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Create Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductForm;