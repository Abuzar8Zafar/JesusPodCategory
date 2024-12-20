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

const StackItem5 = ({ item }) => {
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
    console.log(row);

    setRowdata(row);
    setRowID(row?.id);
    setProfileImage(row?.imageUrl);
    setEditmodal(true);
  };

  const handleCancel = () => {
    setEditmodal(false);
  };

  const initialValues = {
    title: item?.title,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
  });

  const handleDelete = async (id) => {
    try {
      const channelRef = collection(firestore, "Countries");
      await deleteDoc(doc(channelRef, id));
      // After deletion, refresh data
      // getChannelsWithCategories();
    } catch (error) {
      console.error("Error deleting channel:", error);
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

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const radioCollection = collection(firestore, "Countries");
      let docRef;
      if (RowID) {
        docRef = doc(firestore, "Countries", RowID);
        await updateDoc(docRef, {
          title: values?.title,
          imageUrl: profileImage,
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
              imageUrl={item?.imageUrl}
              circeltrue={true}
            />
            <div>{item.title}</div>
            <div>{item.category}</div>
            <div
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                width: "50%",
                overflow: "hidden",
              }}
            >
              {item.url}
            </div>
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
export default StackItem5;
