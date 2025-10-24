// Helper functions for JWT tokens

// Read and decode a JWT token
export function parseJwt(token) {
    try {
        const base64 = token.split('.')[1];      // Get the middleware part of the token
        return JSON.parse(atob(base64));         // Decode it from base64 and read as JSON
    } catch {
        return null;                             // Return null if something goes wrong
    }
    }

    // Get the logged-in user's email from the stores JWT
    export function getUserEmail() {
    const token = localStorage.getItem("token");       // Get token from local storage
    const payload = parseJwt(token);                   // Decode the token
    return payload?.email?.toLowerCase().trim();       // Return the email if it exists
}
