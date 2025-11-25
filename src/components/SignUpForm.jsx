import React, { useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import './SignUpForm.css';

/**
 * Sign Up Form Component
 * 
 * Allows new users to create an account with email, password, and basic info
 */
const SignUpForm = () => {
  const { signUp, loading, error } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    givenName: '',
    surname: '',
  });
  const [formError, setFormError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState('');

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength on password field change
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  /**
   * Simple password strength checker
   */
  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength('');
      return;
    }
    
    if (password.length < 8) {
      setPasswordStrength('weak');
      return;
    }
    
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (strength >= 3) setPasswordStrength('strong');
    else if (strength >= 2) setPasswordStrength('medium');
    else setPasswordStrength('weak');
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return false;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }

    // Name validation
    if (!formData.givenName.trim()) {
      setFormError('Please enter your first name');
      return false;
    }

    if (!formData.surname.trim()) {
      setFormError('Please enter your last name');
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const attributes = {
        givenName: formData.givenName.trim(),
        surname: formData.surname.trim(),
      };

      await signUp(formData.email, formData.password, attributes);
      // Success - AuthContext will update and user will be redirected
    } catch (err) {
      setFormError(err.message || 'Sign up failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        <p className="signup-subtitle">Sign up to get started</p>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="givenName">First Name</label>
              <input
                id="givenName"
                name="givenName"
                type="text"
                value={formData.givenName}
                onChange={handleChange}
                placeholder="John"
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="surname">Last Name</label>
              <input
                id="surname"
                name="surname"
                type="text"
                value={formData.surname}
                onChange={handleChange}
                placeholder="Doe"
                required
                disabled={loading}
                className="form-input"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              required
              disabled={loading}
              className="form-input"
            />
            {passwordStrength && (
              <div className={`password-strength ${passwordStrength}`}>
                Password strength: <strong>{passwordStrength}</strong>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          {/* Error Messages */}
          {(formError || error) && (
            <div className="error-message">
              {formError || error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="signup-footer">
          <p>Already have an account? <a href="/signin">Sign in</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
