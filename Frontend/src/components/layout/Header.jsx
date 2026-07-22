import { FaBell } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuClick }){

    const{

        user,

        logout

    }=useAuth();

const navigate = useNavigate();

const handleLogout = () => {

    logout();

    navigate("/");

};

    return(

        <div className="header">

            <button className="header-menu-button" type="button" onClick={onMenuClick} aria-label="Open sidebar">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <h2>

                College Datesheet Portal

            </h2>

            <div>

                <FaBell/>

                <span>

                    {user?.name}

                </span>

                <button onClick={handleLogout}>

    Logout

</button>

            </div>

        </div>

    );

}
