/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Form, Table } from "react-bootstrap";
import DataTable from "react-data-table-component";
import ImageLoader from "../../ImageLoader/ImageLoader";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Input as InputStrap } from "reactstrap";

import { auth, firestore, storage } from "../../Firebase/Config";
import { Modal } from "antd";
import { v4 as uuidv4 } from "uuid";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import CustomSnackbar from "../../SnackBar/CustomSnackbar";

import fileavatar from "../../../assets/images/profileavatar.jpg";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const ListCategory = () => {
  const [channelLoading, setChannelLoading] = useState(false);
  const [Chanalsdata, setChanalsdata] = useState([]);
  const [ChanalsSortedData, setChanalsSortedData] = useState([]);
  const [Editmodal, setEditmodal] = useState(false);
  const [inputType, setInputType] = useState("password");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [Cat, setCat] = useState([]);
  const [RowID, setRowID] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [SelectedImg, setSelectedImg] = useState("");
  const [Rowdata, setRowdata] = useState("");
  const [loadingupload, setloadingupload] = useState(false);
  const [titleSortOrder, setTitleSortOrder] = useState(null);
  const [catSortOrder, setCatSortOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getCategories = async () => {
    try {
      // Reference to the 'category' collection
      const categoryCollection = collection(firestore, "category");

      // Fetch all documents in the collection
      const categorySnapshot = await getDocs(categoryCollection);

      // Extract data from each document
      const categories = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Log and return the categories
      setCat(categories);
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  const getChannelsWithCategories = async () => {
    setChannelLoading(true);
    try {
      const channelsCollection = collection(firestore, "Newchannels");
      const channelsSnapshot = await getDocs(channelsCollection);
      const channels = channelsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("CHANNNELS ======> ", channels?.slice(0, 20));
      setChanalsdata(channels);
      setChanalsSortedData(channels);
      setChannelLoading(false);
    } catch (error) {
      console.error("Error fetching channels with categories:", error);
      setChannelLoading(false);
      throw error;
    }
  };

  const uploadImage = (courseFile) => {
    if (!courseFile) return;
    setloadingupload(true);
    const currentDate = new Date();
    const uniqueFileName = `${currentDate.getTime()}_${courseFile?.name}`;
    const imageRef = ref(storage, `UserImages/${uniqueFileName}`);
    uploadBytes(imageRef, courseFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        showSnackbar("Image Added Sucessfully", "success");
        setProfileImage(url);
        setloadingupload(false);
      });
    });
  };

  const SelectImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImg(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImg(null);
    }
    if (file) {
      uploadImage(file);
    }
  };

  const getCategoryIDByName = (name) => {
    const category = Cat.find((category) => category.name === name);
    return category?.id;
  };

  const initialValues = {
    cat: getCategoryIDByName(Rowdata?.category?.name),
    title: Rowdata?.title,
    url: Rowdata?.url,
    feature: Rowdata?.feature, // Set the initial value for the switch
  };

  const validationSchema = Yup.object().shape({
    cat: Yup.string().required("Category name is required"),
    title: Yup.string().required("Title is required"),
    url: Yup.string().required("Feed url is required"),
  });

  const handleDelete = async (id) => {
    try {
      const channelRef = collection(firestore, "Newchannels");
      await deleteDoc(doc(channelRef, id));
      // After deletion, refresh data
      getChannelsWithCategories();
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  const handleSubmit = async (values) => {

    setLoading(true);
    try {
      // Fetch the category object by categoryId
      const categoryDocRef = doc(firestore, "category", values?.cat);
      const categoryDoc = await getDoc(categoryDocRef);

      if (!categoryDoc.exists()) {
        setLoading(false);
        throw new Error("Category not found");
      }

      const categoryData = categoryDoc.data();
      const channelsCollection = collection(firestore, "Newchannels");

      let docRef;

      if (RowID) {
        // Update the existing document
        docRef = doc(firestore, "Newchannels", RowID);
        await updateDoc(docRef, {
          title: values?.title,
          imageUrl: profileImage,
          url: values?.url,
          category: categoryData,
          sub: [],
          download: [],
          star: [],
          feature: values?.feature
        });
        setEditmodal(false);
        showSnackbar("Podcast Updated Successfully", "success");
      }

      return docRef.id;
    } catch (error) {
      setLoading(false);
      console.error("Error adding or updating channel:", error);
      throw error;
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleEdit = (row) => {
    setRowdata(row);
    setRowID(row?.id);
    setProfileImage(row?.imageUrl);
    setEditmodal(true);
  };

  const handleCancel = () => {
    setEditmodal(false);
  };

  useEffect(() => {
    getChannelsWithCategories();
    getCategories();
  }, []);

  const handleSort = (title, sortOrder) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    if (title == "Title") {
      const sortedData = [...ChanalsSortedData].sort((a, b) => {
        const firstLetterA = a.title.charAt(0).toLowerCase();
        const firstLetterB = b.title.charAt(0).toLowerCase();

        if (newSortOrder === "asc") {
          return firstLetterA < firstLetterB
            ? -1
            : firstLetterA > firstLetterB
            ? 1
            : 0;
        } else {
          return firstLetterA > firstLetterB
            ? -1
            : firstLetterA < firstLetterB
            ? 1
            : 0;
        }
      });
      setTitleSortOrder(newSortOrder);
      // setChanalsdata(sortedData);
      setChanalsSortedData(sortedData);
    } else if (title == "Cat Name") {
      const sortedData = [...ChanalsSortedData].sort((a, b) => {
        const firstLetterA = a?.category?.name?.charAt(0).toLowerCase();
        const firstLetterB = b?.category?.name?.charAt(0).toLowerCase();

        console.log(firstLetterA, firstLetterB);

        if (newSortOrder === "asc") {
          return firstLetterA < firstLetterB
            ? -1
            : firstLetterA > firstLetterB
            ? 1
            : 0;
        } else {
          return firstLetterA > firstLetterB
            ? -1
            : firstLetterA < firstLetterB
            ? 1
            : 0;
        }
      });
      setCatSortOrder(newSortOrder);
      // setChanalsdata(sortedData);
      setChanalsSortedData(sortedData);
    }
    // Sorting logic as explained in the previous answer...
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        const sortedData = ChanalsSortedData?.filter((item, index) =>
          item?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        );
        setChanalsSortedData(sortedData);
      } else setChanalsSortedData(Chanalsdata);
      // const sortedData = Chanalsdata?.filter((item, index) =>
      //   item?.title?.toLowerCase()?.includes(searchQuery?.toLocaleLowerCase)
      // );
      // setChanalsSortedData(sortedData);
    }, 500);

    return () => {
      clearTimeout(timer); // Clear the timer on cleanup
    };
  }, [searchQuery, Chanalsdata]);

  const NameWithIcon = ({ name, sortOrder }) => {
    const getSortIcon = () => {
      if (sortOrder === "asc") {
        return (
          <div onClick={() => handleSort(name, sortOrder)}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14l5-5 5 5H7z" /> {/* Up arrow for ascending */}
            </svg>
          </div>
        );
      } else if (sortOrder === "desc") {
        return (
          <div onClick={() => handleSort(name, sortOrder)}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5H7z" /> {/* Down arrow for descending */}
            </svg>
          </div>
        );
      }
      return null; // No icon if no sort order is specified
    };

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>{name}</span>
        {sortOrder && (
          <span style={{ marginLeft: "5px" }}>{getSortIcon()}</span>
        )}
      </div>
    );
  };

  const columns = [
    {
      name: "#",
      selector: (row, index) => index,
      maxWidth: "7rem",
      minWidth: "2rem",
    },
    {
      name: "Image",
      selector: (row) => (
        <ImageLoader
          classes={"tableImg"}
          imageUrl={row?.imageUrl}
          circeltrue={true}
        />
      ),
      maxWidth: "7rem",
      minWidth: "2rem",
    },
    {
      name: <NameWithIcon name="Title" sortOrder={titleSortOrder || "asc"} />,
      selector: (row) => row?.title,
      maxWidth: "10rem",
      minWidth: "4rem",
    },
    {
      name: <NameWithIcon name="Cat Name" sortOrder={catSortOrder || "asc"} />,
      selector: (row) => row?.category?.name,
      maxWidth: "7rem",
      minWidth: "2rem",
    },
    {
      name: "Feed Url",
      selector: (row) => row?.url,
      maxWidth: "30rem",
      minWidth: "20rem",
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="loginBtn2"
            style={{ cursor: "pointer", padding: "2px 10px" }}
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="loginBtn2"
            style={{ cursor: "pointer", padding: "2px 10px", marginLeft: 20 }}
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </>
      ),
      maxWidth: "10rem",
      minWidth: "10rem",
    },
  ];
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
      <Modal
        title="Basic Modal"
        footer={false}
        open={Editmodal}
        centered
        onCancel={handleCancel}
      >
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <Form
              className="formHead"
              // style={{ width: "40%" }}
              onSubmit={handleSubmit}
            >
              <section>
                <Form.Group
                  className="mb-2 hideFocus2"
                  controlId="formGroupEmail"
                >
                  <Form.Label className="lableHead">Add Category</Form.Label>

                  <Form.Select
                    aria-label="Default select example"
                    className="radius_12"
                    name="cat"
                    value={values.cat}
                    onChange={handleChange}
                  >
                    {Cat.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>

                  {touched.cat && errors.cat && (
                    <div className="errorMsg">{errors.cat}</div>
                  )}

                  <Form.Label className="lableHead mt-3">Add Title</Form.Label>

                  <Form.Control
                    className="radius_12 "
                    placeholder="Title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                  />
                  {touched.title && errors.title && (
                    <div className="errorMsg">{errors.title}</div>
                  )}

                  <Form.Label className="lableHead mt-3">
                    Add Feed Url
                  </Form.Label>
                  <Form.Control
                    className="radius_12 "
                    placeholder="Url"
                    name="url"
                    value={values.url}
                    onChange={handleChange}
                  />
                  {touched.url && errors.url && (
                    <div className="errorMsg">{errors.url}</div>
                  )}
                </Form.Group>

                <Form.Check
                  type="switch"
                  name="feature"
                  id="custom-switch"
                  label="Feature this Podcast"
                  checked={values.feature}
                  onChange={(e) => setFieldValue("feature", e.target.checked)}
                />

                <div className="d-flex " style={{ flexDirection: "column" }}>
                  <h6 className="lableHead mt-2 mb-2">Upload Image</h6>
                  <div>
                    <label
                      style={{ cursor: "pointer", position: "relative" }}
                      htmlFor="fileInput"
                      className="cursor-pointer"
                    >
                      {loadingupload && (
                        <Spinner
                          style={{
                            width: "18px",
                            height: "18px",
                            marginTop: "3px",
                            borderWidth: "0.15em",
                            position: "absolute",
                            top: "2rem",
                            right: "2.5rem",
                            zIndex: "99999",
                            color: "white",
                          }}
                          animation="border"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      )}
                      {profileImage ? (
                        <>
                          <img
                            src={profileImage}
                            alt="Preview"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "50%",
                              position: "relative",
                            }}
                            className="object-cover"
                          />
                        </>
                      ) : (
                        <div className="border radius_50 flex justify-content-center items-center">
                          <img
                            src={fileavatar}
                            alt="Camera Icon"
                            width={80}
                            height={80}
                          />
                        </div>
                      )}
                    </label>

                    <InputStrap
                      type="file"
                      // required
                      id="fileInput"
                      className="visually-hidden"
                      onChange={SelectImage}
                    />
                  </div>
                </div>

                <div className="d-flex flex-column w-50">
                  <button
                    disabled={loading}
                    className={`loginBtn mt-3 ${loading ? "disbalebtn" : ""}`}
                  >
                    {loading ? (
                      <Spinner
                        style={{
                          width: "18px",
                          height: "18px",
                          marginTop: "3px",
                          borderWidth: "0.15em",
                        }}
                        animation="border"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </section>
            </Form>
          )}
        </Formik>
      </Modal>

      {channelLoading ? (
        <div className="text-center">
          <Spinner
            style={{
              width: "18px",
              height: "18px",
              marginTop: "3px",
              borderWidth: "0.15em",
            }}
            animation="border"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <div className="cat-input-con">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for category"
              className="cat-input"
            />
          </div>
          <DataTable columns={columns} data={ChanalsSortedData} pagination />
        </>
      )}
    </>
  );
};

export default ListCategory;
