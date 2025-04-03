import React, { useEffect, useState } from "react";
import { getNotificationsForUser } from "../Notification/Notification";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotificationsForUser(userId);
        setNotifications(data);
      } catch (error) {
        console.error("Greška pri dohvaćanju notifikacija:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  return (
    <div className="container my-4">
      <h2>Notifikacije</h2>
      {loading ? (
        <p>Učitavanje...</p>
      ) : notifications.length === 0 ? (
        <p>Nemate notifikacija.</p>
      ) : (
        <ul className="list-group">
          {notifications.map((n) => (
            <li key={n.id} className="list-group-item">
              <span>{n.message}</span>
              <br />
              <small className="text-muted">
                {new Date(n.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
