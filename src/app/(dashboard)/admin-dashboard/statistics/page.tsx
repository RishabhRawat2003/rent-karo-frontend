import { DollarSign, Users, Package, CalendarDays, ShoppingCart, Clock, ArrowUpRight, Building2, ListChecks } from 'lucide-react';

export default function StatisticsPage() {
  // Mock data
  const stats = {
    totalTransactions: 1245,
    activeRentals: 287,
    completedPurchases: 564,
    pendingRentals: 43,
    totalRevenue: 45230,
    averageRentalDuration: 5.2,
    userStats: {
      totalUsers: 1237,
      organizations: 345,
      individualUsers: 892,
    },
    inventoryStats: {
      totalListings: 1567,
      availableNow: 843,
      categories: 28,
    },
    orders: {
      totalOrders: 1892,
      pending: 56,
      completed: 1673,
    },
    recentOrders: [
      { id: 1, type: 'rental', item: 'Camera Equipment', status: 'completed', time: '2h ago' },
      { id: 2, type: 'purchase', item: 'Camping Gear', status: 'pending', time: '4h ago' },
      { id: 3, type: 'rental', item: 'Party Tent', status: 'active', time: '6h ago' },
      { id: 4, type: 'purchase', item: 'Hiking Boots', status: 'completed', time: '8h ago' },
    ]
  };

  return (
    <div className="w-full min-h-screen p-8 pt-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Marketplace Dashboard
            </h1>
            <p className="text-gray-500 mt-2">Comprehensive overview of marketplace operations</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100/50 rounded-xl">
                <ListChecks className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Total Orders</h3>
                <p className="text-2xl font-bold">{stats.orders.totalOrders}</p>
                <div className="text-sm text-gray-500 flex gap-2 mt-1">
                  <span className="text-green-600">{stats.orders.completed} completed</span>
                  <span className="text-orange-600">{stats.orders.pending} pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Statistics */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100/50 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Total Users</h3>
                <p className="text-2xl font-bold">{stats.userStats.totalUsers}</p>
                <div className="text-sm text-gray-500 flex gap-2 mt-1">
                  <span>{stats.userStats.individualUsers} individuals</span>
                  <span>•</span>
                  <span>{stats.userStats.organizations} organizations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Overview */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100/50 rounded-xl">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Listings</h3>
                <p className="text-2xl font-bold">{stats.inventoryStats.totalListings}</p>
                <div className="text-sm text-gray-500 mt-1">
                  {stats.inventoryStats.availableNow} available now
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-100/50 rounded-xl">
                <DollarSign className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Total Revenue</h3>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  12.5% vs last month
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Rental/Purchase Breakdown */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                Transaction Breakdown
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600">Active Rentals</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.activeRentals}</p>
                  <div className="mt-2 text-xs text-blue-500 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    15 new today
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-gray-600">Completed Purchases</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedPurchases}</p>
                </div>
                <div className="col-span-2 p-4 bg-orange-50 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Pending Approvals</p>
                      <p className="text-xl font-bold">{stats.pendingRentals}</p>
                    </div>
                    <button className="px-3 py-1.5 text-sm bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50">
                      Manage Orders
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizations Overview */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-500" />
                Business Partners
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex-1 p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-gray-600">Total Organizations</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.userStats.organizations}
                  </p>
                </div>
                <div className="flex-1 p-4 bg-cyan-50 rounded-xl">
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {stats.inventoryStats.availableNow}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-500" />
                Recent Orders
              </h2>
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        order.type === 'rental' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {order.type === 'rental' ? (
                          <CalendarDays className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{order.item}</p>
                        <p className="text-sm text-gray-500 capitalize">{order.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        order.status === 'completed' ? 'text-green-600' : 
                        order.status === 'pending' ? 'text-orange-600' : 'text-blue-600'
                      }`}>
                        {order.status}
                      </p>
                      <p className="text-xs text-gray-400">{order.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Listing Statistics */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-500" />
                Inventory Overview
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-cyan-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">Total Listings</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {stats.inventoryStats.totalListings}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">Available Now</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.inventoryStats.availableNow}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.inventoryStats.categories}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}