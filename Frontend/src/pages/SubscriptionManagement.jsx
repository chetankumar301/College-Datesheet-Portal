import { useEffect, useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import { createSubscription, getAllSubscriptions, cancelSubscription, renewSubscription } from "../services/subscriptionService";
import { getAllColleges } from "../services/collegeService";
import toast from "react-hot-toast";

const PLAN_PRICES = { basic: 5, standard: 10 };

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
        const price = PLAN_PRICES[formData.plan] || 5;
        return (Number(formData.studentCount) || 0) * price;
    }, [formData.plan, formData.studentCount]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
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
        const endDate = prompt("Enter new end date (YYYY-MM-DD):");
        const studentCount = prompt("Enter new student count:");
        if (!endDate || studentCount === null) return;
        try {
            await renewSubscription(id, { endDate, studentCount: Number(studentCount) || 0 });
            toast.success("Subscription renewed successfully");
            loadData();
        } catch {
            toast.error("Failed to renew subscription");
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this subscription?")) return;
        try {
            await cancelSubscription(id);
            toast.success("Subscription cancelled successfully");
            loadData();
        } catch {
            toast.error("Failed to cancel subscription");
        }
    };

    if (loading) {
        return <Layout><h2>Loading...</h2></Layout>;
    }

    return (
        <Layout>
            <div className="subscription-management">
                <div className="header">
                    <h1>Subscription Management</h1>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>+ Create Subscription</button>
                </div>

                <div className="subscription-list">
                    <table>
                        <thead>
                            <tr>
                                <th>College</th><th>Plan</th><th>Students</th><th>Price/Student</th><th>Total</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((sub) => (
                                <tr key={sub._id}>
                                    <td>{sub.college?.name || "N/A"}</td>
                                    <td>{sub.plan}</td>
                                    <td>{sub.studentCount || 0}</td>
                                    <td>₹{sub.pricePerStudent || 0}</td>
                                    <td>₹{(sub.calculatedAmount || sub.amount || 0).toLocaleString()}</td>
                                    <td>{sub.status}</td>
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
                                    <label>College</label>
                                    <select value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} required>
                                        <option value="">Select college</option>
                                        {colleges.map((college) => (
                                            <option key={college._id} value={college._id}>{college.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Plan</label>
                                    <select value={formData.plan} onChange={(e) => setFormData({ ...formData, plan: e.target.value })}>
                                        <option value="basic">Basic</option>
                                        <option value="standard">Standard</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Student Count</label>
                                    <input type="number" value={formData.studentCount} onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })} required />
                                </div>
                                <div className="form-group"><strong>Total Amount: ₹{calculatedAmount.toLocaleString()}/year</strong></div>
                                <div className="form-group"><label>Start Date</label><input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required /></div>
                                <div className="form-group"><label>End Date</label><input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required /></div>
                                <div className="form-group"><label>Billing Name</label><input value={formData.billingName} onChange={(e) => setFormData({ ...formData, billingName: e.target.value })} required /></div>
                                <div className="form-group"><label>Billing Email</label><input type="email" value={formData.billingEmail} onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })} required /></div>
                                <div className="form-group"><label>Billing Address</label><input value={formData.billingAddress} onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })} required /></div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">Create</button>
                                    <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
