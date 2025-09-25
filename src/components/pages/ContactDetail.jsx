import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Deals from "@/components/pages/Deals";
const ContactDetail = () => {
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [company, setCompany] = useState(null);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadContactData();
    }
  }, [id]);

  const loadContactData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const contactData = await contactService.getById(parseInt(id));
      setContact(contactData);

if (contactData.company_id_c) {
        const companyData = await companyService.getById(contactData.company_id_c);
        setCompany(companyData);
      }

      const [dealsData, activitiesData] = await Promise.all([
        dealService.getAll(),
        activityService.getAll()
      ]);

setDeals(dealsData.filter(deal => deal.contact_id_c === contactData.Id));
setActivities(activitiesData.filter(activity => activity.contact_id_c === contactData.Id));
    } catch (err) {
      setError("Failed to load contact details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      active: "success",
      inactive: "default",
      prospect: "warning",
      customer: "primary"
    };
    return variants[status] || "default";
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getTotalDealsValue = () => {
    return deals.reduce((total, deal) => total + (deal.value || 0), 0);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadContactData} />;
  if (!contact) return <Error message="Contact not found" />;

  return (
    <div className="p-6 space-y-6">
    {/* Header */}
    <div className="flex items-center space-x-4">
        <Button variant="ghost" icon="ArrowLeft" onClick={() => window.history.back()}>Back
                    </Button>
        <div className="h-6 w-px bg-gray-300"></div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Details</h1>
    </div>
    {/* Contact Info */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card className="p-6">
                <div className="flex items-start space-x-6">
                    <Avatar
                        name={`${contact.first_name_c || ""} ${contact.last_name_c || ""}`}
                        size="xl" />
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {contact.first_name_c} {contact.last_name_c}
                                </h2>
                                <p className="text-gray-600 mt-1">{contact.title_c}</p>
                                {company && <p className="text-gray-500 mt-1">{company.name}</p>}
                            </div>
                            <Badge variant={getStatusVariant(contact.status_c)}>
                                {contact.status_c}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <ApperIcon name="Mail" className="text-gray-400" size={18} />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <a
                                            href={`mailto:${contact.email_c}`}
                                            className="text-primary-600 hover:text-primary-700">
                                            {contact.email_c}
                                        </a>
                                    </div>
                                    {contact.phone_c && <div className="flex items-center space-x-3">
                                        <ApperIcon name="Phone" className="text-gray-400" size={18} />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <a
                                                href={`tel:${contact.phone_c}`}
                                                className="text-primary-600 hover:text-primary-700">
                                                {contact.phone_c}
                                            </a>
                                        </div>
                                    </div>}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Added</p>
                                        <p className="text-gray-900">
                                            {new Date(contact.created_at_c).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Last Updated</p>
                                        <p className="text-gray-900">
                                            {new Date(contact.updated_at_c).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div></Card>
        </div>
        <div>
            <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Active Deals</p>
                        <p className="text-2xl font-bold text-gray-900">{deals.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Deal Value</p>
                        <p className="text-2xl font-bold text-accent-500">
                            {formatCurrency(getTotalDealsValue())}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Activities</p>
                        <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
                    </div>
                </div>
                <Button
                    className="w-full mt-6"
                    icon="Plus"
                    onClick={() => toast.info("Deal creation feature coming soon")}>Create Deal
                                </Button>
            </Card>
        </div>
    </div>
    {/* Deals and Activities */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deals */}
        <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Deals ({deals.length})</h3>
            <div className="space-y-3">
                {deals.map(
                    deal => <div key={deal.Id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-gray-900">{deal.title_c}</h4>
                                <p className="text-sm text-gray-600 capitalize">{deal.stage_c}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-accent-500">
                                    {formatCurrency(deal.value_c)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {deal.probability_c}% probability
                                                        </p>
                            </div>
                        </div>
                    </div>
                )}
                {deals.length === 0 && <p className="text-gray-500 text-center py-4">No deals yet</p>}
            </div>
        </Card>
        {/* Activities */}
        <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activities ({activities.length})</h3>
            <div className="space-y-3">
                {activities.slice(0, 5).map(activity => <div key={activity.Id} className="flex items-start space-x-3">
                    <div
                        className={`w-2 h-2 rounded-full mt-2 ${activity.type_c === "call" ? "bg-blue-400" : activity.type_c === "email" ? "bg-green-400" : activity.type_c === "meeting" ? "bg-purple-400" : "bg-gray-400"}`} />
                    <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description_c}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.created_at_c).toLocaleDateString()}
                        </p>
                    </div>
                </div>)}
                {activities.length === 0 && <p className="text-gray-500 text-center py-4">No activities yet</p>}
            </div>
        </Card>
    </div>
</div>
  );
};

export default ContactDetail;