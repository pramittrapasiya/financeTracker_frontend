import { formatCurrency } from '../utils/helpers';

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
    const isIncome = transaction.type === 'income';

    // Format date to show day and month
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-IN', { month: 'short' });
        return { day, month };
    };

    const { day, month } = formatDate(transaction.date);

    return (
        <div className={`transaction-item ${transaction.type}`}>
            <div className="transaction-date-badge">
                <div className="date-day">{day}</div>
                <div className="date-month">{month}</div>
            </div>

            <div className="transaction-content">
                <div className="transaction-main">
                    <div className="transaction-title">
                        <h3 className="transaction-category">{transaction.category}</h3>
                        <span className={`transaction-type-badge ${transaction.type}`}>
                            {transaction.type}
                        </span>
                    </div>
                    <div className="transaction-meta">
                        <span className="meta-item">
                            <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            {new Date(transaction.date).toLocaleDateString('en-IN')}
                        </span>
                        <span className="meta-item">
                            <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                <line x1="1" y1="10" x2="23" y2="10"></line>
                            </svg>
                            {transaction.account === 'bank' ? 'Bank' : 'Cash'}
                        </span>
                        <span className="meta-item">
                            <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            Pay: {transaction.payMonth}
                        </span>
                    </div>
                    {transaction.description && (
                        <p className="transaction-description">{transaction.description}</p>
                    )}
                </div>

                <div className="transaction-right">
                    <div className={`transaction-amount ${isIncome ? 'income' : 'expense'}`}>
                        <span className="amount-sign">{isIncome ? '+' : '-'}</span>
                        <span className="amount-value">{formatCurrency(transaction.amount)}</span>
                    </div>
                    <div className="transaction-actions">
                        <button onClick={() => onEdit(transaction)} className="btn-edit" title="Edit transaction">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                        </button>
                        <button onClick={() => onDelete(transaction._id)} className="btn-delete" title="Delete transaction">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionItem;
