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



// import { useEffect, useState } from "react";
// import { FaBell } from "react-icons/fa";
// import API from "../../utils/api";
// import { socket } from "../../utils/socket";


// const NotificationBell = () => {
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);

//   const unreadCount = notifications.filter(n => !n.isSeen).length;

//   const fetchNotifications = async () => {
//     const { data } = await API.get("/notifications/");
//     if (data.success) setNotifications(data.notifications);
//   };

//   useEffect(() => {
//     const auth = localStorage.getItem("auth");
//   if (auth) fetchNotifications();
//   }, []);

//   // 🔴 Live socket notification
//   useEffect(() => {
//     socket.on("new-notification", (notif) => {
//       setNotifications(prev => [notif, ...prev]);
//     });

//     return () => socket.off("new-notification");
//   }, []);

//   const handleOpen = async () => {
//     setOpen(!open);
//     if (!open) {
//       await API.patch("/notifications/seen-all");
//       setNotifications(prev =>
//         prev.map(n => ({ ...n, isSeen: true }))
//       );
//     }
//   };

//   const handleClick = async (n) => {
//     await API.patch(`/notifications/read/${n._id}`);
//     window.location.href = `/article/${n.post}`;
//   };

//   return (
//     <div className="position-relative">
//       <button onClick={handleOpen} className="btn bg-transparent border-0">
//         <FaBell size={20} />
//         {unreadCount > 0 && (
//           <span className="badge bg-danger position-absolute top-0 start-100">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="dropdown-menu show p-2 shadow" style={{ width: 320 }}>
//           <strong>Notifications</strong>

//           {notifications.length === 0 && (
//             <div className="text-muted mt-2">No notifications</div>
//           )}

//           {notifications.map(n => (
//             <div
//               key={n._id}
//               onClick={() => handleClick(n)}
//               className={`p-2 mt-2 rounded ${!n.isRead ? "bg-light" : ""}`}
//               style={{ cursor: "pointer" }}
//             >
//               <div>{n.message}</div>
//               <small className="text-muted">
//                 {new Date(n.createdAt).toLocaleString()}
//               </small>
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
// import { useAuth } from "../context/auth";

// const NotificationBell = () => {
//   const [auth] = useAuth();

//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [loaded, setLoaded] = useState(false);

//   // ✅ Correct unread count
//   const unreadCount = notifications.filter(n => !n.isRead).length;

//   /* ================= FETCH ================= */
// const fetchNotifications = async () => {
//   try {
//     const authData = JSON.parse(localStorage.getItem("auth"));

//     if (!authData?.token) return;

//     const { data } = await API.get("/notifications", {
//       headers: {
//         Authorization: `Bearer ${authData.token}`,
//       },
//     });

//     if (data?.success) {
//       setNotifications(data.notifications);
//       setLoaded(true);
//     }
//   } catch (err) {
//     console.error(
//       "Notification fetch error:",
//       err?.response?.data || err
//     );
//   }
// };


//   // 🔐 Fetch ONLY when auth is ready
//   useEffect(() => {
//     if (auth?.token && !loaded) {
//       fetchNotifications();
//     }
//   }, [auth?.token]);

//   /* ================= SOCKET ================= */
//   useEffect(() => {
//     if (!auth?.user?._id) return;

//     // join user room
//     socket.emit("join-user", auth.user._id);

//     socket.on("new-notification", notif => {
//       setNotifications(prev => [notif, ...prev]);
//     });

//     return () => {
//       socket.off("new-notification");
//     };
//   }, [auth?.user?._id]);

//   /* ================= UI ACTIONS ================= */
//   const handleOpen = async () => {
//     setOpen(prev => !prev);

//     // mark all seen when opening
//     if (!open && unreadCount > 0) {
//       try {
//         await API.patch("/notifications/seen-all");
//         setNotifications(prev =>
//           prev.map(n => ({ ...n, isRead: true }))
//         );
//       } catch (err) {
//         console.error("Seen-all failed:", err);
//       }
//     }
//   };

//   const handleClick = async (n) => {
//     try {
//       if (!n.isRead) {
//         await API.patch(`/notifications/read/${n._id}`);
//       }

//       // redirect safely
//       if (n.post?._id) {
//         window.location.href = `/post/${n.post._id}`;
//       }
//     } catch (err) {
//       console.error("Read notification failed:", err);
//     }
//   };

//   /* ================= RENDER ================= */
//   if (!auth?.token) return null;

//   return (
//     <div className="position-relative">
//       {/* <button
//         onClick={handleOpen}
//         className="btn bg-transparent border-0 position-relative"
//       >
//         <FaBell size={20} className="tk-icon" />
//         <div style={{ color: "red" }}>🔔</div>

//         {unreadCount > 0 && (
//           <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
//             {unreadCount}
//           </span>
//         )}
//       </button> */}

//       <div
//   onClick={handleOpen}
//   className="position-relative"
//   style={{ cursor: "pointer" }}
// >
//   <FaBell size={20} className="tk-icon" />

