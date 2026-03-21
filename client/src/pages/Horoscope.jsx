// import React, { useState, useEffect } from "react";
// import API from "../../utils/api";
// import Layout from "../Layout/Layout";
// import { Container, Row, Col, Card, Badge, Alert, ListGroup } from 'react-bootstrap';
// import { useNavigate, useParams } from "react-router-dom";


// const DailyHoroscope = () => {
//     const { userId } = useParams();
//   const [user, setUser] = useState(null);
//   const [horoscope, setHoroscope] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const [status, setStatus] = useState("Generating your personalized horoscope...");


//   useEffect(() => {
//     const u = JSON.parse(localStorage.getItem("user"));
//     const token = localStorage.getItem("token");

//     if (!u || !token) {
//       navigate("/login");
//       setLoading(false);
//       return;
//     }



//     setUser(u);
//     fetchHoroscope(token);

    
//   useEffect(() => {
//   if (loading) {
//     const messages = [
//       "Analyzing your zodiac...",
//       "Calculating planetary positions...",
//       "Generating insights...",
//       "Almost ready..."
//     ];

//     let i = 0;
//     const interval = setInterval(() => {
//       setStatus(messages[i % messages.length]);
//       i++;
//     }, 4000);

//     return () => clearInterval(interval);
//   }
// }, [loading]);



// //     if (!u?.dob) {
// //   alert("Please update your profile with your Date of Birth to get an accurate horoscope.");
// //   navigate(`/update-profile/${u._id}`);
// //   console.log(`DOB missing, redirecting to profile update. ${u._id}`);
// //   return; // ✅ stop further execution
// // }
//   }, []);

//   const fetchHoroscope = async (token) => {
//     setLoading(true);
//     try {
//       const res = await API.get("/horoscope/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHoroscope(res.data);
//     } catch (err) {
//       console.error("Error fetching horoscope:", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return ( 
//     <Layout>
//   {/* <p className="text-center mt-5">Loading your horoscope...</p> */}
// {loading && (
//   <Layout>
//     <Container style={{ maxWidth: "800px" }} className="py-5">
//       <Card className="shadow-sm p-4">
//         <div className="placeholder-glow">
//           <span className="placeholder col-6 mb-3"></span>
//           <span className="placeholder col-4 mb-4"></span>

//           <span className="placeholder col-12 mb-2"></span>
//           <span className="placeholder col-10 mb-2"></span>
//           <span className="placeholder col-8 mb-4"></span>

//           <span className="placeholder col-6 mb-2"></span>
//           <span className="placeholder col-9 mb-2"></span>
//         </div>
//       </Card>
//     </Container>
//   </Layout>
// )}
//   </Layout>
// );
//   if (!horoscope) return(
//     <Layout>
//      <p className="text-center mt-5">No horoscope found for today.</p>

//      <a href="https://www.trendkari.in/login">Sign In</a>
//      </Layout>
//     );

//   return (
//       <Layout>
//       <div className="py-5">
//     <Container style={{ maxWidth: "800px" }}>
//       {/* Greeting */}
//       <h1 className="fw-bold mb-3 text-center">
//         Hello, {user?.name || "Friend"} ✨
//       </h1>
//       <p className="text-muted text-center mb-4">
//         <strong>Zodiac/Nakshatra:</strong>{" "}
//         {horoscope?.zodiac
//   ? `${horoscope.zodiac.hindi} | ${horoscope.zodiac.english}`
//   : user?.zodiacSign
//   ? `${user.zodiacSign.hindi} | ${user.zodiacSign.english}`
//   : "—"}
//   <br/>
//         <strong>Date:</strong>{" "}
//         {new Date(horoscope.generatedAt).toLocaleDateString()}
//       </p>

//       {/* Main Card */}
//       <Card className="shadow-lg rounded-4 border-0">
//         <Card.Body className="p-4">
//           {/* Title */}
//           <Card.Title className="fs-3 fw-semibold mb-3 text-primary">
//             <h2 className="text-dark">{user.name} राशिफल/Horoscope</h2>
//             {horoscope.title}
//           </Card.Title>

