import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import ChatParticipant from './ChatParticipant'

export function NestChatComponent() {
    const [messageData, setMessageData] = useState([])
    const [onMount, setOnMount] = useState(false)
    const [inputMessage, setInputMessage] = useState('')
    const [socket, setSocket] = useState(null)
    const [token, setToken] = useState('')
    const [chatRoomId, setchatRoomId] = useState('')
    const [applyData, setApplyData] = useState({})
    const [handshake, setHandshake] = useState({})
    const [page, setPage] = useState(1)
    const [userData, setUserData] = useState({})

    async function getOlderMessage() {
        const nextPage = page + 1
        setPage(nextPage)
        try {
            const res = await fetch(`http://localhost:8080/chat/listMessage?page=${nextPage}&chatroom_id=${applyData.chatRoomId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${applyData.token}`
                }
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json(); // Parse the response as JSON
            const dataSort = data.reverse()
            setMessageData((prevMsgData) => [...dataSort, ...prevMsgData]);
        } catch (err) {
            console.error('There was a problem with the fetch operation:', err);
        }
    }

    async function getChatParticipantData() {
        try {
            const res = await fetch(`http://localhost:8080/chat/chatParticipants/${applyData.chatRoomId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${applyData.token}`
                }
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json(); // Parse the response as JSON
            setUserData(data);
        } catch (err) {
            console.error('There was a problem with the fetch operation:', err);
        }
    }

    function onSubmit() {
        socket.emit('createMessage', {
            chatRoomId: parseInt(applyData.chatRoomId),
            messageContent: inputMessage
        }, () => {
            setInputMessage('')
        })
    }

    function apply() {
        setApplyData({
            token,
            chatRoomId,
        })
    }

    function onHandShake() {
        socket.emit('showId', {}, (res) => {
            setHandshake(res)
        })
    }

    useEffect(() => {
        if (onMount) {
            if (!applyData.token) {
                console.error("No token")
                return
            }
            setPage(1)
            const newSocket = io("http://localhost:8080",
                {
                    auth: { token: applyData.token }
                })
            setSocket(newSocket)
            getChatParticipantData()
        }
    }, [applyData])


    useEffect(() => {
        if (socket) {
            setMessageData([])
            socket.emit('listMessages', { chatroom_id: parseInt(chatRoomId) }, (res) => {
                setMessageData(res.reverse())
            })
            socket.on('message', (message) => {
                setMessageData((prevData) => [...prevData, message])
            })
            return () => {
                socket.off('message');
            };
        }
    }, [socket])

    useEffect(() => {
        setOnMount(true)
    }, [])



    return (
        <div style={{ display: 'flex', gap: 48 }}>
            <div style={{ width: '50%', padding: 12 }}>
                <div>
                    <h2>CONFIG</h2>
                    <p>Change variable accordingly, for auth token use the token string itself. Hit apply for the variable to take effect</p>
                    <div>
                        <textarea
                            style={{ width: '100%', padding: 8 }}
                            rows={6}
                            placeholder={`Auth Token (example)
                            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoicHBAZW1haWwuY29tIiwiaWF0IjoxNzA2NTg4OTU5LCJleHAiOjE3MDY2NzUzNTl9.Dm1-j3t2ISRHOKVR_kRCqcr4y5UaJRmnE4oAN4z3G8Q
                            `} onChange={(e) => { setToken(e.target.value) }} value={token} />
                    </div>
                    <div>
                        <input type='text' placeholder="Chatroom" onChange={(e) => { setchatRoomId(e.target.value) }} value={chatRoomId} />
                    </div>
                    <div>
                        <button onClick={() => apply()}>Apply</button>
                    </div>
                </div>
                <h3 style={{ marginTop: 50 }} >APPLIED DATA: </h3>
                <div style={{ padding: 12, borderRadius: 4, backgroundColor: '#EBEBEB' }}>
                    <p style={{ wordBreak: 'break-all' }}><b>Token: </b>{applyData.token}</p>
                    <p><b>Chatroom: </b>{applyData.chatRoomId}</p>
                    <p><b>Page: </b>{page}</p>

                </div>
            </div>
            <div style={{ width: '50%', padding: 20 }}>

                <h2>{`CHAT ROOM ${applyData?.chatRoomId ?? ``}`}</h2>
                {Object.keys(userData).length ? < ChatParticipant userData={userData} /> : null}
                {applyData?.chatRoomId ? <>
                    <div style={{ padding: 12, borderRadius: 4, marginTop: 12, border: 'solid 2px #787878' }}>
                        {messageData?.length ?
                            <>
                                <div>
                                    <button onClick={() => getOlderMessage()}>Load Previous Sad Pagination</button>
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

                        <div style={{ marginTop: 8 }}>
                            <input type='text' value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder='message ... ' />
                            <button onClick={() => onSubmit()}>Send</button></div>
                    </div>


                    <div style={{ marginTop: 48, borderTop: "solid 2px #787878", padding: 8 }}>
                        <h2>Handshake</h2>
                        <p>Throw token and see the payload</p>
                        <div style={{ wordBreak: "break-all", marginBottom: 8 }}>{JSON.stringify(handshake)}</div>
                        <button onClick={() => onHandShake()}>Handshake</button>
                    </div>
                </> :
                    <div>
                        Setup config variables then hit apply to connect to a chat room
                    </div>
                }


            </div>
        </div>
    )
}