// <div style={{ color: "red" }}>🔔</div>
//   {unreadCount > 0 && (
//     <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
//       {unreadCount}
//     </span>
//   )}
// </div>

//       {open && (
//         <div
//           className="dropdown-menu show shadow p-2"
//           style={{ width: 320, right: 0, maxHeight: 400, overflowY: "auto" }}
//         >
//           <strong className="px-2 d-block mb-2">Notifications</strong>

//           {notifications.length === 0 && (
//             <div className="text-muted px-2">No notifications</div>
//           )}

//           {notifications.map(n => (
//             <div
//               key={n._id}
//               onClick={() => handleClick(n)}
//               className={`p-2 rounded mb-1 ${
//                 !n.isRead ? "bg-light" : ""
//               }`}
//               style={{ cursor: "pointer" }}
//             >
//               <div className="fw-medium">{n.message}</div>
//               <small className="text-muted">
//                 {new Date(n.createdAt).toLocaleString()}
//               </small>
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
// import { useAuth } from "../context/auth";

// const NotificationBell = () => {
//   const [auth] = useAuth();
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [loaded, setLoaded] = useState(false);

//   // ✅ Correct unread count
//   const unreadCount = notifications.filter(n => !n.isRead).length;

//   /* ================= FETCH ================= */
//   const fetchNotifications = async () => {
//     try {
//       // FIXED: Get token from auth context instead of localStorage
//       if (!auth?.token) return;

//       const { data } = await API.get("/notifications", {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//         },
//       });

//       if (data?.success) {
//         setNotifications(data.notifications);
//         setLoaded(true);
//       }
//     } catch (err) {
//       console.error(
//         "Notification fetch error:",
//         err?.response?.data || err
//       );
//     }
//   };

//   // 🔐 Fetch ONLY when auth is ready
//   useEffect(() => {
//     if (auth?.token && !loaded) {
//       fetchNotifications();
//     }
//   }, [auth?.token, loaded]);

//   /* ================= SOCKET ================= */
//   useEffect(() => {
//     if (!auth?.user?._id) return;

//     // join user room
//     socket.emit("join-user", auth.user._id);

//     const handleNewNotification = (notif) => {
//       setNotifications(prev => [notif, ...prev]);
//     };

//     socket.on("new-notification", handleNewNotification);

//     return () => {
//       socket.off("new-notification", handleNewNotification);
//     };
//   }, [auth?.user?._id]);

//   /* ================= UI ACTIONS ================= */
//   const handleOpen = async () => {
//     setOpen(prev => !prev);

//     // mark all seen when opening
//     if (!open && unreadCount > 0) {
//       try {
//         await API.patch("/notifications/seen-all", {}, {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         });
//         setNotifications(prev =>
//           prev.map(n => ({ ...n, isRead: true }))
//         );
//       } catch (err) {
//         console.error("Seen-all failed:", err);
//       }
//     }
//   };

//   const handleClick = async (n) => {
//     try {
//       if (!n.isRead) {
//         await API.patch(`/notifications/read/${n._id}`, {}, {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         });
//       }

//       // redirect safely
//       if (n.post?._id) {
//         window.location.href = `/post/${n.post._id}`;
//       }
//     } catch (err) {
//       console.error("Read notification failed:", err);
//     }
//   };

//   /* ================= RENDER ================= */
//   // FIXED: Always render the component, just hide if not authenticated
//   // But if no auth, we can still show a disabled version or null
//   if (!auth?.token) {
//     return null;
//   }

//   return (
//     <div className="position-relative">
//       <div
//         onClick={handleOpen}
//         className="position-relative"
//         style={{ cursor: "pointer" }}
//       >
//         <FaBell size={20} className="tk-icon" />

//         {unreadCount > 0 && (
//           <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
//             {unreadCount}
//           </span>
//         )}
//       </div>

//       {open && (
//         <div
//           className="dropdown-menu show shadow p-2"
//           style={{ 
//             width: 320, 
//             right: 0, 
//             maxHeight: 400, 
//             overflowY: "auto",
//             position: "absolute",
//             zIndex: 1000
//           }}
//         >
//           <strong className="px-2 d-block mb-2">Notifications</strong>

//           {notifications.length === 0 && (
//             <div className="text-muted px-2">No notifications</div>
//           )}

//           {notifications.map(n => (
//             <div
//               key={n._id}
//               onClick={() => handleClick(n)}
//               className={`p-2 rounded mb-1 ${!n.isRead ? "bg-light" : ""}`}
//               style={{ cursor: "pointer" }}
//             >
//               <div className="fw-medium">{n.message}</div>
//               <small className="text-muted">
//                 {new Date(n.createdAt).toLocaleString()}
//               </small>
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
// import { useAuth } from "../context/auth";

// const NotificationBell = () => {
//   const [auth] = useAuth();
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [loaded, setLoaded] = useState(false);

//   // ✅ Correct unread count
//   const unreadCount = notifications.filter(n => !n.isRead).length;

//   /* ================= FETCH ================= */
//   const fetchNotifications = async () => {
//     try {
//       if (!auth?.token) return;

