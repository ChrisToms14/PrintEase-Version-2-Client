import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, Clock, FileText, CreditCard, BarChart3, Package, CheckCircle, AlertCircle, Calendar, User, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { user } = useAuth();
  interface Order {
  id: string;
  status: string;
  totalCost: number;
  estimatedPages: number;
  copies: number;
  createdAt: any;
  fileUrls?: string[];
}
const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    inProgress: 0,
    completed: 0,
    totalSpent: 0,
    totalPages: 0
  });

  React.useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.personalEmail) return;
      const q = query(collection(db, 'orders'), where('userId', '==', user.personalEmail));
      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(fetchedOrders as Order[]);

      const totalOrders = fetchedOrders.length;
      const inProgress = fetchedOrders.filter(o => (o as any).status === 'pending' || (o as any).status === 'Processing').length;
      const completed = fetchedOrders.filter(o => (o as any).status === 'Completed').length;
      const totalSpent = fetchedOrders.reduce((sum, o: any) => sum + ((o as Order).totalCost || 0), 0);
      const totalPages = fetchedOrders.reduce((sum, o: any) => sum + ((o.estimatedPages * o.copies) || 0), 0);
      setStats({ totalOrders, inProgress, completed, totalSpent, totalPages });
    };
    fetchOrders();
  }, [user]);

  // Filter orders based on date range and status
  const filteredOrders = orders.filter(order => {
    const orderDate = order.createdAt ? new Date(order.createdAt.toDate()) : new Date();
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    
    const dateMatch = (!fromDate || orderDate >= fromDate) && (!toDate || orderDate <= toDate);
    const statusMatch = !statusFilter || order.status === statusFilter;
    
    return dateMatch && statusMatch;
  });

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

    const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
const getInitials = (name: string): string => name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.fullName}!</p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm mb-8"
          >
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="h-5 w-5 inline-block mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'orders'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-5 w-5 inline-block mr-2" />
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="h-5 w-5 inline-block mr-2" />
                Profile
              </button>
            </nav>
          </motion.div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Orders</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Orders in Progress</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Orders Completed</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Recent Orders Table */}
              <motion.div variants={itemVariants} className="bg-white shadow-sm rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date of Order
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.createdAt ? formatDate(order.createdAt.toDate()) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {order.fileUrls && order.fileUrls.length ? `${order.fileUrls.length} files` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            ₹{order.totalCost?.toFixed(2) ?? '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* My Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Filters */}
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Status</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setDateFrom('');
                        setDateTo('');
                        setStatusFilter('');
                      }}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      Clear Filters
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Orders Table */}
              <motion.div variants={itemVariants} className="bg-white shadow-sm rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">All Orders ({filteredOrders.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date of Order
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.createdAt ? formatDate(order.createdAt.toDate()) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {order.fileUrls && order.fileUrls.length ? `${order.fileUrls.length} files` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            ₹{order.totalCost?.toFixed(2) ?? '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Profile Tab - Keep existing profile section unchanged */}
          {activeTab === 'profile' && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-xl font-bold mb-6"
              >
                Profile Settings
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  variants={itemVariants}
                  className="md:col-span-1 bg-white rounded-xl p-5 shadow-sm flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-green-600 font-bold text-2xl">
                      {user ? getInitials(user.fullName) : 'U'}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-1">{user?.fullName || 'User'}</h3>
                  <p className="text-gray-600 mb-4">{user?.personalEmail || 'user@example.com'}</p>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 mb-6">
                    {user?.className || 'Student'}
                  </div>
                </motion.div>
                
                <motion.div
                  variants={itemVariants}
                  className="md:col-span-2 bg-white rounded-xl p-5 shadow-sm"
                >
                  <h3 className="font-bold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={user?.fullName || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Personal Email</label>
                      <input 
                        type="email" 
                        value={user?.personalEmail || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Institutional Email</label>
                      <input 
                        type="email" 
                        value={user?.institutionalEmail || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">College</label>
                      <input 
                        type="text" 
                        value={user?.college || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Department</label>
                      <input 
                        type="text" 
                        value={user?.department || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Class</label>
                      <input 
                        type="text" 
                        value={user?.className || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Roll Number</label>
                      <input 
                        type="text" 
                        value={user?.rollNumber || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Year of Enrollment</label>
                      <input 
                        type="text" 
                        value={user?.yearOfEnrollment || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Year of Graduation</label>
                      <input 
                        type="text" 
                        value={user?.yearOfGraduation || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Birthday</label>
                      <input 
                        type="text" 
                        value={user?.birthday || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={user?.phoneNumber || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <h3 className="font-bold mb-4">Account Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.totalOrders}</div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">₹{stats.totalSpent.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Total Amount Spent</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{stats.totalPages}</div>
                      <div className="text-sm text-gray-600">Total Pages Printed</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;