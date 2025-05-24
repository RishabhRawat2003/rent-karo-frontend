"use client";
import { useState, useEffect } from 'react';
import {
  IdCardIcon,
  CreditCardIcon,
  UploadIcon,
  Loader2Icon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { createKyc, getKycByUser } from "@/store/kycSlice";

export default function KYCVerification() {
  const [kycInfo, setKycInfo] = useState<{
    status: 'pending' | 'approved' | 'rejected' | 'NONE';
    rejectedReason?: string;
  }>({ status: 'NONE' });
  const [aadhaarImage, setAadhaarImage] = useState<File | null>(null);
  const [panImage, setPanImage] = useState<File | null>(null);
  const [infoData, setInfoData] = useState({
    aadhaarNumber: '',
    panNumber: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading } = useSelector((state: any) => state.kyc)
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch()

  const fetchKYCStatus = async () => {
    const response = await dispatch(getKycByUser() as any)
    if (response?.error) {
      toast.info(response.error.message)
    } else {
      setKycInfo({
        status: response.payload.kyc.kycStatus,
        rejectedReason: response.payload.kyc?.rejectedReason
      });
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (image: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('aadhaarNumber', infoData.aadhaarNumber);
    formData.append('panNumber', infoData.panNumber);

    if (aadhaarImage) {
      formData.append('aadhaarImage', aadhaarImage);
    }
    if (panImage) {
      formData.append('panImage', panImage);
    }


    const response = await dispatch(createKyc(formData as any) as any)
    if (response?.error) {
      toast.error(response.error.message)
    } else {
      toast.success(response.payload.message)
      fetchKYCStatus()
      setAadhaarImage(null);
      setPanImage(null);
      setInfoData({ aadhaarNumber: '', panNumber: '' });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const getStatusContent = () => {
    switch (kycInfo.status) {
      case 'approved':
        return {
          icon: <CheckCircle2Icon className="w-16 h-16 text-green-500" />,
          title: 'KYC Verified',
          description: 'Your account has been successfully verified.',
          className: 'bg-green-50 border-green-200',
        };
      case 'pending':
        return {
          icon: <ClockIcon className="w-16 h-16 text-yellow-500" />,
          title: 'Verification Pending',
          description: 'Your documents are under review. This may take 2-3 business days.',
          className: 'bg-yellow-50 border-yellow-200',
        };
      case 'rejected':
        return {
          icon: <XCircleIcon className="w-16 h-16 text-red-500" />,
          title: 'Verification Rejected',
          description: `Reason: ${kycInfo.rejectedReason || 'Not specified'}`,
          className: 'bg-red-50 border-red-200',
        };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2Icon className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  const statusContent = getStatusContent();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Verification</h1>
          <p className="text-gray-600 mb-8">
            Complete your Know Your Customer verification to access all features
          </p>

          {statusContent && (
            <div className={`${statusContent.className} border rounded-lg p-8 mb-8`}>
              <div className="flex flex-col items-center text-center space-y-4">
                {statusContent.icon}
                <h2 className="text-2xl font-semibold text-gray-900">
                  {statusContent.title}
                </h2>
                <p className="text-gray-600 max-w-md">{statusContent.description}</p>

                {kycInfo.status === 'rejected' && (
                  <button
                    onClick={() => setKycInfo({ status: 'NONE' })}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Resubmit Documents
                  </button>
                )}
              </div>
            </div>
          )}

          {(kycInfo.status === 'NONE' || kycInfo.status === 'rejected') && (
            <form onSubmit={handleSubmit}>

              {/* Aadhaar Section */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <IdCardIcon className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-semibold">Aadhaar Details</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={infoData.aadhaarNumber}
                      onChange={(e) => setInfoData({ ...infoData, aadhaarNumber: e.target.value })}
                      required
                      pattern="\d{12}"
                      placeholder="Enter 12-digit Aadhaar number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhaar Card Upload
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <input
                        type="file"
                        id="aadhaarImage"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setAadhaarImage)}
                        className="hidden"
                        required
                      />
                      <label
                        htmlFor="aadhaarImage"
                        className="flex-1 p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <UploadIcon className="w-8 h-8" />
                          <span className="font-medium">Upload Aadhaar Card</span>
                          <span className="text-sm">PNG, JPG up to 5MB</span>
                        </div>
                      </label>
                      {aadhaarImage && (
                        <img
                          src={URL.createObjectURL(aadhaarImage)}
                          alt="Aadhaar preview"
                          className="w-32 h-32 object-contain border rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* PAN Section */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCardIcon className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-semibold">PAN Details</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      value={infoData.panNumber}
                      onChange={(e) => setInfoData({ ...infoData, panNumber: e.target.value })}
                      name="panNumber"
                      required
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      placeholder="Enter PAN number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Card Upload
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <input
                        type="file"
                        id="panImage"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setPanImage)}
                        className="hidden"
                        required
                      />
                      <label
                        htmlFor="panImage"
                        className="flex-1 p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <UploadIcon className="w-8 h-8" />
                          <span className="font-medium">Upload PAN Card</span>
                          <span className="text-sm">PNG, JPG up to 5MB</span>
                        </div>
                      </label>
                      {panImage && (
                        <img
                          src={URL.createObjectURL(panImage)}
                          alt="PAN preview"
                          className="w-32 h-32 object-contain border rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-6">
                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2Icon className="w-5 h-5 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    'Submit Verification'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}