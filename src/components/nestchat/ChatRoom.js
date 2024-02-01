import { useState, useEffect } from "react"
import { useAuth } from "../../utils/AuthContext"
import ChatParticipant from "../ChatParticipant"
import { io } from "socket.io-client"

export function NestChatRoom({ selectedRoom }) {
    const { accessToken } = useAuth()
    const [messageData, setMessageData] = useState([]) // Chat message list
    const [onMount, setOnMount] = useState(false) // Component mount status
    const [inputMessage, setInputMessage] = useState('') // Message input box state
    const [socket, setSocket] = useState(null) // Socket connection instance
    const [page, setPage] = useState(0) // Pagination for chat messages
    const [userData, setUserData] = useState({}) // Chat Participant user data

    // Using Normal Fetch APIs to get pagination of previous messages
    // - Pardon the bad pagination setup
    async function getPreviousMessage() {
        setPage((prevPage) => prevPage + 1);
    }

    async function getMessage() {
        // Fetch API for listMessage: query (page, chatRoomId)
        // - Use camelCase for query params
        try {
            const res = await fetch(`http://localhost:8080/chat/listMessage?page=${page}&chatRoomId=${selectedRoom}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!res.ok) {
                throw new Error('Network response was not ok and neither should you');
            }
            const data = await res.json(); // Parse the response as JSON
            // Paginated data is in descending datetime for latest to oldest 
            const dataSort = data.reverse()
            // Update cached data
            setMessageData((prevMsgData) => [...dataSort, ...prevMsgData]);
        } catch (err) {
            console.error('There was a problem with the fetch operation:', err);
        }
    }

    // Get chat participant data (Object format)
    // - Cache and use it repetitively instead of relation fetches 
    async function getChatParticipantData() {
        try {
            const res = await fetch(`http://localhost:8080/chat/chatParticipants/${selectedRoom}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json(); // Parse the response as JSON
            // Set participant data
            setUserData(data);
        } catch (err) {
            console.error('There was a problem with the fetch operation:', err);
        }
    }

    // Send message via web socket event 
    function onSubmit() {
        socket.emit('createMessage', {
            chatRoomId: parseInt(selectedRoom),
            messageContent: inputMessage
        }, () => {
            setInputMessage('')
        })
    }

    // Initialize new config changes
    useEffect(() => {
        if (onMount) {
            // Prevent socket connection without token -> forbidden error
            if (!accessToken) {
                console.error("No token")
                return
            }
            // Reset Pagination
            setPage(1)
            // Connect to socket with auth token 
            const newSocket = io("http://localhost:8080",
                {
                    auth: { token: accessToken }
                })
            setSocket(newSocket)
            getChatParticipantData()
        }
    }, [selectedRoom])


    useEffect(() => {
        // Listen to socket events
        if (socket) {
            setMessageData([])
            socket.emit('joinChatRoom', { chatRoomId: parseInt(selectedRoom) }, (res) => {
                // Handle the response if needed
            });
            socket.on('userJoined', (data) => {
                // if online state/ is read needed
            });
            // update list when new messages are sent
            socket.on('message', (message) => {
                setMessageData((prevData) => [...prevData, message])
            })
            setPage(1) //Trigger initial page fetch
            return () => {
                socket.off('message');
                socket.off('userJoined');
            };
        }
    }, [socket])

    useEffect(() => {
        setOnMount(true)
    }, [selectedRoom])

    useEffect(() => {
        if (page) {
            getMessage()
        }
    }, [page])



    if (!selectedRoom) {
        return (<div style={{ textAlign: "center", justifyContent: "center" }}> Select a chatroom to start chatting</div>)
    }
    return (
        <>
            <div>
                <h2>{`CHAT ROOM ${selectedRoom}`}</h2>
                {Object.keys(userData).length ? < ChatParticipant userData={userData} /> : null}
                <div style={{ padding: 12, borderRadius: 4, marginTop: 12, border: 'solid 2px #787878' }}>
                    {messageData?.length ?
                        <>
                            <div>
                                <button onClick={() => getPreviousMessage()}>Load Previous Sad Pagination {page}</button>
                            </div>
                            {messageData.map((item, index) => {
                                if (item?.messageType === "SYS_MESSAGE") {
                                    return (
                                        <div style={{ padding: 8, fontSize: "12px" }} key={`message_${index}`}>
                                            <div style={{ textAlign: "center" }}>{item.messageContent}</div>
                                        </div>

                                    )
                                }
                                return (
                                    <div style={{ marginTop: 2, padding: 6, borderRadius: 4, backgroundColor: "#EEE" }} key={`message_${index}`}>
                                        <div style={{ fontSize: "12px" }}>{`${userData[item?.senderId]?.firstName} `}</div>
                                        <div>{item.messageContent}</div>
                                    </div>
                                )
                            })}
                        </> :
                        <div>
                            No Message
                        </div>
                    }

                    <div style={{ marginTop: 8, width: '100%', display: "flex" }}>
                        <input style={{ width: "100%" }} type='text' value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder='message ... ' />
                        <button onClick={() => onSubmit()}>Send</button></div>
                </div>

            </div>
        </>
    )

}