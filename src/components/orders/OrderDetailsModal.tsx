"use client"
import { Order } from "@/app/pages/account/orders/page";
import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    MapPin,
    Phone,
    Mail,
    Calendar,
    CreditCard,
    Download,
    RefreshCw,
    ShoppingCart,
    MessageCircle,
    X,
    Check,
    Receipt,
    ShoppingBag
} from "lucide-react"
import { useState } from "react";
import { ContactSupportModal } from "./ContactSupportModal";
import Image from "next/image";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/utils/sharedResources";


export const OrderDetailsModal = ({ order, onClose, formatDate, formatCurrency }: {
    order: Order;
    onClose: () => void;
    formatDate: (date: string) => string;
    formatCurrency: (amount: number) => string;
}) => {
    const [showSupportModal, setShowSupportModal] = useState(false);
    const statusConfig = ORDER_STATUSES[order.order_status];
    const paymentConfig = PAYMENT_STATUSES[order.payment_status];

    // Color mapping for consistent UI
    const statusColors = {
        orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
        green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
        red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
    };

    const statusColor = statusColors[statusConfig.color as keyof typeof statusColors] || statusColors.blue;
    const paymentColor = statusColors[paymentConfig.color as keyof typeof statusColors] || statusColors.blue;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                <Package className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Order #{order._id.slice(-8).toUpperCase()}
                                </h2>
                                <p className="text-gray-500 flex items-center gap-2 mt-1">
                                    <Calendar size={16} />
                                    Placed on {formatDate(order.createdAt)}
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

                <div className="p-6 space-y-8">
                    {/* Status Summary Bar */}
                    <div className="flex flex-wrap gap-4">
                        <div className={`flex-1 min-w-[250px] border rounded-xl p-4 flex items-center gap-4 ${statusColor.border} ${statusColor.bg}`}>
                            <div className="bg-white p-2.5 rounded-lg shadow-sm">
                                <Package className={statusColor.text} size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Order Status</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-3 h-3 rounded-full ${statusColor.bg} ${statusColor.text}`}></div>
                                    <p className={`font-medium ${statusColor.text}`}>{statusConfig.label}</p>
                                </div>
                            </div>
                        </div>

                        <div className={`flex-1 min-w-[250px] border rounded-xl p-4 flex items-center gap-4 ${paymentColor.border} ${paymentColor.bg}`}>
                            <div className="bg-white p-2.5 rounded-lg shadow-sm">
                                <CreditCard className={paymentColor.text} size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment Status</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-3 h-3 rounded-full ${paymentColor.bg} ${paymentColor.text}`}></div>
                                    <p className={`font-medium ${paymentColor.text}`}>{paymentConfig.label}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="bg-gray-50 rounded-xl p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock size={20} className="text-gray-600" />
                            Order Timeline
                        </h3>
                        <div className="relative pl-8 border-l-2 border-gray-200 space-y-6">
                            <div className="relative">
                                <div className="absolute -left-11 top-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                    <Check className="text-white" size={16} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Order Placed</h4>
                                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                </div>
                            </div>

                            {order.order_status === 'pending' && (
                                <div className="relative">
                                    <div className="absolute -left-11 top-0 w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                                        <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Processing</h4>
                                        <p className="text-sm text-gray-500">Your order is being prepared</p>
                                    </div>
                                </div>
                            )}

                            {['shipped', 'delivered', 'returned', 'cancelled'].includes(order.order_status) && (
                                <div className="relative">
                                    <div className="absolute -left-11 top-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                        <Check className="text-white" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Order Processed</h4>
                                        <p className="text-sm text-gray-500">{formatDate(new Date(Date.now() - 86400000).toISOString())}</p>
                                    </div>
                                </div>
                            )}

                            {['shipped', 'delivered', 'returned'].includes(order.order_status) && (
                                <div className="relative">
                                    <div className={`absolute -left-11 top-0 w-6 h-6 rounded-full ${order.order_status === 'shipped' ? 'bg-blue-600' : 'bg-green-500'
                                        } flex items-center justify-center`}>
                                        <Truck className="text-white" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Shipped</h4>
                                        <p className="text-sm text-gray-500">Your order is on the way</p>
                                        {order.order_status === 'shipped' && (
                                            <p className="mt-1 text-sm text-blue-600 font-medium">
                                                Estimated delivery: {formatDate(new Date(Date.now() + 172800000).toISOString())}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {['delivered', 'returned'].includes(order.order_status) && (
                                <div className="relative">
                                    <div className={`absolute -left-11 top-0 w-6 h-6 rounded-full ${order.order_status === 'delivered' ? 'bg-green-500' : 'bg-purple-500'
                                        } flex items-center justify-center`}>
                                        <CheckCircle className="text-white" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Delivered</h4>
                                        <p className="text-sm text-gray-500">Your order has been delivered</p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {formatDate(new Date(Date.now() - 432000000).toISOString())}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {order.order_status === 'returned' && (
                                <div className="relative">
                                    <div className="absolute -left-11 top-0 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                        <RefreshCw className="text-white" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Returned</h4>
                                        <p className="text-sm text-gray-500">Your return has been processed</p>
                                    </div>
                                </div>
                            )}

                            {order.order_status === 'cancelled' && (
                                <div className="relative">
                                    <div className="absolute -left-11 top-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                                        <XCircle className="text-white" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Cancelled</h4>
                                        <p className="text-sm text-gray-500">Your order has been cancelled</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary & Shipping */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Order Summary */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Receipt size={20} className="text-blue-600" />
                                Order Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Items ({order.order_items.length})</span>
                                    <span className="font-medium">{formatCurrency(order.items_total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {order.shipping_amount === 0 ? (
                                            <span className="text-green-600 font-semibold">FREE</span>
                                        ) : (
                                            formatCurrency(order.shipping_amount)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-blue-200 pt-3 mt-2">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-xl text-blue-600">
                                        {formatCurrency(order.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-gray-600" />
                                Shipping Address
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-900">{order.name}</p>
                                    <p className="text-gray-600 mt-1">{order.address}</p>
                                    <p className="text-gray-600">{order.city}, {order.state} - {order.pincode}</p>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Phone size={16} className="text-gray-600" />
                                        </div>
                                        <span className="text-gray-700">{order.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Mail size={16} className="text-gray-600" />
                                        </div>
                                        <span className="text-gray-700">{order.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center gap-2">
                            <ShoppingBag size={20} />
                            Order Items ({order.order_items.length})
                        </h3>
                        <div className="space-y-4">
                            {order.order_items.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                                    <div className="flex-shrink-0">
                                        <div className="relative">
                                            <Image
                                                src={item.product_id.images[0] || '/placeholder-product.jpg'}
                                                alt={item.product_id.title}
                                                width={100}
                                                height={100}
                                                className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                                                }}
                                            />
                                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg transform -translate-y-1/2 translate-x-1/2">
                                                {item.quantity}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 text-lg">
                                                    {item.product_id.title}
                                                </h4>
                                                <p className="text-sm text-gray-500 mb-2">
                                                    {item.product_id.category} • {item.product_id.sub_category}
                                                </p>
                                            </div>
                                            <div className="sm:text-right">
                                                <p className="font-semibold text-lg">
                                                    {item.wanted_to_sell
                                                        ? formatCurrency(item.sellingPrice || 0)
                                                        : formatCurrency((item.rentalPricing?.[0]?.discountPrice || item.rentalPricing?.[0]?.realPrice || 0) * item.quantity)}
                                                </p>
                                                {item.wanted_to_sell && item.discountOnSellingPrice && (
                                                    <p className="text-sm text-gray-500 line-through">
                                                        {formatCurrency(item.realSellingPrice || 0)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {item.wanted_to_sell ? (
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                                                    <ShoppingCart size={14} />
                                                    <span>Purchase</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>Rental</span>
                                                </div>
                                                {item.rentalPricing && item.rentalPricing.length > 0 && (
                                                    <div className="text-gray-600">
                                                        {item.rentalPricing[0].day} day{item.rentalPricing[0].day > 1 ? 's' : ''}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {
                        showSupportModal && <ContactSupportModal order={order} onClose={() => setShowSupportModal(false)} />
                    }

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                        {order.order_status === 'pending' && (
                            <button
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl font-medium transition-colors"
                            >
                                <XCircle size={18} />
                                Cancel Order
                            </button>
                        )}
                        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors">
                            <Download size={18} />
                            Download Invoice
                        </button>
                        <button onClick={() => setShowSupportModal(true)} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
                            <MessageCircle size={18} />
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};