/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import ImageLoader from "../../ImageLoader/ImageLoader";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { auth, firestore } from "../../Firebase/Config";

const ListCategory = () => {
  const [channelLoading, setChannelLoading] = useState(false);
  const [Chanalsdata, setChanalsdata] = useState([]);

  const getChannelsWithCategories = async () => {
    setChannelLoading(true);
    try {
      const channelsCollection = collection(firestore, "Newchannels");
      const channelsSnapshot = await getDocs(channelsCollection);
      const channels = channelsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChanalsdata(channels);
      setChannelLoading(false);
    } catch (error) {
      console.error("Error fetching channels with categories:", error);
      setChannelLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    getChannelsWithCategories();
  }, []);

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
      name: "Title",
      selector: (row) => row?.title,
      maxWidth: "10rem",
      minWidth: "4rem",
    },
    {
      name: "Cat Name",
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
        <button
          className="loginBtn2"
          style={{ cursor: "pointer", padding: "2px 10px" }}
          onClick={() => handleDelete(row.id)}
        >
          Delete
        </button>
      ),
      maxWidth: "7rem",
      minWidth: "2rem",
    },
  ];

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
        <DataTable columns={columns} data={Chanalsdata} pagination />
      )}
    </>
  );
};

export default ListCategory;
