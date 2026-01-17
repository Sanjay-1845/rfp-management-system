import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, CheckCircle } from 'lucide-react';
import { rfpApi } from '../services/api';

const CreateRFP = () => {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [createdRFP, setCreatedRFP] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!text.trim()) {
            setError('Please enter a description for your RFP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await rfpApi.createFromText(text);
            setCreatedRFP(response.data);
        } catch (err) {
            console.error('Failed to create RFP:', err);
            setError('Failed to generate RFP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setText('');
        setCreatedRFP(null);
        setError('');
    };

    if (createdRFP) {
        return (
            <div>
                <div className="page-header">
                    <h1 className="page-title">RFP Created Successfully!</h1>
                    <p className="page-subtitle">Your RFP has been generated from your description</p>
                </div>

                <div className="card" style={{ borderColor: 'var(--color-success)', borderWidth: '2px' }}>
                    <div className="flex items-center gap-md mb-lg">
                        <CheckCircle size={32} color="var(--color-success)" />
                        <div>
                            <h2 className="card-title">{createdRFP.title}</h2>
                            <p className="text-muted">RFP ID: {createdRFP.rfpId}</p>
                        </div>
                    </div>

                    {/* Structured Data Preview */}
                    {createdRFP.structured && (
                        <div className="mt-lg">
                            {/* Items */}
                            {createdRFP.structured.items?.length > 0 && (
                                <div className="mb-lg">
                                    <h3 className="font-semibold mb-sm">Items Required</h3>
                                    <div className="table-container">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th>Specifications</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {createdRFP.structured.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="font-medium">{item.name}</td>
                                                        <td>{item.quantity}</td>
                                                        <td className="text-muted">
                                                            {typeof item.specifications === 'object'
                                                                ? JSON.stringify(item.specifications)
                                                                : item.specifications || '-'
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Budget */}
                            {createdRFP.structured.budget?.amount && (
                                <div className="mb-lg">
                                    <h3 className="font-semibold mb-sm">Budget</h3>
                                    <p className="text-muted">
                                        ${createdRFP.structured.budget.amount.toLocaleString()} {createdRFP.structured.budget.currency}
                                    </p>
                                </div>
                            )}

                            {/* Constraints */}
                            {createdRFP.structured.constraints && (
                                <div className="mb-lg">
                                    <h3 className="font-semibold mb-sm">Constraints</h3>
                                    <div className="flex gap-lg">
                                        {createdRFP.structured.constraints.deliveryDays && (
                                            <div>
                                                <span className="text-muted">Delivery: </span>
                                                <span className="font-medium">{createdRFP.structured.constraints.deliveryDays} days</span>
                                            </div>
                                        )}
                                        {createdRFP.structured.constraints.paymentTerms && (
                                            <div>
                                                <span className="text-muted">Payment: </span>
                                                <span className="font-medium">{createdRFP.structured.constraints.paymentTerms}</span>
                                            </div>
                                        )}
                                        {createdRFP.structured.constraints.warranty && (
                                            <div>
                                                <span className="text-muted">Warranty: </span>
                                                <span className="font-medium">{createdRFP.structured.constraints.warranty}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-md mt-lg">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/send-rfp', { state: { selectedRfpId: createdRFP.rfpId } })}
                        >
                            Send to Vendors
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/rfp/${createdRFP.rfpId}`)}
                        >
                            View Details
                        </button>
                        <button className="btn btn-ghost" onClick={handleReset}>
                            Create Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Create New RFP</h1>
                <p className="page-subtitle">Describe your requirements in natural language and let AI structure it for you</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">
                            <Sparkles size={16} style={{ display: 'inline', marginRight: '8px' }} />
                            Describe Your Requirements
                        </label>
                        <textarea
                            className="form-textarea"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Example: We need 50 HP laptops with 16GB RAM and 512GB SSD for our engineering team. Budget is $50,000. Need delivery within 30 days. Looking for 1 year warranty with on-site support."
                            rows={8}
                        />
                    </div>

                    {error && (
                        <div className="mb-lg" style={{ color: 'var(--color-danger)' }}>
                            {error}
                        </div>
                    )}

                    <div className="flex gap-md">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner" style={{ width: '18px', height: '18px' }}></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Generate RFP with AI
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-lg" style={{ padding: 'var(--spacing-md)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <h4 className="font-medium mb-sm">
                        <FileText size={16} style={{ display: 'inline', marginRight: '8px' }} />
                        Tips for better results
                    </h4>
                    <ul style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', paddingLeft: 'var(--spacing-lg)' }}>
                        <li>Include specific quantities and product details</li>
                        <li>Mention your budget if you have one</li>
                        <li>Specify delivery timeline requirements</li>
                        <li>Add warranty or support requirements</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateRFP;
