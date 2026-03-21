// import React, { useEffect, useRef, useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/auth";

// import API from "../../../utils/api";
// import Editor from "../EditorComponent";


// const CreatePostModal = ({ show, onClose }) => {
//   const navigate = useNavigate();

//   /* ---------------- STATES ---------------- */
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState(null);
//   const [category, setCategory] = useState("");
//   const [language, setLanguage] = useState("hi");
//   const [location, setLocation] = useState("kota");
//   const [image, setImage] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [posting, setPosting] = useState(false);
  
//   const quillRef = useRef(null);
//     const [auth, setAuth] = useAuth();





//   /* ---------------- FETCH CATEGORIES ---------------- */
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await API.get("/category/categories");
//         if (data?.success) setCategories(data.categories);
//       } catch (err) {
//         toast.error("Failed to load categories");
//       }
//     };

//     if (show) fetchCategories();
//   }, [show]);

//   /* ---------------- CREATE POST ---------------- */
//   const handleCreate = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return toast.error("Please login first");

//     if (!title || !content || !category) {
//       return toast.error("All required fields must be filled");
//     }

//     try {
//       setPosting(true);

//       const postData = new FormData();
//       postData.append("title", title);
//       postData.append("content", JSON.stringify(content)); // 🔥 FIX
//       postData.append("category", category);
//       postData.append("language", language);
//       postData.append("location", location);
//       if (image) postData.append("image", image);

//       const { data } = await API.post("/post/create-post", postData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (data?.success) {
//         toast.success("Post created successfully");
//         onClose();
//         navigate("/explore");
//       } else {
//         toast.error(data?.message || "Failed to create post");
//       }
//     } catch (err) {
//       toast.error("Something went wrong");
//     } finally {
//       setPosting(false);
//     }
//   };

//   if (!show) return null;


//   return (
//     <div className="modal show d-block" style={{ background: "rgba(0,0,0,.6)" }}>
//       <div className="modal-dialog modal-lg modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Create Post</h5>
//             <button className="btn-close" onClick={onClose} />
//           </div>

//           <div className="modal-body">
//             <input
//               className="form-control mb-3"
//               placeholder="Post Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />

//             {/* Rich Text Editor */}
//        <Editor onChange={setContent} />


//             {/* Location */}
//             <select
//               className="form-select mt-3"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//             >
//               <option value="kota">कोटा</option>
//               <option value="ramganjmandi">रामगंजमंडी</option>
//               <option value="sangod">सांगोद</option>
//               <option value="ladpura">लाडपुरा</option>
//               <option value="kaithoon">कैथून</option>
//               <option value="modak">मोड़क</option>
//               <option value="rural-kota">ग्रामीण कोटा</option>
//             </select>

//             {/* Category */}
//             <select
//               className="form-select mt-3"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//             >
//               <option value="">Select Category</option>
//               {categories.map((c) => (
//                 <option key={c._id} value={c._id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>

//             {/* Language */}
//             <select
//               className="form-select mt-3"
//               value={language}
//               onChange={(e) => setLanguage(e.target.value)}
//             >
//               <option value="hi">हिंदी</option>
//               <option value="en">English</option>
//             </select>

//             {/* Image */}
//             <input
//               type="file"
//               className="form-control mt-3"
//               accept="image/*"
//               onChange={(e) => setImage(e.target.files[0])}
//             />
//           </div>

//           <div className="modal-footer">
//             <button className="btn btn-secondary" onClick={onClose}>
//               Cancel
//             </button>
//             <button className="btn btn-primary" onClick={handleCreate} disabled={posting}>
//               {posting ? "Posting..." : "Post"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePostModal;


import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import API from "../../../utils/api";
import Editor from "../EditorComponent";

