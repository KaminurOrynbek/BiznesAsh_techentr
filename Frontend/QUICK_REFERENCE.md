# BiznesAsh Frontend - Quick Reference

## 🚀 Start Here

```bash
cd frontend
npm install
npm run dev
```

**App opens at:** http://localhost:5173

## 📖 Core Concepts

### Authentication
```typescript
import { useAuth } from './context/useAuth';

const { user, isAuthenticated, login, logout } = useAuth();
```

### API Calls
```typescript
import { contentService } from './services/contentService';

const posts = await contentService.getPosts();
const comment = await contentService.createComment(postId, { content: "..." });
```

### Protected Routes
```tsx
<Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
```

### Components
```tsx
<Button variant="primary">Click me</Button>
<Card><p>Content</p></Card>
<Input label="Name" value={name} onChange={setName} />
<Loading />
<Alert type="success" message="Done!" />
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Routes and layout |
| `src/context/AuthContext.tsx` | Auth state |
| `src/services/*Service.ts` | API calls |
| `src/components/*` | Reusable UI |
| `src/pages/*` | Page components |
| `.env.local` | Configuration |
| `tailwind.config.js` | Styling |

## 🔧 Common Tasks

### Add a New Page
1. Create file in `src/pages/`
2. Add import in `src/pages/index.ts`
3. Add route in `src/App.tsx`

### Add a Component
1. Create file in `src/components/`
2. Export from `src/components/index.ts`
3. Import where needed

### Add API Endpoint
1. Add method to service in `src/services/`
2. Define types/interfaces
3. Use in component or hook

### Style Element
Use Tailwind CSS classes:
```tsx
<div className="bg-blue-600 text-white p-4 rounded-lg">
  Styled!
</div>
```

## 🐛 Debugging

**Check in browser:**
- Console (F12) - See errors
- Network tab - See API calls
- Storage tab - See localStorage/tokens

**Common issues:**
- Port in use → `npm run dev -- --port 5174`
- Dependencies fail → `npm install --legacy-peer-deps`
- CORS errors → Check API URL in `.env.local`

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| react | UI library |
| react-router-dom | Routing |
| axios | HTTP client |
| tailwindcss | Styling |
| typescript | Type safety |

## 🌐 Environment

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 📚 File Locations

```
src/
├── components/   # UI components
├── pages/        # Page components
├── services/     # API clients
├── context/      # State management
├── App.tsx       # Main app
└── main.tsx      # Entry point
```

## ⚡ Hot Tips

- `useAuth()` hook for auth state anywhere
- `contentService` for posts and comments
- `authService` for user operations
- `notificationService` for notifications
- Tailwind classes in className attributes
- TypeScript interfaces in services

## 🎯 API Endpoints

```
POST   /auth/login
POST   /auth/register
GET    /users/me
PUT    /users/:id
GET    /posts
POST   /posts
GET    /posts/:id
POST   /posts/:id/like
GET    /posts/:id/comments
POST   /posts/:id/comments
GET    /notifications
```

## 🔑 Key Patterns

### Authentication
```typescript
const { user, login } = useAuth();
await login(email, password);
```

### API Calls
```typescript
try {
  const data = await service.method();
} catch (error) {
  setError(error.message);
}
```

### Components
```tsx
export const MyComponent = () => {
  const [state, setState] = useState();
  
  useEffect(() => {
    // side effects
  }, []);
  
  return <div>Content</div>;
};
```

### Conditional Rendering
```tsx
{isLoading && <Loading />}
{error && <Alert type="error" message={error} />}
{data && <Card>{data}</Card>}
```

## 🚄 Performance Tips

- Use React.lazy() for code splitting (can add)
- Memoize expensive components
- Avoid inline functions in render
- Use Tailwind's @apply for repeated styles

## 📖 Documentation

- `FRONTEND_SETUP.md` - Detailed setup guide
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `README.md` - Features and architecture
- This file - Quick reference

## 🎨 Tailwind Cheatsheet

```tsx
// Colors
className="bg-blue-600 text-white border-red-500"

// Spacing
className="p-4 m-2 mb-6 px-8 py-2"

// Layout
className="flex items-center justify-between gap-4"

// Grid
className="grid grid-cols-3 gap-4"

// Responsive
className="md:grid-cols-2 lg:grid-cols-3"

// States
className="hover:bg-blue-700 focus:ring-2 disabled:opacity-50"
```

## 🔗 Quick Links

- Frontend: http://localhost:5173
- API Gateway: http://localhost:8080
- PostgreSQL: localhost:5432
- NATS: localhost:4222

## ✅ Pre-Flight Checklist

- [ ] Node.js installed (16+)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` configured
- [ ] API Gateway running (port 8080)
- [ ] Database ready
- [ ] Dev server started (`npm run dev`)

## 🎬 Next Steps

1. Run `npm install`
2. Run `npm run dev`
3. Test login/register
4. Create a post
5. View feed
6. Check notifications

## 📞 Need Help?

1. Check the documentation files
2. Review browser console (F12)
3. Check network tab for API errors
4. Verify `.env.local` configuration
5. Ensure API Gateway is running

---

**Ready to build something awesome!** 🚀
