import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ImageLoader from "../../ImageLoader/ImageLoader";
import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../../Firebase/Config";
import { Form, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { Input as InputStrap } from "reactstrap";
import fileavatar from "../../../assets/images/profileavatar.jpg";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Modal } from "antd";
import axios from "axios";

const StackItem2 = ({ item }) => {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingupload, setloadingupload] = useState(false);
  const [SelectedImg, setSelectedImg] = useState("");

  const [Rowdata, setRowdata] = useState("");
  const [RowID, setRowID] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [Editmodal, setEditmodal] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = (row) => {
    console.log(Rowdata?.type);

    setRowdata(row);

    setRowID(row?.id);
    setProfileImage(row?.image);
    setEditmodal(true);
  };

  const handleCancel = () => {
    setEditmodal(false);
  };

  const initialValues = {
    name: Rowdata?.name,
    url: Rowdata?.channelLink,
    type: Rowdata?.type,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Channel name is required"),
    url: Yup.string().required("Channel url is required"),
    type: Yup.string().required("Type is required"),
  });

  const handleDelete = async (row) => {
    try {
      const channelRef = collection(firestore, "channels");
      await deleteDoc(doc(channelRef, row));
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
    // try {
    //   const response = await axios.post(
    //     "https://deletechannel-53ifvdv3fa-uc.a.run.app",
    //     {
    //       channelName: row?.name,
    //     }
    //   );
    //   console.log("Channel deleted:", response.data);
    //   //   setChannel((pre) => {
    //   //     return pre?.filter((item) => item?.name != row?.name);
    //   //   });
    // } catch (error) {
    //   console.error("Error deleting channel:", error);
    // }
  };

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

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
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
          type: values?.type,
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
  };
  return (
    <>
      <li
        className="stack-item"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            marginTop: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              width: "80%",
            }}
          >
            <ImageLoader
              classes={"tableImg"}
              imageUrl={item?.image}
              circeltrue={true}
            />
            <div>{item.name}</div>
            <div>{item.channelLink}</div>
          </div>
          <div>
            <button
              className="loginBtn2"
              style={{ cursor: "pointer", padding: "2px 10px" }}
              onClick={() => handleEdit(item)}
            >
              Edit
            </button>
            <button
              className="loginBtn2"
              style={{ cursor: "pointer", padding: "2px 10px", marginLeft: 20 }}
              onClick={() => handleDelete(item?.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </li>

      <Modal
        title="Edit Radio"
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
                  <Form.Label className="lableHead mt-3">
                    Add Channel Name
                  </Form.Label>

                  <Form.Control
                    className="radius_12 "
                    placeholder="Title"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                  />
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

                  <Form.Label className="lableHead mt-3">
                    Select Type
                  </Form.Label>
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
    </>
  );
};
export default StackItem2;
