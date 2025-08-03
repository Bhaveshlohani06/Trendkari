import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import AdminMenu from "../../Layout/AdminMenu";
import toast from "react-hot-toast";
import CategoryForm from "../../Components/forms/Categoryform";
import { Modal } from "antd";
import { useAuth } from "../../context/auth";
import API from "../../../utils/api";

const CreateCategory = () => {
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  // Handle Form Submission
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // console.log("Token being sent:", auth?.token); // ✅ For debugging

    const { data } = await API.post(
      "/api/v1/category/create-category",
      { name },
      {
        headers: {
          Authorization: `Bearer ${auth?.token}`
        }
      }
    );

    if (data?.success) {
      toast.success(`${name} is created`);
      setName("");
      getAllCategory();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while creating the category");
  }
};



  // Get All Categories
  const getAllCategory = async () => {
    try {
      const { data } = await API.get("/category/categories");
          console.log("API response:", data); // ✅ For debugging

      if (data?.success) {
        setCategories(data?.categories);
              console.log("Fetched Categories:", data); 

      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching categories");
    }
  };
  
  useEffect(() => {
    getAllCategory();
  }, []);

  // Update Category
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put(  
        `/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data?.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating the category");
    }
  };

  // Delete Category
  const handleDelete = async (pId) => {
    try {
      const { data } = await API.delete(
        `/category/delete-category/${pId}`
      );
      if (data.success) {
        toast.success(`Category deleted successfully`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong while deleting the category");
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
   
        <div className="row dashboard">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((c) => (
                      <tr key={c._id}>
                        <td>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => handleDelete(c._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No categories found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>

            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              open={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>

    </Layout>
  );
};

export default CreateCategory;
