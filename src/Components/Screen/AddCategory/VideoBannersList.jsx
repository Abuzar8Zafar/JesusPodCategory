/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Form, Table } from "react-bootstrap";
import DataTable from "react-data-table-component";
import ImageLoader from "../../ImageLoader/ImageLoader";
import { writeBatch } from "firebase/firestore";
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

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Input as InputStrap } from "reactstrap";

import { auth, firestore, storage } from "../../Firebase/Config";
import { Modal } from "antd";
import { v4 as uuidv4 } from "uuid";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import CustomSnackbar from "../../SnackBar/CustomSnackbar";
import StackItem4 from "./SlackItem4";
import fileavatar from "../../../assets/images/profileavatar.jpg";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const VideoBannerslist = () => {
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

  const sensors = [
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  ];

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    console.log("ACTIVE, OVER ==> ", active, over);

    if (active.id !== over.id) {
      setChanalsdata((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Reorder the array
        const reorderedItems = arrayMove(items, oldIndex, newIndex);

        // Update Firestore with new order
        updateAllItems(reorderedItems);

        return reorderedItems;
      });
    }
  };

  const updateAllItems = async (items) => {
    const batch = writeBatch(firestore);

    try {
      items.forEach((item, index) => {
        const itemRef = doc(firestore, "VideoBannersCollection", item.id);
        batch.update(itemRef, { order: index + 1 });
      });

      await batch.commit();
      console.log("All items updated successfully in Firestore!");

      // Re-fetch data after updating
      await getChannelsWithCategories(); // Re-fetch data to reflect updates
    } catch (error) {
      console.error("Error updating items in Firestore:", error);
    }
  };

  const getCategories = async () => {
    // try {
    //   // Reference to the 'category' collection
    //   const categoryCollection = collection(
    //     firestore,
    //     "BlogCategoryCollection"
    //   );
    //   // Fetch all documents in the collection
    //   const categorySnapshot = await getDocs(categoryCollection);
    //   // Extract data from each document
    //   const categories = categorySnapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));
    //   // Log and return the categories
    //   setCat(categories);
    //   return categories;
    // } catch (error) {
    //   console.error("Error fetching categories:", error);
    //   throw error;
    // }
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

  const getChannelsWithCategories = async () => {
    setChannelLoading(true);
    try {
      const channelsCollection = collection(
        firestore,
        "VideoBannersCollection"
      );
      const channelsSnapshot = await getDocs(channelsCollection);
      const channels = channelsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.order - b.order);
      console.log(channels);

      setChanalsdata(channels);
      setChannelLoading(false);
    } catch (error) {
      console.error("Error fetching channels with categories:", error);
      setChannelLoading(false);
      throw error;
    }
  };

  const getCategoryIDByName = (name) => {
    const category = Cat.find((category) => category.name === name);
    return category?.id;
  };

  const initialValues = {
    cat: getCategoryIDByName(Rowdata?.category?.name),
    url: Rowdata?.url,
  };

  const validationSchema = Yup.object().shape({
    cat: Yup.string().required("Category name is required"),
    url: Yup.string().required("Feed url is required"),
  });

  const handleDelete = async (id) => {
    try {
      const channelRef = collection(firestore, "VideoBannersCollection");
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

      // Reference to the 'channels' collection
      const channelsCollection = collection(
        firestore,
        "VideoBannersCollection"
      );

      let docRef;

      if (RowID) {
        // Update the existing document
        docRef = doc(firestore, "BannersCollection", RowID);
        await updateDoc(docRef, {
          imageUrl: profileImage,
          download: [],
          star: [],
        });
        setEditmodal(false);
        getChannelsWithCategories();
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
      maxWidth: "50rem",
      minWidth: "2rem",
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
          <DndContext
            modifiers={[
              restrictToFirstScrollableAncestor,
              restrictToVerticalAxis,
            ]}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <ul className="stack-group">
              <SortableContext
                items={Chanalsdata}
                strategy={verticalListSortingStrategy}
              >
                {Chanalsdata.map((item, index) => (
                  <StackItem4 key={item?._id} item={item} />
                ))}
              </SortableContext>
            </ul>
          </DndContext>
        </>
      )}
    </>
  );
};

export default VideoBannerslist;
