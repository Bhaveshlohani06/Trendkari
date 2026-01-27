// import { useState } from "react";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import API from "../../utils/api";

// const LikeButton = ({ postId, initialLiked, initialCount }) => {
//   const [liked, setLiked] = useState(initialLiked);
//   const [count, setCount] = useState(initialCount);
//   const [loading, setLoading] = useState(false);

//   const handleLike = async (e) => {
//     e.stopPropagation();
//     if (loading) return;

//     setLoading(true);

//     // optimistic UI
//     setLiked(!liked);
//     setCount(prev => liked ? prev - 1 : prev + 1);

//     try {
//       const { data } = await API.post(`/likes/${postId}`);
//       setLiked(data.liked);
//       setCount(data.likesCount);
//     } catch (err) {
//       // rollback
//       setLiked(liked);
//       setCount(initialCount);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex align-items-center gap-1">
//       <button
//         onClick={handleLike}
//         className="btn p-0 border-0 bg-transparent"
//       >
//         {liked ? <FaHeart color="red" /> : <FaRegHeart />}
//       </button>
//       <small>{count}</small>
//     </div>
//   );
// };

// export default LikeButton;




// import { useState } from "react";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import API from "../../utils/api";

// const LikeButton = ({ postId, initialLiked, initialCount }) => {
//   const [liked, setLiked] = useState(initialLiked);
//   const [count, setCount] = useState(initialCount);
//   const [loading, setLoading] = useState(false);

//   const handleLike = async (e) => {
//     e.stopPropagation();
//     if (loading) return;

//     setLoading(true);

//     // ✅ Optimistic update (SAFE)
//     setLiked(prevLiked => {
//       setCount(prevCount => (prevLiked ? prevCount - 1 : prevCount + 1));
//       return !prevLiked;
//     });

//     try {
//       const { data } = await API.post(`/likes/${postId}`);

//       // ✅ Backend is source of truth
//       setLiked(data.liked);
//       setCount(data.likesCount);

//     } catch (err) {
//       // ❌ Do NOT reset to initialCount
//       // Best rollback is to revert the optimistic toggle
//       setLiked(prevLiked => {
//         setCount(prevCount => (prevLiked ? prevCount - 1 : prevCount + 1));
//         return !prevLiked;
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex align-items-center gap-1">
//       <button
//         onClick={handleLike}
//         disabled={loading}
//         className="btn p-0 border-0 bg-transparent"
//       >
//         {liked ? <FaHeart color="red" /> : <FaRegHeart />}
//       </button>
//       <small>{count}</small>
//     </div>
//   );
// };

// export default LikeButton;



// import { useState, useRef } from "react";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import API from "../../utils/api";

// const LikeButton = ({ postId, initialLiked, initialCount }) => {
//   const initialized = useRef(false);

//   const [liked, setLiked] = useState(initialLiked);
//   const [count, setCount] = useState(initialCount);
//   const [loading, setLoading] = useState(false);

//   // 🔒 Prevent re-init on re-render
//   if (!initialized.current) {
//     initialized.current = true;
//   }

//   const handleLike = async (e) => {
//     e.stopPropagation();
//     if (loading) return;

//     setLoading(true);

//     // Optimistic update
//     setLiked(prev => {
//       setCount(c => (prev ? c - 1 : c + 1));
//       return !prev;
//     });

//     try {
//       const { data } = await API.post(`/likes/${postId}`);
//       setLiked(data.liked);
//       setCount(data.likesCount);
//     } catch {
//       // rollback optimistic change
//       setLiked(prev => {
//         setCount(c => (prev ? c - 1 : c + 1));
//         return !prev;
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex align-items-center gap-1">
//       <button
//         onClick={handleLike}
//         disabled={loading}
//         className="btn p-0 border-0 bg-transparent"
//       >
//         {liked ? <FaHeart color="red" /> : <FaRegHeart />}
//       </button>
//       <small>{count}</small>
//     </div>
//   );
// };

// export default LikeButton;




import { useState, useEffect, useRef } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import API from "../../utils/api";
import { socket } from "../../utils/socket";

const LikeButton = ({ postId, initialLiked, initialCount }) => {
  const mounted = useRef(false);

  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // 🔒 Prevent re-init on re-render
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setLiked(initialLiked);
      setCount(initialCount);
    }
  }, [initialLiked, initialCount]);

  // 🔥 JOIN POST ROOM + LIVE SYNC
  useEffect(() => {
    socket.emit("join-post", postId);

    socket.on("post-like-updated", (data) => {
      if (data.postId === postId) {
        setCount(data.likesCount);
      }
    });

    return () => {
      socket.off("post-like-updated");
    };
  }, [postId]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);

    // ✅ Optimistic UI (safe)
    setLiked(prev => {
      setCount(c => (prev ? c - 1 : c + 1));
      return !prev;
    });

    try {
      const { data } = await API.post(`/likes/${postId}`);

      // ✅ Backend is source of truth
      setLiked(data.liked);
      setCount(data.likesCount);

    } catch {
      // ❌ Rollback optimistic update
      setLiked(prev => {
        setCount(c => (prev ? c - 1 : c + 1));
        return !prev;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center gap-1">
      <button
        onClick={handleLike}
        disabled={loading}
        className="btn p-0 border-0 bg-transparent"
      >
        {liked ? <FaHeart color="red" /> : <FaRegHeart />}
      </button>
      <small>{count}</small>
    </div>
  );
};

export default LikeButton;
