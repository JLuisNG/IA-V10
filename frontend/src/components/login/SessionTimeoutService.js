// services/SessionTimeoutService.js

const DEFAULT_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
const WARNING_TIME = 60 * 1000; // Show warning 1 minute before timeout
const ACTIVITY_EVENTS = [
  'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'
];

class SessionTimeoutService {
  constructor(options = {}) {
    this.timeout = options.timeout || DEFAULT_TIMEOUT;
    this.warningTime = options.warningTime || WARNING_TIME;
    this.onTimeout = options.onTimeout || this.defaultTimeout;
    this.onWarning = options.onWarning || this.defaultWarning;
    this.onActivityDetected = options.onActivityDetected || this.defaultActivityDetected;
    
    this.timeoutId = null;
    this.warningId = null;
    this.warningDisplayed = false;
    this.isActive = false;
  }

  /**
   * Start tracking session activity
   */
  startTracking() {
    if (this.isActive) {
      return;
    }
    
    this.isActive = true;
    this.resetTimeout();
    
    // Add event listeners for user activity
    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, this.handleUserActivity.bind(this));
    });
    
    console.log('Session timeout tracking started');
  }

  /**
   * Stop tracking session activity
   */
  stopTracking() {
    if (!this.isActive) {
      return;
    }
    
    this.isActive = false;
    this.clearTimeouts();
    
    // Remove event listeners
    ACTIVITY_EVENTS.forEach(event => {
      window.removeEventListener(event, this.handleUserActivity.bind(this));
    });
    
    console.log('Session timeout tracking stopped');
  }

  /**
   * Handle user activity
   */
  handleUserActivity() {
    if (!this.isActive) {
      return;
    }
    
    // If warning is displayed and user is active, hide it
    if (this.warningDisplayed) {
      this.warningDisplayed = false;
      this.onActivityDetected();
    }
    
    this.resetTimeout();
  }

  /**
   * Reset the timeout countdown
   */
  resetTimeout() {
    this.clearTimeouts();
    
    // Set timeout for warning
    this.warningId = setTimeout(() => {
      this.warningDisplayed = true;
      this.onWarning(Math.round(this.warningTime / 1000));
    }, this.timeout - this.warningTime);
    
    // Set timeout for session expiration
    this.timeoutId = setTimeout(() => {
      this.isActive = false;
      this.onTimeout();
    }, this.timeout);
  }

  /**
   * Clear all timeouts
   */
  clearTimeouts() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    if (this.warningId) {
      clearTimeout(this.warningId);
    }
  }

  /**
   * Extend the current session
   */
  extendSession() {
    if (!this.isActive) {
      return;
    }
    
    this.warningDisplayed = false;
    this.resetTimeout();
  }

  /**
   * Default timeout handler
   */
  defaultTimeout() {
    console.log('Session timed out');
    // Logout user
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  }

  /**
   * Default warning handler
   */
  defaultWarning(remainingSeconds) {
    console.log(`Session will timeout in ${remainingSeconds} seconds`);
  }

  /**
   * Default activity detected handler
   */
  defaultActivityDetected() {
    console.log('User activity detected, resetting timeout');
  }
}

// Singleton instance
let sessionTimeoutInstance = null;

const createSessionTimeout = (options = {}) => {
  if (!sessionTimeoutInstance) {
    sessionTimeoutInstance = new SessionTimeoutService(options);
  }
  return sessionTimeoutInstance;
};

export default createSessionTimeout;