//       const { data } = await API.get("/notifications", {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//         },
//       });

//       if (data?.success) {
//         setNotifications(data.notifications);
//         setLoaded(true);
//       }
//     } catch (err) {
//       console.error(
//         "Notification fetch error:",
//         err?.response?.data || err
//       );
//     }
//   };

//   // 🔐 Fetch ONLY when auth is ready
//   useEffect(() => {
//     if (auth?.token && !loaded) {
//       fetchNotifications();
//     }
//   }, [auth?.token, loaded]);

//   /* ================= SOCKET ================= */
//   useEffect(() => {
//     if (!auth?.user?._id) return;

//     // join user room
//     socket.emit("join-user", auth.user._id);

//     const handleNewNotification = (notif) => {
//       setNotifications(prev => [notif, ...prev]);
//     };

//     socket.on("new-notification", handleNewNotification);

//     return () => {
//       socket.off("new-notification", handleNewNotification);
//     };
//   }, [auth?.user?._id]);

//   /* ================= UI ACTIONS ================= */
//   const handleOpen = async () => {
//     setOpen(prev => !prev);

//     // mark all seen when opening
//     if (!open && unreadCount > 0) {
//       try {
//         await API.patch("/notifications/seen-all", {}, {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         });
//         setNotifications(prev =>
//           prev.map(n => ({ ...n, isRead: true }))
//         );
//       } catch (err) {
//         console.error("Seen-all failed:", err);
//       }
//     }
//   };

//   const handleClick = async (n) => {
//     try {
//       if (!n.isRead) {
//         await API.patch(`/notifications/read/${n._id}`, {}, {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         });
//       }

//       // redirect safely
//       if (n.post?._id) {
//         window.location.href = `/post/${n.post._id}`;
//       }
//     } catch (err) {
//       console.error("Read notification failed:", err);
//     }
//   };

//   /* ================= RENDER ================= */
//   // FIXED: Show a placeholder or return early if no auth
//   if (!auth?.token) {
//     return (
//       <div className="position-relative">
//         <FaBell size={20} className="tk-icon" style={{ opacity: 0.5 }} />
//       </div>
//     );
//   }

//   return (
//     <div className="position-relative notification-bell-wrapper">
//       <div
//         onClick={handleOpen}
//         className="notification-icon-wrapper"
//         style={{ cursor: "pointer", display: "inline-block" }}
//       >
//         <FaBell size={20} className="tk-icon" />
//         {unreadCount > 0 && (
//           <span className="notification-badge">
//             {unreadCount}
//           </span>
//         )}
//       </div>

//       {open && (
//         <div
//           className="notification-dropdown"
//         >
//           <div className="notification-header">
//             <strong>Notifications</strong>
//           </div>

//           {notifications.length === 0 && (
//             <div className="notification-empty">
//               No notifications
//             </div>
//           )}

//           {notifications.map(n => (
//             <div
//               key={n._id}
//               onClick={() => handleClick(n)}
//               className={`notification-item ${!n.isRead ? "unread" : ""}`}
//             >
//               <div className="notification-message">{n.message}</div>
//               <small className="notification-time">
//                 {new Date(n.createdAt).toLocaleString()}
//               </small>
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
// import { useAuth } from "../context/auth";

// const NotificationBell = () => {
//   const [auth] = useAuth();
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [loaded, setLoaded] = useState(false);

//   // ✅ Correct unread count
//   const unreadCount = notifications.filter(n => !n.isRead).length;

//   /* ================= FETCH ================= */
//   const fetchNotifications = async () => {
//     try {
//       if (!auth?.token) return;

//       const { data } = await API.get("/notifications/", {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//         },
//       });

//       if (data?.success) {
//         setNotifications(data.notifications);
//         setLoaded(true);
//       }
//     } catch (err) {
//       console.error(
//         "Notification fetch error:",
//         err?.response?.data || err
//       );
//     }
//   };

//   // 🔐 Fetch ONLY when auth is ready
//   useEffect(() => {
//     if (auth?.token && !loaded) {
//       fetchNotifications();
//     }
//   }, [auth?.token, loaded]);

//   /* ================= SOCKET ================= */
//   useEffect(() => {
//     if (!auth?.user?._id) return;

//     // join user room
//     socket.emit("join-user", auth.user._id);

//     const handleNewNotification = (notif) => {
//       setNotifications(prev => [notif, ...prev]);
//     };

//     socket.on("new-notification", handleNewNotification);

//     return () => {
//       socket.off("new-notification", handleNewNotification);
//     };
//   }, [auth?.user?._id]);

//   /* ================= UI ACTIONS ================= */
//   const handleOpen = async () => {
//     setOpen(prev => !prev);

//     // mark all seen when opening
//     if (!open && unreadCount > 0) {
//       try {
//         await API.patch("/notifications/seen-all", {}, {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         });
//         setNotifications(prev =>
//           prev.map(n => ({ ...n, isRead: true }))
//         );
//       } catch (err) {
//         console.error("Seen-all failed:", err);
//       }
//     }
//   };

