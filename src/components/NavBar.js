import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <nav style={{ padding: 20, borderBottom: 'solid 2px rgba(120,120,120,1)' }}>
            <div style={{ maxWidth: 1000, margin: "auto", display: "flex", gap: 20, }}>
                <Link style={{ fontWeight: "bolder" }} to="/">TEST CLIENT</Link>
                <Link className="navbarlink" to="/nest-chat">NestTemplate Chat</Link>
                <Link className="navbarlink" to="/chat">Fightcode Chat</Link>
                <Link className="navbarlink" to="/upload">Upload</Link>
            </div>
        </nav>
    );
}