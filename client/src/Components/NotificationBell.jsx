// import { useEffect, useState } from "react";
// import { FaBell } from "react-icons/fa";
// import axios from "axios";

// const NotificationBell = () => {
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(
//         "/api/v1/notifications?limit=10"
//       );
//       if (data?.success) {
//         setNotifications(data.notifications);
//       }
//     } catch (err) {
//       console.error("Notification fetch error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (open) fetchNotifications();
//   }, [open]);

//   return (
//     <div style={{ position: "relative" }}>
//       {/* Bell Icon */}
//       <button
//         onClick={() => setOpen(!open)}
//         style={{
//           background: "transparent",
//           border: "none",
//           cursor: "pointer",
//           position: "relative",
//         }}
//       >
//         <FaBell size={20} />
//         {notifications.length > 0 && (
//           <span
//             style={{
//               position: "absolute",
//               top: -4,
//               right: -4,
//               background: "red",
//               color: "white",
//               fontSize: 10,
//               borderRadius: "50%",
//               padding: "2px 6px",
//             }}
//           >
//             {notifications.length}
//           </span>
//         )}
//       </button>

//       {/* Dropdown */}
//       {open && (
//         <div
//           style={{
//             position: "absolute",
//             right: 0,
//             top: 30,
//             width: 320,
//             maxHeight: 400,
//             overflowY: "auto",
//             background: "#fff",
//             boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
//             borderRadius: 8,
//             zIndex: 1000,
//           }}
//         >
//           <div style={{ padding: 12, fontWeight: "bold" }}>
//             Notifications
//           </div>

//           {loading && (
//             <div style={{ padding: 12 }}>Loading...</div>
//           )}

//           {!loading && notifications.length === 0 && (
//             <div style={{ padding: 12, color: "#777" }}>
//               No notifications
//             </div>
//           )}

//           {notifications.map((n) => (
//             <div
//               key={n._id}
//               onClick={() => window.location.href = n.link}
//               style={{
//                 padding: 12,
//                 borderBottom: "1px solid #eee",
//                 cursor: "pointer",
//               }}
//             >
//               <div style={{ fontWeight: 600 }}>{n.title}</div>
//               <div style={{ fontSize: 13, color: "#555" }}>
//                 {n.body}
//               </div>
//               <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
//                 {new Date(n.createdAt).toLocaleString()}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;



// import { useEffect, useState } from "react";
// import { FaBell } from "react-icons/fa";
// import API from "../../utils/api";
// import { socket } from "../../utils/socket";

// const NotificationBell = () => {
//   const [notifications, setNotifications] = useState([]);
//   const unreadCount = notifications.filter(n => !n.isSeen).length;

//   // Fetch notifications
//   useEffect(() => {
//     API.get("/notifications").then(res => {
//       setNotifications(res.data);
//     });
//   }, []);

//   // Live notification
//   useEffect(() => {
//     socket.on("new-notification", (notif) => {
//       setNotifications(prev => [notif, ...prev]);
//     });

//     return () => socket.off("new-notification");
//   }, []);

//   // Mark seen when bell clicked
//   const handleOpen = async () => {
//     await API.put("/notifications/seen");
//     setNotifications(prev =>
//       prev.map(n => ({ ...n, isSeen: true }))
//     );
//   };

//   return (
//     <div className="position-relative">
//       <FaBell size={20} onClick={handleOpen} />

//       {unreadCount > 0 && (
//         <span className="badge bg-danger position-absolute top-0 start-100">
//           {unreadCount}
//         </span>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;



import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import API from "../../utils/api";
import { socket } from "../../utils/socket";


const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter(n => !n.isSeen).length;

  const fetchNotifications = async () => {
    const { data } = await API.get("/notifications/");
    if (data.success) setNotifications(data.notifications);
  };

  useEffect(() => {
    const auth = localStorage.getItem("auth");
  if (auth) fetchNotifications();
  }, []);

  // 🔴 Live socket notification
  useEffect(() => {
    socket.on("new-notification", (notif) => {
      setNotifications(prev => [notif, ...prev]);
    });

    return () => socket.off("new-notification");
  }, []);

  const handleOpen = async () => {
    setOpen(!open);
    if (!open) {
      await API.patch("/notifications/seen-all");
      setNotifications(prev =>
        prev.map(n => ({ ...n, isSeen: true }))
      );
    }
  };

  const handleClick = async (n) => {
    await API.patch(`/notifications/read/${n._id}`);
    window.location.href = `/article/${n.post}`;
  };

  return (
    <div className="position-relative">
      <button onClick={handleOpen} className="btn bg-transparent border-0">
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-100">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="dropdown-menu show p-2 shadow" style={{ width: 320 }}>
          <strong>Notifications</strong>

          {notifications.length === 0 && (
            <div className="text-muted mt-2">No notifications</div>
          )}

          {notifications.map(n => (
            <div
              key={n._id}
              onClick={() => handleClick(n)}
              className={`p-2 mt-2 rounded ${!n.isRead ? "bg-light" : ""}`}
              style={{ cursor: "pointer" }}
            >
              <div>{n.message}</div>
              <small className="text-muted">
                {new Date(n.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
