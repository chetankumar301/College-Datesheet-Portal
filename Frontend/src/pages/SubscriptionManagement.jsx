import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getAllSubscriptions, createSubscription, renewSubscription, cancelSubscription } from "../services/subscriptionService";
import toast from "react-hot-toast";

export default function SubscriptionManagement() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        college: "",
        plan: "basic",
        startDate: "",
        endDate: "",
        amount: 0,
        paymentMethod: "bank_transfer",
        billingName: "",
        billingEmail: "",
        billingAddress: "",
    });

    useEffect(() => {
        loadSubscriptions();
    }, []);

    const loadSubscriptions = async () => {
        try {
            const res = await getAllSubscriptions();
            setSubscriptions(res.data);
        } catch (err) {
            toast.error("Failed to load subscriptions");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createSubscription(formData);
            toast.success("Subscription created successfully");
            setShowModal(false);
            setFormData({
                college: "",
                plan: "basic",
                startDate: "",
                endDate: "",
                amount: 0,
                paymentMethod: "bank_transfer",
                billingName: "",
                billingEmail: "",
                billingAddress: "",
            });
            loadSubscriptions();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const handleRenew = async (id) => {
        const endDate = prompt("Enter new end date (YYYY-MM-DD):");
        const amount = prompt("Enter renewal amount:");
        if (endDate && amount) {
            try {
                await renewSubscription(id, { endDate, amount: parseInt(amount) });
                toast.success("Subscription renewed successfully");
                loadSubscriptions();
            } catch (err) {
                toast.error("Failed to renew subscription");
            }
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this subscription?")) {
            try {
                await cancelSubscription(id);
                toast.success("Subscription cancelled successfully");
                loadSubscriptions();
            } catch (err) {
                toast.error("Failed to cancel subscription");
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            college: "",
            plan: "basic",
            startDate: "",
            endDate: "",
            amount: 0,
            paymentMethod: "bank_transfer",
            billingName: "",
            billingEmail: "",
            billingAddress: "",
        });
    };

    if (loading) {
        return (
            <Layout>
                <h2>Loading...</h2>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="subscription-management">
                <div className="header">
                    <h1>Subscription Management</h1>
                    <button 
                        className="btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        + Create Subscription
                    </button>
                </div>

                <div className="subscription-list">
                    <table>
                        <thead>
                            <tr>
                                <th>College</th>
                                <th>Plan</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Payment Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((sub) => (
                                <tr key={sub._id}>
                                    <td>{sub.college?.name || "N/A"}</td>
                                    <td>{sub.plan}</td>
                                    <td>{new Date(sub.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(sub.endDate).toLocaleDateString()}</td>
                                    <td>₹{sub.amount?.toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge ${sub.status}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`payment-badge ${sub.paymentStatus}`}>
                                            {sub.paymentStatus}
                                        </span>
                                    </td>
                                    <td>
                                        {sub.status === "active" && (
                                            <>
                                                <button className="btn-renew" onClick={() => handleRenew(sub._id)}>Renew</button>
                                                <button className="btn-cancel" onClick={() => handleCancel(sub._id)}>Cancel</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Create Subscription</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>College ID:</label>
                                    <input
                                        type="text"
                                        value={formData.college}
                                        onChange={(e) => setFormData({...formData, college: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Plan:</label>
                                    <select
                                        value={formData.plan}
                                        onChange={(e) => setFormData({...formData, plan: e.target.value})}
                                    >
                                        <option value="basic">Basic</option>
                                        <option value="standard">Standard</option>
                                        <option value="premium">Premium</option>
                                        <option value="enterprise">Enterprise</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Start Date:</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date:</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Amount (₹):</label>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Payment Method:</label>
                                    <select
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                                    >
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="card">Card</option>
                                        <option value="upi">UPI</option>
                                        <option value="cheque">Cheque</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Billing Name:</label>
                                    <input
                                        type="text"
                                        value={formData.billingName}
                                        onChange={(e) => setFormData({...formData, billingName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Billing Email:</label>
                                    <input
                                        type="email"
                                        value={formData.billingEmail}
                                        onChange={(e) => setFormData({...formData, billingEmail: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Billing Address:</label>
                                    <input
                                        type="text"
                                        value={formData.billingAddress}
                                        onChange={(e) => setFormData({...formData, billingAddress: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">Create</button>
                                    <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
