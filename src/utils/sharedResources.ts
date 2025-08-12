import {
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw,
} from "lucide-react"

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