//   const handleClick = async (n) => {
//     try {
//       if (!n.isRead) {
//         await API.patch(`/notifications/read/${n._id}`, {}, {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         });
//       }

//       // redirect safely
//       if (n.post?._id) {
//         window.location.href = `/post/${n.post._id}`;
//       }
//     } catch (err) {
//       console.error("Read notification failed:", err);
//     }
//   };

//   /* ================= RENDER ================= */
//   if (!auth?.token) {
//     return (
//       <div className="position-relative">
//         <FaBell size={20} className="tk-icon" style={{ opacity: 0.5 }} />
//       </div>
//     );
//   }

//   return (
//     <div className="notification-container">
//       <div className="notification-trigger" onClick={handleOpen}>
//         <FaBell size={20} className="tk-icon" />
//         {unreadCount > 0 && (
//           <span className="notification-count">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}
//       </div>

//       {open && (
//         <>
//           {/* Backdrop for closing dropdown when clicking outside */}
//           <div 
//             className="notification-backdrop" 
//             onClick={() => setOpen(false)}
//           />
          
//           <div className="notification-dropdown">
//             <div className="notification-header">
//               <strong>Notifications</strong>
//               {notifications.length > 0 && (
//                 <button 
//                   onClick={() => setOpen(false)}
//                   className="close-btn"
//                 >
//                   ×
//                 </button>
//               )}
//             </div>

//             <div className="notification-list">
//               {notifications.length === 0 && (
//                 <div className="notification-empty">
//                   <FaBell size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
//                   <p>No notifications yet</p>
//                 </div>
//               )}

//               {notifications.map(n => (
//                 <div
//                   key={n._id}
//                   onClick={() => handleClick(n)}
//                   className={`notification-item ${!n.isRead ? "unread" : ""}`}
//                 >
//                   <div className="notification-content">
//                     <div className="notification-message">{n.message}</div>
//                     <div className="notification-time">
//                       {formatTimeAgo(n.createdAt)}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // Helper function to format time ago
// const formatTimeAgo = (dateString) => {
//   const date = new Date(dateString);
//   const now = new Date();
//   const seconds = Math.floor((now - date) / 1000);
  
//   if (seconds < 60) return 'just now';
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes}m ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours}h ago`;
//   const days = Math.floor(hours / 24);
//   if (days < 7) return `${days}d ago`;
//   return date.toLocaleDateString();
// };

// export default NotificationBell;


// import { useEffect, useState } from "react";
// import { FaBell } from "react-icons/fa";
// import API from "../../utils/api";
// import { socket } from "../../utils/socket";
// import { useAuth } from "../context/auth";

// const NotificationBell = () => {
//   const [auth] = useAuth();
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [loaded, setLoaded] = useState(false);

//   // ✅ Correct unread count
//   const unreadCount = notifications.filter(n => !n.isRead).length;

//   /* ================= FETCH ================= */
//   const fetchNotifications = async () => {
//     try {
//       if (!auth?.token) {
//         console.log("No auth token found");
//         return;
//       }

//       console.log("Fetching notifications with token:", auth.token);
      
//       // FIXED: Use the correct API path with v1
//       const { data } = await API.get("/notification", {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//         },
//       });

//       console.log("Notifications response:", data);

//       if (data?.success) {
//         setNotifications(data.notifications || []);
//         setLoaded(true);
//       } else {
//         console.log("No success in response:", data);
//         setNotifications([]);
//       }
//     } catch (err) {
//       console.error(
//         "Notification fetch error:",
//         err?.response?.data || err.message
//       );
//       setNotifications([]);
//     }
//   };

//   // 🔐 Fetch ONLY when auth is ready
//   useEffect(() => {
//     if (auth?.token && !loaded) {
//       fetchNotifications();
//     }
//   }, [auth?.token, loaded]);

//   /* ================= SOCKET ================= */
//   useEffect(() => {
//     if (!auth?.user?._id) return;

//     // join user room
//     socket.emit("join-user", auth.user._id);

//     const handleNewNotification = (notif) => {
//       console.log("New notification received:", notif);
//       setNotifications(prev => [notif, ...prev]);
//     };

//     socket.on("new-notification", handleNewNotification);

//     return () => {
//       socket.off("new-notification", handleNewNotification);
//     };
//   }, [auth?.user?._id]);

//   /* ================= UI ACTIONS ================= */
//   const handleOpen = async () => {
//     console.log("Opening dropdown, current open state:", open);
//     setOpen(prev => !prev);

//     // mark all seen when opening
//     if (!open && unreadCount > 0) {
//       try {
//         // FIXED: Use correct API path
//         await API.patch("/notification/seen-all", {}, {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         });
//         setNotifications(prev =>
//           prev.map(n => ({ ...n, isRead: true }))
//         );
//         console.log("Marked all as seen");
//       } catch (err) {
//         console.error("Seen-all failed:", err);
//       }
//     }
//   };

//   const handleClick = async (n) => {
//     try {
//       if (!n.isRead) {
//         // FIXED: Use correct API path
//         await API.patch(`/notification/read/${n._id}`, {}, {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         });
//         console.log("Marked notification as read:", n._id);
//       }

//       // redirect safely
//       if (n.post?._id) {
//         window.location.href = `/post/${n.post._id}`;
//       }
//     } catch (err) {
//       console.error("Read notification failed:", err);
//     }
//   };

//   /* ================= RENDER ================= */
//   if (!auth?.token) {
//     return (
//       <div className="position-relative">
//         <FaBell size={20} className="tk-icon" style={{ opacity: 0.5 }} />
//       </div>
//     );
//   }

//   return (
//     <div className="notification-container">
//       <div className="notification-trigger" onClick={handleOpen}>
//         <FaBell size={20} className="tk-icon" />
//         {unreadCount > 0 && (
//           <span className="notification-count">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}
//       </div>

//       {open && (
//         <>
//           {/* Backdrop for closing dropdown when clicking outside */}
//           <div 
//             className="notification-backdrop" 
//             onClick={() => setOpen(false)}
//           />
          
//           <div className="notification-dropdown">
//             <div className="notification-header">
//               <strong>Notifications</strong>
//               {notifications.length > 0 && (
//                 <button 
//                   onClick={() => setOpen(false)}
//                   className="close-btn"
//                 >
//                   ×
//                 </button>
//               )}
//             </div>

//             <div className="notification-list">
//               {notifications.length === 0 && (
//                 <div className="notification-empty">
//                   <FaBell size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
//                   <p>No notifications yet</p>
//                 </div>
//               )}

//               {notifications.map(n => (
//                 <div
//                   key={n._id}
//                   onClick={() => handleClick(n)}
//                   className={`notification-item ${!n.isRead ? "unread" : ""}`}
//                 >
//                   <div className="notification-content">
//                     <div className="notification-message">{n.message}</div>
//                     <div className="notification-time">
//                       {formatTimeAgo(n.createdAt)}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // Helper function to format time ago
// const formatTimeAgo = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   const now = new Date();
//   const seconds = Math.floor((now - date) / 1000);
  
//   if (seconds < 60) return 'just now';
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes}m ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours}h ago`;
//   const days = Math.floor(hours / 24);
//   if (days < 7) return `${days}d ago`;
//   return date.toLocaleDateString();
// };

