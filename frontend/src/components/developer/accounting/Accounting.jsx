import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/login/AuthContext';
import '../../../styles/developer/accounting/Accounting.scss';
import logoImg from '../../../assets/LogoMHC.jpeg';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import LogoutAnimation from '../../../components/LogOut/LogOut';

// Component imports
import FinancialOverview from './FinancialOverview.jsx';
import MonthlyRevenueStats from './MonthlyRevenueStats.jsx';
import TherapistEarnings from './TherapistEarnings.jsx';
import TherapistDetailModal from './TherapistDetailModal.jsx';
import TopPerformers from './TopPerformers.jsx';
import DisciplineStatistics from './DisciplineStatistics.jsx';
import MonthlyDetails from './MonthlyDetails.jsx';

/**
 * ParticlesBackground Component
 * Creates an animated particle effect for the dashboard background
 * with interactive movement and dynamic color variation
 */
const ParticlesBackground = () => {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  // Initialize particles with enhanced visuals and physics properties
  useEffect(() => {
    if (!containerRef.current) return;
    
    const generateParticles = () => {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      
      // Adaptive particle count based on screen size for optimal performance
      const particlesCount = Math.min(
        Math.floor((containerWidth * containerHeight) / 12000),
        150 // Cap at 150 particles for performance
      );
      
      const newParticles = [];
      
      // Create particles with enhanced properties
      for (let i = 0; i < particlesCount; i++) {
        const size = Math.random() * 4 + 1; // Larger size range
        newParticles.push({
          id: i,
          x: Math.random() * containerWidth,
          y: Math.random() * containerHeight,
          size: size,
          opacity: Math.random() * 0.5 + 0.1,
          speedX: Math.random() * 0.6 - 0.3,
          speedY: Math.random() * 0.6 - 0.3,
          color: getParticleColor(i, particlesCount),
          // Add physics properties for more natural movement
          mass: size * 0.8, // Larger particles have more mass
          friction: 0.97 + Math.random() * 0.02,
          maxSpeed: 1.5 + Math.random(),
          interactionStrength: Math.random() * 0.3 + 0.1
        });
      }
      
      setParticles(newParticles);
    };
    
    // Generate color palette that shifts across the spectrum
    const getParticleColor = (index, total) => {
      // Create a color gradient based on position in array
      const hue = (index / total) * 180 + 180; // Range from 180-360 (cyan to blue)
      
      // Randomly select between a few preset color schemes
      const colorScheme = Math.random();
      
      if (colorScheme > 0.7) {
        return `rgba(0, 229, 255, ${Math.random() * 0.3 + 0.3})`;
      } else if (colorScheme > 0.4) {
        return `rgba(41, 121, 255, ${Math.random() * 0.3 + 0.3})`;
      } else if (colorScheme > 0.1) {
        return `hsla(${hue}, 100%, 70%, ${Math.random() * 0.3 + 0.3})`;
      } else {
        return `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.2})`;
      }
    };
    
    generateParticles();
    
    // Handle window resize for responsive particle system
    const handleResize = () => {
      generateParticles();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Mouse interaction handlers
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);
    
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    // Advanced particle animation with physics and mouse interaction
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Calculate base movement
          let newSpeedX = particle.speedX * particle.friction;
          let newSpeedY = particle.speedY * particle.friction;
          
          // Apply mouse interaction if hovering
          if (isHovering) {
            const dx = mousePosition.x - particle.x;
            const dy = mousePosition.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Only affect particles within a certain radius
            if (distance < 150) {
              // Calculate force based on distance (closer = stronger)
              const force = (150 - distance) / 150 * particle.interactionStrength;
              
              // Apply repulsion force
              newSpeedX -= (dx / distance) * force;
              newSpeedY -= (dy / distance) * force;
            }
          }
          
          // Apply speed limits
          newSpeedX = Math.max(Math.min(newSpeedX, particle.maxSpeed), -particle.maxSpeed);
          newSpeedY = Math.max(Math.min(newSpeedY, particle.maxSpeed), -particle.maxSpeed);
          
          // Calculate new position
          let newX = particle.x + newSpeedX;
          let newY = particle.y + newSpeedY;
          
          // Boundary handling with smooth bounce
          if (newX <= 0 || newX >= containerRef.current.offsetWidth) {
            newSpeedX *= -0.8; // Dampen the bounce
            newX = newX <= 0 ? 0 : containerRef.current.offsetWidth;
          }
          
          if (newY <= 0 || newY >= containerRef.current.offsetHeight) {
            newSpeedY *= -0.8; // Dampen the bounce
            newY = newY <= 0 ? 0 : containerRef.current.offsetHeight;
          }
          
          return {
            ...particle,
            x: newX,
            y: newY,
            speedX: newSpeedX,
            speedY: newSpeedY
          };
        })
      );
      
      animationFrameId = requestAnimationFrame(animateParticles);
    };
    
    let animationFrameId = requestAnimationFrame(animateParticles);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovering, mousePosition]);

  return (
    <div ref={containerRef} className="particles-container">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: particle.opacity,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            borderRadius: '50%'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

/**
 * NotificationBadge Component
 * Displays a notification count with an animated pulse effect
 */
const NotificationBadge = ({ count }) => {
  return (
    <div className="notification-badge-wrapper">
      <div className="notification-badge">
        <span>{count}</span>
        <div className="notification-pulse"></div>
      </div>
    </div>
  );
};

/**
 * UserAvatar Component
 * Displays a user avatar with status indicator and hover effects
 */
const UserAvatar = ({ initials, status, size = 'medium' }) => {
  const avatarVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, boxShadow: '0 0 15px rgba(0, 229, 255, 0.7)' }
  };
  
  return (
    <motion.div 
      className={`user-avatar ${size} ${status}`}
      variants={avatarVariants}
      whileHover="hover"
      initial="idle"
    >
      <span className="avatar-text">{initials}</span>
      <div className={`avatar-status ${status}`}></div>
      <div className="avatar-glow"></div>
    </motion.div>
  );
};

