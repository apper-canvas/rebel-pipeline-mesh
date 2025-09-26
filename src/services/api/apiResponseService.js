const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API response data - realistic examples
const mockAPIResponses = [
  {
    Id: 1,
    endpoint: "/api/users/profile",
    method: "GET",
    status: 200,
    responseTime: 145,
    timestamp: "2024-01-15T10:30:00Z",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    },
    body: {
      userId: 12345,
      name: "John Doe",
      email: "john.doe@company.com",
      role: "admin"
    }
  },
  {
    Id: 2,
    endpoint: "/api/orders",
    method: "POST",
    status: 201,
    responseTime: 320,
    timestamp: "2024-01-15T11:15:00Z",
    headers: {
      "Content-Type": "application/json",
      "Location": "/api/orders/789"
    },
    body: {
      orderId: 789,
      customerId: 456,
      total: 299.99,
      status: "created"
    }
  },
  {
    Id: 3,
    endpoint: "/api/products/search",
    method: "GET",
    status: 200,
    responseTime: 89,
    timestamp: "2024-01-15T12:00:00Z",
    headers: {
      "Content-Type": "application/json",
      "X-Total-Count": "42"
    },
    body: {
      products: [
        { id: 101, name: "Wireless Headphones", price: 79.99 },
        { id: 102, name: "Bluetooth Speaker", price: 49.99 }
      ],
      total: 42,
      page: 1
    }
  },
  {
    Id: 4,
    endpoint: "/api/auth/login",
    method: "POST",
    status: 401,
    responseTime: 156,
    timestamp: "2024-01-15T13:45:00Z",
    headers: {
      "Content-Type": "application/json",
      "WWW-Authenticate": "Bearer"
    },
    body: {
      error: "Invalid credentials",
      code: "AUTH_FAILED",
      message: "Username or password is incorrect"
    }
  },
  {
    Id: 5,
    endpoint: "/api/reports/sales",
    method: "GET",
    status: 200,
    responseTime: 1250,
    timestamp: "2024-01-15T14:20:00Z",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=3600"
    },
    body: {
      period: "2024-01",
      totalSales: 125000,
      transactions: 342,
      averageOrder: 365.50
    }
  },
  {
    Id: 6,
    endpoint: "/api/notifications",
    method: "GET",
    status: 200,
    responseTime: 67,
    timestamp: "2024-01-15T15:10:00Z",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      notifications: [
        { id: 1, message: "New order received", read: false },
        { id: 2, message: "Payment confirmed", read: true }
      ],
      unreadCount: 1
    }
  },
  {
    Id: 7,
    endpoint: "/api/inventory/stock",
    method: "PUT",
    status: 200,
    responseTime: 234,
    timestamp: "2024-01-15T16:00:00Z",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      productId: 101,
      previousStock: 45,
      newStock: 50,
      updated: true
    }
  },
  {
    Id: 8,
    endpoint: "/api/customers/12345",
    method: "DELETE",
    status: 204,
    responseTime: 178,
    timestamp: "2024-01-15T16:30:00Z",
    headers: {},
    body: null
  },
  {
    Id: 9,
    endpoint: "/api/analytics/traffic",
    method: "GET",
    status: 500,
    responseTime: 5000,
    timestamp: "2024-01-15T17:00:00Z",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      error: "Internal Server Error",
      message: "Database connection timeout",
      trace: "DatabaseTimeoutException at line 142"
    }
  },
  {
    Id: 10,
    endpoint: "/api/webhooks/payment",
    method: "POST",
    status: 200,
    responseTime: 45,
    timestamp: "2024-01-15T18:15:00Z",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      received: true,
      processed: true,
      paymentId: "pay_1234567890"
    }
  },
  {
    Id: 11,
    endpoint: "/api/files/upload",
    method: "POST",
    status: 413,
    responseTime: 2100,
    timestamp: "2024-01-15T19:00:00Z",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      error: "Payload Too Large",
      message: "File size exceeds 10MB limit",
      maxSize: "10MB",
      receivedSize: "15.7MB"
    }
  },
  {
    Id: 12,
    endpoint: "/api/settings/preferences",
    method: "PATCH",
    status: 200,
    responseTime: 123,
    timestamp: "2024-01-15T20:30:00Z",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      userId: 12345,
      preferences: {
        theme: "dark",
        notifications: true,
        language: "en"
      },
      updated: true
    }
  }
];

// Service methods following established patterns
export const getAll = async () => {
  await delay(400);
  return [...mockAPIResponses];
};

export const getById = async (id) => {
  await delay(300);
  const response = mockAPIResponses.find(item => item.Id === parseInt(id));
  if (!response) {
    throw new Error(`API response with ID ${id} not found`);
  }
  return { ...response };
};

export const create = async (data) => {
  await delay(500);
  const newId = Math.max(...mockAPIResponses.map(item => item.Id)) + 1;
  const newResponse = {
    Id: newId,
    timestamp: new Date().toISOString(),
    ...data
  };
  mockAPIResponses.push(newResponse);
  return { ...newResponse };
};

export const update = async (id, data) => {
  await delay(400);
  const index = mockAPIResponses.findIndex(item => item.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`API response with ID ${id} not found`);
  }
  mockAPIResponses[index] = { ...mockAPIResponses[index], ...data };
  return { ...mockAPIResponses[index] };
};

export const deleteResponse = async (id) => {
  await delay(350);
  const index = mockAPIResponses.findIndex(item => item.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`API response with ID ${id} not found`);
  }
  mockAPIResponses.splice(index, 1);
  return true;
};

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteResponse
};