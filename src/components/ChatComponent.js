import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

export function ChatComponent() {
    const [messageData, setMessageData] = useState([])
    const [onMount, setOnMount] = useState(false)
    const [inputMessage, setInputMessage] = useState('')
    const [socket, setSocket] = useState(null)
    const [token, setToken] = useState('')
    const [chatroomId, setChatroomId] = useState('')
    const [applyData, setApplyData] = useState({})
    const [handshake, setHandshake] = useState({})
    const [page, setPage] = useState(1)


    async function getOlderMessage() {
        const nextPage = page + 1
        setPage(nextPage)
        try {
            const res = await fetch(`http://localhost:8080/chat/listMessage?page=${nextPage}&chatRoomId=${applyData.chatroomId}`, {
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
    function onSubmit() {
        socket.emit('createMessage', { chatroom_id: parseInt(applyData.chatroomId), message_content: inputMessage }, () => {
            setInputMessage('')
        })
    }

    function apply() {
        setApplyData({
            token,
            chatroomId,
        })

    }

    function onHandShake() {
        socket.emit('showId', {}, (res) => {
            setHandshake(res)

        })
    }

    useEffect(() => {
        if (onMount && applyData.token) {
            console.log("applyData", applyData.token)

            setPage(1)
            const newSocket = io("http://localhost:8080",
                {
                    auth: { token: applyData.token }
                })
            setSocket(newSocket)
        }
    }, [applyData])

    useEffect(() => {
        if (socket && onMount) {
            console.log("socket", applyData.token)
            setMessageData([])
            socket.emit('listMessages', { chatroom_id: parseInt(chatroomId) }, (res) => {
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
        <div style={{ display: 'flex' }}>
            <div style={{ width: '50%', padding: 12 }}>
                <div>
                    <h2>Variables</h2>
                    <p>Change variable accordingly, for auth token use the token string itself. Hit apply for the variable to take effect</p>
                    <div>
                        <textarea
                            style={{ width: '100%' }}
                            placeholder="Auth Token" onChange={(e) => { setToken(e.target.value) }} value={token} />
                    </div>
                    <div>
                        <input placeholder="Chatroom" onChange={(e) => { setChatroomId(e.target.value) }} value={chatroomId} />
                    </div>
                    <div>
                        <button onClick={() => apply()}>Apply</button>
                    </div>
                </div>
                <div style={{ marginTop: 10, padding: 12, borderRadius: 4, backgroundColor: '#EBEBEB' }}>
                    <h3 >Applied Data: </h3>
                    <p style={{ wordBreak: 'break-all' }}><b>Token: </b>{applyData.token}</p>
                    <p><b>Chatroom: </b>{applyData.chatroomId}</p>
                    <p><b>Page: </b>{page}</p>

                </div>
            </div>
            <div style={{ width: '50%', padding: 20 }}>
                <h2>Chatroom</h2>
                <div style={{ padding: 12, borderRadius: 4, marginTop: 12, border: 'solid 1px' }}>
                    {messageData?.length ?
                        <>
                            <div>
                                <button onClick={() => getOlderMessage()}>Load Older</button>
                            </div>
                            {messageData.map((item, index) => (
                                <div key={`message_${index}`}>
                                    <div>{`[${item.sender_id}]: `}{item.message_content}</div>
                                </div>
                            ))}
                        </> :
                        <div>
                            No Message
                        </div>
                    }

                    <div style={{ marginTop: 4 }}>
                        <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder='message ... ' />
                        <button onClick={() => onSubmit()}>Send</button></div>
                </div>
                <div>
                    <div>{JSON.stringify(handshake)}</div>
                    <button onClick={() => onHandShake()}>Handshake</button>
                </div>
            </div>
        </div>
    )
}