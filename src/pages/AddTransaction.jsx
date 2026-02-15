import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import MonthSelector from '../components/MonthSelector';
import { getCurrentMonth, formatDateForInput } from '../utils/helpers';

const AddTransaction = () => {
    const [formData, setFormData] = useState({
        date: formatDateForInput(new Date()),
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        account: 'bank',
        payMonth: getCurrentMonth()
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const categories = {
        income: ['Salary', 'Freelance', 'Old Balance', 'Investment', 'Gift', 'Dividend', 'Other'],
        expense: ['Food', 'Transport', 'Medicines', 'Investment', 'Fuel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Send To Family Member', 'Other']
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/transactions', formData);
            navigate('/transactions');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="form-card">
                <h1>Add Transaction</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="transaction-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="date">Transaction Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="payMonth">Pay Month</label>
                            <MonthSelector
                                value={formData.payMonth}
                                onChange={(value) => setFormData({ ...formData, payMonth: value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="type">Type</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="amount">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select category</option>
                                {categories[formData.type].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="account">Account</label>
                            <select
                                id="account"
                                name="account"
                                value={formData.account}
                                onChange={handleChange}
                                required
                            >
                                <option value="bank">Bank</option>
                                <option value="cash">Cash</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description (Optional)</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Add notes about this transaction..."
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransaction;