// export default NotificationBell;



// import { useEffect, useState } from "react";
// import { FaBell } from "react-icons/fa";
// import API from "../../utils/api";
// import { socket } from "../../utils/socket";
// import { useAuth } from "../context/auth";

// // Helper function to format time ago
// const formatTimeAgo = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   const now = new Date();
//   const seconds = Math.floor((now - date) / 1000);
  
//   if (seconds < 60) return 'just now';
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes}m ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours}h ago`;
//   const days = Math.floor(hours / 24);
//   if (days < 7) return `${days}d ago`;
//   return date.toLocaleDateString();
// };

// const NotificationBell = () => {
//   const [auth] = useAuth();
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [loaded, setLoaded] = useState(false);

//   // ✅ Correct unread count
//   const unreadCount = notifications.filter(n => !n.isRead).length;

//   /* ================= FETCH ================= */
//   const fetchNotifications = async () => {
//     try {
//       if (!auth?.token) {
//         console.log("No auth token found");
//         return;
//       }

//       console.log("Fetching notifications with token:", auth.token);
      
//       // Use the correct API path
//       const { data } = await API.get("/notification", {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//         },
//       });

//       console.log("Notifications response:", data);

//       if (data?.success) {
//         setNotifications(data.notifications || []);
//         setLoaded(true);
//       } else {
//         console.log("No success in response:", data);
//         setNotifications([]);
//       }
//     } catch (err) {
//       console.error(
//         "Notification fetch error:",
//         err?.response?.data || err.message
//       );
//       setNotifications([]);
//     }
//   };

//   // 🔐 Fetch ONLY when auth is ready
//   useEffect(() => {
//     if (auth?.token && !loaded) {
//       fetchNotifications();
//     }
//   }, [auth?.token, loaded]);

//   /* ================= SOCKET ================= */
//   useEffect(() => {
//     if (!auth?.user?._id) return;

//     // join user room
//     socket.emit("join-user", auth.user._id);

//     const handleNewNotification = (notif) => {
//       console.log("New notification received:", notif);
//       setNotifications(prev => [notif, ...prev]);
//     };

//     socket.on("new-notification", handleNewNotification);

//     return () => {
//       socket.off("new-notification", handleNewNotification);
//     };
//   }, [auth?.user?._id]);

//   /* ================= UI ACTIONS ================= */
//   const handleOpen = async () => {
//     console.log("Opening dropdown, current open state:", open);
//     setOpen(prev => !prev);

//     // mark all seen when opening
//     if (!open && unreadCount > 0) {
//       try {
//         await API.patch("/notification/seen-all", {}, {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         });
//         setNotifications(prev =>
//           prev.map(n => ({ ...n, isRead: true }))
//         );
//         console.log("Marked all as seen");
//       } catch (err) {
//         console.error("Seen-all failed:", err);
//       }
//     }
//   };

//   const handleClick = async (n) => {
//     try {
//       if (!n.isRead) {
//         await API.patch(`/notification/read/${n._id}`, {}, {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         });
//         console.log("Marked notification as read:", n._id);
//       }

//       // redirect safely
//       if (n.post?._id) {
//         window.location.href = `/post/${n.post._id}`;
//       }
//     } catch (err) {
//       console.error("Read notification failed:", err);
//     }
//   };

//   /* ================= RENDER ================= */
//   if (!auth?.token) {
//     return (
//       <div className="position-relative">
//         <FaBell size={20} className="tk-icon" style={{ opacity: 0.5 }} />
//       </div>
//     );
//   }

//   return (
//     <div className="notification-container">
//       <div className="notification-trigger" onClick={handleOpen}>
//         <FaBell size={20} className="tk-icon" />
//         {unreadCount > 0 && (
//           <span className="notification-count">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}
//       </div>

//       {open && (
//         <>
//           {/* Backdrop for closing dropdown when clicking outside */}
//           <div 
//             className="notification-backdrop" 
//             onClick={() => setOpen(false)}
//           />
          
//           <div className="notification-dropdown">
//             <div className="notification-header">
//               <strong>Notifications</strong>
//               {notifications.length > 0 && (
//                 <button 
//                   onClick={() => setOpen(false)}
//                   className="close-btn"
//                 >
//                   ×
//                 </button>
//               )}
//             </div>

//             <div className="notification-list">
//               {notifications.length === 0 && (
//                 <div className="notification-empty">
//                   <FaBell size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
//                   <p>No notifications yet</p>
//                 </div>
//               )}

//               {notifications.map(n => (
//                 <div
//                   key={n._id}
//                   onClick={() => handleClick(n)}
//                   className={`notification-item ${!n.isRead ? "unread" : ""}`}
//                 >
//                   <div className="notification-content">
//                     <div className="notification-message">{n.message}</div>
//                     <div className="notification-time">
//                       {formatTimeAgo(n.createdAt)}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default NotificationBell; // ✅ Make sure this line is present


// Minimal test version
// import { useState } from "react";
// import { FaBell } from "react-icons/fa";

// const NotificationBell = () => {
//   const [open, setOpen] = useState(false);
  
//   console.log("Rendering bell, open state:", open);
  
//   return (
//     <div style={{ position: 'relative', display: 'inline-block' }}>
//       <div 
//         onClick={() => {
//           console.log("Bell clicked!");
//           setOpen(!open);
//         }}
//         style={{ cursor: 'pointer' }}
//       >
//         <FaBell size={20} />
//       </div>
      
//       {open && (
//         <div style={{
//           position: 'absolute',
//           top: '100%',
//           right: 0,
//           background: 'white',
//           border: '1px solid black',
//           padding: '10px',
//           width: '200px',
//           zIndex: 9999
//         }}>
//           <p>Test Dropdown</p>
//           <button onClick={() => setOpen(false)}>Close</button>
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
// import { useAuth } from "../context/auth";

// // Helper function to format time ago
// const formatTimeAgo = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   const now = new Date();
//   const seconds = Math.floor((now - date) / 1000);
  
//   if (seconds < 60) return 'just now';
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes}m ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours}h ago`;
//   const days = Math.floor(hours / 24);
//   if (days < 7) return `${days}d ago`;
//   return date.toLocaleDateString();
// };

