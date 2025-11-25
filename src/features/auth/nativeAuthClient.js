import { nativeAuthConfig } from "./nativeAuth";

const { clientId, baseUrl } = nativeAuthConfig;

/**
 * Helper function to make POST requests with JSON payloads
 */
async function postJson(path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = data.error_description || data.error || "Unknown error";
    throw new Error(msg);
  }
  return data;
}

/**
 * Native Authentication Client for Microsoft Entra External ID
 * 
 * Implements the 3-step sign-in flow:
 * 1. initiate - Start the sign-in with email
 * 2. challenge - Submit password or OTP
 * 3. token - Exchange continuation token for access token
 */
export const nativeAuthClient = {
  /**
   * Step 1: Initiate sign-in with email
   * @param {string} email - User's email address
   * @returns {Promise<{continuation_token: string, challenge_type?: string, interaction_id?: string}>}
   */
  async initiateSignIn(email) {
    return await postJson("/signin/v1.0/initiate", {
      client_id: clientId,
      username: email,
    });
  },

  /**
   * Step 2: Challenge with password
   * @param {string} continuationToken - Token from initiate step
   * @param {string} password - User's password
   * @returns {Promise<{continuation_token: string}>}
   */
  async challengeSignIn(continuationToken, password) {
    return await postJson("/signin/v1.0/challenge", {
      client_id: clientId,
      continuation_token: continuationToken,
      password,
    });
  },

  /**
   * Step 3: Get access token
   * @param {string} continuationToken - Token from challenge step
   * @returns {Promise<{access_token: string, id_token: string, refresh_token?: string, expires_in?: number}>}
   */
  async getToken(continuationToken) {
    return await postJson("/signin/v1.0/token", {
      client_id: clientId,
      continuation_token: continuationToken,
      grant_type: "continuation_token",
    });
  },

  /**
   * Complete sign-in flow (all 3 steps)
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<{access_token: string, id_token: string}>}
   */
  async signIn(email, password) {
    // Step 1: Initiate
    const initiateResponse = await this.initiateSignIn(email);
    
    // Step 2: Challenge
    const challengeResponse = await this.challengeSignIn(
      initiateResponse.continuation_token,
      password
    );
    
    // Step 3: Get token
    const tokenResponse = await this.getToken(
      challengeResponse.continuation_token
    );
    
    return {
      access_token: tokenResponse.access_token,
      id_token: tokenResponse.id_token,
    };
  },

  /**
   * Sign-up flow (optional)
   * @param {string} email
   * @param {string} password
   * @param {Object} attributes - User attributes like givenName, surname
   * @returns {Promise<{access_token: string, id_token: string}>}
   */
  async signUp(email, password, attributes = {}) {
    // Step 1: Initiate signup
    const initiateResponse = await postJson("/signup/v1.0/start", {
      client_id: clientId,
      username: email,
      password,
      attributes,
    });

    // Step 2: Continue signup (if needed)
    const continueResponse = await postJson("/signup/v1.0/continue", {
      client_id: clientId,
      continuation_token: initiateResponse.continuation_token,
    });

    // Step 3: Get token
    const tokenResponse = await postJson("/signup/v1.0/token", {
      client_id: clientId,
      continuation_token: continueResponse.continuation_token,
      grant_type: "continuation_token",
    });

    return {
      access_token: tokenResponse.access_token,
      id_token: tokenResponse.id_token,
    };
  },
};