const CreatePostModal = ({ show, onClose }) => {
  const navigate = useNavigate();

  /* ---------------- STATES ---------------- */
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("hi");
  const [location, setLocation] = useState("kota");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [posting, setPosting] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const editorRef = useRef(null);
  const [auth] = useAuth();

  const isAdmin = auth?.user?.role === "admin";

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/category/categories");
        if (data?.success) setCategories(data.categories);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };

    if (show) fetchCategories();
  }, [show]);

  /* ---------------- AI GENERATE ---------------- */
  const generateAndHumanize = async () => {
    if (!title) return toast.error("Please enter a title");

    try {
      setLoadingAI(true);
      const token = localStorage.getItem("token");

      // Step 1: Generate
      const genRes = await API.post(
        "/post/generate",
        { prompt: title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const generated = genRes?.data?.content;
      if (!generated) throw new Error();

      // Step 2: Humanize
      const humRes = await API.post(
        "/post/humanize",
        { htmlContent: generated },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const humanized = humRes?.data?.content;
      if (!humanized) throw new Error();

      // Step 3: Set in editor
      // setContent(humanized);

      const convertHTMLToEditorJS = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const blocks = [];

  tempDiv.childNodes.forEach((node) => {
    if (node.nodeType === 1) {
      blocks.push({
        type: "paragraph",
        data: {
          text: node.innerHTML,
        },
      });
    }
  });

  return {
    time: Date.now(),
    blocks,
    version: "2.28.0",
  };
};

const formatted = convertHTMLToEditorJS(humanized);
setContent(formatted); // ✅ CORRECT

      // if (editorRef.current) {
      //   editorRef.current.setContent(humanized);
      // }

      toast.success("AI content generated!");
    } catch (err) {
      console.error(err);
      toast.error("AI generation failed");
    } finally {
      setLoadingAI(false);
    }
  };

  /* ---------------- VALIDATE EMPTY HTML ---------------- */
  const isContentEmpty = (html) => {
    if (!html) return true;
    const stripped = html.replace(/<[^>]*>/g, "").trim();
    return !stripped;
  };

  /* ---------------- CREATE POST ---------------- */
  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login first");

    if (!title || isContentEmpty(content) || !category) {
      return toast.error("All required fields must be filled");
    }

    try {
      setPosting(true);

      const postData = new FormData();
      postData.append("title", title);
      postData.append("content", content); // ✅ FIXED
      postData.append("category", category);
      postData.append("language", language);
      postData.append("location", location);
      if (image) postData.append("image", image);

      const { data } = await API.post("/post/create-post", postData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.success) {
        toast.success("Post created successfully");
        onClose();
        navigate("/explore");
      } else {
        toast.error(data?.message || "Failed to create post");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setPosting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,.6)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          
          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">Create Post</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">

            {/* TITLE */}
            <input
              className="form-control mb-3"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* AI BUTTON (ADMIN ONLY) */}
            {isAdmin && (
              <button
                className="btn btn-warning mb-2"
                onClick={generateAndHumanize}
                disabled={loadingAI}
              >
                {loadingAI ? "Generating..." : "Generate with AI"}
              </button>
            )}

            {/* EDITOR */}
            <Editor
              // ref={editorRef}
              initialData={content ? JSON.parse(content) : null}
              onChange={setContent}
            />

            {/* LOCATION */}
            <select
              className="form-select mt-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="kota">कोटा</option>
              <option value="ramganjmandi">रामगंजमंडी</option>
              <option value="sangod">सांगोद</option>
              <option value="ladpura">लाडपुरा</option>
              <option value="kaithoon">कैथून</option>
              <option value="modak">मोड़क</option>
              <option value="rural-kota">ग्रामीण कोटा</option>
            </select>

            {/* CATEGORY */}
            <select
              className="form-select mt-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* LANGUAGE */}
            <select
              className="form-select mt-3"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="hi">हिंदी</option>
              <option value="en">English</option>
            </select>

            {/* IMAGE */}
            <input
              type="file"
              className="form-control mt-3"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreate}
              disabled={posting}
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;