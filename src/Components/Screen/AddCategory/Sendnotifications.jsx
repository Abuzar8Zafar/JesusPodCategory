import { React, useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import CustomSnackBar from "../../SnackBar/CustomSnackbar";
import { firestore } from "../../Firebase/Config";
import axios from "axios";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const Sendnotifications = () => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const initialValues = {
    cat: "",
    body: "", // Added body field
  };

  const validationSchema = Yup.object().shape({
    cat: Yup.string().required(" Title is required"),
    body: Yup.string().required("Body text is required"), // Added validation for body
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let body = {
        title: values.cat,
        body: values.body,
      };
      const res = await axios.post(
        "https://pushnoti.vercel.app/sendNotification",
        body
      );
      if (res.status === 200) {
        const uniqueId = uuidv4();
        const channelsCollection = collection(firestore, "notifications");
        const docRef = await addDoc(channelsCollection, {
          _id: uniqueId,
          title: values.cat,
          body: values.body,
          timestamp: serverTimestamp(),
        });

        alert("Sended Successfully", "success");
        setLoading(false);
        return docRef.id;
      }
    } catch (error) {
      setLoading(false);
      console.error("Error adding category", error);
      showSnackbar("Error adding category", "error");
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
        onSubmit={handleSubmit}
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
                <Form.Label className="lableHead">
                  Send Notifications to all
                </Form.Label>
                <Form.Control
                  className="radius_12"
                  placeholder="Enter Title"
                  name="cat"
                  value={values.cat}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.cat && errors.cat && (
                  <div className="errorMsg">{errors.cat}</div>
                )}

                <Form.Control
                  as="textarea" // Changed to textarea
                  className="radius_12"
                  style={{ marginTop: "10px", height: "100px" }}
                  placeholder="Enter Body"
                  name="body" // Changed to body
                  value={values.body} // Changed to body
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.body && errors.body && (
                  <div className="errorMsg">{errors.body}</div> // Error for body
                )}
              </Form.Group>

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

export default Sendnotifications;
