"use client";
import { useState, useEffect, useRef } from 'react';
import { PlusCircle, Building2, Trash2, ArrowLeft, Info, ArrowUpRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrganisation, getSingleOrganisation } from '@/store/organisationSlice';
import { toast } from 'react-toastify';
import { createKyc, createKycBusiness, getKycById, getKycByUser } from '@/store/kycSlice';
import { BUSINESS } from '@/utils/enum';
import { LoadingSpinnerWithOverlay } from '@/components/Loading';

interface Organization {
    _id: string;
    name: string;
    description: string;
    images: string[];
    user: string;
    createdAt: string;
    updatedAt: string;
}

interface Kyc {
    _id: string;
    gstNumber: string;
    kycStatus: string;
    businessRegistrationDocument: string;
    companyPANCard: string;
    authorizedSignatoryIDProof: string;
    createdAt: string;
    updatedAt: string;
    rejectedReason?: string;
}

export default function CreateOrganizationPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [hasOrganization, setHasOrganization] = useState(false);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [kyc, setKyc] = useState<Kyc | null>(null);

    // Step 1 states
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Step 2 states
    const [kycDocuments, setKycDocuments] = useState<{
        businessRegistrationDocument: File | null;
        companyPANCard: File | null;
        authorizedSignatoryIDProof: File | null;
    }>({
        businessRegistrationDocument: null,
        companyPANCard: null,
        authorizedSignatoryIDProof: null,
    });

    const [kycPreviews, setKycPreviews] = useState<{
        businessRegistrationDocument: string | null;
        companyPANCard: string | null;
        authorizedSignatoryIDProof: string | null;
    }>({
        businessRegistrationDocument: null,
        companyPANCard: null,
        authorizedSignatoryIDProof: null,
    });

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        gstNumber: '',
    });

    const { loading } = useSelector((state: any) => state.organisation);
    const dispatch = useDispatch()

    async function submitOrganisationDetails() {
        const formData2 = new FormData()
        formData2.append('name', formData.name)
        formData2.append('description', formData.description)
        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                formData2.append('image', images[i]);
            }
        }
        const response = await dispatch(createOrganisation(formData2 as any) as any)
        if (response?.error) {
            toast.error(response.error.message)
        } else {
            toast.success(response.payload.message)
            setHasOrganization(true)
            return response.payload.organisation
        }
    }

    async function checkOrganisation() {
        const response = await dispatch(getSingleOrganisation() as any)
        if (response?.error) {
            return
        } else {
            setHasOrganization(true)
            setOrganization(response.payload.organisation)
            checkKyc(response.payload.organisation._id)
        }
    }

    async function checkKyc(id: any) {
        const response = await dispatch(getKycById(id as any) as any)
        if (response?.error) {
            toast.error(response.error.message)
        } else {
            setKyc(response.payload.kyc)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setImages: React.Dispatch<React.SetStateAction<File[]>>
    ) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setImages(prev => [...prev, ...newFiles]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleKycDocumentUpload = (field: keyof typeof kycDocuments, file: File) => {
        setKycDocuments(prev => ({ ...prev, [field]: file }));
        setKycPreviews(prev => ({
            ...prev,
            [field]: URL.createObjectURL(file)
        }));
    };

    const removeKycDocument = (field: keyof typeof kycDocuments) => {
        setKycDocuments(prev => ({ ...prev, [field]: null }));
        setKycPreviews(prev => {
            if (prev[field]) URL.revokeObjectURL(prev[field]!);
            return { ...prev, [field]: null };
        });
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        window.scrollTo(0, 0)
        if (!formData.name || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }
        setCurrentStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.gstNumber ||
            !kycDocuments.businessRegistrationDocument ||
            !kycDocuments.companyPANCard ||
            !kycDocuments.authorizedSignatoryIDProof
        ) {
            toast.error('Please fill in all KYC fields');
            return;
        }

        try {
            const organisation = hasOrganization ? organization : await submitOrganisationDetails();
            const newFormData = new FormData()
            newFormData.append('organisationId', organisation._id)
            newFormData.append('gstNumber', formData.gstNumber)
            newFormData.append('kycType', BUSINESS)
            newFormData.append('businessRegistrationDocument', kycDocuments.businessRegistrationDocument)
            newFormData.append('companyPANCard', kycDocuments.companyPANCard)
            newFormData.append('authorizedSignatoryIDProof', kycDocuments.authorizedSignatoryIDProof)


            const response = await dispatch(createKycBusiness(newFormData as any) as any)
            if (response?.error) {
                toast.error(response.error.message)
            } else {
                toast.success(response.payload.message)
            }
            setOrganization(organisation);
            setHasOrganization(true);
            await checkOrganisation()
        } catch (error) {
            console.error('Error creating organization:', error);
        }
    };

    useEffect(() => {
        const newPreviews = images.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);

        return () => {
            newPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [images]);

    useEffect(() => {
        return () => {
            Object.values(kycPreviews).forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [kycPreviews]);

    useEffect(() => {
        window.scrollTo(0, 0)
        checkOrganisation()
    }, []);

    if (loading) {
        return (
            <div className='w-full h-screen'>
                <LoadingSpinnerWithOverlay />
            </div>
        )
    }

    if (hasOrganization && organization && !kyc?.rejectedReason) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 pt-20">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 transition-all duration-300 hover:shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <Building2 className="h-12 w-12 text-blue-600" />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{organization.name}</h2>
                                    <p className="text-gray-500 text-sm">
                                        Registered on {new Date(organization.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                Already Registered
                            </span>
                        </div>

                        <div className="mb-8">
                            <p className="text-gray-700 leading-relaxed">{organization.description}</p>
                        </div>

                        {kyc && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">Organization Details</h3>
                                    <dl className="space-y-2">
                                        <div>
                                            <dt className="text-xs text-gray-500">GST Number</dt>
                                            <dd className="font-medium text-gray-900">{kyc.gstNumber}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-gray-500">KYC Status</dt>
                                            <dd>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${kyc.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    kyc.kycStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {kyc.kycStatus.toUpperCase()}
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">KYC Documents</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Business Registration</p>
                                            <a
                                                href={kyc.businessRegistrationDocument}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                                            >
                                                <span>View Document</span>
                                                <ArrowUpRight className="h-4 w-4" />
                                            </a>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Company PAN Card</p>
                                            <a
                                                href={kyc.companyPANCard}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                                            >
                                                <span>View Document</span>
                                                <ArrowUpRight className="h-4 w-4" />
                                            </a>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Authorized Signatory ID</p>
                                            <a
                                                href={kyc.authorizedSignatoryIDProof}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                                            >
                                                <span>View Document</span>
                                                <ArrowUpRight className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {kyc?.kycStatus === 'pending' ? (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-start gap-3">
                                    <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-blue-800">
                                            Your KYC verification is in progress. This usually takes 2-3 business days.
                                            You'll receive an email notification once your verification is complete.
                                        </p>
                                        <p className="text-sm text-blue-800 mt-2">
                                            Last updated: {new Date(kyc?.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : !kyc && (
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <div className="flex items-start gap-3">
                                    <Info className="h-5 w-5 text-yellow-400 mt-0.5" />
                                    <p className="text-sm text-yellow-800">
                                        KYC verification not submitted yet. Please complete the KYC process.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (kyc?.rejectedReason) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20">
                <div className="kyc-rejection-notice bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full border border-red-100">
                    <div className="flex flex-col gap-6">
                        {/* Header Section */}
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <svg
                                    className="w-6 h-6 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mt-4">
                                KYC Verification Rejected
                            </h3>
                        </div>

                        {/* Rejection Reason */}
                        <div className="bg-red-50 px-4 py-3 rounded-lg">
                            <p className="text-sm font-medium text-red-800">
                                Reason for rejection:
                            </p>
                            <p className="mt-1 text-sm text-red-700">
                                {kyc.rejectedReason}
                            </p>
                        </div>

                        {/* Resubmission Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* GST Number Field */}
                            <div>
                                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    GST Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="gstNumber"
                                    required
                                    value={formData.gstNumber}
                                    onChange={handleInputChange}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter GST number"
                                />
                            </div>

                            {/* Document Upload Sections */}
                            {['businessRegistrationDocument', 'companyPANCard', 'authorizedSignatoryIDProof'].map((field) => (
                                <div key={field} className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600 capitalize">
                                            {field.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    handleKycDocumentUpload(
                                                        field as keyof typeof kycDocuments,
                                                        e.target.files[0]
                                                    );
                                                }
                                            }}
                                            className="hidden"
                                            id={field}
                                        />
                                        <label
                                            htmlFor={field}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 cursor-pointer"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Upload Document
                                        </label>
                                    </div>
                                    {kycPreviews[field as keyof typeof kycPreviews] && (
                                        <div className="relative group aspect-video mt-2">
                                            <img
                                                src={kycPreviews[field as keyof typeof kycPreviews]!}
                                                alt={`${field} preview`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeKycDocument(field as keyof typeof kycDocuments)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4 text-white" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Resubmit KYC Application
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 pt-20">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <Building2 className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {currentStep === 1
                            ? 'Create Organization'
                            : 'KYC Verification'}
                    </h1>
                    <p className="text-gray-600">
                        {currentStep === 1 ? 'Step 1: Basic Information' : 'Step 2: KYC Details'}
                    </p>
                </div>


                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {currentStep === 1 ? (
                        <form onSubmit={handleNextStep} className="space-y-8">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Organization Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter organization name"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    required
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="block w-full px-4 py-3 resize-none rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Describe your organization"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Images
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Add Images
                                    </button>
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    multiple
                                    onChange={(e) => handleImageUpload(e, setImages)}
                                    className="hidden"
                                    accept="image/*"
                                />

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {previews.map((preview, index) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2"
                            >
                                Next Step
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-6"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                Back to Basic Info
                            </button>

                            <div>
                                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    GST Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="gstNumber"
                                    required
                                    value={formData.gstNumber}
                                    onChange={handleInputChange}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter GST number"
                                />
                            </div>

                            {['businessRegistrationDocument', 'companyPANCard', 'authorizedSignatoryIDProof'].map((field) => (
                                <div key={field} className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600 capitalize">
                                            {field.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    handleKycDocumentUpload(
                                                        field as keyof typeof kycDocuments,
                                                        e.target.files[0]
                                                    );
                                                }
                                            }}
                                            className="hidden"
                                            id={field}
                                        />
                                        <label
                                            htmlFor={field}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 cursor-pointer"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Upload Document
                                        </label>
                                    </div>
                                    {kycPreviews[field as keyof typeof kycPreviews] && (
                                        <div className="relative group aspect-video mt-2">
                                            <img
                                                src={kycPreviews[field as keyof typeof kycPreviews]!}
                                                alt={`${field} preview`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeKycDocument(field as keyof typeof kycDocuments)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4 text-white" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2"
                            >
                                Complete Registration
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
}