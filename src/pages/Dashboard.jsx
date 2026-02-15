import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';
import MonthSelector from '../components/MonthSelector';
import { getCurrentMonth, formatCurrency } from '../utils/helpers';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpense: 0,
        remainingBalance: 0,
        bankBalance: 0,
        cashBalance: 0
    });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [selectedMonth]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch monthly stats
            const statsResponse = await api.get(`/dashboard/${selectedMonth}`);
            setStats(statsResponse.data.stats);

            // Fetch recent transactions for the month
            const transactionsResponse = await api.get('/transactions', {
                params: { payMonth: selectedMonth, limit: 5 }
            });
            setRecentTransactions(transactionsResponse.data.transactions);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: ['Income', 'Expense'],
        datasets: [
            {
                label: 'Amount',
                data: [stats.totalIncome, stats.totalExpense],
                backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(239, 68, 68, 0.7)'],
                borderColor: ['rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)'],
                borderWidth: 2
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Income vs Expense'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="page-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <MonthSelector value={selectedMonth} onChange={setSelectedMonth} />
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card income">
                    <div className="stat-label">Total Income</div>
                    <div className="stat-value">{formatCurrency(stats.totalIncome)}</div>
                </div>

                <div className="stat-card expense">
                    <div className="stat-label">Total Expense</div>
                    <div className="stat-value">{formatCurrency(stats.totalExpense)}</div>
                </div>

                <div className="stat-card balance">
                    <div className="stat-label">Remaining Balance</div>
                    <div className="stat-value">{formatCurrency(stats.remainingBalance)}</div>
                </div>

                <div className="stat-card bank">
                    <div className="stat-label">Bank Balance</div>
                    <div className="stat-value">{formatCurrency(stats.bankBalance)}</div>
                </div>

                <div className="stat-card cash">
                    <div className="stat-label">Cash Balance</div>
                    <div className="stat-value">{formatCurrency(stats.cashBalance)}</div>
                </div>
            </div>

            {/* Chart */}
            <div className="chart-card">
                <div className="chart-container">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="recent-transactions">
                <h2>Recent Transactions</h2>
                {recentTransactions.length === 0 ? (
                    <div className="empty-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        <p>No transactions for this month</p>
                    </div>
                ) : (
                    <div className="transactions-preview">
                        {recentTransactions.map(transaction => (
                            <div key={transaction._id} className={`transaction-preview-item ${transaction.type}`}>
                                <div className="preview-left">
                                    <div className={`preview-icon ${transaction.type}`}>
                                        {transaction.type === 'income' ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="12" y1="19" x2="12" y2="5"></line>
                                                <polyline points="5 12 12 5 19 12"></polyline>
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <polyline points="19 12 12 19 5 12"></polyline>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="preview-info">
                                        <span className="preview-category">{transaction.category}</span>
                                        <span className="preview-date">
                                            {new Date(transaction.date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="preview-right">
                                    <span className={`preview-amount ${transaction.type}`}>
                                        {transaction.type === 'income' ? '+' : '-'}
                                        {formatCurrency(transaction.amount)}
                                    </span>
                                    <span className="preview-account">{transaction.account}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
