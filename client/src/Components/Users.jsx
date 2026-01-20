import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import { ArrowLeft } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/user");
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Login to see users");
        navigate("/login");
      } else {
        toast.error("Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await API.post(`/user/follow/${userId}`);
      toast.success("Followed successfully");
    } catch {
      toast.error("Unable to follow");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="container mt-4">

        {/* HEADER */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <button
            className="btn btn-light border"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h4 className="fw-bold m-0">सभी पत्रकार और स्रोत</h4>
            <small className="text-muted">
              प्लेटफ़ॉर्म पर उपलब्ध सभी प्रोफाइल
            </small>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="row">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="col-md-3 mb-4">
                <div className="card shadow-sm border-0 p-4 text-center">
                  <div
                    className="rounded-circle bg-light mx-auto mb-3"
                    style={{ width: 70, height: 70 }}
                  />
                  <div className="placeholder-glow">
                    <span className="placeholder col-8"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* USERS GRID */}
        {!loading && users.length > 0 && (
          <div className="row">
            {users.map((user) => (
              <div key={user._id} className="col-md-3 mb-4">
                <div className="card shadow-sm border-0 h-100">

                  <div className="card-body d-flex flex-column align-items-center text-center">

                    {/* AVATAR */}
                    <div
                      className="rounded-circle border overflow-hidden mb-3"
                      style={{ width: 70, height: 70 }}
                    >
                      <img
                        src={
                          user.avatar?.startsWith("http")
                            ? user.avatar
                            : "/avatar.png"
                        }
                        alt={user.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => (e.target.src = "/avatar.png")}
                      />
                    </div>

                    {/* NAME */}
                    <h6 className="fw-bold text-truncate w-100">
                      {user.name}
                    </h6>

                    {/* ROLE / BIO (optional) */}
                    <p className="small text-muted mb-3">
                      स्थानीय स्रोत
                    </p>

                    {/* ACTIONS */}
                    <div className="d-flex gap-2 w-100 mt-auto">
                      <button
                        className="btn btn-outline-primary btn-sm w-100"
                        onClick={() => handleFollow(user._id)}
                      >
                        फॉलो करें
                      </button>

                      <button
                        className="btn btn-light btn-sm w-100"
                        onClick={() =>
                          navigate(`/dashboard/user/profile/${user._id}`)
                        }
                      >
                        प्रोफ़ाइल
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && users.length === 0 && (
          <div className="text-center py-5 border rounded">
            <p className="text-muted mb-1">
              कोई यूज़र उपलब्ध नहीं है
            </p>
            <small>बाद में पुनः प्रयास करें</small>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;
