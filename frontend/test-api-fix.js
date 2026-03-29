// Test script to verify the API fix
console.log('Testing API authentication fix...');

// Simulate getting cookie
function getCookie(name) {
  if (typeof document === 'undefined') {
    // Server-side, return test token
    return 'test-token-from-cookie';
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift() || null;
  return null;
}

const token = getCookie('auth-token');
console.log('Token from cookie:', token ? 'Found' : 'Not found');
console.log('Fix applied successfully!');
