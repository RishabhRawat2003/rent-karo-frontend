"use client"
import { getSingleProduct } from "@/store/productSlice";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";
import { LoadingSpinnerWithOverlay } from "@/components/Loading";
import { FaCheckCircle, FaShoppingCart, FaPlus, FaMinus, FaCalendarAlt, FaStar, FaHeart, FaShareAlt } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { getInitials } from "@/utils/GetInitials";
import RelatedProducts from "@/components/product/RelatedProducts";
import { createReview, getAllReviews, removeSingleReview } from "@/store/reviewSlice";
import { decodeToken } from "@/utils/decodeToken";
import { TOKEN } from "@/utils/enum";
import { convertUTCtoIST2 } from "@/utils/timeConvertor";
import CommonModal from "@/components/popup/CommonModal";
import { addToCart } from "@/store/cartSlice";


interface RentalPricing {
    day: number;
    discount: number;
    discountPrice: number;
    realPrice: number;
    _id: string;
}

interface Organisation {
    _id: string;
    name: string;
    images: string[];
    is_verified: boolean;
}

interface SpecificationItem {
    key: string;
    value: string;
    _id: string;
}

interface SpecificationGroup {
    title: string;
    data: SpecificationItem[];
    _id: string;
}

interface Review {
    _id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        _id: string;
        fullName: string;
        profilePicture: string;
    }
}

