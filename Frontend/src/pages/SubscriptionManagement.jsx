import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { getAllColleges } from "../services/collegeService";
import { cancelSubscription, createSubscription, getAllSubscriptions, renewSubscription } from "../services/subscriptionService";

const PLAN_PRICES = { basic: 5, standard: 10 };
const PLAN_FEATURES = {
    basic: ["Manual upload", "Approval workflow", "Student publishing"],
    standard: ["Automatic generator", "Analytics", "Priority support"],
};

const emptyForm = {
    college: "",
    plan: "basic",
    studentCount: 0,
    startDate: "",
    endDate: "",
    paymentMethod: "bank_transfer",
    billingName: "",
    billingEmail: "",
    billingAddress: "",
};

export default function SubscriptionManagement() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(emptyForm);

    const calculatedAmount = useMemo(() => {
        const price = PLAN_PRICES[formData.plan] || PLAN_PRICES.basic;
        return (Number(formData.studentCount) || 0) * price;
    }, [formData.plan, formData.studentCount]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [subsRes, collegesRes] = await Promise.all([getAllSubscriptions(), getAllColleges()]);
            setSubscriptions(Array.isArray(subsRes.data) ? subsRes.data : []);
            setColleges(Array.isArray(collegesRes.data) ? collegesRes.data : []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load subscriptions");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => setFormData(emptyForm);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createSubscription({ ...formData, amount: calculatedAmount });
            toast.success("Subscription created successfully");
            setShowModal(false);
            resetForm();
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleRenew = async (id) => {
        const endDate = prompt("Enter new expiry date (YYYY-MM-DD):");
        const studentCount = prompt("Enter student count:");
        if (!endDate || studentCount === null) return;
        try {
            await renewSubscription(id, { endDate, studentCount: Number(studentCount) || 0 });
            toast.success("Subscription updated successfully");
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update subscription");
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this subscription?")) return;
        try {
            await cancelSubscription(id);
            toast.success("Subscription cancelled successfully");
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel subscription");
        }
    };

    if (loading) return <Layout><h2>Loading...</h2></Layout>;

    return (
        <Layout>
            <div className="subscription-management">
                <div className="college-management-header">
                    <div>
                        <p className="page-kicker">Plans and billing</p>
                        <h1>Subscription Management</h1>
                        <p className="page-subtitle">Manage plans, pricing, college status, expiry, upgrades, downgrades, and payment history.</p>
                    </div>
                    <button className="btn-primary" type="button" onClick={() => setShowModal(true)}>+ Create Subscription</button>
                </div>

                <div className="exam-cards">
                    {Object.entries(PLAN_PRICES).map(([plan, price]) => (
                        <div className="exam-card" key={plan}>
                            <strong>{plan.toUpperCase()}</strong>
                            <span>INR {price}/student/year</span>
                            <p>{PLAN_FEATURES[plan].join(", ")}</p>
                        </div>
                    ))}
                </div>

                <div className="college-list-panel">
                    <div className="college-list">
                        <table className="table">
                            <thead>
                                <tr><th>College</th><th>Plan</th><th>Students</th><th>Price</th><th>Total</th><th>Status</th><th>Expiry</th><th>Payment</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {subscriptions.length ? subscriptions.map((sub) => (
                                    <tr key={sub._id}>
                                        <td>{sub.college?.name || "N/A"}</td>
                                        <td>{sub.plan}</td>
                                        <td>{sub.studentCount || 0}</td>
                                        <td>INR {sub.pricePerStudent || 0}</td>
                                        <td>INR {(sub.calculatedAmount || sub.amount || 0).toLocaleString()}</td>
                                        <td>{sub.status}</td>
                                        <td>{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : "N/A"}</td>
                                        <td>{sub.paymentStatus || "pending"}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="btn-edit" type="button" onClick={() => handleRenew(sub._id)}>Renew / Upgrade</button>
                                                <button className="btn-secondary" type="button" onClick={() => handleRenew(sub._id)}>Downgrade</button>
                                                {sub.status === "active" && <button className="btn-delete" type="button" onClick={() => handleCancel(sub._id)}>Cancel</button>}
                                            </div>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="9">No subscriptions found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="utility-panel">
                    <h2>Payment History</h2>
                    <div className="college-list">
                        <table className="table">
                            <thead><tr><th>Date</th><th>College</th><th>Method</th><th>Transaction</th><th>Amount</th><th>Status</th></tr></thead>
                            <tbody>
                                {subscriptions.map((sub) => (
                                    <tr key={`payment-${sub._id}`}>
                                        <td>{sub.updatedAt ? new Date(sub.updatedAt).toLocaleDateString() : "N/A"}</td>
                                        <td>{sub.college?.name || "N/A"}</td>
                                        <td>{sub.paymentMethod || "N/A"}</td>
                                        <td>{sub.transactionId || "N/A"}</td>
                                        <td>INR {(sub.calculatedAmount || sub.amount || 0).toLocaleString()}</td>
                                        <td>{sub.paymentStatus || "pending"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showModal && (
                    <div className="college-form-panel">
                        <div className="panel-topline">
                            <h2>Create Subscription</h2>
                            <button className="btn-secondary" type="button" onClick={() => { setShowModal(false); resetForm(); }}>Close</button>
                        </div>
                        <form className="college-form" onSubmit={handleSubmit}>
                            <div className="form-grid-2">
                                <div className="form-group"><label>College</label><select value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} required><option value="">Select college</option>{colleges.map((college) => <option key={college._id} value={college._id}>{college.name}</option>)}</select></div>
                                <div className="form-group"><label>Plan</label><select value={formData.plan} onChange={(e) => setFormData({ ...formData, plan: e.target.value })}><option value="basic">Basic</option><option value="standard">Standard</option></select></div>
                                <div className="form-group"><label>Student Count</label><input type="number" min="1" value={formData.studentCount} onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })} required /></div>
                                <div className="form-group"><label>Payment Method</label><select value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}><option value="bank_transfer">Bank Transfer</option><option value="upi">UPI</option><option value="card">Card</option><option value="cheque">Cheque</option></select></div>
                                <div className="form-group"><label>Start Date</label><input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required /></div>
                                <div className="form-group"><label>End Date</label><input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required /></div>
                            </div>
                            <div className="section-preview">Total Amount: INR {calculatedAmount.toLocaleString()}/year</div>
                            <div className="form-grid-2">
                                <div className="form-group"><label>Billing Name</label><input value={formData.billingName} onChange={(e) => setFormData({ ...formData, billingName: e.target.value })} required /></div>
                                <div className="form-group"><label>Billing Email</label><input type="email" value={formData.billingEmail} onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })} required /></div>
                            </div>
                            <div className="form-group"><label>Billing Address</label><input value={formData.billingAddress} onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })} required /></div>
                            <div className="form-actions"><button type="submit" className="btn-primary">Create</button><button type="button" className="btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button></div>
                        </form>
                    </div>
                )}
            </div>
        </Layout>
    );
}
