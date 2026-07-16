import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getAllColleges, createCollege, updateCollege, suspendCollege, activateCollege, deleteCollege } from "../services/collegeService";
import toast from "react-hot-toast";

export default function CollegeManagement() {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCollege, setEditingCollege] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        pricingPlan: "basic",
        maxStudents: 1000,
        annualFee: 0,
        perStudentFee: 0,
    });

    useEffect(() => {
        loadColleges();
    }, []);

    const loadColleges = async () => {
        try {
            const res = await getAllColleges();
            setColleges(res.data);
        } catch (err) {
            toast.error("Failed to load colleges");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCollege) {
                await updateCollege(editingCollege._id, formData);
                toast.success("College updated successfully");
            } else {
                await createCollege(formData);
                toast.success("College created successfully");
            }
            setShowModal(false);
            setEditingCollege(null);
            setFormData({
                name: "",
                code: "",
                email: "",
                phone: "",
                address: "",
                city: "",
                state: "",
                country: "India",
                pricingPlan: "basic",
                maxStudents: 1000,
                annualFee: 0,
                perStudentFee: 0,
            });
            loadColleges();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const handleEdit = (college) => {
        setEditingCollege(college);
        setFormData({
            name: college.name,
            code: college.code,
            email: college.email,
            phone: college.phone,
            address: college.address,
            city: college.city,
            state: college.state,
            country: college.country,
            pricingPlan: college.pricingPlan,
            maxStudents: college.maxStudents,
            annualFee: college.annualFee,
            perStudentFee: college.perStudentFee,
        });
        setShowModal(true);
    };

    const handleSuspend = async (id) => {
        const reason = prompt("Enter suspension reason:");
        if (reason) {
            try {
                await suspendCollege(id, reason);
                toast.success("College suspended successfully");
                loadColleges();
            } catch (err) {
                toast.error("Failed to suspend college");
            }
        }
    };

    const handleActivate = async (id) => {
        try {
            await activateCollege(id);
            toast.success("College activated successfully");
            loadColleges();
        } catch (err) {
            toast.error("Failed to activate college");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this college? This will delete all associated data.")) {
            try {
                await deleteCollege(id);
                toast.success("College deleted successfully");
                loadColleges();
            } catch (err) {
                toast.error("Failed to delete college");
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCollege(null);
        setFormData({
            name: "",
            code: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            country: "India",
            pricingPlan: "basic",
            maxStudents: 1000,
            annualFee: 0,
            perStudentFee: 0,
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
            <div className="college-management">
                <div className="header">
                    <h1>College Management</h1>
                    <button 
                        className="btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        + Add New College
                    </button>
                </div>

                <div className="college-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Code</th>
                                <th>Email</th>
                                <th>Students</th>
                                <th>Plan</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {colleges.map((college) => (
                                <tr key={college._id}>
                                    <td>{college.name}</td>
                                    <td>{college.code}</td>
                                    <td>{college.email}</td>
                                    <td>{college.studentCount || 0} / {college.maxStudents}</td>
                                    <td>{college.pricingPlan}</td>
                                    <td>
                                        <span className={`status-badge ${college.subscriptionStatus}`}>
                                            {college.subscriptionStatus}
                                        </span>
                                        {college.isSuspended && <span className="suspended-badge">Suspended</span>}
                                    </td>
                                    <td>
                                        <button className="btn-edit" onClick={() => handleEdit(college)}>Edit</button>
                                        {college.isSuspended ? (
                                            <button className="btn-activate" onClick={() => handleActivate(college._id)}>Activate</button>
                                        ) : (
                                            <button className="btn-suspend" onClick={() => handleSuspend(college._id)}>Suspend</button>
                                        )}
                                        <button className="btn-delete" onClick={() => handleDelete(college._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>{editingCollege ? "Edit College" : "Add New College"}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>College Name:</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>College Code:</label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone:</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Address:</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>City:</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>State:</label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Pricing Plan:</label>
                                    <select
                                        value={formData.pricingPlan}
                                        onChange={(e) => setFormData({...formData, pricingPlan: e.target.value})}
                                    >
                                        <option value="basic">Basic</option>
                                        <option value="standard">Standard</option>
                                        <option value="premium">Premium</option>
                                        <option value="enterprise">Enterprise</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Max Students:</label>
                                    <input
                                        type="number"
                                        value={formData.maxStudents}
                                        onChange={(e) => setFormData({...formData, maxStudents: parseInt(e.target.value)})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Annual Fee (₹):</label>
                                    <input
                                        type="number"
                                        value={formData.annualFee}
                                        onChange={(e) => setFormData({...formData, annualFee: parseInt(e.target.value)})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Per Student Fee (₹):</label>
                                    <input
                                        type="number"
                                        value={formData.perStudentFee}
                                        onChange={(e) => setFormData({...formData, perStudentFee: parseInt(e.target.value)})}
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">
                                        {editingCollege ? "Update" : "Create"}
                                    </button>
                                    <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
