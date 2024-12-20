/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CustomSnackBar from "../../SnackBar/CustomSnackbar";
import { firestore, storage } from "../../Firebase/Config";
import fileavatar from "../../../assets/images/profileavatar.jpg";
import { Input as InputStrap } from "reactstrap";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Checkbox } from "antd";
import axios from "axios";

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
  const [handVideoLink, sethandVideoLink] = useState("");

  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const toggleChecked = () => {
    setChecked(!checked);
  };

  const toggleDisable = () => {
    setDisabled(!disabled);
  };

  const onChange = (e) => {
    setChecked(e.target.checked);
  };

  const handleVidoLinkChnage = (e) => {
    sethandVideoLink(e.target.value); // Update the state with the new input value
  };

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

  const uploadVideo = async (videoFile) => {
    if (!videoFile) return;
    setloadinguploadVideo(true);
    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const res = await axios.post(
        "https://pushnotinode.onrender.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setvideoUrl(res.data?.video);
      setloadinguploadVideo(false);
    } catch (error) {
      console.error(error);
      setloadinguploadVideo(false);
    }
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
  };

  const [type, setType] = useState("");
  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = async (value) => {
    setLoading(true);
    try {
      const uniqueId = uuidv4();

      const channelsCollection = collection(firestore, "BannersCollection");

      const docRef = await addDoc(channelsCollection, {
        _id: uniqueId,
        imageUrl: profileImage,
        videoUrl: videoUrl,
        PromoteUrl: checked ? handVideoLink : PromoteUrl,
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

        <div className="d-flex" style={{ flexDirection: "column" }}>
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
          <div
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h6 className="lableHead mt-2 mb-2">Upload Video Banner</h6>
            <Checkbox checked={checked} disabled={disabled} onChange={onChange}>
              Add Video Link
            </Checkbox>
          </div>
          {!checked ? (
            <>
              <div>
                <label
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    width: "100%",
                  }}
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
            </>
          ) : (
            <Form.Group className="mb-2 hideFocus2" controlId="formGroupEmail">
              <Form.Control
                className="radius_12"
                placeholder="Add Video Link"
                name="cat"
                value={handVideoLink}
                onChange={handleVidoLinkChnage}
              />
            </Form.Group>
          )}
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
