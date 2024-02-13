import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function NavBar() {
    const { userProfile, logout } = useAuth()

    const handleLogOut = () => {
        logout()
    }

    return (
        <nav style={{ padding: 20, borderBottom: 'solid 2px rgba(120,120,120,1)' }}>
            <div style={{ maxWidth: 1000, margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 20 }}>
                    <Link style={{ fontWeight: "bolder" }} to="/">TEST CLIENT</Link>
                    <Link className="navbarlink" to="/nest-chat">NestTemplate Chat</Link>
                    <Link className="navbarlink" to="/chat">Fightcode Chat</Link>
                    <Link className="navbarlink" to="/upload">Upload</Link>
                    <Link className="navbarlink" to="/billing">Billing</Link>

                </div>
                {userProfile ?
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span>{`${userProfile.firstName} ${userProfile.lastName}`}</span>
                        <button
                            style={{ padding: 10 }} onClick={handleLogOut}>Log Out</button>
                    </div>
                    :
                    <Link style={{ padding: 10 }}
                        className="homebutton" to="/sign-in"> Sign In
                    </Link>}
            </div>
        </nav >
    );
}