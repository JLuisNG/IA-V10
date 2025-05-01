// services/PasswordRecoveryService.js

class PasswordRecoveryService {
    /**
     * Iniciar el proceso de recuperación de contraseña
     * @param {string} email - Correo del usuario
     * @returns {Promise<Object>} Resultado del proceso
     */
    static async initiatePasswordRecovery(email) {
      try {
        // Simular validación de correo
        const isValidEmail = this.validateEmail(email);
        if (!isValidEmail) {
          return {
            success: false,
            error: 'Invalid email format'
          };
        }
        
        // Simular verificación de que el correo existe en el sistema
        const userExists = await this.checkEmailExists(email);
        if (!userExists) {
          // Por seguridad, no informamos si el correo existe o no
          // Simulamos éxito incluso si no existe
          return {
            success: true,
            message: 'If your email is registered, you will receive reset instructions'
          };
        }
        
        // Generar token de recuperación
        const token = this.generateRecoveryToken();
        
        // Guardar token (en producción esto se haría en la base de datos)
        this.storeRecoveryToken(email, token);
        
        // Simular envío de correo
        await this.sendRecoveryEmail(email, token);
        
        return {
          success: true,
          message: 'Reset instructions sent to your email'
        };
      } catch (error) {
        console.error('Error initiating password recovery:', error);
        return {
          success: false,
          error: 'Failed to process recovery request'
        };
      }
    }
    
    /**
     * Validar formato de correo
     * @param {string} email - Correo a validar
     * @returns {boolean} - True si es válido
     */
    static validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    
    /**
     * Verificar si el correo existe en el sistema
     * @param {string} email - Correo a verificar
     * @returns {Promise<boolean>} - True si existe
     */
    static async checkEmailExists(email) {
      // En producción, verificar en base de datos
      // Esta es una simulación para propósitos de demostración
      
      // Lista de correos conocidos (usuarios válidos para la demo)
      const knownEmails = [
        'jluis@example.com',
        'javier@example.com',
        'Alex@example.com',
        'Justin@example.com',
        'arya@example.com',
        'Cohen@example.com'
      ];
      
      return knownEmails.includes(email.toLowerCase());
    }
    
    /**
     * Generar token único para recuperación
     * @returns {string} Token generado
     */
    static generateRecoveryToken() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const timestamp = Date.now().toString(36);
      let token = timestamp + '-';
      
      for (let i = 0; i < 32; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      return token;
    }
    
    /**
     * Almacenar token de recuperación
     * @param {string} email - Correo del usuario
     * @param {string} token - Token generado
     */
    static storeRecoveryToken(email, token) {
      try {
        // En producción, almacenar en base de datos con tiempo de expiración
        // Para la demo, usamos localStorage como simulación
        
        const recoveryData = {
          email,
          token,
          createdAt: Date.now(),
          expiresAt: Date.now() + (60 * 60 * 1000) // 1 hora de validez
        };
        
        // Obtener tokens existentes
        const storedTokens = JSON.parse(localStorage.getItem('recovery_tokens') || '[]');
        
        // Filtrar tokens antiguos del mismo usuario
        const updatedTokens = storedTokens.filter(item => item.email !== email);
        
        // Agregar nuevo token
        updatedTokens.push(recoveryData);
        
        // Guardar en localStorage
        localStorage.setItem('recovery_tokens', JSON.stringify(updatedTokens));
        
        return true;
      } catch (error) {
        console.error('Error storing recovery token:', error);
        return false;
      }
    }
    
