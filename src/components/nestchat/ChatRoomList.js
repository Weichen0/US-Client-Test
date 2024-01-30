import { useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthContext";




export default function NestChatRoomList({ setSelectedRoom }) {
    const { accessToken } = useAuth()
    const [roomList, setRoomList] = useState([])

    async function getChatRooms() {
        try {
            const response = await fetch(`http://localhost:8080/chat/userChatRooms`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (!response.ok) {
                throw "Can't retrieve data"
            }
            const data = await response.json()
            setRoomList(data)

        } catch (error) {
            console.error(error)
        }
    }
    function RoomCard({ item }) {
        const { id, chatParticipant, dateCreated } = item ?? {}
        return (
            <div
                onClick={() => setSelectedRoom(id)}
                style={{ padding: 16, borderBottom: "solid 2px #787878" }}>
                <div style={{ fontWeight: "Bold" }}>{`CHAT ROOM ID ${id}`}</div>
                <div>Users: {chatParticipant.length}</div>
                <div>{new Date(dateCreated).toLocaleDateString()}</div>

            </div>
        )
    }

    useEffect(() => {
        getChatRooms()
    }, [])

    return (
        <div>
            <h2>{`CHAT ROOMS`}</h2>
            {/* <div>
                <button> Create New Chat Room</button>
            </div> */}
            <div style={{ borderTop: "solid 2px #787878" }}>
                {
                    roomList.length ?
                        roomList.map((item, index) => (
                            <RoomCard key={`chatroom-${index}`} item={item} />
                        ))
                        :
                        <div style={{ justifyContent: "center", alignItems: "center", padding: 20 }}>
                            No Chat Rooms Found, Check if you're logged in
                        </div>
                }
            </div>

        </div>
    )
}