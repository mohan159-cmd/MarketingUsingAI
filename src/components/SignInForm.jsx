import React, { useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import './SignInForm.css';

/**
 * Multi-step Sign In Form Component
 * 
 * Flow:
 * 1. User enters email and clicks Continue
 * 2. System validates email and asks for password
 * 3. User enters password and submits
 * 4. On success, user is authenticated
 */
const SignInForm = () => {
  const { signIn, loading, error } = useAuth();
  
  // Form state
  const [step, setStep] = useState(1); // 1 = email, 2 = password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);

  /**
   * Handle email submission (Step 1)
   */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!email) {
      setFormError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Move to password step
    setStep(2);
  };

  /**
   * Handle password submission (Step 2)
   */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!password) {
      setFormError('Please enter your password');
      return;
    }

    try {
      await signIn(email, password);
      // Success - AuthContext will update and user will be redirected
    } catch (err) {
      setFormError(err.message || 'Sign in failed. Please try again.');
    }
  };

  /**
   * Go back to email step
   */
  const handleBack = () => {
    setStep(1);
    setPassword('');
    setFormError(null);
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2>Sign In</h2>
        <p className="signin-subtitle">
          {step === 1 
            ? 'Enter your email to continue' 
            : `Enter your password for ${email}`}
        </p>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="signin-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoFocus
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            {formError && (
              <div className="error-message">
                {formError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Processing...' : 'Continue'}
            </button>
          </form>
        )}

        {/* Step 2: Password Input */}
        {step === 2 && (
          <form onSubmit={handlePasswordSubmit} className="signin-form">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoFocus
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            {(formError || error) && (
              <div className="error-message">
                {formError || error}
              </div>
            )}

            <div className="button-group">
              <button 
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="btn btn-secondary"
              >
                Back
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        )}

        <div className="signin-footer">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
