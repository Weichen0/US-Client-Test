import { useRef, useState } from "react"

const defaultFields = {
    signUpData: {
        user_email: 'sample@email.com',
        hash_key: 'samplepassword',
        first_name: 'Sample',
        last_name: 'User',
        user_phone: '0123456789'
    },
    newCoach: {
        user_id: 3,
        gym_name: 'Sample Gym',
        gym_discipline: {}
    },


}
export default function UserAvatar() {
    const [attachments, setAttachments] = useState(null)
    const [response, setResponse] = useState(null)
    const fileInput = useRef(null)

    async function createUserProfile() {
        const formData = new FormData();
        const jsonFields = {
            ...defaultFields.signUpData,
        };
        Object.keys(jsonFields).forEach((key) => {
            formData.append(key, jsonFields[key]);
        });
        formData.append('user_avatar', attachments, attachments.name);
        const response = await fetch(`http://localhost:8080/auth/signUp`, {
            method: 'POST',
            body: formData,
        })
            .catch((err) => {
                return err;
            })
            .then((res) => {
                return res;
            });
        if (response) {
            setResponse(response);
        }
    }

    async function updateNewAvatar() {
        const formData = new FormData()
        formData.append('user_avatar', attachments, attachments.name)
        const response = await fetch(`http://localhost:8080/auth/userProfile/1`,
            {
                method: 'PUT',
                body: formData
            }).catch((err) => {
                return err
            }).then((res) => {
                return res
            })
        if (response) {
            setResponse(response);
        }
    }
    async function createCoachProfile() {
        const formData = new FormData()
        const jsonFields = {
            ...defaultFields.newCoach,
        };
        Object.keys(jsonFields).forEach((key) => {
            formData.append(key, jsonFields[key]);
        });
        formData.append('gym_logo', attachments, attachments.name)
        const response = await fetch(`http://localhost:8080/coach`,
            {
                method: 'POST',
                body: formData
            }).catch((err) => {
                return err
            }).then((res) => {
                return res
            })
        if (response) {
            setResponse(response);
        }
    }
    async function updateGymLogo() {
        const formData = new FormData()
        formData.append('gym_logo', attachments, attachments.name)
        const response = await fetch(`http://localhost:8080/coach/1`,
            {
                method: 'PUT',
                body: formData
            }).catch((err) => {
                return err
            }).then((res) => {
                return res
            })
        if (response) {
            setResponse(response);
        }
    }

    const handleFileChange = (e) => {
        const files = e.target.files[0];
        setAttachments(files);
        fileInput.current.value = null
    };
    return (
        <div style={{ padding: 8, margin: 8, borderRadius: 8, border: '2px solid #D6D6D6' }}>
            <h2>Change profile images</h2>
            {response &&
                <div>{JSON.stringify(response)}</div>
            }
            <div>Attachments: {attachments?.name}</div>
            <input type="file" onChange={handleFileChange} ref={fileInput} />
            <div style={{ display: "grid", marginTop: 12, gap: 2, maxWidth: 400 }}>
                <b>User Profile</b>
                <button onClick={() => createUserProfile()}>Create New User Profile</button>
                <button onClick={() => { updateNewAvatar() }}>Update New Avatar</button>
            </div>
            <div style={{ display: "grid", marginTop: 12, gap: 2, maxWidth: 400 }}>
                <b>Gym Logo</b>
                <button onClick={() => { createCoachProfile() }}>Create New Coach Profile</button>
                <button onClick={() => updateGymLogo()}>Update Gym Logo</button>
            </div>

        </div>
    )
}