import React, { useEffect, useState } from "react";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { activityService } from "@/services/api/activityService";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const Dashboard = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [dealsData, contactsData, activitiesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(), 
        activityService.getAll()
      ]);
      
      setDeals(dealsData);
      setContacts(contactsData);
      setActivities(activitiesData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

const calculateMetrics = () => {
    const totalDeals = deals.length;
    const totalPipelineValue = deals.reduce((sum, deal) => sum + (deal.value_c || 0), 0);
    const closedDeals = deals.filter(deal => deal.stage_c === 'closed');
    const conversionRate = totalDeals > 0 ? ((closedDeals.length / totalDeals) * 100).toFixed(1) : 0;
    const activeContacts = contacts.filter(contact => contact.status_c === "active").length;
    
    return {
      totalDeals,
      totalPipelineValue,
      conversionRate: `${conversionRate}%`,
      activeContacts,
      closedDealsValue: closedDeals.reduce((sum, deal) => sum + (deal.value_c || 0), 0)
    };
  };

  const getRecentActivities = () => {
    return activities
.sort((a, b) => new Date(b.created_at_c) - new Date(a.created_at_c))
      .slice(0, 5);
  };

  const getContactById = (contactId) => {
return contacts.find(contact => contact.Id === contactId);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const metrics = calculateMetrics();
  const recentActivities = getRecentActivities();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening with your sales.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Deals"
          value={metrics.totalDeals}
          icon="Target"
          trend="up"
          trendValue="+12% from last month"
        />
        <MetricCard
          title="Pipeline Value"
          value={formatCurrency(metrics.totalPipelineValue)}
          icon="DollarSign"
          trend="up"
          trendValue="+18% from last month"
        />
        <MetricCard
          title="Conversion Rate"
          value={metrics.conversionRate}
          icon="TrendingUp"
          trend="up"
          trendValue="+2.5% from last month"
        />
        <MetricCard
          title="Active Contacts"
          value={metrics.activeContacts}
          icon="Users"
          trend="up"
          trendValue="+5% from last month"
        />
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline by Stage */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline by Stage</h2>
          <div className="space-y-4">
            {["lead", "qualified", "proposal", "closed"].map(stage => {
const stageDeals = deals.filter(deal => deal.stage_c === stage);
const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.value_c || 0), 0);
              const percentage = metrics.totalPipelineValue > 0 ? 
                ((stageValue / metrics.totalPipelineValue) * 100).toFixed(1) : 0;
              
              return (
                <div key={stage} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      stage === "lead" ? "bg-blue-400" :
                      stage === "qualified" ? "bg-yellow-500" :
                      stage === "proposal" ? "bg-orange-500" : "bg-green-500"
                    }`} />
                    <span className="text-sm font-medium capitalize">{stage}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(stageValue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {stageDeals.length} deals ({percentage}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map(activity => {
const contact = getContactById(activity.contact_id_c);
              return (
                <div key={activity.Id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
activity.type_c === "call" ? "bg-blue-400" :
                    activity.type_c === "email" ? "bg-green-400" :
                    activity.type_c === "meeting" ? "bg-purple-400" : "bg-gray-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
{activity.description_c}
                    </p>
                    {contact && (
<p className="text-xs text-gray-500">
                        {contact?.first_name_c} {contact?.last_name_c}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
{new Date(activity.created_at_c).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
            {recentActivities.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent activities
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;