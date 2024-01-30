import { useState } from "react"
export default function ChatParticipant({ userData }) {
    const [showUsers, setShowUsers] = useState(false)


    function TableRows({ item }) {
        const { firstName, lastName, avatar } = userData[item]

        return (
            <div
                style={{ display: 'grid', gridTemplateColumns: "repeat(4, 1fr)" }}>
                <span>{item}</span>
                <span>{firstName}</span>
                <span>{lastName}</span>
                <span>{avatar}</span>
            </div>
        )
    }



    return (
        <>
            {
                showUsers ?
                    <>
                        <div style={{ padding: 8, borderRadius: 4, border: "solid 2px #787878" }}>
                            <div
                                style={{ display: 'grid', gridTemplateColumns: "repeat(4, 1fr)", fontWeight: "bold" }}>
                                <span>ID</span>
                                <span>FNAME</span>
                                <span>LNAME</span>
                                <span>AVATAR</span>
                            </div>
                            {Object.keys(userData)?.map((item, index) => (
                                <TableRows item={item} key={`user-data-${index}`} />
                            ))}
                        </div>
                    </>
                    :
                    null
            }
            <button onClick={() => setShowUsers(!showUsers)}>
                {showUsers ? `Hide Chat Participant` : `Show Chat Participant`}
            </button>
        </>
    )
}