// const NotificationBell = () => {
//     console.log("NotificationBell component is rendering");

//   const [auth] = useAuth();
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [loaded, setLoaded] = useState(false);

//   // ✅ Correct unread count
//   const unreadCount = notifications.filter(n => !n.isRead).length;



//      const handleClicks = async() => {
//     console.log("🔔 BELL CLICKED! 🔔");
//     alert("Bell was clicked!");
//   };

//   /* ================= FETCH ================= */
//   const fetchNotifications = async () => {
//     try {
//       if (!auth?.token) {
//         console.log("No auth token found");
//         return;
//       }

//       console.log("Fetching notifications...");
      
//       const { data } = await API.get("/notification", {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//         },
//       });

//       console.log("Notifications response:", data);

//       if (data?.success) {
//         setNotifications(data.notifications || []);
//         setLoaded(true);
//       } else {
//         setNotifications([]);
//       }
//     } catch (err) {
//       console.error("Notification fetch error:", err?.response?.data || err.message);
//       setNotifications([]);
//     }
//   };

//   // Fetch when auth is ready
//   useEffect(() => {
//     if (auth?.token && !loaded) {
//       fetchNotifications();
//     }
//   }, [auth?.token, loaded]);

//   /* ================= SOCKET ================= */
//   useEffect(() => {
//     if (!auth?.user?._id) return;

//     socket.emit("join-user", auth.user._id);

//     const handleNewNotification = (notif) => {
//       console.log("New notification received:", notif);
//       setNotifications(prev => [notif, ...prev]);
//     };

