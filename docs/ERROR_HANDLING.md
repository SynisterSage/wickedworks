# Error Handling & Toast Notifications

## Overview

A comprehensive error handling system has been integrated across the application using **react-toastify** for user-friendly error notifications. All critical data-fetching operations, cart mutations, and authentication flows now show toast notifications on errors.

## Toast Utility

**File:** `lib/toast.ts`

### Available Functions

```typescript
// Show error toast
notifyError(message: string, options?: ToastOptions)

// Show success toast
notifySuccess(message: string, options?: ToastOptions)

// Show warning toast
notifyWarning(message: string, options?: ToastOptions)

// Show info toast
notifyInfo(message: string, options?: ToastOptions)

// Handle error with logging + toast
handleError(context: string, error: unknown, showToast = true): string
```

### Usage Example

```typescript
import { handleError, notifySuccess } from '../lib/toast';

try {
  await someAsyncOperation();
  notifySuccess('Operation completed successfully');
} catch (error) {
  const message = handleError('[ComponentName]', error);
  setError(message);
}
```

## Integrated Components

### Data Fetching Hooks

| Hook | Status | Error Handling |
|------|--------|-----------------|
| `useProducts()` | ✅ Integrated | GraphQL errors + network errors with fallback to mocks |
| `useProductByHandle()` | ✅ Integrated | Product not found + API errors |
| `useCollections()` | ✅ Integrated | GraphQL errors with fallback response |
| `useBlogPosts()` | ✅ Integrated | Article fetch errors with empty fallback |
| `useArchives()` | ✅ Integrated | Product fetch errors with mock fallback |
| `useNewReleases()` | ✅ Integrated | Latest products fetch with fallback |

### Cart Operations

**File:** `hooks/useCart.ts`

- ✅ Cart creation errors shown to user
- ✅ Add to cart success notification
- ✅ Remove from cart success notification
- ✅ Cart sync errors with proper error messages
- ✅ Shopify user errors properly formatted and displayed

**Cart Mutations with Error Handling:**
- `CART_CREATE_MUTATION` - Initialize cart
- `CART_LINES_ADD_MUTATION` - Add items with success toast
- `CART_LINES_UPDATE_MUTATION` - Update quantities
- `CART_LINES_REMOVE_MUTATION` - Remove items with success toast

### Authentication

**File:** `contexts/AuthContext.tsx`

- ✅ Auth state loading errors (silent, no toast)
- ✅ Customer fetch errors with proper error message
- ✅ Logout success notification
- ✅ Refresh customer errors properly handled

## Toast Configuration

Default toast settings:
- **Position:** Bottom-right
- **Auto-close:** 4000ms for errors, 3000ms for success
- **Progress bar:** Visible
- **Click to close:** Enabled
- **Pause on hover:** Enabled
- **Draggable:** Enabled

## Error Message Format

Errors are automatically extracted from various types:
- `Error` objects → `error.message`
- Strings → Used directly
- Objects → Converted to JSON string
- Unknown → Generic fallback message

## Best Practices

1. **Always log to console for debugging:**
   ```typescript
   const message = handleError('[ComponentName]', error);
   ```

2. **Use context labels for easier debugging:**
   ```typescript
   handleError('[useProducts] Fetch failed', err);
   // Console output: [useProducts] Fetch failed: ...
   ```

3. **Silent errors (no toast) for non-critical operations:**
   ```typescript
   handleError('[LoadingState]', err, false); // No toast shown
   ```

4. **Success notifications for user actions:**
   ```typescript
   notifySuccess('Item added to cart');
   notifySuccess('Profile updated successfully');
   ```

## Integration with ToastContainer

Make sure your app includes the `ToastContainer` from react-toastify:

```tsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  return (
    <>
      <main>Your app content</main>
      <ToastContainer />
    </>
  );
}
```

This is already configured in [App.tsx](../App.tsx).

## Testing Error States

To test error handling:

1. **Network errors:** Set `VITE_STORE_DOMAIN` to invalid domain
2. **API errors:** Temporarily mock invalid responses in queries
3. **Timeout errors:** Use browser DevTools network throttling
4. **Auth errors:** Clear localStorage auth tokens and reload

## Future Improvements

- Add toast dismiss timeout based on error severity
- Implement error analytics/tracking
- Add retry buttons for failed operations
- Implement offline detection with appropriate messaging
- Add error boundary component for critical sections
