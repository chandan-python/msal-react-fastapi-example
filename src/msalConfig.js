// msalConfig.js
export const msalConfig = {
    auth: {
      clientId: "9a5a3ecb-f66c-4ca4-870e-65384058db43", // Replace with your Azure AD app's client ID
      authority: 'https://login.microsoftonline.com/chandanp20kgmail.onmicrosoft.com', // Replace with your tenant ID or subdomain
      redirectUri: "http://localhost:3000/upload", // Should match what you've set in Azure portal
    },
    cache: {
      cacheLocation: "sessionStorage", // You can also use localStorage
      storeAuthStateInCookie: false, // Set to true if you have issues on IE/Edge
    },
  };
  
  export const loginRequest = {
    scopes: ["User.Read"], // The permissions you want to request
  };
  