//     socket.on("new-notification", handleNewNotification);

//     return () => {
//       socket.off("new-notification", handleNewNotification);
//     };
//   }, [auth?.user?._id]);

//   /* ================= UI ACTIONS ================= */
//   const handleOpen = () => {
//     console.log("Bell clicked! Current open state:", open);
//     setOpen(!open);
//   };

//   const handleMarkAllSeen = async () => {
//     if (unreadCount > 0) {
//       try {
//         await API.patch("/notification/seen-all", {}, {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         });
//         setNotifications(prev =>
//           prev.map(n => ({ ...n, isRead: true }))
//         );
//       } catch (err) {
//         console.error("Seen-all failed:", err);
//       }
//     }
//   };

//   const handleClick = async (n) => {
//     try {
//       if (!n.isRead) {
//         await API.patch(`/notification/read/${n._id}`, {}, {
//           headers: {
//             Authorization: `Bearer ${auth?.token}`,
//           },
//         });
//       }

//       if (n.post?._id) {
//         window.location.href = `/post/${n.post._id}`;
//       }
//     } catch (err) {
//       console.error("Read notification failed:", err);
//     }
//   };

//   /* ================= RENDER ================= */
//   if (!auth?.token) {
//     return (
//       <div style={{ position: 'relative', display: 'inline-block' }}>
//         <div style={{ cursor: 'pointer' }}>
//           <FaBell size={20} className="tk-icon" style={{ opacity: 0.5 }} />
//         </div>
//       </div>
//     );
//   }





//   // Using the same working structure as the test version
//   return (
//     <div style={{ position: 'relative', display: 'inline-block' }}>
//       {/* Bell Icon */}
//       <div 
//         onClick={handleClicks}
//         style={{ cursor: 'pointer', position: 'relative' }}
//       >
//         <FaBell size={20} className="tk-icon" />
//         {unreadCount > 0 && (
//           <span style={{
//             position: 'absolute',
//             top: '-8px',
//             right: '-8px',
//             backgroundColor: '#ef4444',
//             color: 'white',
//             borderRadius: '50%',
//             padding: '2px 6px',
//             fontSize: '10px',
//             fontWeight: 'bold',
//             minWidth: '18px',
//             height: '18px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             boxShadow: '0 0 0 2px white'
//           }}>
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}
//       </div>
      
//       {/* Dropdown - Using the same structure as test version */}
//       {open && (
//         <div style={{
//           position: 'absolute',
//           top: '100%',
//           right: 0,
//           marginTop: '8px',
//           backgroundColor: 'white',
//           border: '1px solid #e5e7eb',
//           borderRadius: '12px',
//           boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
//           width: '380px',
//           zIndex: 9999,
//           overflow: 'hidden'
//         }}>
//           {/* Header */}
//           <div style={{
//             padding: '16px 20px',
//             borderBottom: '1px solid #e5e7eb',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             backgroundColor: 'white'
//           }}>
//             <strong style={{ fontSize: '16px' }}>Notifications</strong>
//             <div>
//               {unreadCount > 0 && (
//                 <button
//                   onClick={handleMarkAllSeen}
//                   style={{
//                     background: 'none',
//                     border: 'none',
//                     color: '#3b82f6',
//                     fontSize: '12px',
//                     cursor: 'pointer',
//                     marginRight: '12px',
//                     padding: '4px 8px'
//                   }}
//                 >
//                   Mark all read
//                 </button>
//               )}
//               <button
//                 onClick={() => setOpen(false)}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   fontSize: '20px',
//                   cursor: 'pointer',
//                   color: '#9ca3af',
//                   padding: '0 4px',
//                   lineHeight: 1
//                 }}
//               >
//                 ×
//               </button>
//             </div>
//           </div>

//           {/* Notification List */}
//           <div style={{
//             maxHeight: '400px',
//             overflowY: 'auto'
//           }}>
//             {notifications.length === 0 && (
//               <div style={{
//                 padding: '48px 20px',
//                 textAlign: 'center',
//                 color: '#9ca3af'
//               }}>
//                 <FaBell size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
//                 <p style={{ margin: 0, fontSize: '14px' }}>No notifications yet</p>
//               </div>
//             )}

//             {notifications.map(n => (
//               <div
//                 key={n._id}
//                 onClick={() => {
//                   handleClick(n);
//                   setOpen(false);
//                 }}
//                 style={{
//                   padding: '12px 20px',
//                   cursor: 'pointer',
//                   borderBottom: '1px solid #f3f4f6',
//                   backgroundColor: !n.isRead ? '#eff6ff' : 'white',
//                   transition: 'background-color 0.2s'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.backgroundColor = !n.isRead ? '#dbeafe' : '#f9fafb';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.backgroundColor = !n.isRead ? '#eff6ff' : 'white';
//                 }}
//               >
//                 <div style={{
//                   fontSize: '14px',
//                   color: '#111827',
//                   lineHeight: '1.4',
//                   fontWeight: !n.isRead ? '600' : '500',
//                   marginBottom: '4px'
//                 }}>
//                   {n.message}
//                 </div>
//                 <div style={{
//                   fontSize: '11px',
//                   color: '#9ca3af'
//                 }}>
//                   {formatTimeAgo(n.createdAt)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;



