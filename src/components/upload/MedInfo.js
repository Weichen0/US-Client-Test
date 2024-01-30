import { useState, useRef } from "react"

const dataField = {
    newMedInfo: {
        fighter_id: '',
        med_info: ''
    }
}
export default function MedInfo() {
    const [attachments, setAttachments] = useState([])
    const [res, setRes] = useState(null)

    const postMedInfo = async () => {
        setRes(null);
        for (let i = 0; i < attachments.length; i++) {
            const formData = new FormData();
            formData.append(`medical_info`, attachments[i]);
            formData.append('fighter_id', 1)
            console.log(formData)

            try {
                const response = await fetch('http://localhost:8080/fighter/medicalInfo', {

                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    console.log('Multiple medical_info files uploaded successfully');
                } else {
                    console.error('Failed to upload multiple medical_info files', response);
                }
            } catch (error) {
                console.error('Error uploading multiple medical_info files:', error);
            }
        }

    };


    const handleFileChange = (e) => {
        const files = e.target.files;
        setAttachments((prevAttachment) => [...prevAttachment, ...files]);
    };

    const removeFile = (fileIndex) => {
        setAttachments((prevAttachments) =>
            prevAttachments.filter((_, index) => index !== fileIndex)
        );
    };
    return (
        <div style={{ padding: 8, margin: 8, borderRadius: 8, border: '2px solid #D6D6D6' }}>
            <h2>Upload medical docs</h2>
            {res && <div>{JSON.stringify(res)}</div>}
            <div>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf, .docx, .jpg, .jpeg, .png, .webp"
                />
                <div style={{ marginTop: 8 }}>
                    <b>Selected Files:</b>
                    <ul>
                        {attachments.map((file, index) => (
                            <li key={index}>
                                {file.name}{' '}
                                <button onClick={() => removeFile(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div>
                <button onClick={() => postMedInfo()}>Upload</button>
            </div>
        </div>
    )
}