//           {/* Summary bilingual */}
//           <Card.Text className="fs-5 mb-3">{horoscope.summary?.english}</Card.Text>
//           {horoscope.summary?.hindi && (
//             <Card.Text className="fs-5 text-secondary" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
//               {horoscope.summary.hindi}
//             </Card.Text>
//           )}

//           {/* Sections */}
//           {horoscope.sections?.map((sec, idx) => (
//             <div key={idx} className="mb-4">
//               <h5 className="fw-bold text-dark">{sec.heading}</h5>
//               <p className="text-muted mb-1">{sec.text?.english}</p>
//               {sec.text?.hindi && (
//                 <p className="text-secondary" style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
//                   {sec.text.hindi}
//                 </p>
//               )}
//             </div>
//           ))}

//           {/* Lucky details */}
//           {horoscope.lucky && (
//             <ListGroup className="mb-4 rounded-3">
//               <ListGroup.Item className="d-flex justify-content-between">
//                 <span><strong>Lucky Color:</strong></span>
//                 <Badge bg="info" pill>{horoscope.lucky.color}</Badge>
//               </ListGroup.Item>
//               <ListGroup.Item className="d-flex justify-content-between">
//                 <span><strong>Lucky Number:</strong></span>
//                 <Badge bg="success" pill>{horoscope.lucky.number}</Badge>
//               </ListGroup.Item>
//             </ListGroup>
//           )}

//           {/* Tags */}
//           {horoscope.tags?.length > 0 && (
//             <div className="d-flex flex-wrap gap-2">
//               {horoscope.tags.map((tag, i) => (
//                 <Badge key={i} pill bg="secondary">
//                   {tag}
//                 </Badge>
//               ))}
//             </div>
//           )}
//         </Card.Body>
//       </Card>
//     </Container>
//   </div>
//   </Layout>
//   );
// };

// export default DailyHoroscope;


import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import Layout from "../Layout/Layout";
import { Container, Card, Badge, ListGroup, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
const [isGuest, setIsGuest] = useState(false);


const DailyHoroscope = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Generating your personalized horoscope...");
  const navigate = useNavigate();

const getShareText = () => {
  const summary =
    typeof horoscope.summary === "string"
      ? horoscope.summary
      : horoscope.summary?.hindi || "";

  const appLink = "https://www.trendkari.in/horoscope"; // 🔥 your route

  return `✨ आज का राशिफल ✨

${summary}

🎨 लकी रंग: ${horoscope.lucky?.color}
🔢 लकी नंबर: ${horoscope.lucky?.number}

👉 अपना राशिफल जानने के लिए यहाँ क्लिक करें:
${appLink}`;
};

  /* ---------------- USER + FETCH ---------------- */
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!u || !token) {
      navigate("/login");
      setLoading(false);
      return;
    }

    setUser(u);

    // ✅ CACHE CHECK
    const todayKey = `horoscope_${new Date().toDateString()}`;
    const cached = localStorage.getItem(todayKey);

    if (cached) {
      setHoroscope(JSON.parse(cached));
      setLoading(false);
      return;
    }

    fetchHoroscope(token, todayKey);
  }, []);

  /* ---------------- STATUS LOADER ---------------- */
  useEffect(() => {
    if (!loading) return;

    const messages = [
      "Analyzing your zodiac...",
      "Calculating planetary positions...",
      "Generating insights...",
      "Almost ready..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      setStatus(messages[i % messages.length]);
      i++;
    }, 4000);

    const timeout = setTimeout(() => {
      setStatus("Still working... this is taking longer than usual ⏳");
    }, 12000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loading]);

  /* ---------------- API CALL ---------------- */
  const fetchHoroscope = async (token, todayKey) => {
    setLoading(true);
    try {
      const res = await API.get("/horoscope/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHoroscope(res.data);

      // ✅ SAVE CACHE
      localStorage.setItem(todayKey, JSON.stringify(res.data));

    } catch (err) {
      console.error("Error fetching horoscope:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const u = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!u || !token) {
    setIsGuest(true); // 👈 don't redirect
    setLoading(false);
    return;
  }

  setUser(u);
  fetchHoroscope(token);
}, []);

// ``````````````````


useEffect(() => {
  const u = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!u || !token) {
    setIsGuest(true); // 👈 don't redirect
    setLoading(false);
    return;
  }

  setUser(u);
  fetchHoroscope(token);
}, []);