import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import API from "../../utils/api";
import { socket } from "../../utils/socket";
import { useAuth } from "../context/auth";

// Helper function to format time ago
const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const NotificationBell = () => {
  const [auth] = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  /* ================= FETCH NOTIFICATIONS ================= */
  const fetchNotifications = async () => {
    try {
      if (!auth?.token) {
        console.log("No auth token found");
        return;
      }

      console.log("Fetching notifications...");
      
      const { data } = await API.get("/notifications/", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      console.log("Notifications response:", data);

      if (data?.success) {
        setNotifications(data.notifications || []);
        setLoaded(true);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Notification fetch error:", err?.response?.data || err.message);
      setNotifications([]);
    }
  };

  // Fetch when auth is ready
  useEffect(() => {
    if (auth?.token && !loaded) {
      fetchNotifications();
    }
  }, [auth?.token, loaded]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!auth?.user?._id) return;

    socket.emit("join-user", auth.user._id);

    const handleNewNotification = (notif) => {
      console.log("New notification received:", notif);
      setNotifications(prev => [notif, ...prev]);
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [auth?.user?._id]);

  /* ================= HANDLE OPEN DROPDOWN ================= */
  const toggleDropdown = async (e) => {
    e?.stopPropagation();
    console.log("Toggling dropdown, current state:", open);
    
    // If opening and there are unread notifications, mark them as seen
    if (!open && unreadCount > 0) {
      try {
        await API.patch("/notifications/seen-all", {}, {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        });
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true }))
        );
        console.log("Marked all as seen");
      } catch (err) {
        console.error("Seen-all failed:", err);
      }
    }
    
    setOpen(!open);
  };

  /* ================= HANDLE NOTIFICATION CLICK ================= */
  const handleNotificationClick = async (n) => {
    try {
      if (!n.isRead) {
        await API.patch(`/notifications/read/${n._id}`, {}, {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        });
        console.log("Marked notification as read:", n._id);
      }

      // Close dropdown
      setOpen(false);

      // Redirect if there's a post
      if (n.post?._id) {
        window.location.href = `/post/${n.post._id}`;
      }
    } catch (err) {
      console.error("Read notification failed:", err);
    }
  };

  /* ================= MARK ALL AS READ ================= */
  const markAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      await API.patch("/notification/seen-all", {}, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      console.log("Marked all as read");
    } catch (err) {
      console.error("Mark all failed:", err);
    }
  };

  /* ================= RENDER ================= */
  // If not authenticated, show disabled bell
  if (!auth?.token) {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <FaBell size={20} style={{ opacity: 0.5, cursor: 'not-allowed' }} />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell Icon with Click Handler */}
      <div 
        onClick={toggleDropdown}
        style={{ 
          cursor: 'pointer', 
          position: 'relative',
          padding: '4px',
          display: 'inline-block'
        }}
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '10px',
            fontWeight: 'bold',
            minWidth: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 2px white'
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
      
      {/* Dropdown Menu */}
      {open && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
              backgroundColor: 'rgba(0, 0, 0, 0)'
            }}
          />
          
          {/* Dropdown Content */}
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
            width: '380px',
            maxWidth: 'calc(100vw - 20px)',
            zIndex: 1000,
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white'
            }}>
              <strong style={{ fontSize: '16px', color: '#111827' }}>
                Notifications
                {notifications.length > 0 && (
                  <span style={{ 
                    marginLeft: '8px', 
                    fontSize: '12px', 
                    color: '#6b7280',
                    fontWeight: 'normal'
                  }}>
                    ({notifications.length})
                  </span>
                )}
              </strong>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3b82f6',
                    fontSize: '12px',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {notifications.length === 0 && (
                <div style={{
                  padding: '48px 20px',
                  textAlign: 'center',
                  color: '#9ca3af'
                }}>
                  <FaBell size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontSize: '14px' }}>No notifications yet</p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.7 }}>
                    When you get notifications, they'll appear here
                  </p>
                </div>
              )}

              {notifications.map((n, index) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    padding: '14px 20px',
                    cursor: 'pointer',
                    borderBottom: index !== notifications.length - 1 ? '1px solid #f3f4f6' : 'none',
                    backgroundColor: !n.isRead ? '#eff6ff' : 'white',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = !n.isRead ? '#dbeafe' : '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = !n.isRead ? '#eff6ff' : 'white';
                  }}
                >
                  <div style={{
                    fontSize: '14px',
                    color: '#111827',
                    lineHeight: '1.4',
                    fontWeight: !n.isRead ? '600' : '500',
                    marginBottom: '6px'
                  }}>
                    {n.message}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{formatTimeAgo(n.createdAt)}</span>
                    {!n.isRead && (
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        display: 'inline-block'
                      }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;