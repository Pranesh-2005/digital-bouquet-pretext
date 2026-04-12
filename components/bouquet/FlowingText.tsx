"use client";

import { useMemo } from "react";
import {
  prepareWithSegments,
  layoutNextLineRange,
  materializeLineRange,
} from "@chenglou/pretext";

const LINE_HEIGHT = 20;
const MAX_WIDTH = 300;

export default function FlowingText({ text }: { text: string }) {
  const lines = useMemo(() => {
    if (!text) return [];

    const prepared = prepareWithSegments(text, "14px serif", {
      whiteSpace: "pre-wrap",
    });

    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let y = 0;

    const result: { text: string; y: number; left: number }[] = [];

    while (true) {
      const { width, left } = getLineLayout(y);

      const range = layoutNextLineRange(prepared, cursor, width);
      if (!range) break;

      const line = materializeLineRange(prepared, range);

      result.push({ text: line.text, y, left });

      cursor = range.end;
      y += LINE_HEIGHT;
    }

    return result;
  }, [text]);

  return (
    <div className="relative w-full h-full">
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: line.y,
            left: line.left,
            whiteSpace: "nowrap",
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}

/**
 * 🌸 SIMPLE BOUQUET SHAPE (Phase 1)
 */
function getLineLayout(y: number) {
  const MAX_WIDTH = 300;

  if (y < 60) {
    return { width: 160, left: 70 }; // narrow center
  }

  if (y < 140) {
    return { width: 220, left: 40 }; // medium
  }

  return { width: 300, left: 0 }; // full
}