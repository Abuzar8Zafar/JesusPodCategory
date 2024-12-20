/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import { Form, Spinner, Table } from "react-bootstrap";
import { Formik, Field } from "formik";
import axios from "axios";
import * as Yup from "yup";
import closeEye from "../../../assets/icon/close_eye.svg";
import openEye from "../../../assets/icon/open_eye.svg";
import { NavLink, useNavigate } from "react-router-dom";
import CustomSnackBar from "../../SnackBar/CustomSnackbar";
// import { setToken } from "../../../store/reducer/AuthConfig";
import { ToastMessage } from "../../../utils/ToastMessage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, storage } from "../../Firebase/Config";
import fileavatar from "../../../assets/images/profileavatar.jpg";
import { Input as InputStrap } from "reactstrap";
import { v4 as uuidv4 } from "uuid";

import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

import { message } from "antd";

import { useDispatch } from "react-redux";
import {
  setAuthenticated,
  setToken,
  setUser,
} from "../../../Redux/Slices/AuthSlice";
import {
  addGlobalTypeToAllCollections,
  getSingleDoc,
} from "../../Firebase/FirbaseService";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import DataTable from "react-data-table-component";
import ImageLoader from "../../ImageLoader/ImageLoader";
const AddChannels = () => {
  const navigation = useNavigate();

  const [inputType, setInputType] = useState("password");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [Cat, setCat] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [SelectedImg, setSelectedImg] = useState("");
  const [Chanalsdata, setChanalsdata] = useState([]);
  const [channelLoading, setChannelLoading] = useState(false);
  const [loadingupload, setloadingupload] = useState(false);
  const [FalgType, setFalgType] = useState([]);

  const getCategories = async () => {
    try {
      // Reference to the 'category' collection
      const categoryCollection = collection(
        firestore,
        "BlogCategoryCollection"
      );

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

  // snackbar

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const initialValues = {
    name: "",
    url: "",
    type: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Channel name is required"),
    url: Yup.string().required("Channel url is required"),
    type: Yup.string().required("Type is required"),
  });

  const getChannelsWithCategories = async () => {
    try {
      const channelsCollection = collection(firestore, "Countries");
      const channelsSnapshot = await getDocs(channelsCollection);
      const channels = channelsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.order - b.order);

      setFalgType(channels);
    } catch (error) {
      console.error("Error fetching channels with categories:", error);
      throw error;
    }
  };

  useEffect(() => {
    getChannelsWithCategories();
  }, []);

  const uploadImage = (courseFile) => {
    if (!courseFile) return;
    setloadingupload(true);

    const currentDate = new Date();
    const uniqueFileName = `${currentDate.getTime()}_${courseFile?.name}`;
    const imageRef = ref(storage, `BookImages/${uniqueFileName}`);
    uploadBytes(imageRef, courseFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        showSnackbar("Image Added Sucessfully", "success");
        setProfileImage(url);
        setloadingupload(false);
      });
    });
  };

  // const handleUpdate = async () => {
  //   const res = await addGlobalTypeToAllCollections();
  // };

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

  useEffect(() => {
    getCategories();
  }, []);

  const handleSubmit = async (value) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://addchannel2-53ifvdv3fa-uc.a.run.app", // Replace with your actual function URL
        {
          name: value?.name,
          channelLink: value?.url,
          image: profileImage,
          type: value?.type,
        }
      );

      console.log("response is: ", response);
      showSnackbar("Channel Added Sucessfully", "success");

      setLoading(false);

      //   return docRef.id;
    } catch (error) {
      setLoading(false);
      console.error("Error adding channel:", error);
      throw error;
    }
  };

  return (
    <>
      <CustomSnackBar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
      <Formik
        initialValues={initialValues}
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
        }) => (
          <Form
            className="formHead"
            style={{ width: "40%" }}
            onSubmit={handleSubmit}
          >
            <section className="bord">
              <Form.Group
                className="mb-2 hideFocus2"
                controlId="formGroupEmail"
              >
                <Form.Label className="lableHead mt-3">
                  Add Channel Name
                </Form.Label>
                <Form.Control
                  className="radius_12 "
                  placeholder="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                />
                {touched.name && errors.name && (
                  <div className="errorMsg">{errors.name}</div>
                )}

                <Form.Label className="lableHead mt-3">Select Type</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  className="radius_12"
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {FalgType?.map((item) => (
                    <>
                      <option value={item.title}>{item.title}</option>
                    </>
                  ))}
                </Form.Select>
                {touched.type && errors.type && (
                  <div className="errorMsg">{errors.type}</div>
                )}
              </Form.Group>

              <Form.Group
                className="mb-2 hideFocus2"
                controlId="formGroupEmail"
              >
                <Form.Label className="lableHead mt-3">
                  Add Channel Url
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
                          top: "1.5rem",
                          right: "2rem",
                          zIndex: "99999",
                          color: "red",
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
                            borderRadius: "0%",
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
    </>
  );
};

export default AddChannels;
