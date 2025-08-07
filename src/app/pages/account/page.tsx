"use client";
import { LoadingSpinnerWithOverlay } from '@/components/Loading';
import CommonModal from '@/components/popup/CommonModal';
import { userDetails } from '@/store/userSlice';
import { decodeToken } from '@/utils/decodeToken';
import { TOKEN } from '@/utils/enum';
import { convertUTCtoIST2 } from '@/utils/timeConvertor';
import {
    ShoppingCart, Heart, FileText, HelpCircle, LogOut, AlertCircle, Wallet, Package, Building, LayoutGrid,
    Edit, BarChart, ShoppingBag, PackageX, Sofa, FileBarChart
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
    stats: {
        totalOrders: number;
        totalWishlist: number;
        activeRentals: number;
    }
}

export default function DashboardPage() {
    const [logoutModal, setLogoutModal] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter()
    const dispatch = useDispatch()

    function handleLogout() {
        toast.success("Logged out successfully")
        localStorage.removeItem(TOKEN)
        router.push("/")
    }

    async function getUserDetails() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await dispatch(userDetails() as any)
        if (response?.error) {
            toast.error(response.error.message)
        } else {
            setUser(response.payload.user)
            setIsLoading(false)
        }
    }

    function handleRoute(route: string) {
        router.push(route)

    }

    const renterItems = [
        { id: 1, name: "My Listings", icon: <LayoutGrid size={24} />, onClick: () => handleRoute("/pages/account/my-listing") },
        { id: 2, name: "Create Organization", icon: <Building size={24} />, onClick: () => handleRoute("/pages/account/organisation") },
        { id: 4, name: "Statistics", icon: <BarChart size={24} />, onClick: () => alert("Statistics") },
        { id: 5, name: "KYC Verification", icon: <AlertCircle size={24} />, onClick: () => handleRoute("/pages/account/kyc") },
        { id: 7, name: "Orders", icon: <ShoppingBag size={24} />, onClick: () => alert("Orders") },
        { id: 8, name: "Invoices", icon: <FileText size={24} />, onClick: () => alert("Invoices") },
        { id: 9, name: "Sold Out Items", icon: <PackageX size={24} />, onClick: () => alert("Sold Out Items") },
        { id: 10, name: "Rental Items", icon: <Sofa size={24} />, onClick: () => alert("Rental Items") },
        { id: 11, name: "Reports", icon: <FileBarChart size={24} />, onClick: () => alert("Reports") },
        { id: 6, name: "Help & Support", icon: <HelpCircle size={24} />, onClick: () => alert("Help & Support") },
    ];

    const buyerItems = [
        { id: 1, name: "Browse Rentals", icon: <LayoutGrid size={24} />, onClick: () => alert("Browse Rentals") },
        { id: 3, name: "My Orders", icon: <ShoppingCart size={24} />, onClick: () => alert("My Orders") },
        { id: 4, name: "Wishlist", icon: <Heart size={24} />, onClick: () => alert("Wishlist") },
        { id: 5, name: "Invoices", icon: <FileText size={24} />, onClick: () => alert("Invoices") },
        { id: 8, name: "KYC Verification", icon: <AlertCircle size={24} />, onClick: () => handleRoute("/pages/account/kyc") },
        { id: 6, name: "Payments", icon: <Wallet size={24} />, onClick: () => alert("Payments") },
        { id: 7, name: "Help & Support", icon: <HelpCircle size={24} />, onClick: () => alert("Help & Support") },
    ];

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem(TOKEN) || '{}');
        if (!token) {
            toast.error("Please login first")
            router.push("/")
        } else {
            const decodedToken = decodeToken(token);
            if (decodedToken?.role !== "renter" && decodedToken?.role !== "buyer") {
                toast.error("Please login first")
                router.push("/")
            } else {
                getUserDetails()
            }
        }
    }, [])

    if (isLoading) {
        return (
            <div className='w-full h-screen'>
                <LoadingSpinnerWithOverlay />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 mt-14">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-16 h-16 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                                {user?.fullName?.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border-2 border-white">
                            <div className={`w-6 h-6 ${user?.role === 'renter' ? 'bg-purple-400' : 'bg-green-400'} rounded-full flex items-center justify-center`}>
                                {user?.role === 'renter' ? (
                                    <Building size={12} className="text-white" />
                                ) : (
                                    <span className="text-xs text-white">✓</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-1">{user?.fullName}</h1>
                                <p className="text-gray-600 font-medium">{user?.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => alert("Edit Profile")}
                                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                >
                                    <Edit size={16} />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => alert("Raise Complaint")}
                                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                >
                                    <AlertCircle size={16} />
                                    <span>Complaint</span>
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Joined {convertUTCtoIST2(user?.createdAt as string)}</p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {user?.role === 'buyer' && (
                        <>
                            <StatCard
                                icon={<ShoppingCart className="text-blue-600" size={20} />}
                                label="Total Orders"
                                value={user?.stats?.totalOrders || 0}
                                color="blue"
                            />
                            <StatCard
                                icon={<Heart className="text-red-600" size={20} />}
                                label="Wishlist Items"
                                value={user?.stats?.totalWishlist || 0}
                                color="red"
                            />
                            <StatCard
                                icon={<Package className="text-green-600" size={20} />}
                                label="Active Rentals"
                                value={user?.stats?.activeRentals || 0}
                                color="green"
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Dashboard Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(user?.role === 'renter' ? renterItems : buyerItems).map((item) => (
                    <button
                        key={item.id}
                        onClick={item.onClick}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all 
                     flex flex-col items-center gap-3 group border border-gray-100
                     hover:border-blue-100"
                    >
                        <span className="text-blue-600 group-hover:text-blue-700 transition-colors">
                            {item.icon}
                        </span>
                        <span className="text-gray-700 font-medium group-hover:text-gray-900">
                            {item.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Logout Button */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={() => setLogoutModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 
                   rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>

            {
                logoutModal && (
                    <CommonModal
                        isOpen={logoutModal}
                        closeModal={() => setLogoutModal(false)}
                        title="Logout"
                        description="Are you sure you want to logout?"
                        onAccept={() => handleLogout()}
                        onCancel={() => setLogoutModal(false)}
                        type="warning"
                        acceptButtonText="Logout"
                        cancelButtonText="Cancel"
                    />)
            }

        </div>
    );
}

const StatCard = ({ icon, label, value, color }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
}) => (
    <div className={`bg-${color}-50 p-4 rounded-xl flex items-center gap-4`}>
        <div className={`bg-${color}-100 p-2 rounded-lg`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);