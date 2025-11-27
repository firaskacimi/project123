# TanStack Query Data Fetching Layer - Documentation

## Overview

This document provides a comprehensive guide to the refactored data fetching layer built with TanStack Query (React Query). It follows best practices for managing server state, caching, synchronization, and error handling.

## Architecture

### File Structure

```
app/
├── lib/api/
│   ├── client.ts          # Axios client with interceptors
│   ├── endpoints.ts       # API endpoint constants
│   ├── types.ts          # Shared TypeScript types
│   ├── queryKeys.ts      # Query key factory
│   ├── errors.ts         # Custom error handling
│   └── index.ts          # Module exports
├── hooks/
│   ├── queries/
│   │   ├── useProduct.ts      # Product queries
│   │   ├── useCategory.ts     # Category queries
│   │   ├── useOrder.ts        # Order queries
│   │   ├── useUser.ts         # User queries
│   │   └── index.ts           # Query exports
│   └── mutations/
│       ├── useAuthMutations.ts      # Auth mutations
│       ├── useProductMutations.ts   # Product mutations
│       ├── useOrderMutations.ts     # Order mutations
│       └── index.ts                 # Mutation exports
└── providers/
    └── QueryProvider.tsx      # TanStack Query provider setup
```

## Core Components

### 1. API Client (`lib/api/client.ts`)

The Axios client is configured with:

- **Base URL**: Defaults to `http://localhost:4000` (configurable via `NEXT_PUBLIC_API_URL`)
- **Request Interceptors**: Automatically adds authentication tokens
- **Response Interceptors**: Handles 401 errors and logs requests
- **Retry Logic**: Built into TanStack Query configuration
- **Timeout**: 30 seconds per request

**Key Functions:**

```typescript
// Import the client
import { apiClient, setAuthToken, clearAuthToken } from "@/app/lib/api";

// Set token after login
setAuthToken(token);

// Clear token on logout
clearAuthToken();
```

### 2. API Endpoints (`lib/api/endpoints.ts`)

Centralized endpoint definitions for type-safe API calls:

```typescript
import { ENDPOINTS } from "@/app/lib/api";

// Usage example
const url = ENDPOINTS.PRODUCTS.DETAIL(productId);
```

**Available Endpoints:**

- `AUTH`: Login, register, logout, get current user
- `PRODUCTS`: List, detail, search
- `CATEGORIES`: List, detail
- `ORDERS`: List, detail, create, update, delete
- `USERS`: Profile, list, detail
- `CART`: Get, add, remove, clear
- `PAYMENT`: Process, webhook

### 3. TypeScript Types (`lib/api/types.ts`)

Fully typed interfaces for all API requests and responses:

```typescript
import {
  Product,
  Category,
  Order,
  User,
  ApiResponse,
  PaginatedApiResponse,
  ProductFilters,
} from "@/app/lib/api";
```

**Type Guards:**

```typescript
// Check if response is paginated
if (isPaginatedResponse(data)) {
  console.log(data.pagination.totalPages);
}

// Check if response is valid API response
if (isApiResponse(data)) {
  console.log(data.success);
}
```

### 4. Query Key Factory (`lib/api/queryKeys.ts`)

Centralized cache key management using React Query's recommended pattern:

```typescript
import { queryKeys } from "@/app/lib/api";

// Query keys are structured hierarchically for easy invalidation
queryKeys.products.all; // ['products']
queryKeys.products.lists(); // ['products', 'list']
queryKeys.products.list(filters); // ['products', 'list', { filters }]
queryKeys.products.detail(id); // ['products', 'detail', id]
queryKeys.products.byCategory(id); // ['products', 'list', { category }]
```

### 5. Error Handling (`lib/api/errors.ts`)

Custom error types for structured error handling:

```typescript
import {
  ApiError,
  NetworkError,
  TimeoutError,
  ValidationError,
  getErrorMessage,
  handleAxiosError,
} from "@/app/lib/api";

// In catch blocks
try {
  // API call
} catch (error) {
  const apiError = handleAxiosError(error);
  console.error(getErrorMessage(apiError));
}
```

### 6. Query Provider (`providers/QueryProvider.tsx`)

Configure your app root to use TanStack Query:

