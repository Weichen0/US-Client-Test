import { useState } from "react";
import MedInfo from "../components/upload/MedInfo";
import UserAvatar from "../components/upload/UserAvatar";

export default function UploadPage() {
    const [data, setData] = useState()
    async function handshake() {
        const response = await fetch(`http://localhost:8080/hello`, { method: 'GET' })
            .then((res) => {
                return res.json()
            })
        if (response) {
            setData(response)
        }
    }
    return (
        <div style={{ padding: 20 }}>
            <h1>FIGHTCODE FILE UPLOAD</h1>
            <MedInfo />
            <UserAvatar />
            <div>{(data?.message)}</div>
            <button onClick={() => handshake()}>Handshake</button>
        </div>
    )
}