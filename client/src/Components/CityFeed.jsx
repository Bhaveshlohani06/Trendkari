import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../utils/api";
import BlogCard from "../Components/BlogCard";
import Layout from "../Layout/Layout";

const CityFeed = () => {
  const { location } = useParams();
  const [posts, setPosts] = useState([]);

  const fetchCityPosts = async () => {
    const { data } = await API.get(
      `/post/get-posts?location=${location}&language=hi`
    );
    if (data?.success) setPosts(data.posts);
  };

  useEffect(() => {
    fetchCityPosts();
  }, [location]);

  return (
    <Layout>
      <div className="container py-4">
        <h2 className="fw-bold mb-4 text-capitalize">
          {location} News
        </h2>

        <div className="row">
          {posts.map(post => (
            <div className="col-md-6 mb-3" key={post._id}>
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CityFeed;
