"use client"
import { getOrdersByUser } from "@/store/orderSlice"
import { decodeToken } from "@/utils/decodeToken"
import { TOKEN } from "@/utils/enum"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    MapPin,
    Calendar,
    CreditCard,
    ChevronRight,
    Filter,
    Search,
    RefreshCw,
} from "lucide-react"
import { LoadingSpinnerWithOverlay } from "@/components/Loading"
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal"

export interface OrderItem {
    product_id: {
        _id: string;
        title: string;
        images: string[];
        category: string;
        sub_category: string;
    };
    quantity: number;
    wanted_to_sell: boolean;
    realSellingPrice?: number;
    sellingPrice?: number;
    discountOnSellingPrice?: number;
    rentalPricing?: Array<{
        day: number;
        realPrice: number;
        discount: number;
        discountPrice?: number;
    }>;
}

export interface Order {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
    user_id: string;
    order_items: OrderItem[];
    payment_status: 'paid' | 'unpaid';
    order_status: 'pending' | 'shipped' | 'delivered' | 'returned' | 'cancelled';
    shipping_amount: number;
    items_total: number;
    total_amount: number;
    createdAt: string;
    updatedAt: string;
}

export const ORDER_STATUSES = {
    pending: { color: 'orange', icon: Clock, label: 'Pending' },
    shipped: { color: 'blue', icon: Truck, label: 'Shipped' },
    delivered: { color: 'green', icon: CheckCircle, label: 'Delivered' },
    returned: { color: 'purple', icon: RefreshCw, label: 'Returned' },
    cancelled: { color: 'red', icon: XCircle, label: 'Cancelled' }
};

export const PAYMENT_STATUSES = {
    paid: { color: 'green', label: 'Paid' },
    unpaid: { color: 'red', label: 'Unpaid' }
};

function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [pagination, setPagination] = useState({ page: 1, limit: 10 })
    const [totalOrders, setTotalOrders] = useState({
        totalOrders: 0,
        totalPages: 0
    })

    const dispatch = useDispatch()
    const router = useRouter()

    async function fetchOrders(id: string) {
        setLoading(true)
        const data = {
            user_id: id,
            page: pagination.page,
            limit: pagination.limit
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await dispatch(getOrdersByUser(data as any) as any)
            if (response?.error) {
                toast.error(response.error.message)
            } else {
                setOrders(response.payload.orders)
                setTotalOrders({
                    totalOrders: response.payload.totalOrders,
                    totalPages: response.payload.totalPages
                })
            }
        } catch (error) {
            toast.error("Failed to fetch orders")
        } finally {
            setLoading(false)
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || order.order_status === statusFilter
        return matchesSearch && matchesStatus
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount)
    }

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
                fetchOrders(decodedToken.id)
            }
        }
    }, [pagination])

    if (loading) {
        return (
            <div className="w-full min-h-screen">
                <LoadingSpinnerWithOverlay />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            {/* Header */}
            <div className="sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                            <p className="text-sm text-gray-500">{totalOrders.totalOrders} total orders</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by order ID or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="returned">Returned</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Package size={48} className="text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
                        <p className="text-gray-500">You haven't placed any orders yet or no orders match your search.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <OrderCard
                                key={order._id}
                                order={order}
                                onViewDetails={setSelectedOrder}
                                formatDate={formatDate}
                                formatCurrency={formatCurrency}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalOrders.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="text-gray-600">
                            Page {pagination.page} of {totalOrders.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(totalOrders.totalPages, prev.page + 1) }))}
                            disabled={pagination.page === totalOrders.totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                />
            )}
        </div>
    )
}

const OrderCard = ({ order, onViewDetails, formatDate, formatCurrency }: {
    order: Order;
    onViewDetails: (order: Order) => void;
    formatDate: (date: string) => string;
    formatCurrency: (amount: number) => string;
}) => {
    const statusConfig = ORDER_STATUSES[order.order_status];
    const StatusIcon = statusConfig.icon;
    const paymentConfig = PAYMENT_STATUSES[order.payment_status];


    const getStatusColorClasses = (color: string) => {
        const colorMap = {
            orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', accent: 'bg-orange-500' },
            blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-500' },
            green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', accent: 'bg-green-500' },
            purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', accent: 'bg-purple-500' },
            red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: 'bg-red-500' }
        };
        return colorMap[color as keyof typeof colorMap] || colorMap.blue;
    };

    const statusColors = getStatusColorClasses(statusConfig.color);
    const paymentColors = getStatusColorClasses(paymentConfig.color);

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden">
            {/* Gradient Accent Bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${statusColors.accent}`}></div>

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-full transform translate-x-16 -translate-y-16"></div>
            </div>

            <div className="relative p-6 space-y-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                            <Package className="text-gray-600 group-hover:text-blue-600 transition-colors" size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                                #{order._id.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                <Calendar size={14} />
                                {formatDate(order.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                            ${statusColors.bg} ${statusColors.text} ${statusColors.border} hover:scale-105`}>
                            <StatusIcon size={14} />
                            {statusConfig.label}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                            ${paymentColors.bg} ${paymentColors.text} ${paymentColors.border} hover:scale-105`}>
                            <CreditCard size={14} />
                            {paymentConfig.label}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                {/* Items Preview Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {order.order_items.length} Items
                        </h4>
                        <button
                            onClick={() => onViewDetails(order)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            View all <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="flex gap-3 overflow-x-auto py-1 -mx-1 px-1">
                        {order.order_items.slice(0, 4).map((item, index) => (
                            <div key={index} className="flex-shrink-0 group/item relative">
                                <div className="relative overflow-hidden rounded-xl border-2 border-gray-100 group-hover/item:border-blue-200 transition-all duration-200 w-16 h-16">
                                    <img
                                        src={item.product_id.images[0] || '/placeholder-product.jpg'}
                                        alt={item.product_id.title}
                                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                                        }}
                                    />
                                </div>
                                {item.quantity > 1 && (
                                    <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                                        {item.quantity}
                                    </div>
                                )}
                            </div>
                        ))}
                        {order.order_items.length > 4 && (
                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200 border-dashed group-hover:border-blue-300 transition-colors">
                                <div className="text-center">
                                    <span className="text-sm font-bold text-gray-500">+{order.order_items.length - 4}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-medium">Delivery To</p>
                        <p className="text-sm font-medium text-gray-800 truncate">{order.city}, {order.state}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-medium">Total Amount</p>
                        <p className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            {formatCurrency(order.total_amount)}
                        </p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                    {/* Shipping Address */}
                    <div className="flex-1 flex items-start gap-3">
                        <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-green-50 transition-colors mt-0.5">
                            <MapPin size={16} className="text-gray-600 group-hover:text-green-600 transition-colors" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Shipping Address</p>
                            <p className="text-sm font-medium text-gray-800 line-clamp-2">
                                {order.address}, {order.city}, {order.state} - {order.pincode}
                            </p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => onViewDetails(order)}
                            className="relative overflow-hidden group/btn flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto"
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                            <span>View Details</span>
                            <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>
        </div>
    );
};




export default OrdersPage
