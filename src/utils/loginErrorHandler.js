import { ref } from 'vue';
import router from '@/router/index';
// Simple reactive utility for handling login errors
class LoginErrorHandler {
  constructor() {
    this.currentLoginError = ref('');
  }

  setLoginError(errorMessage) {
    console.error('Login Error:', errorMessage);
    this.currentLoginError.value = errorMessage;
    // Always route to landing page when error occurs
    router.push({ name: 'landing' });



  }

  getLoginError() {
    return this.currentLoginError.value;
  }

  clearLoginError() {
    this.currentLoginError.value = '';
  }
  // Helper method to get the reactive state
  getErrorRef() {
    return this.currentLoginError;
  }
}

// Create singleton instance
const loginErrorHandler = new LoginErrorHandler();

export default loginErrorHandler;
