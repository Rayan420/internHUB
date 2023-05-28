import React, { useState } from "react";
import axios from "../services/axios";
import { useAuthHeader } from "react-auth-kit";
import CircularProgress from "@mui/material/CircularProgress";

const NotificationModal = ({ notifications, onClose, userId,onNotificationRead  }) => {
  const authHeader = useAuthHeader();
  const [loadingNotificationIds, setLoadingNotificationIds] = useState([]);
  console.log(authHeader());

  const markAsRead = async (notificationId) => {
    try {
      setLoadingNotificationIds((prevLoadingIds) => [...prevLoadingIds, notificationId]);
      // Perform the axios PUT request to mark the notification as read
      await axios.put(`/notification/${userId}/${notificationId}`, null, {
        headers: {
          authorization: authHeader(),
        },
      });

      // Call the callback function to update notifications in the parent component
      await new Promise((resolve) => setTimeout(resolve, 500));
      onNotificationRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setLoadingNotificationIds((prevLoadingIds) =>
        prevLoadingIds.filter((id) => id !== notificationId)
      );
    }
    
  };

  if (notifications.length === 0) {
    return (
      <>
        <div className="overlay" onClick={onClose}></div>
        <div className="notification-modal">
          <div className="notification-modal-header">
            <h3>Notifications</h3>
          </div>
          <div className="notification-modal-body">
            <p>No notifications found.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="notification-modal">
        <div className="notification-modal-header">
          <h3>Notifications</h3>
        </div>
        <div className="notification-modal-body">
          {notifications.map((notification) => {
            const createdAt = new Date(notification.createdAt);
            const isMarkingAsRead = loadingNotificationIds.includes(notification.id);

            return (
              <div
                key={notification.id}
                className={`notification-card ${notification.read ? "read" : ""}`}
              >
                <div className="notification-info">
                  <span className="notification-date">
                    {createdAt.toDateString()}
                  </span>
                  <span className="notification-message">
                    {notification.message}
                  </span>
                </div>
                {!notification.read && (
                  <div className="mark-as-read-container">
                    {isMarkingAsRead ? (
                      <div className="loading-container">
                        <CircularProgress size={24} color="secondary" />
                      </div>
                    ) : (
                      <button
                        className="mark-as-read-btn"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                    {!isMarkingAsRead && notification.read && (
                      <div className="checkmark">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path
                            className="checkmark-path"
                            d="M20.293,5.293l-9,9c-0.391,0.391-1.023,0.391-1.414,0l-4.5-4.5c-0.391-0.391-0.391-1.023,0-1.414   s1.023-0.391,1.414,0L11,11.586l8.793-8.793c0.391-0.391,1.023-0.391,1.414,0S20.683,4.902,20.293,5.293z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NotificationModal;
