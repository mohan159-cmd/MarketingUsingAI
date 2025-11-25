import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import Dashboard from './components/Dashboard';

/**
 * Main App Router Component
 * Handles navigation between SignIn, SignUp, and Dashboard
 */
function AppRouter() {
  const { user, token } = useAuth();
  const [currentView, setCurrentView] = useState('signin'); // 'signin' | 'signup' | 'dashboard'

  // If user is authenticated, show Dashboard
  if (token && user) {
    return <Dashboard />;
  }

  // Otherwise show SignIn or SignUp based on current view
  if (currentView === 'signup') {
    return (
      <div>
        <SignUpForm />
        {/* Override link behavior to use state */}
        <style>{`
          .signup-footer a {
            cursor: pointer;
          }
        `}</style>
        <script>{`
          document.addEventListener('click', (e) => {
            if (e.target.matches('.signup-footer a')) {
              e.preventDefault();
            }
          });
        `}</script>
      </div>
    );
  }

  return (
    <div>
      <SignInForm />
      {/* Override link behavior to use state */}
      <style>{`
        .signin-footer a {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

/**
 * Main App Component
 * Wraps everything in AuthProvider
 */
function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
