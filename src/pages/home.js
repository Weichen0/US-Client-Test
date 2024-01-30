import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div style={{ padding: 32 }}>
            <h1>TEST CLIENT</h1>
            <p>Testing backend stuff and implementation guide for frontend</p>
            <h2>NestJS Template Tests</h2>
            <div style={{ display: "flex", gap: 4, maxWidth: "max-content" }}>
                <Link
                    className="homebutton"
                    to="/nest-chat">Chat Feature</Link>
            </div>

            <h2>Fightcode Tests</h2>
            <div style={{ display: "flex", gap: 4, maxWidth: "max-content" }}>
                <Link
                    className="homebutton"
                    to="/upload">File Upload</Link>
                <Link
                    className="homebutton"
                    to="/chat">Fightcode Chat</Link>
            </div>
        </div>
    )
}