/**
 * NavButton Component
 * Enhanced navigation button with animations and active state
 */
const NavButton = ({ icon, label, isActive, onClick, disabled }) => {
  return (
    <motion.button 
      className={`nav-button ${isActive ? 'active' : ''}`} 
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
      whileTap={{ y: 0, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      disabled={disabled}
      title={label}
    >
      <i className={`fas ${icon}`}></i>
      <span>{label}</span>
      <div className="button-effect"></div>
    </motion.button>
  );
};

/**
 * LoadingSpinner Component
 * Creates an advanced loading animation with overlapping rings
 */
const LoadingSpinner = ({ progress }) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <div className="loading-spinner-middle"></div>
      <div className="loading-spinner-inner"></div>
      <div className="loading-progress-percentage">{Math.round(progress)}%</div>
    </div>
  );
};

/**
 * DevAccounting Component
 * Main financial dashboard with enhanced UI and animations
 */
const DevAccounting = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  // State management for interface and data
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuTransitioning, setMenuTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [notificationCount] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [disciplineDetails, setDisciplineDetails] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showFabMenu, setShowFabMenu] = useState(false);
  
  // Refs
  const userMenuRef = useRef(null);
  const snackbarTimerRef = useRef(null);
  
  // Enhanced payment periods with more detailed information
  const paymentPeriods = [
    { 
      id: 1, 
      period: "Jan 1 to 15, 2025", 
      paymentDate: "Feb 15, 2025", 
      status: "paid", 
      amount: 42580.50,
      processingDate: "Feb 13, 2025",
      therapistsCount: 18,
      visitsCount: 502,
      auditStatus: "Completed",
      paymentMethod: "Direct Deposit"
    },
    { 
      id: 2, 
      period: "Jan 16 to 31, 2025", 
      paymentDate: "Feb 28, 2025", 
      status: "paid", 
      amount: 39750.25,
      processingDate: "Feb 26, 2025",
      therapistsCount: 17,
      visitsCount: 468,
      auditStatus: "Completed",
      paymentMethod: "Direct Deposit" 
    },
    { 
      id: 3, 
      period: "Feb 1 to 15, 2025", 
      paymentDate: "Mar 15, 2025", 
      status: "paid", 
      amount: 44850.75,
      processingDate: "Mar 13, 2025",
      therapistsCount: 19,
      visitsCount: 528,
      auditStatus: "Completed",
      paymentMethod: "Direct Deposit" 
    },
    { 
      id: 4, 
      period: "Feb 16 to 28, 2025", 
      paymentDate: "Mar 31, 2025", 
      status: "paid", 
      amount: 42980.50,
      processingDate: "Mar 29, 2025",
      therapistsCount: 18,
      visitsCount: 506,
      auditStatus: "Completed",
      paymentMethod: "Direct Deposit" 
    },
    { 
      id: 5, 
      period: "Mar 1 to 15, 2025", 
      paymentDate: "Apr 15, 2025", 
      status: "pending", 
      amount: 45670.25,
      processingDate: "Apr 13, 2025 (Estimated)",
      therapistsCount: 20,
      visitsCount: 538,
      auditStatus: "In Progress",
      paymentMethod: "Direct Deposit" 
    },
    { 
      id: 6, 
      period: "Mar 16 to 31, 2025", 
      paymentDate: "Apr 30, 2025", 
      status: "upcoming", 
      amount: 43850.00,
      processingDate: "Apr 28, 2025 (Estimated)",
      therapistsCount: 19,
      visitsCount: 512,
      auditStatus: "Scheduled",
      paymentMethod: "Direct Deposit" 
    },
    { 
      id: 7, 
      period: "Apr 1 to 15, 2025", 
      paymentDate: "May 15, 2025", 
      status: "upcoming", 
      amount: 46200.00,
      processingDate: "May 13, 2025 (Estimated)",
      therapistsCount: 20,
      visitsCount: 545,
      auditStatus: "Not Started",
      paymentMethod: "Direct Deposit" 
    },
    { 
      id: 8, 
      period: "Apr 16 to 30, 2025", 
      paymentDate: "May 31, 2025", 
      status: "upcoming", 
      amount: 44500.00,
      processingDate: "May 29, 2025 (Estimated)",
      therapistsCount: 19,
      visitsCount: 520,
      auditStatus: "Not Started",
      paymentMethod: "Direct Deposit" 
    },
  ];

  // Helper function to get user initials
  const getInitials = useCallback((name) => {
    if (!name) return "U";
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }, []);
  
  // User data from auth context
  const userData = useMemo(() => ({
    name: currentUser?.fullname || currentUser?.username || 'Usuario',
    avatar: getInitials(currentUser?.fullname || currentUser?.username || 'Usuario'),
    email: currentUser?.email || 'usuario@ejemplo.com',
    role: currentUser?.role || 'Usuario',
    status: 'online', // online, away, busy, offline
    lastActive: 'Just now',
    notifications: notificationCount,
    stats: {
      visits: 152,
      revenue: 12850.75,
      growth: 15.2,
      completion: 97
    }
  }), [currentUser, getInitials, notificationCount]);
  
  // Detect screen size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Check initially
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load initial data with enhanced progressive animation
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setLoadingProgress(0);
      setLoadingStep(0);
      
      // Simulated data loading with realistic progress
      const simulateDataLoading = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 3;
          setLoadingProgress(Math.min(progress, 100));
          
          // Update loading steps at certain thresholds
          if (progress >= 30 && loadingStep === 0) {
            setLoadingStep(1);
          } else if (progress >= 70 && loadingStep === 1) {
            setLoadingStep(2);
          }
          
          if (progress >= 100) {
            clearInterval(interval);
            
            // Set dashboard statistics with enhanced data
            setDashboardStats({
              totalBilled: 127850.75,
              pendingPayments: 42500.25,
              completedPayments: 85350.50,
              averagePerVisit: 65.00,
              visitsByDiscipline: {
                PT: 650,
                OT: 420,
                ST: 310,
                PTA: 280,
                COTA: 175,
                STA: 120
              },
              revenueByMonth: [
                { month: 'Jan', revenue: 38420.50, previousRevenue: 34210.25, growth: 12.3, visits: 502, year: 2025 },
                { month: 'Feb', revenue: 42850.75, previousRevenue: 36580.50, growth: 17.1, visits: 528, year: 2025 },
                { month: 'Mar', revenue: 46580.25, previousRevenue: 40120.75, growth: 16.1, visits: 538, year: 2025 },
                { month: 'Apr', projected: true, revenue: 45200.00, previousRevenue: 41850.25, growth: 8.0, visits: 520, year: 2025 }
              ],
              topPerformers: [
                { id: 1, name: 'Regina Araquel', role: 'PT', revenue: 4050.75, growth: 15.2, completion: 97, patients: 15 },
                { id: 3, name: 'Justin Shimane', role: 'OT', revenue: 3780.00, growth: 12.8, completion: 100, patients: 13 },
                { id: 5, name: 'Elena Martinez', role: 'ST', revenue: 3600.00, growth: 10.5, completion: 98, patients: 12 }
              ],
              visitTrends: {
                weeklyGrowth: 8.5,
                monthlyGrowth: 12.3,
                averageDuration: 45,
                peakHours: '10:00 AM - 2:00 PM',
                noShowRate: 3.2,
                cancellationRate: 5.1,
                rescheduleRate: 7.3
              },
              forecasts: {
                nextMonthRevenue: 47500.00,
                nextMonthVisits: 560,
                growthTrend: 'increasing',
                seasonalImpact: 'positive'
              }
            });
            
            // Set therapists with enhanced mock data
            setTherapists([
              {
                id: 1,
                name: "Regina Araquel",
                role: "PT",
                visits: 45,
                earnings: 4050.75,
                status: "verified",
                pendingVisits: 3,
                completionRate: 97,
                growth: 15.2,
                avatar: null,
                specialty: "Orthopedic Rehabilitation",
                joinDate: "2023-05-12",
                certifications: ["APTA Certified", "Manual Therapy Specialist"],
                rating: 4.9,
                patients: [
                  { id: 101, name: "Soheila Adhami", visits: 8, revenue: 680.00, lastVisit: "2025-03-14", visitTrend: "increasing", satisfaction: 4.8, adherence: 92 },
                  { id: 102, name: "James Smith", visits: 12, revenue: 1020.00, lastVisit: "2025-03-15", visitTrend: "stable", satisfaction: 4.7, adherence: 95 },
                  { id: 103, name: "Maria Rodriguez", visits: 10, revenue: 850.00, lastVisit: "2025-03-12", visitTrend: "stable", satisfaction: 4.5, adherence: 88 },
                  { id: 112, name: "Anna Johnson", visits: 7, revenue: 595.00, lastVisit: "2025-03-10", visitTrend: "decreasing", satisfaction: 4.2, adherence: 80 },
                  { id: 118, name: "Luis Chen", visits: 8, revenue: 680.00, lastVisit: "2025-03-13", visitTrend: "increasing", satisfaction: 4.9, adherence: 97 }
                ],
                visitDetails: [
                  { id: 1001, patientId: 101, patientName: "Soheila Adhami", date: "2025-03-14", time: "09:30 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Showing good progress", insurance: "BlueCross" },
                  { id: 1002, patientId: 102, patientName: "James Smith", date: "2025-03-15", time: "11:00 AM", type: "Standard", duration: 60, status: "completed", amount: 85.00, notes: "Increasing ROM exercises", insurance: "Aetna" },
                  { id: 1003, patientId: 103, patientName: "Maria Rodriguez", date: "2025-03-12", time: "02:30 PM", type: "Follow-up", duration: 30, status: "completed", amount: 85.00, notes: "Reduced pain levels", insurance: "Medicare" },
                  { id: 1004, patientId: 101, patientName: "Soheila Adhami", date: "2025-03-11", time: "10:15 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Gait training progress", insurance: "BlueCross" },
                  { id: 1005, patientId: 102, patientName: "James Smith", date: "2025-03-10", time: "03:45 PM", type: "Initial Eval", duration: 60, status: "completed", amount: 85.00, notes: "Post-surgical assessment", insurance: "Aetna" },
                  { id: 1006, patientId: 112, patientName: "Anna Johnson", date: "2025-03-10", time: "01:15 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Balance exercises", insurance: "UnitedHealth" },
                  { id: 1007, patientId: 118, patientName: "Luis Chen", date: "2025-03-13", time: "11:30 AM", type: "Standard", duration: 45, status: "pending", amount: 85.00, notes: "Scheduled for strength assessment", insurance: "Cigna" }
                ],
                performance: {
                  revenueHistory: [3850.25, 3920.50, 4050.75],
                  satisfactionTrend: [4.7, 4.8, 4.9],
                  utilizationRate: 92.5,
                  averageVisitDuration: 47
                }
              },
              {
                id: 2,
                name: "Jacob Staffey",
                role: "PTA",
                visits: 38,
                earnings: 3230.00,
                status: "pending",
                pendingVisits: 5,
                completionRate: 92,
                growth: -2.1,
                avatar: null,
                specialty: "Sports Rehabilitation",
                joinDate: "2023-08-22",
                certifications: ["Sports Therapy Certified"],
                rating: 4.5,
                patients: [
                  { id: 104, name: "Linda Johnson", visits: 10, revenue: 850.00, lastVisit: "2025-03-10", visitTrend: "stable", satisfaction: 4.4, adherence: 88 },
                  { id: 105, name: "Robert Garcia", visits: 9, revenue: 765.00, lastVisit: "2025-03-13", visitTrend: "decreasing", satisfaction: 4.1, adherence: 82 },
                  { id: 115, name: "Olivia Wilson", visits: 9, revenue: 765.00, lastVisit: "2025-03-11", visitTrend: "stable", satisfaction: 4.6, adherence: 90 },
                  { id: 119, name: "David Martinez", visits: 10, revenue: 850.00, lastVisit: "2025-03-14", visitTrend: "increasing", satisfaction: 4.7, adherence: 93 }
                ],
                visitDetails: [
                  { id: 2001, patientId: 104, patientName: "Linda Johnson", date: "2025-03-10", time: "10:00 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Knee rehabilitation progress", insurance: "UnitedHealth" },
                  { id: 2002, patientId: 105, patientName: "Robert Garcia", date: "2025-03-13", time: "01:30 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Reduced exercises due to pain", insurance: "Medicare" },
                  { id: 2003, patientId: 115, patientName: "Olivia Wilson", date: "2025-03-11", time: "03:00 PM", type: "Follow-up", duration: 30, status: "completed", amount: 85.00, notes: "Recovery on track", insurance: "Cigna" },
                  { id: 2004, patientId: 119, patientName: "David Martinez", date: "2025-03-14", time: "09:45 AM", type: "Initial Eval", duration: 60, status: "pending", amount: 85.00, notes: "Ankle sprain assessment scheduled", insurance: "Aetna" },
                  { id: 2005, patientId: 104, patientName: "Linda Johnson", date: "2025-03-07", time: "11:15 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Strength improving", insurance: "UnitedHealth" }
                ],
                performance: {
                  revenueHistory: [3420.50, 3380.25, 3230.00],
                  satisfactionTrend: [4.6, 4.5, 4.5],
                  utilizationRate: 87.2,
                  averageVisitDuration: 43
                }
              },
              {
                id: 3,
                name: "Justin Shimane",
                role: "OT",
                visits: 42,
                earnings: 3780.00,
                status: "verified",
                pendingVisits: 0,
                completionRate: 100,
                growth: 12.8,
                avatar: null,
                specialty: "Hand Therapy",
                joinDate: "2023-06-15",
                certifications: ["CHT", "Sensory Integration Certified"],
                rating: 4.8,
                patients: [
                  { id: 106, name: "Susan Wilson", visits: 7, revenue: 595.00, lastVisit: "2025-03-14", visitTrend: "increasing", satisfaction: 4.8, adherence: 95 },
                  { id: 107, name: "Michael Brown", visits: 8, revenue: 680.00, lastVisit: "2025-03-15", visitTrend: "stable", satisfaction: 4.7, adherence: 92 },
                  { id: 113, name: "Patricia Lee", visits: 10, revenue: 850.00, lastVisit: "2025-03-11", visitTrend: "increasing", satisfaction: 4.9, adherence: 97 },
                  { id: 116, name: "Christopher Adams", visits: 9, revenue: 765.00, lastVisit: "2025-03-13", visitTrend: "stable", satisfaction: 4.6, adherence: 90 },
                  { id: 120, name: "Emily Turner", visits: 8, revenue: 680.00, lastVisit: "2025-03-15", visitTrend: "increasing", satisfaction: 4.8, adherence: 95 }
                ],
                visitDetails: [
                  { id: 3001, patientId: 106, patientName: "Susan Wilson", date: "2025-03-14", time: "10:30 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Fine motor exercises", insurance: "Medicare" },
                  { id: 3002, patientId: 107, patientName: "Michael Brown", date: "2025-03-15", time: "01:00 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "ADL training progressing well", insurance: "BlueCross" },
                  { id: 3003, patientId: 113, patientName: "Patricia Lee", date: "2025-03-11", time: "11:30 AM", type: "Follow-up", duration: 30, status: "completed", amount: 85.00, notes: "Hand strength improving", insurance: "Aetna" },
                  { id: 3004, patientId: 116, patientName: "Christopher Adams", date: "2025-03-13", time: "02:15 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Adaptive equipment training", insurance: "Cigna" },
                  { id: 3005, patientId: 120, patientName: "Emily Turner", date: "2025-03-15", time: "03:30 PM", type: "Initial Eval", duration: 60, status: "completed", amount: 85.00, notes: "Post-stroke assessment complete", insurance: "Medicare" }
                ],
                performance: {
                  revenueHistory: [3320.50, 3650.25, 3780.00],
                  satisfactionTrend: [4.6, 4.7, 4.8],
                  utilizationRate: 94.5,
                  averageVisitDuration: 46
                }
              },
              {
                id: 4,
                name: "April Kim",
                role: "COTA",
                visits: 35,
                earnings: 2975.00,
                status: "pending",
                pendingVisits: 2,
                completionRate: 95,
                growth: 8.7,
                avatar: null,
                specialty: "Pediatric Development",
                joinDate: "2023-09-10",
                certifications: ["Pediatric Certified", "Sensory Processing Specialist"],
                rating: 4.7,
                patients: [
                  { id: 108, name: "David Anderson", visits: 6, revenue: 510.00, lastVisit: "2025-03-11", visitTrend: "stable", satisfaction: 4.5, adherence: 88 },
                  { id: 109, name: "Jennifer Lopez", visits: 7, revenue: 595.00, lastVisit: "2025-03-13", visitTrend: "increasing", satisfaction: 4.8, adherence: 93 },
                  { id: 114, name: "Daniel Wright", visits: 9, revenue: 765.00, lastVisit: "2025-03-12", visitTrend: "stable", satisfaction: 4.6, adherence: 90 },
                  { id: 117, name: "Michelle Taylor", visits: 8, revenue: 680.00, lastVisit: "2025-03-15", visitTrend: "decreasing", satisfaction: 4.3, adherence: 85 }
                ],
                visitDetails: [
                  { id: 4001, patientId: 108, patientName: "David Anderson", date: "2025-03-11", time: "09:00 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Sensory integration session", insurance: "UnitedHealth" },
                  { id: 4002, patientId: 109, patientName: "Jennifer Lopez", date: "2025-03-13", time: "10:45 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Motor planning activities", insurance: "Aetna" },
                  { id: 4003, patientId: 114, patientName: "Daniel Wright", date: "2025-03-12", time: "01:45 PM", type: "Follow-up", duration: 30, status: "pending", amount: 85.00, notes: "Handwriting evaluation scheduled", insurance: "BlueCross" },
                  { id: 4004, patientId: 117, patientName: "Michelle Taylor", date: "2025-03-15", time: "03:00 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Visual perception exercises", insurance: "Medicaid" }
                ],
                performance: {
                  revenueHistory: [2750.25, 2830.50, 2975.00],
                  satisfactionTrend: [4.5, 4.6, 4.7],
                  utilizationRate: 88.5,
                  averageVisitDuration: 42
                }
              },
              {
                id: 5,
                name: "Elena Martinez",
                role: "ST",
                visits: 40,
                earnings: 3600.00,
                status: "verified",
                pendingVisits: 1,
                completionRate: 98,
                growth: 10.5,
                avatar: null,
                specialty: "Voice & Swallowing Disorders",
                joinDate: "2023-07-20",
                certifications: ["ASHA Certified", "BCS-S"],
                rating: 4.8,
                patients: [
                  { id: 110, name: "Thomas White", visits: 9, revenue: 765.00, lastVisit: "2025-03-12", visitTrend: "stable", satisfaction: 4.7, adherence: 92 },
                  { id: 111, name: "Jessica Taylor", visits: 8, revenue: 680.00, lastVisit: "2025-03-15", visitTrend: "increasing", satisfaction: 4.9, adherence: 96 },
                  { id: 121, name: "Kevin Harris", visits: 10, revenue: 850.00, lastVisit: "2025-03-14", visitTrend: "increasing", satisfaction: 4.8, adherence: 95 },
                  { id: 122, name: "Rachel Thompson", visits: 7, revenue: 595.00, lastVisit: "2025-03-11", visitTrend: "stable", satisfaction: 4.6, adherence: 90 },
                  { id: 123, name: "Steven Clark", visits: 6, revenue: 510.00, lastVisit: "2025-03-13", visitTrend: "decreasing", satisfaction: 4.4, adherence: 87 }
                ],
                visitDetails: [
                  { id: 5001, patientId: 110, patientName: "Thomas White", date: "2025-03-12", time: "11:00 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Articulation therapy", insurance: "BlueCross" },
                  { id: 5002, patientId: 111, patientName: "Jessica Taylor", date: "2025-03-15", time: "02:00 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Voice exercises showing improvement", insurance: "Aetna" },
                  { id: 5003, patientId: 121, patientName: "Kevin Harris", date: "2025-03-14", time: "10:15 AM", type: "Follow-up", duration: 30, status: "completed", amount: 85.00, notes: "Fluency strategies practice", insurance: "UnitedHealth" },
                  { id: 5004, patientId: 122, patientName: "Rachel Thompson", date: "2025-03-11", time: "01:30 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00, notes: "Language comprehension exercises", insurance: "Medicare" },
                  { id: 5005, patientId: 123, patientName: "Steven Clark", date: "2025-03-13", time: "03:15 PM", type: "Initial Eval", duration: 60, status: "pending", amount: 85.00, notes: "Swallowing assessment scheduled", insurance: "Cigna" }
                ],
                performance: {
                  revenueHistory: [3250.50, 3420.75, 3600.00],
                  satisfactionTrend: [4.6, 4.7, 4.8],
                  utilizationRate: 93.5,
                  averageVisitDuration: 44
                }
              }
            ]);
            
            // Set default selected period
            setSelectedPeriod(paymentPeriods[4]); // March 1-15 as default
            
            setIsLoading(false);
            
            // Show success snackbar
            showNotification("Financial data loaded successfully");
            
            // Trigger entrance animations after loading
            setTimeout(() => {
              setAnimateIn(true);
            }, 100);
          }
        }, 50);
      };
      
      simulateDataLoading();
    };
    
    loadData();
    
    // Cleanup
    return () => {
      setAnimateIn(false);
      if (snackbarTimerRef.current) {
        clearTimeout(snackbarTimerRef.current);
      }
    };
  }, []);

  // Handle outside click to close user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show notification snackbar
  const showNotification = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    
    // Auto-hide snackbar after 5 seconds
    if (snackbarTimerRef.current) {
      clearTimeout(snackbarTimerRef.current);
    }
    
    snackbarTimerRef.current = setTimeout(() => {
      setShowSnackbar(false);
    }, 5000);
  };

  // Handle period change
  const handlePeriodChange = (period) => {
    if (isLoggingOut) return; // Prevent actions during logout
    
    setSelectedPeriod(period);
    showNotification(`Selected payment period: ${period.period}`);
  };
  
  // Handle logout with enhanced effects
  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowUserMenu(false);
    
    // Apply class to document.body for global effects
    document.body.classList.add('logging-out');
    
    // Show logout notification
    showNotification("Logging out...");
  };
  
  // Callback for when logout animation completes
  const handleLogoutAnimationComplete = () => {
    // Execute logout from auth context
    logout();
    // Navigate to login page
    navigate('/');
  };
  
  // Handle therapist click to show modal
  const handleTherapistClick = (therapist) => {
    if (isLoggingOut) return; // Prevent actions during logout
    
    setSelectedTherapist(therapist);
    setShowTherapistModal(true);
  };
  
  // Handle navigation to main menu with enhanced transition
  const handleMainMenuTransition = () => {
    if (isLoggingOut) return; // Prevent navigation during logout
    
    setMenuTransitioning(true);
    
    // Extract base role for navigation
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
    
    setTimeout(() => {
      navigate(`/${baseRole}/homePage`);
    }, 400);
  };
  
  // Handle redirect to patient page
  const handlePatientClick = (patientId) => {
    if (isLoggingOut) return; // Prevent navigation during logout
    
    // Extract base role for navigation
    const baseRole = currentUser?.role?.split(' - ')[0].toLowerCase() || 'developer';
    
    navigate(`/${baseRole}/paciente/${patientId}`);
  };

  // Handle month selection for detailed view
  const handleMonthSelect = (monthData) => {
    setSelectedMonth({ month: monthData.month, year: monthData.year });
    
    const mockMonthlyDetails = {
      month: monthData.month,
      year: monthData.year,
      revenue: monthData.revenue,
      visits: monthData.visits,
      therapists: therapists
    };
    
    setDashboardStats(prev => ({
      ...prev,
      monthlyDetails: mockMonthlyDetails
    }));
    
    showNotification(`Viewing details for ${monthData.month} ${monthData.year}`);
  };

  // Handle discipline selection for detailed view
  const handleDisciplineSelect = (discipline) => {
    setSelectedDiscipline(discipline);
    
    const therapistsByDiscipline = therapists.filter(
      therapist => therapist.role === discipline
    );
    
    const details = {
      discipline,
      therapists: therapistsByDiscipline
    };
    
    setDisciplineDetails(details);
    
    showNotification(`Viewing details for ${discipline} discipline`);
  };

  // Reset selected discipline
  const handleResetDiscipline = () => {
    setSelectedDiscipline(null);
    setDisciplineDetails(null);
  };

  // Handle verification of therapist payment
  const handleVerifyPayment = (therapistId) => {
    setTherapists(
      therapists.map(therapist => 
        therapist.id === therapistId 
          ? { ...therapist, status: 'verified' } 
          : therapist
      )
    );
    
    const therapist = therapists.find(t => t.id === therapistId);
    if (therapist) {
      showNotification(`Payment verified for ${therapist.name}`);
    }
  };
  
  // Handle FAB actions
  const handleFabAction = (action) => {
    switch (action) {
      case 'new-report':
        showNotification('Creating new financial report...');
        break;
      case 'add-payment':
        showNotification('Payment form opened');
        break;
      case 'export-data':
        showNotification('Preparing data export...');
        break;
      default:
        break;
    }
  };
  
  // Generate loading steps
  const loadingSteps = [
    { icon: 'fa-database', label: 'Fetching data' },
    { icon: 'fa-chart-line', label: 'Processing metrics' },
    { icon: 'fa-check-circle', label: 'Rendering interface' }
  ];

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const fabVariants = {
    closed: { 
      scale: 1,
      boxShadow: "0 4px 20px rgba(0, 229, 255, 0.4)"
    },
    open: { 
      scale: 1.1,
      boxShadow: "0 6px 25px rgba(0, 229, 255, 0.5)"
    }
  };
  
  const fabButtonsVariants = {
    closed: {
      opacity: 0,
      y: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.05
      }
    }
  };
  
  const fabButtonVariants = {
    closed: { 
      y: 10, 
      opacity: 0,
      scale: 0.8
    },
    open: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  return (
    <motion.div 
      className={`accounting-container ${animateIn ? 'animate-in' : ''} ${menuTransitioning ? 'transitioning' : ''} ${isLoggingOut ? 'logging-out' : ''}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Logout animation - Show only during logout */}
      {isLoggingOut && (
        <LogoutAnimation 
          isMobile={isMobile} 
          onAnimationComplete={handleLogoutAnimationComplete} 
        />
      )}
      
      {/* Enhanced background with parallax and particles */}
      <div className="parallax-background">
        <div className="gradient-overlay"></div>
        <ParticlesBackground />
      </div>
      
      {/* Header with logo and profile */}
      <header className={`main-header ${isLoggingOut ? 'logging-out' : ''}`}>
        <div className="header-container">
          <div className="logo-container">
            <motion.div 
              className="logo-wrapper"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 229, 255, 0.5)" }}
            >
              <img src={logoImg} alt="TherapySync Logo" className="logo" />
              <div className="logo-glow"></div>
            </motion.div>
            
            {/* Menu navigation with enhanced effects */}
            <div className="menu-navigation">
              <NavButton 
                icon="fa-th-large" 
                label="Main Menu" 
                isActive={false}
                onClick={handleMainMenuTransition}
                disabled={isLoggingOut}
              />
              
              <NavButton 
                icon="fa-chart-pie" 
                label="Accounting" 
                isActive={true}
                disabled={isLoggingOut}
              />
            </div>
          </div>
          
          {/* Enhanced user profile */}
          <div className="support-user-profile" ref={userMenuRef}>
            <motion.div 
              className={`support-profile-button ${showUserMenu ? 'active' : ''}`} 
              onClick={() => !isLoggingOut && setShowUserMenu(!showUserMenu)}
              whileHover={{ y: -3, boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)" }}
              data-tooltip="Your profile and settings"
            >
              <div className="support-avatar">
                <div className="support-avatar-text">{userData.avatar}</div>
                <div className={`support-avatar-status ${userData.status}`}></div>
              </div>
              
              <div className="support-profile-info">
                <span className="support-user-name">{userData.name}</span>
                <span className="support-user-role">{userData.role}</span>
              </div>
              
              <motion.i 
                className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}
                animate={{ rotate: showUserMenu ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {notificationCount > 0 && (
                <NotificationBadge count={notificationCount} />
              )}
            </motion.div>
            
            {/* Enhanced user dropdown menu with statistics */}
            <AnimatePresence>
              {showUserMenu && !isLoggingOut && (
                <motion.div 
                  className="support-user-menu"
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="support-menu-header">
                    <div className="support-user-info">
                      <UserAvatar 
                        initials={userData.avatar} 
                        status={userData.status} 
                        size="large"
                      />
                      
                      <div className="support-user-details">
                        <h4>{userData.name}</h4>
                        <span className="support-user-email">{userData.email}</span>
                        <span className={`support-user-status ${userData.status}`}>
                          <i className="fas fa-circle"></i> 
                          {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    {/* User stats cards */}
                    <div className="support-user-stats">
                      <motion.div 
                        className="stat-card"
                        whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 212, 255, 0.2)" }}
                      >
                        <div className="stat-value">{userData.stats.visits}</div>
                        <div className="stat-label">Visits</div>
                      </motion.div>
                      
                      <motion.div 
                        className="stat-card"
                        whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 212, 255, 0.2)" }}
                      >
                        <div className="stat-value">${userData.stats.revenue.toLocaleString()}</div>
                        <div className="stat-label">Revenue</div>
                      </motion.div>
                      
                      <motion.div 
                        className="stat-card"
                        whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 212, 255, 0.2)" }}
                      >
                        <div className="stat-value">+{userData.stats.growth}%</div>
                        <div className="stat-label">Growth</div>
                      </motion.div>
                      
                      <motion.div 
                        className="stat-card"
                        whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 212, 255, 0.2)" }}
                      >
                        <div className="stat-value">{userData.stats.completion}%</div>
                        <div className="stat-label">Completion</div>
                      </motion.div>
                    </div>
                    
                    {/* Quick actions */}
                    <div className="quick-actions">
                      <motion.div 
                        className="quick-action-btn"
                        whileHover={{ y: -3, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ y: 0, scale: 0.95 }}
                      >
                        <i className="fas fa-sync-alt"></i>
                        <span>Refresh</span>
                      </motion.div>
                      
                      <motion.div 
                        className="quick-action-btn"
                        whileHover={{ y: -3, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ y: 0, scale: 0.95 }}
                      >
                        <i className="fas fa-file-export"></i>
                        <span>Export</span>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="support-menu-section">
                    <div className="section-title">Account</div>
                    <div className="support-menu-items">
                      <motion.div 
                        className="support-menu-item"
                        whileHover={{ x: 5, backgroundColor: "rgba(0, 212, 255, 0.05)" }}
                      >
                        <i className="fas fa-user-circle"></i>
                        <span>My Profile</span>
                      </motion.div>
                      <motion.div 
                        className="support-menu-item"
                        whileHover={{ x: 5, backgroundColor: "rgba(0, 212, 255, 0.05)" }}
                      >
                        <i className="fas fa-cog"></i>
                        <span>Settings</span>
                      </motion.div>
                      <motion.div 
                        className="support-menu-item"
                        whileHover={{ x: 5, backgroundColor: "rgba(0, 212, 255, 0.05)" }}
                      >
                        <i className="fas fa-calendar-alt"></i>
                        <span>My Schedule</span>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="support-menu-section">
                    <div className="section-title">Preferences</div>
                    <div className="support-menu-items">
                      <motion.div 
                        className="support-menu-item"
                        whileHover={{ x: 5, backgroundColor: "rgba(0, 212, 255, 0.05)" }}
                      >
                        <i className="fas fa-bell"></i>
                        <span>Notifications</span>
                        <div className="support-notification-badge">{notificationCount}</div>
                      </motion.div>
                      <div className="support-menu-item toggle-item">
                        <div className="toggle-item-content">
                          <i className="fas fa-moon"></i>
                          <span>Dark Mode</span>
                        </div>
                        <div className="toggle-switch">
                          <div className="toggle-handle active"></div>
                        </div>
                      </div>
                      <div className="support-menu-item toggle-item">
                        <div className="toggle-item-content">
                          <i className="fas fa-volume-up"></i>
                          <span>Sound Alerts</span>
                        </div>
                        <div className="toggle-switch">
                          <div className="toggle-handle"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="support-menu-section">
                    <div className="section-title">Support</div>
                    <div className="support-menu-items">
                      <motion.div 
                        className="support-menu-item"
                        whileHover={{ x: 5, backgroundColor: "rgba(0, 212, 255, 0.05)" }}
                      >
                        <i className="fas fa-headset"></i>
                        <span>Contact Support</span>
                      </motion.div>
                      <motion.div 
                        className="support-menu-item"
                        whileHover={{ x: 5, backgroundColor: "rgba(0, 212, 255, 0.05)" }}
                      >
                        <i className="fas fa-bug"></i>
                        <span>Report Issue</span>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="support-menu-footer">
                    <motion.div 
                      className="support-menu-item logout" 
                      onClick={handleLogout}
                      whileHover={{ x: 5, backgroundColor: "rgba(244, 67, 54, 0.05)" }}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Log Out</span>
                    </motion.div>
                    <div className="version-info">
                      <span>TherapySync™ Premium</span>
                      <span>v2.7.0</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
      
      {/* Main content with enhanced effects */}
      <main className={`accounting-content ${isLoggingOut ? 'fade-out' : ''}`}>
        {isLoading ? (
          <motion.div 
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingSpinner progress={loadingProgress} />
            
            <div className="loading-progress">
              <div className="loading-progress-text">
                {loadingStep === 0 && "Fetching financial data..."}
                {loadingStep === 1 && "Processing financial metrics..."}
                {loadingStep === 2 && "Preparing dashboard visualization..."}
              </div>
              <div className="loading-progress-bar">
                <motion.div 
                  className="loading-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            
            <div className="loading-steps">
              {loadingSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  className={`loading-step ${index <= loadingStep ? 'active' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.4 }}
                >
                  <i className={`fas ${step.icon}`}></i>
                  <span>{step.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            <div className="accounting-header">
              <motion.div 
                className="title-section"
                variants={itemVariants}
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <i className="fas fa-chart-line"></i>
                  Financial Management
                  <div className="title-highlight"></div>
                </motion.h1>
                <motion.p 
                  className="subtitle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Track earnings, manage payments, and view financial metrics across your practice
                </motion.p>
              </motion.div>
              
              <motion.div 
                className="global-filters"
                variants={itemVariants}
              >
                <motion.div 
                  className="date-range-selector"
                  whileHover={{ y: -2, boxShadow: "0 5px 15px rgba(0, 229, 255, 0.3)" }}
                >
                  <i className="fas fa-calendar-alt"></i>
                  <span>Current Period: {selectedPeriod?.period}</span>
                </motion.div>
                <div className="actions-toolbar">
                  <motion.button 
                    className="toolbar-button" 
                    title="Refresh Data"
                    whileHover={{ y: -2, boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ y: 0, scale: 0.95 }}
                    disabled={isLoggingOut}
                  >
                    <i className="fas fa-sync-alt"></i>
                  </motion.button>
                  <motion.button 
                    className="toolbar-button" 
                    title="Export Reports"
                    whileHover={{ y: -2, boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ y: 0, scale: 0.95 }}
                    disabled={isLoggingOut}
                  >
                    <i className="fas fa-file-export"></i>
                  </motion.button>
                  <motion.button 
                    className="toolbar-button" 
                    title="Print"
                    whileHover={{ y: -2, boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ y: 0, scale: 0.95 }}
                    disabled={isLoggingOut}
                  >
                    <i className="fas fa-print"></i>
                  </motion.button>
                  <motion.button 
                    className="toolbar-button" 
                    title="Settings"
                    whileHover={{ y: -2, boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ y: 0, scale: 0.95 }}
                    disabled={isLoggingOut}
                  >
                    <i className="fas fa-cog"></i>
                  </motion.button>
                </div>
              </motion.div>
            </div>
            
            <div className="accounting-body">
              {/* Enhanced metrics dashboard */}
              <motion.div 
                className="dashboard-section"
                variants={containerVariants}
              >
                {/* Financial Overview Component */}
                <motion.div variants={itemVariants}>
                  <FinancialOverview 
                    stats={{
                      totalBilled: dashboardStats.totalBilled,
                      pendingPayments: dashboardStats.pendingPayments,
                      completedPayments: dashboardStats.completedPayments
                    }} 
                  />
                </motion.div>
                
                {/* Monthly Revenue Stats Component */}
                <motion.div variants={itemVariants}>
                  <MonthlyRevenueStats 
                    data={dashboardStats.revenueByMonth || []} 
                    onMonthSelect={handleMonthSelect}
                    selectedMonth={selectedMonth}
                  />
                </motion.div>
                
                {/* Monthly Details if a month is selected */}
                {selectedMonth && dashboardStats.monthlyDetails && (
                  <motion.div 
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <MonthlyDetails 
                      data={dashboardStats.monthlyDetails} 
                      onTherapistClick={handleTherapistClick} 
                    />
                  </motion.div>
                )}
                
                {/* Top Performers Component */}
                <motion.div variants={itemVariants}>
                  <TopPerformers 
                    performers={dashboardStats.topPerformers || []} 
                    onTherapistClick={handleTherapistClick} 
                  />
                </motion.div>
                
                {/* Discipline Statistics Component */}
                <motion.div variants={itemVariants}>
                  <DisciplineStatistics 
                    stats={dashboardStats.visitsByDiscipline || {}} 
                    onDisciplineSelect={handleDisciplineSelect}
                    selectedDiscipline={selectedDiscipline}
                    disciplineDetails={disciplineDetails}
                    onResetDiscipline={handleResetDiscipline}
                    onTherapistClick={handleTherapistClick}
                  />
                </motion.div>
                
                {/* Therapist Earnings Component */}
                <motion.div variants={itemVariants}>
                  <TherapistEarnings 
                    therapists={therapists} 
                    selectedPeriod={selectedPeriod} 
                    onTherapistClick={handleTherapistClick}
                    onVerifyPayment={handleVerifyPayment}
                  />
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </main>
      
      {/* Therapist Detail Modal with enhanced animations */}
      <AnimatePresence>
        {showTherapistModal && selectedTherapist && !isLoggingOut && (
          <TherapistDetailModal 
            therapist={selectedTherapist}
            period={selectedPeriod}
            onClose={() => setShowTherapistModal(false)}
            onVerifyPayment={handleVerifyPayment}
          />
        )}
      </AnimatePresence>
      
      {/* Enhanced floating action button with animations */}
      {!isLoggingOut && (
        <div className="floating-action-button">
          <motion.button 
            className="fab-main" 
            onClick={() => setShowFabMenu(!showFabMenu)}
            variants={fabVariants}
            animate={showFabMenu ? "open" : "closed"}
            whileTap={{ scale: 0.95 }}
            disabled={isLoggingOut}
          >
            <i className={`fas ${showFabMenu ? 'fa-times' : 'fa-plus'}`}></i>
          </motion.button>
          
          <motion.div 
            className="fab-buttons"
            initial="closed"
            animate={showFabMenu ? "open" : "closed"}
            variants={fabButtonsVariants}
          >
            <motion.button 
              className="fab-button" 
              title="New Report" 
              onClick={() => handleFabAction('new-report')}
              variants={fabButtonVariants}
              disabled={isLoggingOut}
            >
              <i className="fas fa-file-alt"></i>
            </motion.button>
            <motion.button 
              className="fab-button" 
              title="Add Payment" 
              onClick={() => handleFabAction('add-payment')}
              variants={fabButtonVariants}
              disabled={isLoggingOut}
            >
              <i className="fas fa-money-bill-wave"></i>
            </motion.button>
            <motion.button 
              className="fab-button" 
              title="Export Data" 
              onClick={() => handleFabAction('export-data')}
              variants={fabButtonVariants}
              disabled={isLoggingOut}
            >
              <i className="fas fa-file-export"></i>
            </motion.button>
          </motion.div>
        </div>
      )}
      
      {/* Enhanced notification snackbar with animations */}
      <AnimatePresence>
        {showSnackbar && (
          <motion.div 
            className="notification-snackbar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <i className="fas fa-info-circle"></i>
            <span>{snackbarMessage}</span>
            <button 
              className="snackbar-close" 
              onClick={() => setShowSnackbar(false)}
              disabled={isLoggingOut}
            >
              <i className="fas fa-times"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DevAccounting;