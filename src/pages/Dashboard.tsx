import React, { useState, useEffect } from 'react';
import { DollarSign, Package, Wrench, TrendingUp } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useRepairRequests } from '../hooks/useFirebaseData';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const [dateFilter, setDateFilter] = useState('month');
  const { repairs, loading } = useRepairRequests();
  const { t } = useLanguage();
  
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_cost: 0,
    net_profit: 0,
    total_repairs: 0
  });
  const [profitData, setProfitData] = useState<any[]>([]);
  const [popularModels, setPopularModels] = useState<any[]>([]);
  const [commonIssues, setCommonIssues] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && repairs.length > 0) {
      calculateStats();
    }
  }, [dateFilter, repairs, loading]);

  const calculateStats = () => {
    const now = new Date();
    let filteredRepairs = repairs;

    // تطبيق فلتر التاريخ
    if (dateFilter === 'today') {
      const today = new Date().toDateString();
      filteredRepairs = repairs.filter((repair) => 
        new Date(repair.created_at).toDateString() === today
      );
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredRepairs = repairs.filter((repair) => 
        new Date(repair.created_at) >= weekAgo
      );
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredRepairs = repairs.filter((repair) => 
        new Date(repair.created_at) >= monthAgo
      );
    }

    // حساب الإحصائيات
    const totalRevenue = filteredRepairs.reduce((sum, repair) => sum + repair.total_cost, 0);
    const totalCost = filteredRepairs.reduce((sum, repair) => {
      const partsCost = (repair.repair_parts || []).reduce((partSum, part) => 
        partSum + (part.quantity_used * part.price_at_time * 0.7), 0);
      return sum + partsCost + (repair.labor_cost * 0.5);
    }, 0);
    const netProfit = totalRevenue - totalCost;

    setStats({
      total_revenue: totalRevenue,
      total_cost: totalCost,
      net_profit: netProfit,
      total_repairs: filteredRepairs.length
    });

    // حساب بيانات الأرباح اليومية للأسبوع الماضي
    const weeklyProfits = calculateWeeklyProfits(repairs);
    setProfitData(weeklyProfits);

    // حساب الموديلات الأكثر شيوعاً
    const modelCounts = calculatePopularModels(filteredRepairs);
    setPopularModels(modelCounts);

    // حساب الأعطال الأكثر شيوعاً
    const issueCounts = calculateCommonIssues(filteredRepairs);
    setCommonIssues(issueCounts);
  };

  const calculateWeeklyProfits = (repairs: any[]) => {
    const days = [
      t('days.sunday'), t('days.monday'), t('days.tuesday'), t('days.wednesday'),
      t('days.thursday'), t('days.friday'), t('days.saturday')
    ];
    const weeklyData = days.map(day => ({ name: day, profit: 0 }));

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    repairs.forEach((repair) => {
      const repairDate = new Date(repair.created_at);
      if (repairDate >= weekAgo && repair.status === 'completed') {
        const dayIndex = repairDate.getDay();
        weeklyData[dayIndex].profit += repair.profit || 0;
      }
    });

    return weeklyData;
  };

  const calculatePopularModels = (repairs: any[]) => {
    const modelCounts: { [key: string]: number } = {};
    
    repairs.forEach((repair) => {
      const modelName = repair.model?.name || t('common.noData');
      modelCounts[modelName] = (modelCounts[modelName] || 0) + 1;
    });

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    
    return Object.entries(modelCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count], index) => ({
        name,
        count,
        color: colors[index % colors.length]
      }));
  };

  const calculateCommonIssues = (repairs: any[]) => {
    const issueCounts: { [key: string]: number } = {};
    
    repairs.forEach((repair) => {
      const issue = repair.issue_type || t('common.noData');
      issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    });

    return Object.entries(issueCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([issue, count]) => ({ issue, count }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        
        <div className="flex gap-2">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="today">{t('time.today')}</option>
            <option value="week">{t('time.week')}</option>
            <option value="month">{t('time.month')}</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title={t('dashboard.totalRevenue')}
          value={`${stats.total_revenue.toLocaleString()} ${t('currency')}`}
          icon={DollarSign}
          color="blue"
        />
        
        <StatsCard
          title={t('dashboard.totalCost')}
          value={`${stats.total_cost.toLocaleString()} ${t('currency')}`}
          icon={Package}
          color="red"
        />
        
        <StatsCard
          title={t('dashboard.netProfit')}
          value={`${stats.net_profit.toLocaleString()} ${t('currency')}`}
          icon={TrendingUp}
          color="green"
        />
        
        <StatsCard
          title={t('dashboard.totalRepairs')}
          value={stats.total_repairs}
          icon={Wrench}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Profit Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">{t('dashboard.weeklyProfits')}</h3>
          <div className="h-64 sm:h-80">
            {profitData.some(d => d.profit > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => [`${value} ${t('currency')}`, t('repairs.profit')]} />
                  <Bar dataKey="profit" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Wrench className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm sm:text-base">{t('common.noData')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Popular Models */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">{t('dashboard.popularModels')}</h3>
          <div className="h-64 sm:h-80">
            {popularModels.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={popularModels}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ name, count }) => `${name}: ${count}`}
                    fontSize={10}
                  >
                    {popularModels.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Package className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm sm:text-base">{t('common.noData')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Common Issues */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">{t('dashboard.commonIssues')}</h3>
        {commonIssues.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {commonIssues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-gray-700 font-medium truncate flex-1">{issue.issue}</span>
                <div className="flex items-center gap-2 sm:gap-4 ml-4">
                  <div className="w-20 sm:w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(issue.count / Math.max(...commonIssues.map(i => i.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-6 sm:w-8 text-center">{issue.count}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm sm:text-base">{t('common.noData')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;