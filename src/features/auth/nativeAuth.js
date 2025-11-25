/**
 * Configuration for Microsoft Entra External ID Native Authentication
 * 
 * Replace these values with your actual tenant information:
 * - clientId: Your Application (client) ID from Azure portal
 * - tenantSubdomain: Your tenant subdomain (e.g., "abcproducts" for abcproducts.onmicrosoft.com)
 * - tenantDomain: Full tenant domain (e.g., "abcproducts.onmicrosoft.com")
 */
export const nativeAuthConfig = {
  clientId: "91ff64e8-13c8-483a-9ec4-7e075e26f879",
  tenantSubdomain: "alt360stage",
  tenantDomain: "alt360stage.onmicrosoft.com",
  // Base URL for native auth API calls
  get baseUrl() {
    return `https://${this.tenantSubdomain}.ciamlogin.com/${this.tenantDomain}`;
  }
};
