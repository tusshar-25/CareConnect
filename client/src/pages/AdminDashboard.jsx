import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Heart, 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Filter,
  Search,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import axios from 'axios'

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/dashboard')
      setDashboardData(response.data.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, change, changeType }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card rounded-2xl p-6 hover-lift"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center text-sm ${
            changeType === 'positive' ? 'text-accent' : 'text-danger'
          }`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {change}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-text mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </motion.div>
  )

  const RecentActivityTable = ({ title, data, columns }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-text mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th key={column.key} className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                {columns.map((column) => (
                  <td key={column.key} className="py-3 px-4 text-sm">
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage and monitor CareConnect operations</p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {['overview', 'patients', 'volunteers', 'contacts', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Patients"
                value={dashboardData?.patients?.totalPatients || 0}
                icon={Users}
                color="bg-primary"
                change="+12%"
                changeType="positive"
              />
              <StatCard
                title="Active Volunteers"
                value={dashboardData?.volunteers?.active || 0}
                icon={Heart}
                color="bg-secondary"
                change="+8%"
                changeType="positive"
              />
              <StatCard
                title="Pending Messages"
                value={dashboardData?.contacts?.pendingMessages || 0}
                icon={MessageSquare}
                color="bg-accent"
                change="-3%"
                changeType="negative"
              />
              <StatCard
                title="Urgent Cases"
                value={dashboardData?.patients?.urgent || 0}
                icon={AlertTriangle}
                color="bg-danger"
                change="+2"
                changeType="positive"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RecentActivityTable
                title="Recent Patients"
                data={dashboardData?.recentActivity?.patients}
                columns={[
                  { key: 'fullName', label: 'Name' },
                  { key: 'urgencyLevel', label: 'Urgency' },
                  { key: 'status', label: 'Status' },
                  { key: 'createdAt', label: 'Date', render: (date) => new Date(date).toLocaleDateString() }
                ]}
              />
              <RecentActivityTable
                title="Recent Volunteers"
                data={dashboardData?.recentActivity?.volunteers}
                columns={[
                  { key: 'fullName', label: 'Name' },
                  { key: 'status', label: 'Status' },
                  { key: 'createdAt', label: 'Date', render: (date) => new Date(date).toLocaleDateString() }
                ]}
              />
              <RecentActivityTable
                title="Recent Contacts"
                data={dashboardData?.recentActivity?.contacts}
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'category', label: 'Category' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'createdAt', label: 'Date', render: (date) => new Date(date).toLocaleDateString() }
                ]}
              />
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text">Patient Trends</h3>
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Analytics Chart</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text">Category Distribution</h3>
                  <PieChart className="h-5 w-5 text-primary" />
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Distribution Chart</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-text mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">98%</div>
                  <div className="text-sm text-gray-600">Patient Satisfaction</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">2.5h</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Service Availability</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Other Tabs (Placeholders) */}
        {activeTab !== 'overview' && activeTab !== 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-12 text-center"
          >
            <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p className="text-gray-600">
              Advanced {activeTab} management features coming soon
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