    /**
     * Simular envío de correo de recuperación
     * @param {string} email - Correo del destinatario
     * @param {string} token - Token de recuperación
     * @returns {Promise<boolean>} - Resultado del envío
     */
    static async sendRecoveryEmail(email, token) {
      // En producción, integrar con servicio de correo real
      // Esta es solo una simulación
      
      console.log(`Simulating sending recovery email to: ${email}`);
      console.log(`Recovery link would include token: ${token}`);
      
      // Simular retraso de red
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Recovery email sent successfully (simulated)');
          resolve(true);
        }, 1500);
      });
    }
    
    /**
     * Verificar validez de un token de recuperación
     * @param {string} token - Token a verificar
     * @returns {Promise<Object>} - Resultado de la verificación
     */
    static async verifyRecoveryToken(token) {
      try {
        // Obtener tokens almacenados
        const storedTokens = JSON.parse(localStorage.getItem('recovery_tokens') || '[]');
        
        // Buscar token
        const tokenData = storedTokens.find(item => item.token === token);
        
        // Si no se encuentra el token
        if (!tokenData) {
          return {
            valid: false,
            error: 'Invalid or expired recovery token'
          };
        }
        
        // Verificar expiración
        const now = Date.now();
        if (now > tokenData.expiresAt) {
          return {
            valid: false,
            error: 'Recovery token has expired',
            expired: true
          };
        }
        
        return {
          valid: true,
          email: tokenData.email
        };
      } catch (error) {
        console.error('Error verifying recovery token:', error);
        return {
          valid: false,
          error: 'Failed to verify token'
        };
      }
    }
    
    /**
     * Restablecer contraseña
     * @param {string} token - Token de recuperación
     * @param {string} newPassword - Nueva contraseña
     * @returns {Promise<Object>} - Resultado del proceso
     */
    static async resetPassword(token, newPassword) {
      try {
        // Verificar token
        const verification = await this.verifyRecoveryToken(token);
        
        if (!verification.valid) {
          return {
            success: false,
            error: verification.error
          };
        }
        
        // Validar nueva contraseña
        const passwordValidation = this.validatePassword(newPassword);
        if (!passwordValidation.valid) {
          return {
            success: false,
            error: passwordValidation.error
          };
        }
        
        // En producción, actualizar contraseña en base de datos
        // Para la demo, simulamos actualización
        
        const email = verification.email;
        
        // Simular actualización (aquí iría la lógica real)
        const updateResult = await this.simulatePasswordUpdate(email, newPassword);
        
        if (updateResult) {
          // Invalidar token utilizado
          this.invalidateRecoveryToken(token);
          
          return {
            success: true,
            message: 'Password has been successfully reset'
          };
        } else {
          return {
            success: false,
            error: 'Failed to update password'
          };
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        return {
          success: false,
          error: 'An unexpected error occurred'
        };
      }
    }
    
    /**
     * Validar nueva contraseña
     * @param {string} password - Contraseña a validar
     * @returns {Object} - Resultado de validación
     */
    static validatePassword(password) {
      if (!password || password.length < 8) {
        return {
          valid: false,
          error: 'Password must be at least 8 characters long'
        };
      }
      
      // Verificar mayúsculas
      if (!/[A-Z]/.test(password)) {
        return {
          valid: false,
          error: 'Password must contain at least one uppercase letter'
        };
      }
      
      // Verificar números
      if (!/[0-9]/.test(password)) {
        return {
          valid: false,
          error: 'Password must contain at least one number'
        };
      }
      
      return { valid: true };
    }
    
    /**
     * Simular actualización de contraseña
     * @param {string} email - Correo del usuario
     * @param {string} newPassword - Nueva contraseña
     * @returns {Promise<boolean>} - Éxito de la actualización
     */
    static async simulatePasswordUpdate(email, newPassword) {
      // En una aplicación real, aquí se actualizaría la contraseña en la base de datos
      
      // Para la demo, simplemente simulamos éxito
      return new Promise(resolve => {
        setTimeout(() => {
          console.log(`Password for ${email} would be updated to: ${newPassword}`);
          resolve(true);
        }, 1000);
      });
    }
    
    /**
     * Invalidar token después de usarlo
     * @param {string} token - Token a invalidar
     */
    static invalidateRecoveryToken(token) {
      try {
        // Obtener tokens almacenados
        const storedTokens = JSON.parse(localStorage.getItem('recovery_tokens') || '[]');
        
        // Filtrar token utilizado
        const updatedTokens = storedTokens.filter(item => item.token !== token);
        
        // Guardar tokens actualizados
        localStorage.setItem('recovery_tokens', JSON.stringify(updatedTokens));
        
        return true;
      } catch (error) {
        console.error('Error invalidating recovery token:', error);
        return false;
      }
    }
  }
  
  export default PasswordRecoveryService;