import React from 'react';
import { useAuth } from '../features/auth/AuthContext';
import './Dashboard.css';

/**
 * Protected Dashboard Component
 * 
 * Only renders when user is authenticated with a valid access token.
 * Shows user information and provides sign-out functionality.
 */
const Dashboard = () => {
  const { user, token, signOut } = useAuth();

  // Extract user info from decoded token
  const displayName = user?.name || user?.preferred_username || user?.email || 'User';
  const email = user?.email || user?.preferred_username || 'N/A';

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Welcome to Your Dashboard</h1>
          <button onClick={signOut} className="btn btn-signout">
            Sign Out
          </button>
        </div>

        <div className="user-info-section">
          <h2>User Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Display Name:</span>
              <span className="info-value">{displayName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{email}</span>
            </div>
            {user?.sub && (
              <div className="info-item">
                <span className="info-label">User ID:</span>
                <span className="info-value">{user.sub}</span>
              </div>
            )}
          </div>
        </div>

        <div className="token-section">
          <h3>Access Token</h3>
          <div className="token-display">
            <code>{token ? `${token.substring(0, 50)}...` : 'No token available'}</code>
          </div>
          <p className="token-info">
            This access token can be used to authenticate API requests to your backend services.
          </p>
        </div>

        <div className="debug-section">
          <details>
            <summary>Full Token Payload (Debug)</summary>
            <pre className="debug-payload">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
