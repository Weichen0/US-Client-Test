import { useState } from "react"
import { useAuth } from "../utils/AuthContext"

const pageStyle = {
    formSection: { marginTop: 24, display: "grid", maxWidth: 350, gap: 8 }
}

export default function SignInPage() {
    const { login } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [response, setResponse] = useState(null)

    async function signIn() {
        try {
            const reqBody = { email, password }
            const fetchRes = await fetch(`http://localhost:8080/auth/signIn`, {
                method: "POST",
                body: JSON.stringify(reqBody),
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!fetchRes.ok) {
                throw new Error('Authentication failed');
            }
            const data = await fetchRes.json();
            setResponse(data)
            const accessToken = data.tokens.accessToken;
            login(accessToken);
        } catch (error) {
            console.error('Sign-in failed:', error.message);
        }

    }

    return (
        <>
            <div style={{ padding: 20 }}>
                <h1 style={{ marginBottom: 24 }}>SIGN IN</h1>
                {
                    response ? <div style={{ marginBottom: 24, wordBreak: "break-all" }}>
                        {JSON.stringify(response)}
                    </div>
                        : null
                }
                <div style={pageStyle.formSection}>
                    <label>Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="johndoe@email.com"
                        type="email"
                        value={email}
                    />
                </div>
                <div style={pageStyle.formSection}>
                    <label>Password</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="samplepassword"
                        type="password"
                        value={password}
                    />
                </div>
                <div style={pageStyle.formSection}>
                    <button
                        onClick={() => signIn()}
                    >Sign In</button>
                </div>

            </div>
        </>
    )
}