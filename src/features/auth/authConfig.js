/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 * 
 * https://alt360stage.ciamlogin.com/alt360stage.onmicrosoft.com/oauth2/v2.0/authorize?client_id=91ff64e8-13c8-483a-9ec4-7e075e26f879&nonce=DU-FSxIOF5&redirect_uri=http://localhost:3000/&scope=openid&response_type=id_token&prompt=login
 */



export const msalConfig = {
    auth: {
        clientId: "11b01f7d-304f-4961-9947-a4d27a2a7f55",
        authority: "https://alt360products.ciamlogin.com/18b48599-a65d-4c87-9e8f-1e18b93c118f",
        redirectUri: "/UserDashboard", // Indicates the page to navigate after login.
        postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
        navigateToLoginRequestUrl: false
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {	
        loggerOptions: {	
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }	
            }	
        }	
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
// export const loginRequest = {
//     scopes: ["User.Read"]
// };

export const loginRequest = {
    scopes: ["openid", "profile"],
    extraQueryParameters: {
        domain_hint: "SignUpSignIn" // Your user flow name
    }
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com",
};
