import { MsalProvider } from '@azure/msal-react';
import './App.css';
import { msalConfig } from './features/auth/authConfig';
import LoginButton from './features/auth/LoginButton';
import { PublicClientApplication } from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication(msalConfig);
await msalInstance.initialize();

function App() {
  
  return (
    <MsalProvider instance={msalInstance}>
      <div>
        <LoginButton />
      </div>
    </MsalProvider>
  );
}

export default App;
