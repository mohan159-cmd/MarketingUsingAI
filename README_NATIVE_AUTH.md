# Microsoft Entra External ID Native Authentication - React App

This React application demonstrates **Microsoft Entra External ID Native Authentication** using the REST API flow.

## 🎯 Features

- ✅ **Multi-step Sign-In Flow**: Email → Password → Token
- ✅ **Sign-Up Flow**: Complete user registration with attributes
- ✅ **Auth Context**: Centralized authentication state management
- ✅ **Protected Dashboard**: Only accessible with valid access token
- ✅ **Token Management**: Automatic token storage in sessionStorage
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Loading States**: Visual feedback during API calls

## 📁 Project Structure

```
src/
├── features/
│   └── auth/
│       ├── nativeAuth.js           # Configuration (clientId, tenant)
│       ├── nativeAuthClient.js     # API client (3-step flow)
│       └── AuthContext.jsx         # Auth state management
├── components/
│   ├── SignInForm.jsx              # Multi-step sign-in UI
│   ├── SignInForm.css
│   ├── SignUpForm.jsx              # Registration UI
│   ├── SignUpForm.css
│   ├── Dashboard.jsx               # Protected dashboard
│   └── Dashboard.css
└── App.jsx                         # Main app with routing
```

## 🔐 Authentication Flow

### Sign-In Flow (3 Steps)

1. **Initiate** - User enters email
   ```
   POST https://{tenant}.ciamlogin.com/{tenant}.onmicrosoft.com/signin/v1.0/initiate
   ```

2. **Challenge** - User enters password
   ```
   POST https://{tenant}.ciamlogin.com/{tenant}.onmicrosoft.com/signin/v1.0/challenge
   ```

3. **Token** - Exchange continuation token for access token
   ```
   POST https://{tenant}.ciamlogin.com/{tenant}.onmicrosoft.com/signin/v1.0/token
   ```

### Sign-Up Flow

Similar 3-step flow with user attributes (givenName, surname)

## ⚙️ Configuration

Update `src/features/auth/nativeAuth.js` with your tenant details:

```javascript
export const nativeAuthConfig = {
  clientId: "YOUR_CLIENT_ID",              // From Azure Portal
  tenantSubdomain: "YOUR_TENANT_SUBDOMAIN", // e.g., "abcproducts"
  tenantDomain: "YOUR_TENANT.onmicrosoft.com",
};
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure your tenant** (see Configuration section above)

3. **Run the app**:
   ```bash
   npm start
   ```

4. **Open** http://localhost:3000

## 📦 Components

### AuthContext
Provides authentication state and functions throughout the app:
- `user` - Decoded user information from token
- `token` - Access token
- `signIn(email, password)` - Sign-in function
- `signUp(email, password, attributes)` - Sign-up function
- `signOut()` - Clear authentication state
- `loading` - Loading state
- `error` - Error messages

### SignInForm
Multi-step sign-in component:
- Step 1: Email entry with validation
- Step 2: Password entry
- Error handling and loading states
- Auto-redirects to Dashboard on success

### SignUpForm
User registration component:
- Collects first name, last name, email, password
- Password strength indicator
- Password confirmation
- Form validation

### Dashboard
Protected component showing:
- User information
- Access token (truncated)
- Sign-out button
- Full token payload (debug view)

## 🔑 API Endpoints

All endpoints are in `nativeAuthClient.js`:

| Method | Description |
|--------|-------------|
| `initiateSignIn(email)` | Start sign-in with email |
| `challengeSignIn(token, password)` | Submit password |
| `getToken(token)` | Get access token |
| `signIn(email, password)` | Complete flow (all 3 steps) |
| `signUp(email, password, attrs)` | Complete sign-up flow |

## 🛠️ TypeScript Interfaces

While this implementation uses JavaScript, here are the key types:

```typescript
// Request/Response types
type InitiateResponse = {
  continuation_token: string;
  challenge_type?: string;
  interaction_id?: string;
};

type ChallengeResponse = {
  continuation_token: string;
};

type TokenResponse = {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_in?: number;
};
```

## 🔒 Security Notes

- Tokens are stored in `sessionStorage` (cleared on tab close)
- HTTPS required for production
- Implement proper CORS configuration
- Consider using refresh tokens for long sessions
- Add CSRF protection for production apps

## 📝 To-Do for Production

- [ ] Add refresh token handling
- [ ] Implement token expiration checks
- [ ] Add proper routing (React Router)
- [ ] Error boundary components
- [ ] Unit tests for auth flows
- [ ] E2E tests with Playwright/Cypress
- [ ] Accessibility improvements
- [ ] Internationalization (i18n)

## 🐛 Troubleshooting

### CORS Errors
Ensure your Azure app registration has the correct redirect URIs and CORS settings.

### Token Decode Errors
Check that your tenant is configured correctly and returning valid JWT tokens.

### API Errors
Verify your `clientId` and tenant configuration in `nativeAuth.js`.

## 📚 Resources

- [Microsoft Entra External ID Docs](https://learn.microsoft.com/entra/external-id/)
- [Native Authentication API Reference](https://learn.microsoft.com/entra/external-id/customers/reference-native-authentication-api)
- [Azure Portal](https://portal.azure.com)

## 📄 License

MIT

---

**Built with** ❤️ using Microsoft Entra External ID Native Authentication
