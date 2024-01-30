import { NestChatComponent } from "../components/NestChatComponent";

export default function NestChatPage() {
    return (
        <>
            <div style={{ padding: 24 }}>
                <h1>NESTJS TEMPLATE CHAT</h1>
                <NestChatComponent />
            </div>
        </>
    )
}