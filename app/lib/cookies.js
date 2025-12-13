// Cookie utility functions for token management

export const setToken = (token) => {
  if (typeof document !== 'undefined') {
    // Set cookie with 1 day expiry
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  }
};

export const getToken = () => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'auth_token') {
        return value;
      }
    }
  }
  return null;
};

export const removeToken = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};