if (isGuest) {
  return (
    <Layout>
      <div className="text-center mt-5 px-3">

        <p className="mt-4 text-muted">
  ✨ आज आपके लिए कुछ खास संकेत हैं...
</p>

<div className="blur-box p-3 mt-3">
  <p>आज का दिन आपके लिए बदलाव लेकर आ सकता है...</p>
</div>

        <h3>🔮 अपना पर्सनल राशिफल जानें</h3>

        <p className="text-muted mt-3">
          यह राशिफल आपके लिए विशेष रूप से तैयार किया जाएगा।
        </p>

        <div className="mt-4">
          {/* <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/login")}
          >
            लॉगिन करें
          </button> */}

          <button  className="btn btn-primary me-2"
           onClick={() => navigate("/login?redirect=/horoscope")}>
            लॉगिन करें
           </button>

          {/* <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/register")}
          >
            नया अकाउंट बनाएं
          </button> */}
        </div>

      </div>
    </Layout>
  );
}

  /* ---------------- LOADING UI ---------------- */
  if (loading) {
    return (
      <Layout>
        <Container style={{ maxWidth: "800px" }} className="py-5 text-center">

          <h4 className="mb-3">
            Hello, {user?.name || "Friend"} ✨
          </h4>

          <p className="text-muted mb-4">
            Your personalized horoscope is being prepared...
          </p>

          <Card className="shadow-sm p-4 mb-3">
            <div className="placeholder-glow">
              <span className="placeholder col-6 mb-3"></span>
              <span className="placeholder col-4 mb-4"></span>

              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-10 mb-2"></span>
              <span className="placeholder col-8 mb-4"></span>
            </div>
          </Card>

          <Spinner animation="border" />

          <p className="mt-3 text-muted">{status}</p>

          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => navigate("/")}
          >
            Explore while waiting
          </button>

        </Container>
      </Layout>
    );
  }

  /* ---------------- NO DATA ---------------- */
  if (!horoscope) {
    return (
      <Layout>
        <p className="text-center mt-5">No horoscope found for today.</p>
      </Layout>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <Layout>
      <div className="py-5">
        <Container style={{ maxWidth: "800px" }}>

          <h1 className="fw-bold mb-3 text-center">
            Hello, {user?.name || "Friend"} ✨
          </h1>

          <p className="text-muted text-center mb-4">
            <strong>Zodiac:</strong>{" "}
            {horoscope?.zodiac
              ? `${horoscope.zodiac.hindi} | ${horoscope.zodiac.english}`
              : "—"}
            <br />
            <strong>Date:</strong>{" "}
            {new Date(horoscope.generatedAt).toLocaleDateString()}
          </p>




          <Card className="shadow-lg rounded-4 border-0">
  <Card.Body className="p-4">

    <h4 className="fw-bold mb-3">✨ {user.name} आज का राशिफल</h4>

    {/* <p className="fs-5">{horoscope.summary}</p> */}

<Card.Text style={{ fontFamily: "Noto Sans Devanagari, sans-serif" }}>
  {typeof horoscope.summary === "string"
    ? horoscope.summary
    : horoscope.summary?.hindi || horoscope.summary?.english}
</Card.Text>

    {/* <div className="mt-3 p-3 bg-light rounded">
      <strong>💡 Advice:</strong>
      <p className="mb-0">{horoscope.advice}</p>
    </div> */}

    <div className="d-flex justify-content-between mt-4">
      <span>      <strong className="p-3">🎨 Lucky Color:</strong>
{horoscope.lucky.color}</span>
      <span>       <strong className="p-3">🔢 Lucky Number:</strong>
 {horoscope.lucky.number}</span>
    </div>

    

<button
  className="btn btn-primary mt-3"
  onClick={() =>
   window.open(
  `https://wa.me/?text=${encodeURIComponent(getShareText())}`,
  "_blank"
)
  }
>
  📤 WhatsApp पर शेयर करें
</button>

  </Card.Body>
</Card>


          
        </Container>
      </div>
    </Layout>
  );
};

export default DailyHoroscope;