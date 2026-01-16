import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import axios from "axios";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "/api/v1/notifications?limit=10"
      );
      if (data?.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Notification fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  return (
    <div style={{ position: "relative" }}>
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <FaBell size={20} />
        {notifications.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "red",
              color: "white",
              fontSize: 10,
              borderRadius: "50%",
              padding: "2px 6px",
            }}
          >
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 30,
            width: 320,
            maxHeight: 400,
            overflowY: "auto",
            background: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            borderRadius: 8,
            zIndex: 1000,
          }}
        >
          <div style={{ padding: 12, fontWeight: "bold" }}>
            Notifications
          </div>

          {loading && (
            <div style={{ padding: 12 }}>Loading...</div>
          )}

          {!loading && notifications.length === 0 && (
            <div style={{ padding: 12, color: "#777" }}>
              No notifications
            </div>
          )}

          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => window.location.href = n.link}
              style={{
                padding: 12,
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 600 }}>{n.title}</div>
              <div style={{ fontSize: 13, color: "#555" }}>
                {n.body}
              </div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