export interface Product {
    _id: string;
    title: string;
    subTitle: string;
    description: string;
    category: string;
    sub_category: string;
    wanted_to_sell: boolean;
    images: string[];
    rentalPricing: RentalPricing[];
    stocks: number;
    organisationId: Organisation;
    specifications: SpecificationGroup[];
    createdAt: string;
    updatedAt: string;
    rating: number;
    reviews: number;
}

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [singleProduct, setSingleProduct] = useState<Product | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedRentalOption, setSelectedRentalOption] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
    const [userReview, setUserReview] = useState({
        rating: 0,
        comment: ""
    });
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loggedInUser, setLoggedInUser] = useState('');
    const [deleteReviewId, setDeleteReviewId] = useState('');
    const dispatch = useDispatch();
    const { id } = useParams();
    const router = useRouter()

    const increaseQty = () => {
        toast.dismiss()
        if (!singleProduct) return
        if (quantity >= singleProduct?.stocks) {
            toast.error('Quantity is more than available stocks');
            return
        }
        setQuantity(prev => prev + 1);
    }
    const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    async function getReviews() {
        setLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(getAllReviews(id as any) as any);
            if (response?.error) {
                console.error(response.error);
            } else {
                setReviews(response.payload.reviews);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to load reviews');
        }
        setLoading(false)
    }

    async function createReviews(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const token = JSON.parse(localStorage.getItem(TOKEN) as string);
        if (!token) {
            toast.error('You are not logged in');
            router.push('/pages/login')
            return
        }
        const decodedToken = decodeToken(token)
        if (decodedToken.role === 'renter') {
            toast.error('You are not allowed to create a review');
            return
        }

        if (userReview.rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        if (userReview.comment.trim() === "") {
            toast.error("Please write a review");
            return;
        }

        try {
            const data = {
                product: id,
                user: decodedToken.id,
                rating: userReview.rating,
                comment: userReview.comment
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(createReview(data as any) as any);
            if (response?.error) {
                console.log(response.error);
            } else {
                setUserReview({
                    rating: 0,
                    comment: ""
                })
                toast.success('Review created successfully!');
                getReviews();
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to load reviews');
        }
        setLoading(false)
    }

    const handleAddToCart = () => {
        toast.dismiss();
        const data = {
            _id: id,
            title: singleProduct?.title,
            subTitle: singleProduct?.subTitle,
            category: singleProduct?.category,
            sub_category: singleProduct?.sub_category,
            images: singleProduct?.images,
            stocks: singleProduct?.stocks,
            rentalPricing: singleProduct?.rentalPricing,
            wanted_to_sell: singleProduct?.wanted_to_sell,
            quantity,
        }
        dispatch(addToCart(data))
        setQuantity(1)
        toast.success('Product added to cart successfully!');
    };

    async function handleDeleteReview() {
        setLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(removeSingleReview(deleteReviewId as any) as any);
            if (response?.error) {
                toast.error(response.error.message);
            } else {
                toast.success('Review deleted successfully!');
                setDeleteReviewId('');
                getReviews();
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete review');
        }
        setLoading(false);
    }

    async function getProduct() {
        setLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(getSingleProduct(id as any) as any);
            if (response?.error) {
                toast.error(response.error.message);
            } else {
                setSingleProduct(response.payload.product);
                // Set the first rental option as selected by default
                if (response.payload.product?.rentalPricing?.length > 0) {
                    setSelectedRentalOption(response.payload.product.rentalPricing[0]._id);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to load product');
        }
        setLoading(false);
    }

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem(TOKEN) as string);
        if (token) {
            const decodedToken = decodeToken(token);
            setLoggedInUser(decodedToken.id);
        }
        if (id) {
            getProduct()
            getReviews()
        }
    }, [id]);

    const handlePrevImage = () => {
        setCurrentImageIndex(prev =>
            prev === 0 ? (singleProduct?.images.length || 1) - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prev =>
            prev === (singleProduct?.images.length || 1) - 1 ? 0 : prev + 1
        );
    };

    if (loading) {
        return (
            <div className="w-full h-screen">
                <LoadingSpinnerWithOverlay />
            </div>
        )
    }

    if (!singleProduct) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-xl">Product not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        <li className="hover:text-blue-600 transition-colors">
                            Home
                        </li>
                        <li className="mx-1">/</li>
                        <li className="hover:text-blue-600 transition-colors">
                            {singleProduct?.category}
                        </li>
                        <li className="mx-1">/</li>
                        <li className="text-gray-900 font-medium truncate max-w-xs">
                            {singleProduct?.title}
                        </li>
                    </ol>
                </nav>

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Image Gallery */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                {singleProduct?.images?.length > 0 ? (
                                    <>
                                        <Image
                                            src={singleProduct?.images[currentImageIndex]}
                                            alt={singleProduct?.title}
                                            fill
                                            className="object-contain transition-opacity duration-300"
                                            sizes="(max-width: 1024px) 100vw, 70vw"
                                            priority
                                        />
                                        <button
                                            onClick={handlePrevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                                            aria-label="Previous image"
                                        >
                                            <IoIosArrowBack className="text-gray-800 text-xl" />
                                        </button>
                                        <button
                                            onClick={handleNextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                                            aria-label="Next image"
                                        >
                                            <IoIosArrowForward className="text-gray-800 text-xl" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-gray-700">Product images</h3>
                                    <span className="text-xs text-gray-500">{currentImageIndex + 1} of {singleProduct?.images?.length || 0}</span>
                                </div>

                                <div className="flex gap-3 overflow-x-auto pb-2 p-5 scrollbar-hide">
                                    {singleProduct?.images?.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 aspect-square rounded-lg overflow-hidden transition-all duration-200 ${currentImageIndex === index
                                                ? "ring-2 ring-blue-500 scale-105"
                                                : "ring-1 ring-gray-200 hover:ring-blue-300"
                                                }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                width={80}
                                                height={80}
                                                className="object-cover w-full h-full"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="inline-block bg-blue-50 capitalize text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
                                            {singleProduct?.category}
                                        </span>
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-1">
                                            {singleProduct?.title}
                                        </h1>
                                        <h2 className="text-lg text-gray-600 font-light mb-4">
                                            {singleProduct?.subTitle}
                                        </h2>

                                        {/* Rating */}
                                        <div className="flex items-center mb-4">
                                            <div className="flex items-center">
                                                {(() => {
                                                    // Calculate average rating from reviews array
                                                    const averageRating = reviews?.length > 0
                                                        ? reviews?.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                                                        : 0;

                                                    // Round to nearest 0.5 for half-star display
                                                    const displayRating = Math.round(averageRating * 2) / 2;

                                                    return [...Array(5)].map((_, i) => {
                                                        const isFullStar = i < Math.floor(displayRating);
                                                        const isHalfStar = i === Math.floor(displayRating) && displayRating % 1 === 0.5;

                                                        return (
                                                            <FaStar
                                                                key={i}
                                                                className={`text-sm ${isFullStar || isHalfStar
                                                                    ? "text-yellow-400 fill-current"
                                                                    : "text-gray-300"
                                                                    }`}
                                                            />
                                                        );
                                                    });
                                                })()}

                                            </div>
                                            <span className="ml-2 text-sm text-gray-600">
                                                {reviews.length} reviews
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setIsFavorite(!isFavorite)}
                                            className={`p-2 rounded-full transition-colors ${isFavorite
                                                ? "text-red-500 bg-red-50"
                                                : "text-gray-500 hover:bg-gray-100"
                                                }`}
                                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                        >
                                            <FaHeart className={isFavorite ? "fill-current" : ""} />
                                        </button>
                                        <button
                                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                                            aria-label="Share product"
                                        >
                                            <FaShareAlt />
                                        </button>
                                    </div>
                                </div>

                                {/* Organization Info */}
                                <div className="flex items-center mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex-shrink-0 mr-3">
                                        {singleProduct?.organisationId?.images.length > 0
                                            ? <Image
                                                src={singleProduct?.organisationId?.images[0]}
                                                alt="Organisation Logo"
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 object-cover rounded-full"
                                            />
                                            : <div className="bg-gray-200 border-2 border-dashed flex items-center justify-center text-xl font-bold rounded-xl w-10 h-10" >
                                                {getInitials(singleProduct?.organisationId?.name || '')}
                                            </div>
                                        }

                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {singleProduct?.organisationId?.name}
                                        </p>
                                        <div className="flex items-center">
                                            {singleProduct?.organisationId?.is_verified && (
                                                <span className="flex items-center text-xs text-green-600 font-medium">
                                                    <FaCheckCircle className="mr-1" />
                                                    Verified Seller
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Rental Options */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaCalendarAlt className="mr-2 text-blue-500" />
                                        Rental Options
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {singleProduct?.rentalPricing?.map((option) => (
                                            <button
                                                key={option._id}
                                                onClick={() => setSelectedRentalOption(option._id)}
                                                className={`border rounded-lg p-4 text-left transition-all ${selectedRentalOption === option._id
                                                    ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50"
                                                    : "border-gray-200 hover:border-blue-300"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className="font-medium text-gray-900">
                                                            {option.day} Day{option.day > 1 ? 's' : ''}
                                                        </span>
                                                        {option.discount > 0 && (
                                                            <span className="block text-xs text-green-600 font-medium mt-1">
                                                                Save {option.discount}%
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-lg font-bold text-blue-600">
                                                            ₹{option.discountPrice.toLocaleString()}
                                                        </span>
                                                        {option.discount > 0 && (
                                                            <span className="block text-xs text-gray-500 line-through">
                                                                ₹{option.realPrice.toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Stock Status */}
                                <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className={`text-base font-medium flex items-center ${singleProduct?.stocks > 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {singleProduct?.stocks > 0
                                            ? <><FaCheckCircle className="mr-2" /> In Stock</>
                                            : 'Out of Stock'}
                                    </span>
                                    <span className="text-sm select-none text-gray-600">
                                        {singleProduct?.stocks} available
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row xl:gap-0">
                                    <button
                                        disabled={singleProduct?.stocks <= 0}
                                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${singleProduct?.stocks > 0
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        <FaShoppingCart className="mr-2" />
                                        {singleProduct?.wanted_to_sell ? 'Buy Now' : 'Rent Now'}
                                    </button>
                                    <div className="flex flex-col items-center gap-2 space-x-3 sm:flex-row lg:flex-col xl:flex-row xl:gap-0">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-center border rounded-lg px-3 py-2">
                                            <button
                                                onClick={decreaseQty}
                                                className="text-gray-700 hover:text-black"
                                                disabled={quantity <= 1}
                                            >
                                                <FaMinus />
                                            </button>
                                            <span className="px-4">{quantity}</span>
                                            <button
                                                onClick={increaseQty}
                                                className="text-gray-700 hover:text-black"
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button
                                            disabled={singleProduct?.stocks <= 0}
                                            onClick={handleAddToCart}
                                            className={`flex-1 px-4 w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${singleProduct?.stocks > 0
                                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            <FaShoppingCart className="mr-2" />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description and Specs */}
                <div className="mt-8">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`py-3 px-1 border-b-2 text-sm font-medium ${activeTab === 'description'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setActiveTab('specifications')}
                                className={`py-3 px-1 border-b-2 text-sm font-medium ${activeTab === 'specifications'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Specifications
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`py-3 px-1 border-b-2 text-sm font-medium ${activeTab === 'reviews'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Reviews ({reviews.length})
                            </button>
                        </nav>
                    </div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            {/* Description Tab */}
                            {activeTab === 'description' && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                                        Product Overview
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        {singleProduct?.description || "No description available."}
                                    </p>
                                </div>
                            )}

                            {/* Specifications Tab */}
                            {activeTab === 'specifications' && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                                        Specifications
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {singleProduct?.specifications?.map((group) => (
                                            <div key={group._id} className="border border-gray-100 rounded-lg p-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                    {group.title}
                                                </h3>
                                                <div className="space-y-2">
                                                    {group?.data?.map((item) => (
                                                        <div key={item._id} className="flex justify-between py-1.5">
                                                            <span className="text-gray-600">
                                                                {item.key}
                                                            </span>
                                                            <span className="text-gray-900 font-medium">
                                                                {item.value}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reviews Tab */}
                            {activeTab === 'reviews' && (
                                <div>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                                Customer Reviews
                                            </h2>
                                            <div className="flex items-center">
                                                <div className="flex text-yellow-400 mr-2">
                                                    {(() => {
                                                        // Calculate average rating from reviews array
                                                        const averageRating = reviews?.length > 0
                                                            ? reviews?.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                                                            : 0;

                                                        // Round to nearest 0.5 for half-star display
                                                        const displayRating = Math.round(averageRating * 2) / 2;

                                                        return [...Array(5)].map((_, i) => {
                                                            const isFullStar = i < Math.floor(displayRating);
                                                            const isHalfStar = i === Math.floor(displayRating) && displayRating % 1 === 0.5;

                                                            return (
                                                                <FaStar
                                                                    key={i}
                                                                    className={`text-sm ${isFullStar || isHalfStar
                                                                        ? "text-yellow-400 fill-current"
                                                                        : "text-gray-300"
                                                                        }`}
                                                                />
                                                            );
                                                        });
                                                    })()}
                                                </div>
                                                <span className="text-gray-500 ml-2">({reviews.length} reviews)</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 md:mt-0">
                                            <button
                                                onClick={() => {
                                                    document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" });
                                                }}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                            >
                                                Write a Review
                                            </button>
                                        </div>
                                    </div>

                                    {
                                        deleteReviewId && <CommonModal isOpen={deleteReviewId !== ""} closeModal={() => setDeleteReviewId("")} type="warning" onCancel={() => setDeleteReviewId("")} title="Delete Review" description="Are you sure you want to delete this review?" onAccept={handleDeleteReview} />
                                    }

                                    {/* Reviews List */}
                                    <div className="space-y-6">
                                        {reviews.map(review => (
                                            <div key={review?._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mr-4">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            {
                                                                review?.user?.profilePicture
                                                                    ? <Image src={review?.user?.profilePicture} alt={review?.user?.fullName} width={100} height={100} className="w-10 h-10 rounded-full" />
                                                                    : <span className="font-semibold">{getInitials(review?.user?.fullName)}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                            <h4 className="font-medium text-gray-900">{review?.user?.fullName}</h4>
                                                            <div className="flex items-center mt-1 md:mt-0">
                                                                <div className="flex text-yellow-400">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <FaStar
                                                                            key={i}
                                                                            className={`text-sm ${i < review?.rating
                                                                                ? "fill-current"
                                                                                : "text-gray-300"
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="text-xs text-gray-500 ml-2">{convertUTCtoIST2(review?.createdAt)}</span>
                                                                {
                                                                    loggedInUser === review?.user?._id && <span onClick={() => setDeleteReviewId(review?._id)}><MdDeleteOutline size={20} className="text-red-600 ml-2 cursor-pointer" /></span>
                                                                }
                                                            </div>
                                                        </div>
                                                        <p className="mt-2 text-gray-700">{review.comment}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Review Form */}
                                    <div id="review-form" className="mt-12 pt-6 border-t border-gray-200">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                                        <form onSubmit={createReviews}>
                                            <div className="mb-6">
                                                <label className="block text-gray-700 font-medium mb-2">
                                                    Your Rating
                                                </label>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setUserReview({ ...userReview, rating: star })}
                                                            className="mr-1 focus:outline-none"
                                                        >
                                                            <FaStar
                                                                className={`text-2xl ${star <= userReview.rating
                                                                    ? "text-yellow-400 fill-current"
                                                                    : "text-gray-300"
                                                                    }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
                                                    Your Review
                                                </label>
                                                <textarea
                                                    id="comment"
                                                    value={userReview.comment}
                                                    onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                                                    rows={4}
                                                    className="w-full px-4 py-3 resize-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Share your experience with this product..."
                                                ></textarea>
                                            </div>

                                            <button
                                                type="submit"
                                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                            >
                                                Submit Review
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <RelatedProducts category={singleProduct?.category} />
            </div>
        </div>
    );
}