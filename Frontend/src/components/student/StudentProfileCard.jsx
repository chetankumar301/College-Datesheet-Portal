import { useAuth } from "../../context/AuthContext";

export default function StudentProfileCard() {

    const { user } = useAuth();

    return (

        <div className="student-profile-card">

            <h2>👤 Student Profile</h2>

            <div className="profile-item">
                <span>Name</span>
                <strong>{user?.name}</strong>
            </div>

            <div className="profile-item">
                <span>Email</span>
                <strong>{user?.email}</strong>
            </div>

            <div className="profile-item">
                <span>Course</span>
                <strong>{user?.course?.name || user?.course}</strong>
            </div>

            <div className="profile-item">
                <span>Branch</span>
                <strong>{user?.branch?.name || user?.branch}</strong>
            </div>

            <div className="profile-item">
                <span>Semester</span>
                <strong>{user?.semester}</strong>
            </div>

            <div className="profile-item">
                <span>Year</span>
                <strong>{user?.year}</strong>
            </div>

        </div>

    );

}