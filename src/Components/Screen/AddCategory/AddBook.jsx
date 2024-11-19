/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import { Formik } from "formik";
import { React, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import CustomSnackBar from "../../SnackBar/CustomSnackbar";
import { Input as InputStrap } from "reactstrap";
import { v4 as uuidv4 } from "uuid";
import fileavatar from "../../../assets/images/profileavatar.jpg";
import { firestore, storage } from "../../Firebase/Config";

import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
const AddBook = () => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [profileImage, setProfileImage] = useState("");
  const [SelectedImg, setSelectedImg] = useState("");
  const [loadingupload, setloadingupload] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const initialValues = {
    title: "",
    name: "",
    type: "",
    url: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    name: Yup.string().required("Name is required"),
    url: Yup.string().required("Url is required"),
    type: Yup.string().required("Type is required"),
  });

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

  const handleSubmit = async (value) => {
    setLoading(true);
    try {
      const uniqueId = uuidv4();
      // Reference to the 'channels' collection
      const channelsCollection = collection(firestore, "Books");

      // Add a new document with the channel details, including the category object
      const docRef = await addDoc(channelsCollection, {
        _id: uniqueId,
        title: value?.title,
        name: value?.name,
        imageUrl: profileImage,
        url: value?.url,
        type: value?.type,
      });

      navigation("/BookList");

      showSnackbar("Book Added Sucessfully", "success");

      setLoading(false);

      return docRef.id;
    } catch (error) {
      setLoading(false);
      console.error("Error adding book:", error);
      throw error;
    }
  };

  // /

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

                <Form.Label className="lableHead mt-3">Add Name</Form.Label>

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
                  <option value="Global">Global</option>
                  <option value="Espanol">Espanol</option>
                  <option value="Nigeria">Nigeria</option>
                </Form.Select>
                {touched.type && errors.type && (
                  <div className="errorMsg">{errors.type}</div>
                )}

                <Form.Label className="lableHead mt-3">Add Book Url</Form.Label>
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

export default AddBook;
