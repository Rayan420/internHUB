import React, { useEffect, useState } from "react";
const ComposeModal = ({ showModal, setShowModal }) => {
  const [recipientType, setRecipientType] = useState("");
  const [recipientOptions, setRecipientOptions] = useState([]);
  const [recipientValue, setRecipientValue] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleRecipientTypeChange = (e) => {
    setRecipientType(e.target.value);
  };

  const handleRecipientValueChange = (e) => {
    setRecipientValue(e.target.value);
  };

  const handleRecipientOptionSelect = (option) => {
    setRecipientValue(option.email);
  };

  const handleAttachmentChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setAttachments((prevFiles) => prevFiles.concat(newFiles));
  };

  const handleAttachmentDelete = (filename) => {
    setAttachments((prevFiles) =>
      prevFiles.filter((file) => file.name !== filename)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // code to send message
    setRecipientOptions("");
    setSubject("");
    setBody("");
    setShowModal(false); // close modal after sending message
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
                <label htmlFor="recipient-type">To:</label>
                <select
                  id="recipient-type"
                  value={recipientType}
                  onChange={handleRecipientTypeChange}
                >
                  <option value="">-- Select Recipient Type --</option>
                  <option value="admin">Admin</option>
                  <option value="coordinator">Coordinator</option>
                  <option value="student">Student</option>
                </select>
                {recipientType && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Recipient"
                    value={recipientValue}
                    onChange={handleRecipientValueChange}
                  />
                )}
                {recipientOptions.length > 0 && (
                  <div className="recipient-options">
                    {recipientOptions.map((option) => (
                      <div
                        key={option.email}
                        className="recipient-option"
                        onClick={() => handleRecipientOptionSelect(option)}
                      >
                        <FaUser /> {option.name} ({option.email})
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  className="form-input"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
                            {file.type.includes("image") && (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                              />
                            )}
                            {!file.type.includes("image") && (
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
    </>
  );
};

export default ComposeModal;
