import { useState } from "react"
import { useAuth } from "../utils/AuthContext"

const pageStyle = {
    formSection: { marginTop: 24, display: "grid", maxWidth: 350, gap: 8 }
}

// not directly referencing 
const sampleUser = [

    {
        firstName: "John",
        lastName: "Doe",
        phone: "01111111111",
        email: "johndoe@email.com",
        hashKey: "samplepassword",
        googleId: "samplegoogleid"
    },
    {
        firstName: "Peter",
        lastName: "Parker",
        phone: "0112323232",
        email: "pp@email.com",
        hashKey: "samplepassword1",
    },
    {
        firstName: "Tony",
        lastName: "Stark",
        phone: "0112324232",
        email: "ironman@email.com",
        hashKey: "samplepassword2",
    }
]

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
            <div style={{ padding: 20, display: 'flex', gap: 20 }}>
                <div style={{ width: "50%" }}>
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
                <div style={{ width: "50%" }}>
                    {
                        sampleUser?.map((item, index) => (
                            <div
                                key={`sample-user-${index}`}
                                style={{ padding: 20, display: 'grid', borderRadius: 4, border: "solid 2px #787878", marginTop: "10px" }}
                            >
                                <b>{`${item.firstName} ${item.lastName}`}</b>
                                <span>{item.email}</span>
                                <span>{item.hashKey}</span>

                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}