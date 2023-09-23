"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Trash } from "lucide-react";

import React from "react";

interface Props {
  attributes: Record<string, string>[];
  onReorder: (
    updateData: { propertyName: string; propertyValue: string }[]
  ) => void;
}

const ReorderCard = ({ attributes, onReorder }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(attributes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedAttributes = items.slice(startIndex, endIndex + 1);

    // @ts-ignore
    onReorder(items);
  };

  const onDelete = (propertyName: string) => {
    const updatedAttributes = attributes.filter(
      (attribute) => attribute.propertyName !== propertyName
    );

    // @ts-ignore
    onReorder(updatedAttributes);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="attributes">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {attributes.map((attribute, index) => (
              <Draggable
                key={attribute.propertyName}
                draggableId={attribute.propertyName}
                index={index}
              >
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps}>
                    <div
                      className="grid grid-cols-2 gap-y-2 px-2 py-3 hover:bg-slate-300 bg-slate-500 rounded-xl transition "
                      {...provided.dragHandleProps}
                    >
                      <div className="flex flex-row items-center justify-between mr-5">
                        <Grip className="h-5 w-5" />
                        {attribute.propertyName}
                      </div>
                      <div className="flex flex-row items-center justify-between ml-5 ">
                        {attribute.propertyValue}
                        <Trash
                          onClick={() => onDelete(attribute.propertyName)}
                          className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ReorderCard;
