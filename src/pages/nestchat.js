import { useState } from "react";
import { NestChatComponent } from "../components/NestChatComponent";
import { NestChatRoom } from "../components/nestchat/ChatRoom";
import NestChatRoomList from "../components/nestchat/ChatRoomList";

export default function NestChatPage() {
    const [selectedRoom, setSelectedRoom] = useState(null)

    return (
        <>
            <div style={{ padding: 24 }}>
                <h1>NESTJS TEMPLATE CHAT</h1>
                {/* <NestChatComponent /> */}
                <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ width: "50%" }}>
                        <NestChatRoomList setSelectedRoom={setSelectedRoom} />
                    </div>
                    <div style={{ width: "50%" }}>
                        <NestChatRoom selectedRoom={Number(selectedRoom)} />
                    </div>

                </div>
            </div>
        </>
    )
}