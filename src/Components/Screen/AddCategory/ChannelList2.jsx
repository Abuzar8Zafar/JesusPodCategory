/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Form, Table } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
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

const ChannelList = () => {
  const [channelLoading, setChannelLoading] = useState(false);
  const [Chanalsdata, setChanalsdata] = useState([]);
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
  const [channel, setChannel] = useState([]);

  const getCategories = async () => {
    try {
      const response = await axios.post(
        "https://getchannels-53ifvdv3fa-uc.a.run.app"
      );
      console.log("Channels data:", response.data?.channels);
      setChannel(response.data?.channels);
    } catch (error) {
      console.error("Error getting channels:", error);
    }
  };

  const getChannelNames = () => {
    return channel.find((item) => {
      return item.name == Rowdata?.name;
    });
  };

  const getChannelUrls = () => {
    console.log(
      "URLS: ",
      channel.find((item) => {
        return item.channelLink == Rowdata?.channelLink;
      })
    );
    return channel.find((item) => {
      return item.channelLink == Rowdata?.channelLink;
    })?.channelLink;
  };

  const initialValues = {
    name: Rowdata?.name,
    url: Rowdata?.channelLink,
    // name: getChannelNames(),
    // url: getChannelUrls(),
  };

  const validationSchema = Yup.object().shape({
    cat: Yup.string().required("Channel name is required"),
    url: Yup.string().required("Channel url is required"),
  });

  const handleDelete = async (row) => {
    try {
      const response = await axios.post(
        "https://deletechannel-53ifvdv3fa-uc.a.run.app",
        {
          channelName: row?.name,
        }
      );
      console.log("Channel deleted:", response.data);
      setChannel((pre) => {
        return pre?.filter((item) => item?.name != row?.name);
      });
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
    // try {
    //   const channelRef = collection(firestore, "BlogCollection");
    //   await deleteDoc(doc(channelRef, id));
    //   // After deletion, refresh data
    //   // getChannelsWithCategories();
    // } catch (error) {
    //   console.error("Error deleting channel:", error);
    // }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    console.log("values2 are: ", values, Rowdata?.name);
    try {
      const radioCollection = collection(firestore, "channels");

      let docRef;

      console.log("ROW ID IS: ", RowID);

      if (RowID) {
        // Update the existing document in the 'Radio' collection
        docRef = doc(firestore, "channels", RowID);
        console.log("docRef is: ", docRef);
        await updateDoc(docRef, {
          name: values?.name, // Update title
          channelLink: values?.url, // Update imageUrl
          image: profileImage,
        });
        // setEditmodal(false);
        // setLoading(false);
        // showSnackbar("Book Updated Successfully", "success");
      }
      setLoading(false);
      setEditmodal(false);
      // setLoading(false);
      showSnackbar("Book Updated Successfully", "success");
    } catch (error) {
      setLoading(false);
      console.error("Error deleting channel:", error);
    } finally {
      setLoading(false);
    }

    // try {
    //   // Fetch the category object by categoryId
    //   const categoryDocRef = doc(
    //     firestore,
    //     "BlogCategoryCollection",
    //     values?.cat
    //   );
    //   const categoryDoc = await getDoc(categoryDocRef);

    //   if (!categoryDoc.exists()) {
    //     setLoading(false);
    //     throw new Error("Category not found");
    //   }

    //   const categoryData = categoryDoc.data();

    //   // Reference to the 'channels' collection
    //   const channelsCollection = collection(firestore, "BlogCollection");

    //   let docRef;

    //   if (RowID) {
    //     // Update the existing document
    //     docRef = doc(firestore, "BlogCollection", RowID);
    //     await updateDoc(docRef, {
    //       url: values?.url,
    //       category: categoryData,
    //       sub: [],
    //       download: [],
    //       star: [],
    //     });
    //     setEditmodal(false);
    //     // getChannelsWithCategories();
    //     showSnackbar("Podcast Updated Successfully", "success");
    //   }

    //   return docRef.id;
    // } catch (error) {
    //   setLoading(false);
    //   console.error("Error adding or updating channel:", error);
    //   throw error;
    // }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleEdit = (row) => {
    console.log("row is: ", row);
    setRowdata(row);
    setRowID(row?.id);
    setProfileImage(row?.image);
    setEditmodal(true);
  };

  const handleCancel = () => {
    setEditmodal(false);
  };

  useEffect(() => {
    // getChannelsWithCategories();
    getCategories();
  }, []);

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
          imageUrl={row?.image}
          circeltrue={true}
        />
      ),
      maxWidth: "7rem",
      minWidth: "2rem",
    },
    {
      name: "Channel Name",
      selector: (row) => row?.name,
      maxWidth: "10rem",
      minWidth: "7rem",
    },
    {
      name: "Channel Url",
      selector: (row) => row?.channelLink,
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
            onClick={() => handleDelete(row)}
          >
            Delete
          </button>
        </>
      ),
      maxWidth: "10rem",
      minWidth: "10rem",
    },
  ];

  const uploadImage = (courseFile) => {
    if (!courseFile) return;
    setloadingupload(true);
    const currentDate = new Date();
    const uniqueFileName = `${currentDate.getTime()}_${courseFile?.name}`;
    const imageRef = ref(storage, `ChannelsImages/${uniqueFileName}`);
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
      <Modal footer={false} open={Editmodal} centered onCancel={handleCancel}>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          // validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log("values are: ", values);
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
              // style={{ width: "40%" }}
              onSubmit={handleSubmit}
            >
              <section>
                <Form.Group
                  className="mb-2 hideFocus2"
                  controlId="formGroupEmail"
                >
                  <Form.Label className="lableHead">Eidt Channel</Form.Label>

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

                  {/* <Form.Select
                    aria-label="Default select example"
                    className="radius_12"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                  >
                    {channel.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select> */}

                  {touched.name && errors.name && (
                    <div className="errorMsg">{errors.name}</div>
                  )}

                  <Form.Label className="lableHead mt-3">
                    Add Channel Url
                  </Form.Label>
                  <Form.Control
                    className="radius_12 "
                    placeholder="Url"
                    name="url"
                    value={values.url}
                    onChange={handleChange}
                    readOnly
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
        <DataTable columns={columns} data={channel} pagination />
      )}
    </>
  );
};

export default ChannelList;