```typescript
// app/layout.tsx or page.tsx
import { QueryProvider } from "@/app/providers/QueryProvider";

export default function RootLayout() {
  return <QueryProvider>{/* Your app */}</QueryProvider>;
}
```

## Query Hooks

All query hooks follow the `useGet[Entity][Action]` naming pattern.

### Product Queries

```typescript
import {
  useGetProducts,
  useGetProductById,
  useGetProductsByCategory,
} from "@/app/hooks/queries";

// Get all products with filters
const { data, isLoading, error } = useGetProducts({
  search: "gaming",
  category: "cpu",
  page: 1,
  limit: 12,
  minPrice: 100,
  maxPrice: 1000,
});

// Get single product
const { data: product } = useGetProductById(productId);

// Get products by category
const { data: categoryProducts } = useGetProductsByCategory(categoryId, 20);

// Search products
const { data: searchResults } = useSearchProducts("keyboard");
```

### Category Queries

```typescript
import { useGetCategories, useGetCategoryById } from "@/app/hooks/queries";

// Get all categories
const { data: categories } = useGetCategories();

// Get single category
const { data: category } = useGetCategoryById(categoryId);
```

### Order Queries

```typescript
import { useGetOrders, useGetOrderById } from "@/app/hooks/queries";

// Get user orders (paginated)
const { data: ordersResponse } = useGetOrders(1, 10);

// Get single order
const { data: order } = useGetOrderById(orderId);
```

### User Queries

```typescript
import { useGetCurrentUser, useGetUserById } from "@/app/hooks/queries";

// Get current user profile
const { data: currentUser } = useGetCurrentUser();

// Get user by ID
const { data: user } = useGetUserById(userId);
```

## Mutation Hooks

All mutation hooks follow the `use[Action][Entity]` naming pattern.

### Authentication Mutations

```typescript
import {
  useLogin,
  useRegister,
  useLogout,
  useUpdateProfile,
} from "@/app/hooks/mutations";

// Login
const loginMutation = useLogin();
const handleLogin = async (email, password) => {
  const { data } = await loginMutation.mutateAsync({ email, password });
  // User is logged in, token is saved
};

// Register
const registerMutation = useRegister();
const handleRegister = async (email, password, name) => {
  await registerMutation.mutateAsync({ email, password, name });
};

// Logout
const logoutMutation = useLogout();
const handleLogout = async () => {
  await logoutMutation.mutateAsync();
  // Token is cleared, redirect to login
};

// Update profile
const updateProfileMutation = useUpdateProfile();
const handleUpdate = async (profileData) => {
  await updateProfileMutation.mutateAsync(profileData);
};
```

### Product Mutations (Admin)

```typescript
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/app/hooks/mutations";

// Create product
const createMutation = useCreateProduct();
const handleCreate = async (productData) => {
  await createMutation.mutateAsync(productData);
};

// Update product
const updateMutation = useUpdateProduct(productId);
const handleUpdate = async (productData) => {
  await updateMutation.mutateAsync(productData);
};

// Delete product
const deleteMutation = useDeleteProduct();
const handleDelete = async (productId) => {
  await deleteMutation.mutateAsync(productId);
};
```

### Order Mutations

```typescript
import {
  useCreateOrder,
  useUpdateOrder,
  useDeleteOrder,
} from "@/app/hooks/mutations";

// Create order
const createMutation = useCreateOrder();
const handleCreateOrder = async (orderData) => {
  const { data } = await createMutation.mutateAsync(orderData);
  // Order created successfully
};

// Update order status
const updateMutation = useUpdateOrder(orderId);
const handleUpdateOrder = async (updates) => {
  await updateMutation.mutateAsync(updates);
};

// Delete order
const deleteMutation = useDeleteOrder();
const handleDeleteOrder = async (orderId) => {
  await deleteMutation.mutateAsync(orderId);
};
```

## Usage Examples

### Example 1: Basic Product List with Filters

```typescript
"use client";

import { useState } from "react";
import { useGetProducts } from "@/app/hooks/queries";

export default function ProductsList() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    page: 1,
    limit: 12,
  });

  const { data, isLoading, error } = useGetProducts(filters);

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <input
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        placeholder="Search products..."
      />

      <div>
        {data?.data.map((product) => (
          <div key={product._id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>

      {data?.pagination && (
        <div>
          Page {data.pagination.currentPage} of {data.pagination.totalPages}
        </div>
      )}
    </div>
  );
}
```

