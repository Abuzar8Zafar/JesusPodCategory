import { React, useEffect, useState } from "react";
import { Form, Spinner, Table } from "react-bootstrap";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import CustomSnackBar from "../../SnackBar/CustomSnackbar";
import { auth, firestore, storage } from "../../Firebase/Config";
import fileavatar from "../../../assets/images/profileavatar.jpg";
import { Input as InputStrap } from "reactstrap";
import { v4 as uuidv4 } from "uuid";
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
const AddBanner = () => {
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
  const [loadingupload, setloadingupload] = useState(false);
  const [loadinguploadVideo, setloadinguploadVideo] = useState(false);
  const [videoUrl, setvideoUrl] = useState("");
  const [SelectedVideo, setSelectedVideo] = useState("");
  const [PromoteUrl, setPromoteUrl] = useState("");

  const handlePromoteUrlChange = (e) => {
    setPromoteUrl(e.target.value); // Update the state with the new input value
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

  // snackbar

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    getCategories();
  }, []);

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

  const uploadVideo = (videoFile) => {
    if (!videoFile) return;

    setloadinguploadVideo(true);

    const currentDate = new Date();
    const uniqueFileName = `${currentDate.getTime()}_${videoFile?.name}`;
    const videoRef = ref(storage, `UserVideos/${uniqueFileName}`);

    uploadBytes(videoRef, videoFile)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            console.log("Video URL:", url);
            showSnackbar("Video Added Successfully", "success");
            setvideoUrl(url);
            setloadinguploadVideo(false);
          })
          .catch((error) => {
            console.error("Error getting video URL: ", error);
            setloadinguploadVideo(false);
          });
      })
      .catch((error) => {
        console.error("Error uploading video: ", error);
        setloadinguploadVideo(false);
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

  const SelectVideo = (e) => {
    const file = e.target.files[0];

    if (file) {
      uploadVideo(file);
    }

    //   // Create a video element to check dimensions
    //   const video = document.createElement("video");
    //   video.src = URL.createObjectURL(file);

    //   video.onloadedmetadata = () => {
    //     const { videoWidth, videoHeight } = video;

    //     if (videoWidth >= 1920 && videoHeight >= 1080) {
    //       // Upload if dimensions are correct
    //     } else {
    //       alert("Video must be 1920x1080.");
    //     }
    //   };
    // } else {
    //   alert("Please select a video file.");
    // }
  };
  const handleSubmit = async (value) => {
    setLoading(true);
    try {
      const uniqueId = uuidv4();

      // Reference to the 'channels' collection
      const channelsCollection = collection(firestore, "BannersCollection");

      // Add a new document with the channel details, including the category object
      const docRef = await addDoc(channelsCollection, {
        _id: uniqueId,
        imageUrl: profileImage,
        videoUrl: videoUrl,
        PromoteUrl: PromoteUrl,
        download: [],
        star: [],
      });

      navigation("/Bannerlist");

      showSnackbar("Podcast Added Sucessfully", "success");

      setLoading(false);

      return docRef.id;
    } catch (error) {
      setLoading(false);
      console.error("Error adding channel:", error);
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

      <section className="bord" style={{ width: "40%" }}>
        <Form.Group className="mb-2 hideFocus2" controlId="formGroupEmail">
          <Form.Label className="lableHead">Add Banner</Form.Label>
        </Form.Group>

        <div className="d-flex " style={{ flexDirection: "column" }}>
          <h6 className="lableHead mt-2 mb-2">Upload Image</h6>
          <div>
            <label
              style={{ cursor: "pointer", position: "relative", width: "100%" }}
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
                      borderRadius: "50%",
                      position: "relative",
                    }}
                    className="object-cover"
                  />
                </>
              ) : (
                <div
                  style={{ borderRadius: 10 }}
                  className="border  d-flex justify-content-center items-center"
                >
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

        <Form.Group className="mb-2 hideFocus2" controlId="formGroupEmail">
          <Form.Label className="lableHead">Add Promote Url</Form.Label>
          <Form.Control
            className="radius_12"
            placeholder="Enter name"
            name="cat"
            value={PromoteUrl}
            onChange={handlePromoteUrlChange}
            // value={values.cat}
            // onChange={handleChange}
          />
        </Form.Group>

        <div className="d-flex " style={{ flexDirection: "column" }}>
          <h6 className="lableHead mt-2 mb-2">Upload Video Banner</h6>
          <div>
            <label
              style={{ cursor: "pointer", position: "relative", width: "100%" }}
              htmlFor="fileInput1"
              className="cursor-pointer"
            >
              {loadinguploadVideo && (
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
              {videoUrl ? (
                <>
                  {/* <img
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
                  /> */}
                  <video width="200" height="200" controls>
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                </>
              ) : (
                <div
                  style={{ borderRadius: 10 }}
                  className="border d-flex justify-content-center items-center"
                >
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
              id="fileInput1"
              className="visually-hidden"
              onChange={SelectVideo}
            />
          </div>
        </div>

        <div className="d-flex flex-column w-50">
          <button
            onClick={handleSubmit}
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
    </>
  );
};

export default AddBanner;
