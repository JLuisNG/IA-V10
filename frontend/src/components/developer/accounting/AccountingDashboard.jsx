import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../../../styles/developer/accounting/EnhancedAccountingDashboard.scss';
import FinancialOverview from './FinancialOverview.jsx';
import MonthlyRevenueStats from './MonthlyRevenueStats.jsx';
import TherapistEarnings from './TherapistEarnings.jsx';
import TherapistDetailModal from './TherapistDetailModal.jsx';
import TopPerformers from './TopPerformers.jsx';
import DisciplineStatistics from './DisciplineStatistics.jsx';
import MonthlyDetails from './MonthlyDetails.jsx';

const EnhancedAccountingDashboard = () => {
  // State for dashboard data
  const [isLoading, setIsLoading] = useState(true);
  const [financialStats, setFinancialStats] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [disciplineStats, setDisciplineStats] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthlyDetails, setMonthlyDetails] = useState(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [disciplineDetails, setDisciplineDetails] = useState(null);

  // Load mock data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API fetching
    setTimeout(() => {
      // Financial overview data
      setFinancialStats({
        totalBilled: 127850.75,
        pendingPayments: 42500.25,
        completedPayments: 85350.50
      });
      
      // Selected period
      setSelectedPeriod({
        id: 5,
        period: "Mar 1 to 15, 2025",
        paymentDate: "Apr 15, 2025",
        status: "pending",
        amount: 45670.25
      });
      
      // Therapists data
      setTherapists([
        {
          id: 1,
          name: "Regina Araquel",
          role: "PT",
          visits: 45,
          pendingVisits: 3,
          earnings: 4050.75,
          status: "verified",
          completionRate: 97,
          growth: 15.2,
          patients: [
            { id: 101, name: "Soheila Adhami", visits: 8, revenue: 680.00, lastVisit: "2025-03-14" },
            { id: 102, name: "James Smith", visits: 12, revenue: 1020.00, lastVisit: "2025-03-15" },
            { id: 103, name: "Maria Rodriguez", visits: 10, revenue: 850.00, lastVisit: "2025-03-12" }
          ],
          visitDetails: [
            { id: 1001, patientId: 101, patientName: "Soheila Adhami", date: "2025-03-14", time: "09:30 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
            { id: 1002, patientId: 102, patientName: "James Smith", date: "2025-03-15", time: "11:00 AM", type: "Standard", duration: 60, status: "completed", amount: 85.00 },
            { id: 1003, patientId: 103, patientName: "Maria Rodriguez", date: "2025-03-12", time: "02:30 PM", type: "Follow-up", duration: 30, status: "completed", amount: 85.00 }
          ]
        },
        {
          id: 2,
          name: "Jacob Staffey",
          role: "PTA",
          visits: 38,
          pendingVisits: 5,
          earnings: 3230.00,
          status: "pending",
          completionRate: 92,
          growth: -2.1,
          patients: [
            { id: 104, name: "Linda Johnson", visits: 10, revenue: 850.00, lastVisit: "2025-03-10" },
            { id: 105, name: "Robert Garcia", visits: 9, revenue: 765.00, lastVisit: "2025-03-13" }
          ],
          visitDetails: [
            { id: 2001, patientId: 104, patientName: "Linda Johnson", date: "2025-03-10", time: "10:00 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
            { id: 2002, patientId: 105, patientName: "Robert Garcia", date: "2025-03-13", time: "01:30 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00 }
          ]
        },
        {
          id: 3,
          name: "Justin Shimane",
          role: "OT",
          visits: 42,
          pendingVisits: 0,
          earnings: 3780.00,
          status: "verified",
          completionRate: 100,
          growth: 12.8,
          patients: [
            { id: 106, name: "Susan Wilson", visits: 7, revenue: 595.00, lastVisit: "2025-03-14" },
            { id: 107, name: "Michael Brown", visits: 8, revenue: 680.00, lastVisit: "2025-03-15" }
          ],
          visitDetails: [
            { id: 3001, patientId: 106, patientName: "Susan Wilson", date: "2025-03-14", time: "10:30 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
            { id: 3002, patientId: 107, patientName: "Michael Brown", date: "2025-03-15", time: "01:00 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00 }
          ]
        },
        {
          id: 4,
          name: "April Kim",
          role: "COTA",
          visits: 35,
          pendingVisits: 2,
          earnings: 2975.00,
          status: "pending",
          completionRate: 95,
          growth: 8.7,
          patients: [
            { id: 108, name: "David Anderson", visits: 6, revenue: 510.00, lastVisit: "2025-03-11" },
            { id: 109, name: "Jennifer Lopez", visits: 7, revenue: 595.00, lastVisit: "2025-03-13" }
          ],
          visitDetails: [
            { id: 4001, patientId: 108, patientName: "David Anderson", date: "2025-03-11", time: "09:00 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
            { id: 4002, patientId: 109, patientName: "Jennifer Lopez", date: "2025-03-13", time: "10:45 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 }
          ]
        },
        {
          id: 5,
          name: "Elena Martinez",
          role: "ST",
          visits: 40,
          pendingVisits: 1,
          earnings: 3600.00,
          status: "verified",
          completionRate: 98,
          growth: 10.5,
          patients: [
            { id: 110, name: "Thomas White", visits: 9, revenue: 765.00, lastVisit: "2025-03-12" },
            { id: 111, name: "Jessica Taylor", visits: 8, revenue: 680.00, lastVisit: "2025-03-15" }
          ],
          visitDetails: [
            { id: 5001, patientId: 110, patientName: "Thomas White", date: "2025-03-12", time: "11:00 AM", type: "Standard", duration: 45, status: "completed", amount: 85.00 },
            { id: 5002, patientId: 111, patientName: "Jessica Taylor", date: "2025-03-15", time: "02:00 PM", type: "Standard", duration: 45, status: "completed", amount: 85.00 }
          ]
        }
      ]);
      
      // Discipline statistics
      setDisciplineStats({
        PT: { count: 650, percentage: 33, therapists: 12 },
        OT: { count: 420, percentage: 21, therapists: 8 },
        ST: { count: 310, percentage: 16, therapists: 7 },
        PTA: { count: 280, percentage: 14, therapists: 6 },
        COTA: { count: 175, percentage: 9, therapists: 5 },
        STA: { count: 120, percentage: 6, therapists: 4 }
      });
      
      // Monthly revenue
      setMonthlyRevenue([
        { 
          month: 'Jan', 
          year: 2025,
          revenue: 38420.50, 
          previousRevenue: 34210.25, 
          growth: 12.3,
          visits: 452,
          completedVisits: 445,
          pendingVisits: 7
        },
        { 
          month: 'Feb', 
          year: 2025,
          revenue: 42850.75, 
          previousRevenue: 36580.50, 
          growth: 17.1,
          visits: 504,
          completedVisits: 498,
          pendingVisits: 6
        },
        { 
          month: 'Mar', 
          year: 2025,
          revenue: 46580.25, 
          previousRevenue: 40120.75, 
          growth: 16.1,
          visits: 548,
          completedVisits: 541,
          pendingVisits: 7
        },
        { 
          month: 'Apr', 
          year: 2025,
          projected: true, 
          revenue: 45200.00, 
          previousRevenue: 41850.25, 
          growth: 8.0,
          visits: 532,
          completedVisits: 520,
          pendingVisits: 12
        }
      ]);
      
      // Top performers
      setTopPerformers([
        { id: 1, name: "Regina Araquel", role: "PT", visits: 45, earnings: 4050.75, growth: 15.2 },
        { id: 3, name: "Justin Shimane", role: "OT", visits: 42, earnings: 3780.00, growth: 12.8 },
        { id: 5, name: "Elena Martinez", role: "ST", visits: 40, earnings: 3600.00, growth: 10.5 }
      ]);
      
      // April monthly details (shown by default)
      const aprilDetails = {
        month: 'Apr',
        year: 2025,
        revenue: 45200.00,
        visits: 532,
        therapists: [
          { id: 1, name: "Regina Araquel", role: "PT", visits: 45, earnings: 4050.75 },
          { id: 2, name: "Jacob Staffey", role: "PTA", visits: 38, earnings: 3230.00 },
          { id: 3, name: "Justin Shimane", role: "OT", visits: 42, earnings: 3780.00 },
          { id: 4, name: "April Kim", role: "COTA", visits: 35, earnings: 2975.00 },
          { id: 5, name: "Elena Martinez", role: "ST", visits: 40, earnings: 3600.00 }
        ],
        visitsByDay: [
          { day: '2025-04-01', count: 18 },
          { day: '2025-04-02', count: 22 },
          { day: '2025-04-03', count: 24 },
          { day: '2025-04-04', count: 17 },
          { day: '2025-04-05', count: 12 },
          { day: '2025-04-06', count: 0 },
          { day: '2025-04-07', count: 27 },
          { day: '2025-04-08', count: 25 },
          { day: '2025-04-09', count: 23 },
          { day: '2025-04-10', count: 26 },
          { day: '2025-04-11', count: 21 },
          { day: '2025-04-12', count: 14 },
          { day: '2025-04-13', count: 0 },
          { day: '2025-04-14', count: 28 },
          { day: '2025-04-15', count: 24 }
        ],
        visitDetails: [
          { id: 1, therapistId: 1, therapistName: "Regina Araquel", patientName: "James Smith", date: "2025-04-02", time: "09:30 AM", status: "completed", amount: 85.00 },
          { id: 2, therapistId: 1, therapistName: "Regina Araquel", patientName: "Maria Rodriguez", date: "2025-04-02", time: "11:00 AM", status: "completed", amount: 85.00 },
          { id: 3, therapistId: 3, therapistName: "Justin Shimane", patientName: "Susan Wilson", date: "2025-04-02", time: "10:30 AM", status: "completed", amount: 85.00 },
          { id: 4, therapistId: 5, therapistName: "Elena Martinez", patientName: "Thomas White", date: "2025-04-02", time: "02:15 PM", status: "completed", amount: 85.00 },
          { id: 5, therapistId: 2, therapistName: "Jacob Staffey", patientName: "Linda Johnson", date: "2025-04-02", time: "03:30 PM", status: "completed", amount: 85.00 },
          // More visits would be here
        ]
      };
      
      setMonthlyDetails(aprilDetails);
      setSelectedMonth({ month: 'Apr', year: 2025 });
      
      setIsLoading(false);
    }, 1500);
  }, []);

  // Handle therapist click for modal
  const handleTherapistClick = (therapist) => {
    setSelectedTherapist(therapist);
    setShowTherapistModal(true);
  };

  // Handle month selection for detailed view
  const handleMonthSelect = (monthData) => {
    setSelectedMonth({ month: monthData.month, year: monthData.year });
    
    // In a real app, you would fetch the monthly details from the API
    // Here we're just using the same mock data for April
    const mockMonthlyDetails = {
      month: monthData.month,
      year: monthData.year,
      revenue: monthData.revenue,
      visits: monthData.visits,
      therapists: therapists,
      visitsByDay: [
        // Mock data for the selected month
        { day: `2025-${monthData.month === 'Jan' ? '01' : monthData.month === 'Feb' ? '02' : monthData.month === 'Mar' ? '03' : '04'}-01`, count: 18 },
        { day: `2025-${monthData.month === 'Jan' ? '01' : monthData.month === 'Feb' ? '02' : monthData.month === 'Mar' ? '03' : '04'}-02`, count: 22 },
        { day: `2025-${monthData.month === 'Jan' ? '01' : monthData.month === 'Feb' ? '02' : monthData.month === 'Mar' ? '03' : '04'}-03`, count: 24 }
        // More days would be here
      ],
      visitDetails: therapists.flatMap(therapist => 
        therapist.visitDetails.map(visit => ({
          id: visit.id,
          therapistId: therapist.id,
          therapistName: therapist.name,
          patientName: visit.patientName,
          date: visit.date.replace('03', monthData.month === 'Jan' ? '01' : monthData.month === 'Feb' ? '02' : monthData.month === 'Mar' ? '03' : '04'),
          time: visit.time,
          status: visit.status,
          amount: visit.amount
        }))
      )
    };
    
    setMonthlyDetails(mockMonthlyDetails);
  };

  // Handle discipline selection for detailed view
  const handleDisciplineSelect = (discipline) => {
    setSelectedDiscipline(discipline);
    
    // In a real app, you would fetch the discipline details from the API
    // Here we're just filtering therapists by role
    const therapistsByDiscipline = therapists.filter(
      therapist => therapist.role === discipline
    );
    
    const disciplineDetails = {
      discipline,
      count: disciplineStats[discipline].count,
      percentage: disciplineStats[discipline].percentage,
      therapists: therapistsByDiscipline,
      visitDetails: therapistsByDiscipline.flatMap(therapist => 
        therapist.visitDetails.map(visit => ({
          id: visit.id,
          therapistId: therapist.id,
          therapistName: therapist.name,
          patientName: visit.patientName,
          date: visit.date,
          time: visit.time,
          status: visit.status,
          amount: visit.amount
        }))
      )
    };
    
    setDisciplineDetails(disciplineDetails);
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
  };

  // Reset discipline selection
  const handleResetDiscipline = () => {
    setSelectedDiscipline(null);
    setDisciplineDetails(null);
  };

  return (
    <div className="enhanced-accounting-dashboard">
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading Financial Data...</h3>
        </div>
      ) : (
        <>
          <div className="dashboard-header">
            <div className="title-section">
              <h1>
                <i className="fas fa-chart-line"></i>
                Financial Management
              </h1>
              <p className="subtitle">
                Track earnings, manage payments, and view financial metrics across your practice
              </p>
            </div>
            <div className="period-badge">
              <i className="fas fa-calendar-alt"></i>
              <span>Current Period: {selectedPeriod?.period}</span>
            </div>
          </div>

          <div className="dashboard-body">
            {/* Financial Overview Section */}
            <FinancialOverview stats={financialStats} />
            
            {/* Monthly Revenue Statistics */}
            <MonthlyRevenueStats 
              data={monthlyRevenue} 
              onMonthSelect={handleMonthSelect}
              selectedMonth={selectedMonth}
            />
            
            {/* Monthly Detailed View */}
            {selectedMonth && monthlyDetails && (
              <MonthlyDetails 
                data={monthlyDetails} 
                onTherapistClick={handleTherapistClick} 
              />
            )}
            
            {/* Top Performers */}
            <TopPerformers performers={topPerformers} onTherapistClick={handleTherapistClick} />
            
            {/* Discipline Statistics */}
            <DisciplineStatistics 
              stats={disciplineStats} 
              onDisciplineSelect={handleDisciplineSelect}
              selectedDiscipline={selectedDiscipline}
              disciplineDetails={disciplineDetails}
              onResetDiscipline={handleResetDiscipline}
              onTherapistClick={handleTherapistClick}
            />
            
            {/* Therapist Earnings Table */}
            <TherapistEarnings 
              therapists={therapists} 
              selectedPeriod={selectedPeriod} 
              onTherapistClick={handleTherapistClick}
              onVerifyPayment={handleVerifyPayment}
            />
          </div>
          
          {/* Therapist Detail Modal */}
          {showTherapistModal && selectedTherapist && (
            <TherapistDetailModal 
              therapist={selectedTherapist} 
              period={selectedPeriod} 
              onClose={() => setShowTherapistModal(false)}
              onVerifyPayment={handleVerifyPayment}
            />
          )}
        </>
      )}
    </div>
  );
};

export default EnhancedAccountingDashboard;