# TanStack Query Layer - Implementation Summary

## What Was Created

### 1. API Module (`app/lib/api/`)

**Files:**

- `client.ts` - Axios client with interceptors, auth handling, and logging
- `endpoints.ts` - Centralized endpoint constants
- `types.ts` - TypeScript interfaces and type guards
- `queryKeys.ts` - React Query cache key factory
- `errors.ts` - Custom error types and handlers
- `index.ts` - Module exports barrel file

**Features:**

- ✅ Request/response interceptors for authentication
- ✅ Automatic token management
- ✅ Structured error handling
- ✅ Development logging
- ✅ Retry logic configuration
- ✅ 30-second timeout

### 2. Query Hooks (`app/hooks/queries/`)

**Files:**

- `useProduct.ts` - Product list, detail, by category, search
- `useCategory.ts` - Category list and detail
- `useOrder.ts` - Order list and detail
- `useUser.ts` - Current user and user by ID
- `index.ts` - Exports barrel file

**Features:**

- ✅ Fully typed with TypeScript
- ✅ Configurable filters and pagination
- ✅ Proper stale times and cache settings
- ✅ Error handling built-in
- ✅ Loading states included
- ✅ Query key factory integration

### 3. Mutation Hooks (`app/hooks/mutations/`)

**Files:**

- `useAuthMutations.ts` - Login, register, logout, profile update
- `useProductMutations.ts` - Create, update, delete products
- `useOrderMutations.ts` - Create, update, delete orders
- `index.ts` - Exports barrel file

**Features:**

- ✅ Automatic query invalidation
- ✅ Cache updates on success
- ✅ Error handling
- ✅ Token management for auth mutations
- ✅ Retry logic for resilience

### 4. Query Provider (`app/providers/QueryProvider.tsx`)

**Features:**

- ✅ Default query options (5 min stale time, 10 min cache)
- ✅ Default mutation options (1 retry)
- ✅ React Query DevTools integration
- ✅ Exponential backoff for retries
- ✅ Production/development aware

### 5. Documentation

**Files:**

- `DATA_FETCHING_GUIDE.md` - Comprehensive usage guide
- This file - Implementation summary

## How to Use

### 1. Wrap Your App with QueryProvider

```typescript
// app/layout.tsx or your root component
import { QueryProvider } from "@/app/providers/QueryProvider";

export default function RootLayout({ children }) {
  return <QueryProvider>{children}</QueryProvider>;
}
```

### 2. Replace Fetch Calls with Hooks

**Before:**

```typescript
const [products, setProducts] = useState([]);
useEffect(() => {
  fetch("/products")
    .then((r) => r.json())
    .then((d) => setProducts(d.data));
}, []);
```

**After:**

```typescript
const { data } = useGetProducts();
// Access products from data.data
```

### 3. Use Mutations for Write Operations

```typescript
import { useLogin } from "@/app/hooks/mutations";

const loginMutation = useLogin();
await loginMutation.mutateAsync({ email, password });
```

### 4. Set Token After Login

```typescript
import { setAuthToken } from "@/app/lib/api";

const response = await loginMutation.mutateAsync(credentials);
setAuthToken(response.token); // Token is now in all requests
```

## Configuration

### Environment Variable

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Customize Default Options

Edit `app/providers/QueryProvider.tsx` and modify `defaultOptions` in `QueryClient`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Adjust cache freshness
      gcTime: 1000 * 60 * 10, // Adjust garbage collection
      retry: 3, // Adjust retry attempts
    },
  },
});
```

## Key Concepts

### Query Keys

Hierarchical cache keys for efficient invalidation:

```typescript
queryKeys.products.all; // All product-related keys
queryKeys.products.lists(); // All product list keys
queryKeys.products.list(filters); // Specific filtered list
queryKeys.products.detail(id); // Specific product detail
```

### Automatic Cache Management

- Queries cache data automatically
- Mutations invalidate related queries
- Stale data is refetched as needed
- GC removes unused cache entries

### Error Handling

```typescript
import { getErrorMessage } from "@/app/lib/api";

try {
  await mutation.mutateAsync(data);
} catch (error) {
  console.error(getErrorMessage(error)); // User-friendly message
}
```

## File Locations

```
app/
├── lib/api/
│   ├── client.ts
│   ├── endpoints.ts
│   ├── types.ts
│   ├── queryKeys.ts
│   ├── errors.ts
│   └── index.ts
├── hooks/
│   ├── queries/
│   │   ├── useProduct.ts
│   │   ├── useCategory.ts
│   │   ├── useOrder.ts
│   │   ├── useUser.ts
│   │   └── index.ts
│   └── mutations/
│       ├── useAuthMutations.ts
│       ├── useProductMutations.ts
│       ├── useOrderMutations.ts
│       └── index.ts
└── providers/
    └── QueryProvider.tsx
```

## Next Steps

1. **Wrap your app root with QueryProvider** (if not already done)
2. **Set NEXT_PUBLIC_API_URL** in .env.local
3. **Start replacing fetch calls** with query/mutation hooks
4. **Test with React Query DevTools** (bottom-right corner in dev)
5. **Review DATA_FETCHING_GUIDE.md** for detailed examples

## Troubleshooting

### Query not loading

- Check if `enabled` condition is met
- Check browser console for error messages
- Use React Query DevTools to inspect query state

### Token not persisting

- Ensure `setAuthToken(token)` is called after login
- Check localStorage for "token" key
- Verify Authorization header in Network tab

### Too many requests

- Increase `staleTime` in defaultOptions
- Check for duplicate query keys
- Use React Query DevTools to see request patterns

## Benefits of This Setup

✅ Automatic caching and synchronization  
✅ Built-in retry logic and error handling  
✅ TypeScript support with full type safety  
✅ Centralized API management  
✅ Reduced boilerplate code  
✅ Better performance with smart cache management  
✅ Easy debugging with DevTools  
✅ Production-ready authentication handling

---

For more details, see `DATA_FETCHING_GUIDE.md`
