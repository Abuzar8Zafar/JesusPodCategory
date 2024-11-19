/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

import { collection, doc, getDocs } from "firebase/firestore";

import { firestore } from "../../Firebase/Config";
import { writeBatch } from "firebase/firestore";

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
import SlackItem5 from "./SlackItem5";

const TelivsionList = () => {
  const [Chanalsdata, setChanalsdata] = useState([]);
  const [channelLoading, setChannelLoading] = useState(true);

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
      const channelsCollection = collection(firestore, "Telivision");
      const channelsSnapshot = await getDocs(channelsCollection);
      const channels = channelsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.order - b.order); // Sort by the order field

      setChanalsdata(channels);
      setChannelLoading(false);
    } catch (error) {
      console.error("Error fetching channels with categories:", error);
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
        const itemRef = doc(firestore, "Telivision", item.id);
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

  useEffect(() => {
    getChannelsWithCategories();
  }, []);

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
                <SlackItem5 key={item?._id} item={item} />
              ))}
            </SortableContext>
          </ul>
        </DndContext>
      )}
    </>
  );
};

export default TelivsionList;
