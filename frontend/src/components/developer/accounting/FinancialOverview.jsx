import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import '../../../styles/developer/accounting/FinancialOverview.scss';

const FinancialOverview = ({ stats }) => {
  const [animatedValues, setAnimatedValues] = useState({
    totalBilled: 0,
    pendingPayments: 0,
    completedPayments: 0
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const controls = useAnimation();
  
  // Observe when component enters viewport for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [controls]);
  
  // Animate values with improved easing
  useEffect(() => {
    if (stats && isVisible) {
      const duration = 1800; // Slightly longer for more fluid animation
      const steps = 60; // Animation steps (for 60fps)
      const stepTime = duration / steps;
      let step = 0;
      
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        
        // Improved easing function for smoother animation with slight bounce
        const easedProgress = progress < 0.8 
          ? 1.1 * Math.pow(progress, 2) / (2 * (Math.pow(progress, 2) - progress) + 1)
          : 1 - Math.pow(1 - progress, 3);
        
        setAnimatedValues({
          totalBilled: Math.round(easedProgress * stats.totalBilled * 100) / 100,
          pendingPayments: Math.round(easedProgress * stats.pendingPayments * 100) / 100,
          completedPayments: Math.round(easedProgress * stats.completedPayments * 100) / 100
        });
        
        if (step >= steps) {
          clearInterval(interval);
        }
      }, stepTime);
      
      return () => clearInterval(interval);
    }
  }, [stats, isVisible]);
  
  // Format currency values with improved formatting
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Calculate percentage of completed payments
  const calculateCompletionPercentage = () => {
    if (!stats || stats.totalBilled === 0) return 0;
    return Math.round((stats.completedPayments / stats.totalBilled) * 100);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.1,
        staggerChildren: 0.15,
        duration: 0.5
      }
    }
  };
  
  const cardVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.5
      }
    }
  };
  
  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
        delay: 0.2
      }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4, 
        delay: 0.3 
      }
    }
  };
  
  const progressVariants = {
    hidden: { width: 0 },
    visible: { 
      width: `${calculateCompletionPercentage()}%`,
      transition: { 
        duration: 1.2, 
        delay: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="financial-overview-section"
      ref={sectionRef}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <div className="section-header">
        <motion.h2 variants={textVariants}>
          <motion.i 
            className="fas fa-chart-line"
            variants={iconVariants}
          ></motion.i>
          Financial Overview
        </motion.h2>
      </div>
      
      <div className="metrics-container">
        <motion.div 
          className="metric-card total-billed" 
          variants={cardVariants}
          // Se eliminó la animación de elevación (whileHover)
        >
          <motion.div 
            className="metric-icon"
            variants={iconVariants}
          >
            <i className="fas fa-file-invoice-dollar"></i>
          </motion.div>
          <div className="metric-content">
            <motion.h3 
              className="metric-title"
              variants={textVariants}
            >
              Total Billed
            </motion.h3>
            <motion.div 
              className="metric-value"
              variants={textVariants}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {formatCurrency(animatedValues.totalBilled)}
            </motion.div>
            <motion.div 
              className="metric-footer"
              variants={textVariants}
            >
              <div className="metric-subtitle">Current billing period</div>
            </motion.div>
          </div>
          <div className="card-background-effect"></div>
        </motion.div>
        
        <motion.div 
          className="metric-card pending-payments" 
          variants={cardVariants}
          // Se eliminó la animación de elevación (whileHover)
        >
          <motion.div 
            className="metric-icon"
            variants={iconVariants}
          >
            <i className="fas fa-hourglass"></i>
          </motion.div>
          <div className="metric-content">
            <motion.h3 
              className="metric-title"
              variants={textVariants}
            >
              Pending Payments
            </motion.h3>
            <motion.div 
              className="metric-value"
              variants={textVariants}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {formatCurrency(animatedValues.pendingPayments)}
            </motion.div>
            <motion.div 
              className="metric-footer"
              variants={textVariants}
            >
              <motion.div 
                className="badge awaiting"
              >
                <i className="fas fa-clock"></i>
                <span>Awaiting Verification</span>
              </motion.div>
            </motion.div>
          </div>
          <div className="card-background-effect"></div>
        </motion.div>
        
        <motion.div 
          className="metric-card completed-payments" 
          variants={cardVariants}
          // Se eliminó la animación de elevación (whileHover)
        >
          <motion.div 
            className="metric-icon"
            variants={iconVariants}
          >
            <i className="fas fa-check-circle"></i>
          </motion.div>
          <div className="metric-content">
            <motion.h3 
              className="metric-title"
              variants={textVariants}
            >
              Completed Payments
            </motion.h3>
            <motion.div 
              className="metric-value"
              variants={textVariants}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {formatCurrency(animatedValues.completedPayments)}
            </motion.div>
            <motion.div 
              className="metric-footer"
              variants={textVariants}
            >
              <div className="completion-progress">
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    variants={progressVariants}
                  >
                    <div className="progress-shine"></div>
                  </motion.div>
                </div>
                <motion.span 
                  className="progress-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                >
                  {calculateCompletionPercentage()}% of total
                </motion.span>
              </div>
            </motion.div>
          </div>
          <div className="card-background-effect"></div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FinancialOverview;