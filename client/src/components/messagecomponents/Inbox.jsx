import { BiEnvelope } from "react-icons/bi";
import { useState } from "react";
import PropTypes from "prop-types";
import "../../style/style.css";

const Inbox = ({ messages, messageCount }) => {
  const [selectedMessageId, setSelectedMessageId] = useState(
    messages.length > 0 ? messages[0].id : null
  );

  const selectedMessage = messages.find(
    (message) => message.id === selectedMessageId
  );

  return (
    <div className="message-main-container">
      <div className="inbox-container">
        <div className="inbox-header">
          <div className="inbox-header-title">
            <BiEnvelope />
            <span>Inbox</span>
          </div>
          <div className="inbox-header-messages">
            <div className="inbox-header-message-count">
              {messages.length > 0 ? messageCount : 0}
            </div>
          </div>
        </div>
        <div className="inbox-body">
          <div className="inbox-list">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  className={`inbox-message ${
                    message.id === selectedMessageId ? "selected" : ""
                  } ${!message.read ? "unread" : ""}`}
                  key={message.id}
                  onClick={() => setSelectedMessageId(message.id)}
                >
                  <div className="inbox-message-sender-time">
                    <div className="inbox-message-sender">{message.sender}</div>
                    <div className="inbox-message-time">
                      {message.time}
                      {!message.read && <span className="unread-marker"></span>}
                    </div>
                  </div>
                  <div className="inbox-message-title">{message.title}</div>
                  <div className="inbox-message-content">{message.content}</div>
                  {message.attachments && (
                    <div className="inbox-message-attachments">
                      {message.attachments.map((attachment) => (
                        <a href={attachment.url} key={attachment.id}>
                          {attachment.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="inbox-empty">No messages in your inbox.</div>
            )}
          </div>
        </div>
      </div>
      <div className="message-container inbox-container">
        {selectedMessage ? (
          <div className="message">
            <div className="message-header">
              <div className="message-sender">{selectedMessage.sender}</div>
              <div className="message-date">{selectedMessage.time}</div>
            </div>
            <div className="message-body">
              <div className="message-title">{selectedMessage.title}</div>
              <div className="message-content">{selectedMessage.content}</div>
              {selectedMessage.attachments && (
                <div className="message-attachments">
                  {selectedMessage.attachments.map((attachment) => (
                    <div className="message-attachment" key={attachment.id}>
                      <a href={attachment.url}>{attachment.name}</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="message-footer">
              <button className="message-reply-button">Reply</button>
            </div>
          </div>
        ) : (
          <div className="message-empty">No message selected.</div>
        )}
      </div>
    </div>
  );
};

Inbox.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      sender: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      attachments: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ),
    })
  ),
  messageCount: PropTypes.number.isRequired,
};

Inbox.defaultProps = {
  messages: [],
  messageCount: 0,
};
export default Inbox;