### Example 2: Login Form with Error Handling

```typescript
"use client";

import { useState } from "react";
import { useLogin } from "@/app/hooks/mutations";
import { getErrorMessage } from "@/app/lib/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginMutation.mutateAsync({ email, password });
      console.log("Logged in as:", data.user.name);
      // Redirect to dashboard
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>
      {loginMutation.error && (
        <p style={{ color: "red" }}>{getErrorMessage(loginMutation.error)}</p>
      )}
    </form>
  );
}
```

### Example 3: Dependent Queries

```typescript
"use client";

import { useGetCurrentUser } from "@/app/hooks/queries";
import { useGetOrders } from "@/app/hooks/queries";

export default function UserOrders() {
  const { data: user } = useGetCurrentUser();

  // This query only runs after user is loaded
  const { data: orders } = useGetOrders(1, 10);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}'s Orders</h1>
      {orders?.data.map((order) => (
        <div key={order._id}>
          <p>
            Order {order._id}: ${order.totalPrice}
          </p>
        </div>
      ))}
    </div>
  );
}
```

### Example 4: Optimistic Updates

The mutation hooks already include automatic cache updates. For manual optimistic updates:

```typescript
"use client";

import { useUpdateProduct } from "@/app/hooks/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/app/lib/api";

export default function EditProduct() {
  const queryClient = useQueryClient();
  const mutation = useUpdateProduct(productId);

  const handleUpdate = async (newData) => {
    // Optimistic update
    queryClient.setQueryData(
      queryKeys.products.detail(productId),
      (oldData) => ({ ...oldData, ...newData })
    );

    try {
      await mutation.mutateAsync(newData);
    } catch (error) {
      // Revert on error
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(productId),
      });
    }
  };

  return (
    // JSX here
  );
}
```

## Migration Guide

### Before (Old Pattern)

```typescript
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  fetch("/products")
    .then((res) => res.json())
    .then((data) => {
      setProducts(data.data);
      setLoading(false);
    });
}, []);
```

### After (New Pattern)

```typescript
const { data, isLoading } = useGetProducts();
// That's it! Caching, refetching, and error handling are automatic
```

### Migration Checklist

1. ✅ Replace all `fetch()` calls with appropriate query/mutation hooks
2. ✅ Replace `useState` for data with hook states (data is in hook return)
3. ✅ Replace manual loading state with `isLoading` from hooks
4. ✅ Replace manual error state with `error` from hooks
5. ✅ Remove manual cache management (TanStack Query handles it)
6. ✅ Wrap app root with `<QueryProvider>`
7. ✅ Set authentication token after login with `setAuthToken()`
8. ✅ Clear authentication token on logout with `clearAuthToken()`

## Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Query Client Options

Edit `providers/QueryProvider.tsx` to customize:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 3,
      // ... more options
    },
    mutations: {
      retry: 1,
      // ... more options
    },
  },
});
```

## Best Practices

1. **Use Query Keys Consistently**: Always use `queryKeys` factory to ensure proper cache management
2. **Invalidate, Don't Refetch**: Use `queryClient.invalidateQueries()` after mutations
3. **Handle Loading States**: Always show loading indicators for better UX
4. **Error Boundaries**: Wrap components with error boundaries for graceful error handling
5. **Dependent Queries**: Use the `enabled` option for queries that depend on others
6. **Stale Time**: Set appropriate `staleTime` based on data freshness requirements
7. **Devtools**: Use React Query Devtools in development for debugging

## Troubleshooting

### Issue: Data not updating after mutation

**Solution**: Ensure mutations are using `queryClient.invalidateQueries()` with correct query keys.

### Issue: Too many API requests

**Solution**: Increase `staleTime` to prevent unnecessary refetches.

### Issue: Losing token on page refresh

**Solution**: Token is stored in localStorage and automatically added to requests. Ensure `setAuthToken()` is called after login.

### Issue: Query not running

**Solution**: Check if `enabled` condition is met for dependent queries.

## Additional Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query DevTools](https://github.com/tanstack/query/tree/main/packages/react-query-devtools)
- [Axios Documentation](https://axios-http.com/)

---

For questions or issues, refer to the inline code comments or check the TanStack Query documentation.
