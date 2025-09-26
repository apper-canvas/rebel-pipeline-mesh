import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as apiResponseService from '@/services/api/apiResponseService';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';

const APIResponse = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiResponseService.getAll();
      setResponses(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load API responses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResponse = async (id) => {
    if (!confirm('Are you sure you want to delete this API response?')) {
      return;
    }

    try {
      await apiResponseService.deleteResponse(id);
      setResponses(prev => prev.filter(r => r.Id !== id));
      toast.success('API response deleted successfully');
      if (selectedResponse?.Id === id) {
        setSelectedResponse(null);
      }
    } catch (err) {
      toast.error('Failed to delete API response');
    }
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-blue-600';
    if (status >= 400 && status < 500) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'PATCH': return 'bg-orange-100 text-orange-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadResponses} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">API Responses</h1>
          <p className="text-gray-600 mt-1">View and manage API response data</p>
        </div>
        <Button onClick={loadResponses} className="flex items-center gap-2">
          <ApperIcon name="RefreshCw" size={16} />
          Refresh
        </Button>
      </div>

      {responses.length === 0 ? (
        <Empty
          icon="Database"
          title="No API Responses"
          description="No API responses available to display."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Response List</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {responses.map((response) => (
                <Card
                  key={response.Id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedResponse?.Id === response.Id
                      ? 'border-primary-500 bg-primary-50'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedResponse(response)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(response.method)}`}>
                        {response.method}
                      </span>
                      <span className={`font-bold ${getStatusColor(response.status)}`}>
                        {response.status}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteResponse(response.Id);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-800 truncate">
                      {response.endpoint}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {formatTimestamp(response.timestamp)} • {response.responseTime}ms
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Response Details</h2>
            {selectedResponse ? (
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {selectedResponse.endpoint}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(selectedResponse.method)}`}>
                        {selectedResponse.method}
                      </span>
                      <span className={`font-bold ${getStatusColor(selectedResponse.status)}`}>
                        {selectedResponse.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Response Time:</span>
                      <p className="text-gray-800">{selectedResponse.responseTime}ms</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Timestamp:</span>
                      <p className="text-gray-800">{formatTimestamp(selectedResponse.timestamp)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-600 mb-2">Headers</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                        {JSON.stringify(selectedResponse.headers, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-600 mb-2">Response Body</h4>
                    <div className="bg-gray-50 p-3 rounded-md max-h-64 overflow-y-auto">
                      <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                        {selectedResponse.body ? JSON.stringify(selectedResponse.body, null, 2) : 'No response body'}
                      </pre>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 flex flex-col items-center justify-center h-64 text-gray-500">
                <ApperIcon name="MousePointer" size={48} className="mb-4" />
                <p>Select an API response to view details</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default APIResponse;