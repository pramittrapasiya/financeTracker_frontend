import { useState, useEffect } from 'react';
import api from '../services/api';
import TransactionItem from '../components/TransactionItem';
import MonthSelector from '../components/MonthSelector';
import { getCurrentMonth, formatDateForInput } from '../utils/helpers';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        payMonth: getCurrentMonth(),
        type: '',
        category: '',
        account: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editFormData, setEditFormData] = useState({
        date: '',
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        account: 'bank',
        payMonth: ''
    });
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState('');

    const categories = {
        income: ['Salary', 'Freelance', 'Old Balance', 'Investment', 'Gift', 'Dividend', 'Other'],
        expense: ['Food', 'Transport', 'Medicines', 'Investment', 'Fuel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Send To Family Member', 'Other']
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters, pagination.page, pagination.limit]);

    useEffect(() => {
        if (editingTransaction) {
            setEditFormData({
                date: formatDateForInput(editingTransaction.date),
                amount: editingTransaction.amount,
                type: editingTransaction.type,
                category: editingTransaction.category,
                description: editingTransaction.description || '',
                account: editingTransaction.account,
                payMonth: editingTransaction.payMonth
            });
        }
    }, [editingTransaction]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                ...filters
            };

            // Remove empty filters
            Object.keys(params).forEach(key => {
                if (params[key] === '') delete params[key];
            });

            const response = await api.get('/transactions', { params });
            setTransactions(response.data.transactions);
            setPagination(prev => ({
                ...prev,
                ...response.data.pagination
            }));
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        try {
            await api.delete(`/transactions/${id}`);
            fetchTransactions();
        } catch (error) {
            alert('Failed to delete transaction');
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setUpdateError('');
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;

        // If type changes, reset category to empty
        if (name === 'type') {
            setEditFormData({
                ...editFormData,
                [name]: value,
                category: '' // Reset category when type changes
            });
        } else {
            setEditFormData({
                ...editFormData,
                [name]: value
            });
        }
    };

    const handleUpdateTransaction = async (e) => {
        e.preventDefault();
        setUpdateError('');
        setUpdateLoading(true);

        try {
            await api.put(`/transactions/${editingTransaction._id}`, editFormData);
            setEditingTransaction(null);
            fetchTransactions();
        } catch (err) {
            setUpdateError(err.response?.data?.message || 'Failed to update transaction');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingTransaction(null);
        setUpdateError('');
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleLimitChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Transactions</h1>
            </div>

            {/* Filters */}
            <div className="filters-card">
                <div className="filters-grid">
                    <div className="filter-group">
                        <label>Pay Month</label>
                        <MonthSelector
                            value={filters.payMonth}
                            onChange={(value) => handleFilterChange('payMonth', value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label>Type</label>
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Account</label>
                        <select
                            value={filters.account}
                            onChange={(e) => handleFilterChange('account', e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="bank">Bank</option>
                            <option value="cash">Cash</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Category</label>
                        <input
                            type="text"
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            placeholder="Filter by category"
                        />
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="transactions-list">
                {loading ? (
                    <div className="loading">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">
                        <p>No transactions found</p>
                    </div>
                ) : (
                    <>
                        {transactions.map(transaction => (
                            <TransactionItem
                                key={transaction._id}
                                transaction={transaction}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </>
                )}
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
                <div className="pagination-container">
                    <div className="pagination-info-section">
                        <span className="pagination-total">
                            Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
                        </span>
                        <div className="pagination-limit-selector">
                            <label htmlFor="page-limit">Per page:</label>
                            <select
                                id="page-limit"
                                value={pagination.limit}
                                onChange={(e) => handleLimitChange(Number(e.target.value))}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>

                    {pagination.pages > 1 && (
                        <div className="pagination-controls">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={pagination.page === 1}
                                className="btn-pagination"
                                title="First page"
                            >
                                ««
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="btn-pagination"
                                title="Previous page"
                            >
                                ‹
                            </button>

                            {/* Page numbers */}
                            <div className="pagination-numbers">
                                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.pages <= 5) {
                                        pageNum = i + 1;
                                    } else if (pagination.page <= 3) {
                                        pageNum = i + 1;
                                    } else if (pagination.page >= pagination.pages - 2) {
                                        pageNum = pagination.pages - 4 + i;
                                    } else {
                                        pageNum = pagination.page - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`btn-page-number ${pagination.page === pageNum ? 'active' : ''}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                                className="btn-pagination"
                                title="Next page"
                            >
                                ›
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.pages)}
                                disabled={pagination.page === pagination.pages}
                                className="btn-pagination"
                                title="Last page"
                            >
                                »»
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Transaction Modal */}
            {editingTransaction && (
                <div className="modal-overlay" onClick={handleCancelEdit}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Transaction</h2>
                            <button onClick={handleCancelEdit} className="modal-close">&times;</button>
                        </div>

                        {updateError && <div className="error-message">{updateError}</div>}

                        <form onSubmit={handleUpdateTransaction} className="transaction-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="edit-date">Transaction Date</label>
                                    <input
                                        type="date"
                                        id="edit-date"
                                        name="date"
                                        value={editFormData.date}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="edit-payMonth">Pay Month</label>
                                    <MonthSelector
                                        value={editFormData.payMonth}
                                        onChange={(value) => setEditFormData({ ...editFormData, payMonth: value })}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="edit-type">Type</label>
                                    <select
                                        id="edit-type"
                                        name="type"
                                        value={editFormData.type}
                                        onChange={handleEditFormChange}
                                        required
                                    >
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="edit-amount">Amount</label>
                                    <input
                                        type="number"
                                        id="edit-amount"
                                        name="amount"
                                        value={editFormData.amount}
                                        onChange={handleEditFormChange}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="edit-category">Category</label>
                                    <select
                                        id="edit-category"
                                        name="category"
                                        value={editFormData.category}
                                        onChange={handleEditFormChange}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories[editFormData.type].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="edit-account">Account</label>
                                    <select
                                        id="edit-account"
                                        name="account"
                                        value={editFormData.account}
                                        onChange={handleEditFormChange}
                                        required
                                    >
                                        <option value="bank">Bank</option>
                                        <option value="cash">Cash</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="edit-description">Description (Optional)</label>
                                <textarea
                                    id="edit-description"
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleEditFormChange}
                                    rows="3"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={updateLoading}>
                                    {updateLoading ? 'Updating...' : 'Update Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;

