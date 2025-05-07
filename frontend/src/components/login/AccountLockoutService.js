// services/AccountLockoutService.js
const LOCKOUT_STORAGE_KEY = 'user_lockout_data';
const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION = 10 * 30 * 1000; // 30 minutes in milliseconds

class AccountLockoutService {
  /**
   * Get lockout data for a specific username
   * @param {string} username 
   * @returns {Object|null} Lockout data or null if not found
   */
  static getLockoutData(username) {
    try {
      const lockoutData = JSON.parse(localStorage.getItem(LOCKOUT_STORAGE_KEY)) || {};
      return lockoutData[username] || null;
    } catch (error) {
      console.error('Error retrieving lockout data:', error);
      return null;
    }
  }

  /**
   * Save lockout data for a specific username
   * @param {string} username 
   * @param {Object} data 
   */
  static saveLockoutData(username, data) {
    try {
      const lockoutData = JSON.parse(localStorage.getItem(LOCKOUT_STORAGE_KEY)) || {};
      lockoutData[username] = data;
      localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(lockoutData));
    } catch (error) {
      console.error('Error saving lockout data:', error);
    }
  }

  /**
   * Check if an account is currently locked
   * @param {string} username 
   * @returns {Object} Status object with isLocked flag and remainingTime
   */
  static checkAccountLocked(username) {
    const lockoutData = this.getLockoutData(username);
    
    if (!lockoutData || !lockoutData.lockedUntil) {
      return { isLocked: false, remainingTime: 0 };
    }
    
    const currentTime = new Date().getTime();
    const lockedUntil = lockoutData.lockedUntil;
    
    if (currentTime < lockedUntil) {
      // Account is still locked
      const remainingTime = Math.ceil((lockedUntil - currentTime) / 1000); // in seconds
      return { isLocked: true, remainingTime };
    } else {
      // Lock period expired, reset the failed attempts but keep record
      this.resetLockout(username);
      return { isLocked: false, remainingTime: 0 };
    }
  }

  /**
   * Reset lockout for a username
   * @param {string} username 
   */
  static resetLockout(username) {
    const lockoutData = this.getLockoutData(username) || {};
    
    // Keep the history but reset the active lock
    lockoutData.failedAttempts = 0;
    lockoutData.lockedUntil = null;
    lockoutData.lastFailedAttempt = lockoutData.lastFailedAttempt || null;
    
    this.saveLockoutData(username, lockoutData);
  }

  /**
   * Record a failed login attempt
   * @param {string} username 
   * @returns {Object} Updated lockout status
   */
  static recordFailedAttempt(username) {
    const currentTime = new Date().getTime();
    const lockoutData = this.getLockoutData(username) || {
      failedAttempts: 0,
      lastFailedAttempt: null,
      lockedUntil: null,
      lockoutHistory: []
    };
    
    // Check if currently locked
    const lockStatus = this.checkAccountLocked(username);
    if (lockStatus.isLocked) {
      return lockStatus;
    }
    
    // Increment failed attempts
    lockoutData.failedAttempts += 1;
    lockoutData.lastFailedAttempt = currentTime;
    
    // Check if max attempts reached
    if (lockoutData.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      const lockedUntil = currentTime + LOCKOUT_DURATION;
      lockoutData.lockedUntil = lockedUntil;
      
      // Record lockout history
      lockoutData.lockoutHistory = lockoutData.lockoutHistory || [];
      lockoutData.lockoutHistory.push({
        lockedAt: currentTime,
        lockedUntil: lockedUntil,
        reason: `${MAX_FAILED_ATTEMPTS} failed login attempts`
      });
      
      this.saveLockoutData(username, lockoutData);
      return { 
        isLocked: true, 
        remainingTime: LOCKOUT_DURATION / 1000,
        attemptsRemaining: 0
      };
    }
    
    this.saveLockoutData(username, lockoutData);
    return { 
      isLocked: false, 
      remainingTime: 0,
      attemptsRemaining: MAX_FAILED_ATTEMPTS - lockoutData.failedAttempts
    };
  }

  /**
   * Record a successful login
   * @param {string} username 
   */
  static recordSuccessfulLogin(username) {
    this.resetLockout(username);
  }
}

export default AccountLockoutService;