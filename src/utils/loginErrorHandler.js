// Simple utility for handling login errors
class LoginErrorHandler {
  constructor() {
    this.currentLoginError = '';
  }

  setLoginError(errorMessage) {
    console.error('Login Error:', errorMessage);
    this.currentLoginError = errorMessage;
    // Always route to landing page when error occurs
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }

  getLoginError() {
    return this.currentLoginError;
  }

  clearLoginError() {
    this.currentLoginError = '';
  }
}

// Create singleton instance
const loginErrorHandler = new LoginErrorHandler();

export default loginErrorHandler;