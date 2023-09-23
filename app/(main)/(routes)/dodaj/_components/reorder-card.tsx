"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

import React from "react";

interface Props {
  attributeName: string;
  attributeValue: string;
}

const ReorderCard = ({ attributeName, attributeValue }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <p className="text-lg font-semibold">{attributeName}</p>
      <p className="text-lg font-semibold">{attributeValue}</p>
    </div>
  );
};

export default ReorderCard;
