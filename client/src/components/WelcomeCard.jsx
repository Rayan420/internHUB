import React from "react";
import PropTypes from "prop-types";
import "../style/style.css";

/**
 * A component that displays a welcome message to a recipient.
 * The message is split into chunks of 12 words for better readability.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.recipient - The name of the recipient.
 * @param {string} props.message - The welcome message to display.
 * @returns {JSX.Element} - The rendered component.
 */
const WelcomeCard = ({ recipient, message }) => {
  /**
   * Splits a message into chunks of 12 words for better readability.
   *
   * @function
   * @param {string} message - The message to split.
   * @returns {string[]} - An array of message chunks.
   */
  const breakMessage = (message) => {
    const words = message.split(" ");
    const chunks = [];
    let chunk = "";
    words.forEach((word, index) => {
      if ((index + 1) % 12 === 0) {
        chunks.push(chunk + " " + word);
        chunk = "";
      } else {
        chunk += " " + word;
      }
    });
    if (chunk !== "") {
      chunks.push(chunk);
    }
    return chunks;
  };

  return (
    <div className="welcome-card">
      <p className="welcome-text">
        Welcome back, <span className="message-recipient">{recipient}</span>
      </p>
      {breakMessage(message).map((chunk, index) => (
        <p className="welcome-message" key={index}>
          {chunk}
        </p>
      ))}
    </div>
  );
};

WelcomeCard.propTypes = {
  /**
   * The name of the recipient.
   */
  recipient: PropTypes.string.isRequired,
  /**
   * The welcome message to display.
   */
  message: PropTypes.string.isRequired,
};

export default WelcomeCard;
