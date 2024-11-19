/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

import { collection, doc, getDocs } from "firebase/firestore";

import { firestore } from "../../Firebase/Config";
import { writeBatch } from "firebase/firestore";
import axios from "axios";

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
import StackItem from "./StackItem";
import StackItem2 from "./SlackItem2";

const RadioList = () => {
  const [Chanalsdata, setChanalsdata] = useState([]);
  const [ChanalsSortedData, setChanalsSortedData] = useState([]);
  const [channelLoading, setChannelLoading] = useState(true);
  const [sortValue, setSortValue] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const sensors = [
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  ];

  const getChannelsWithCategories = async () => {
    setChannelLoading(true);
    try {
      const channelsCollection = collection(firestore, "channels");
      const channelsSnapshot = await getDocs(channelsCollection);
      const channels = channelsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.order - b.order); // Sort by the order field
      console.log("CHANNELS ARE ===> ", channels);
      setChanalsSortedData(channels);
      setChanalsdata(channels);
      setChannelLoading(false);
      // const response = await axios.post(
      //   "https://getchannels-53ifvdv3fa-uc.a.run.app"
      // );
      // console.log("Channels data:", response.data?.channels);
      // setChanalsdata(response.data?.channels);
      // setChannelLoading(false);
    } catch (error) {
      console.error("Error getting channels:", error);
      setChannelLoading(false);
      throw error;
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

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
        const itemRef = doc(firestore, "channels", item.id);
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

  const handleSortToggle = () => {
    // Cycle through 1 -> 2 -> 1 when pressed
    console.log("here");
    const sortedData = [...ChanalsSortedData].sort((a, b) => {
      const firstLetterA = a?.name?.charAt(0).toLowerCase();
      const firstLetterB = b?.name?.charAt(0).toLowerCase();

      if (sortValue === "asc") {
        return firstLetterA < firstLetterB
          ? -1
          : firstLetterA > firstLetterB
          ? 1
          : 0;
      } else {
        return firstLetterA > firstLetterB
          ? -1
          : firstLetterA < firstLetterB
          ? 1
          : 0;
      }
    });
    setChanalsSortedData(sortedData);
    setSortValue((prevValue) => (prevValue === "asc" ? "desc" : "asc"));
  };

  const SortAscendingIcon = ({ size = 24, color = "black" }) => (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill={color}
      onClick={handleSortToggle}
    >
      <path d="M7 14l5-5 5 5H7z"></path>
    </svg>
  );

  // Sort Descending Icon (Down Arrow)
  const SortDescendingIcon = ({ size = 24, color = "black" }) => (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill={color}
      onClick={handleSortToggle}
    >
      <path d="M7 10l5 5 5-5H7z"></path>
    </svg>
  );

  useEffect(() => {
    getChannelsWithCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        const sortedData = Chanalsdata?.filter((item, index) =>
          item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        );
        setChanalsSortedData(sortedData);
      } else setChanalsSortedData(Chanalsdata);
      // const sortedData = Chanalsdata?.filter((item, index) =>
      //   item?.title?.toLowerCase()?.includes(searchQuery?.toLocaleLowerCase)
      // );
      // setChanalsSortedData(sortedData);
    }, 500);

    return () => {
      clearTimeout(timer); // Clear the timer on cleanup
    };
  }, [searchQuery, Chanalsdata]);

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
          <div className="cat-input-con">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for channels"
              className="cat-input"
            />
            {sortValue === "asc" ? (
              <SortAscendingIcon size={24} color="black" />
            ) : (
              <SortDescendingIcon size={24} color="black" />
            )}
          </div>
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
                items={ChanalsSortedData}
                strategy={verticalListSortingStrategy}
              >
                {ChanalsSortedData.map((item, index) => (
                  <StackItem2 key={item?._id} item={item} />
                ))}
              </SortableContext>
            </ul>
          </DndContext>
        </>
      )}
    </>
  );
};

export default RadioList;
