import React, { useState } from "react";
import axios from '../../services/axios';
import { useAuthHeader } from "react-auth-kit";
import { toast, ToastContainer } from "react-toastify";
const ComposeModal = ({ showModal, setShowModal, userId }) => {
  const authHeader = useAuthHeader();
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleAttachmentChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setAttachments((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleAttachmentDelete = (filename) => {
    setAttachments((prevFiles) =>
      prevFiles.filter((file) => file.name !== filename)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("senderId", userId);
    formData.append("recipientEmail", recipient);
    formData.append("subject", subject);
    formData.append("text", text);
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      const response = await axios.post(`/api/chats/send/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: authHeader(),
        },
      });

     
      if(response.status === 200)
      {
        toast.success("Message sent successfully");
         // Clear form inputs and close modal
          setRecipient("");
          setSubject("");
          setText("");
          setAttachments([]);
        return setShowModal(false);

      }
      else if(response.status === 202)
      {
        toast.error(response.data.error);
      }
      // Handle success response if needed
      console.log("Message sent:", response.data);
    } catch (error) {
      // Handle error response if needed
      console.error("Error sending message:", error);
    }
  };


  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Compose Message</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="recipient">To:</label>
                <input
                  type="text"
                  id="recipient"
                  className="form-input"
                  placeholder="Recipient Email"
                  value={recipient}
                  onChange={handleRecipientChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject:</label>
                <input
                  type="text"
                  id="subject"
                  className="form-input"
                  placeholder="Message Subject"
                  value={subject}
                  onChange={handleSubjectChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="text">Message:</label>
                <textarea
                  id="text"
                  className="form-input"
                  placeholder="Type your message here..."
                  value={text}
                  onChange={handleTextChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="attachments">Attachments:</label>
                <input
                  type="file"
                  id="attachments"
                  className="form-input"
                  multiple
                  onChange={handleAttachmentChange}
                />
                {attachments.length > 0 && (
                  <div className="attachments">
                    {attachments.map((file) => (
                      <div key={file.name} className="attachment">
                        <div className="attachment-info">
                          <div className="attachment-thumbnail">
                            {file.type.includes("image") ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                              />
                            ) : (
                              <div className="file-thumbnail"></div>
                            )}
                          </div>
                          <div className="attachment-name">{file.name}</div>
                        </div>
                        <button
                          className="attachment-delete"
                          onClick={() => handleAttachmentDelete(file.name)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <button type="submit" className="btn-compose btn-primary">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
                <ToastContainer />

    </>
  );
};

export default ComposeModal;
