"use client";

import Image from "next/image";
import { flowers } from "@/data/data";

export default function BouquetCustomizer({
  bouquet,
  setBouquet,
}: {
  // Simplified bouquet state - just flower IDs and counts
  bouquet: {
    flowers: Array<{
      id: number;
      count: number;
    }>;
    letter: {
      sender: string;
      recipient: string;
      message: string;
    };
    greenery: number;
    timestamp: number;
    mode: string;
    flowerOrder: number[];
  };
  // Function to update the bouquet state
  // Mode parameter - can be "mono" or "full" for different styling/behavior
  setBouquet: React.Dispatch<
    React.SetStateAction<{
      flowers: Array<{ id: number; count: number }>;
      greenery: number;
      timestamp: number;
      mode: string;
      flowerOrder: number[];
      letter: {
        sender: string;
        recipient: string;
        message: string;
      };
    }>
  >;
}) {
  // Function to randomize the arrangement of flowers
  const randomizeFlowers = () => {
    // Calculate total number of individual flowers (not flower types)
    const totalFlowers = bouquet.flowers.reduce(
      (sum, flower) => sum + flower.count,
      0
    );
    // Create an array of indices from 0 to totalFlowers-1
    const indices = Array.from({ length: totalFlowers }, (_, i) => i);

    // Fisher-Yates shuffle algorithm to randomize the order
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setBouquet((prev) => ({
      ...prev,
      flowerOrder: indices,
    }));
  };

  const changeGreenery = () => {
    setBouquet((prev) => ({
      ...prev,
      greenery: (prev.greenery + 1) % 3,
    }));
  };

  // Helper function to get flower dimensions based on size
  const getFlowerDimensions = (size: string) => {
    switch (size) {
      case "small":
        return 80;
      case "large":
        return 160;
      default:
        return 120; // medium
    }
  };

  return (
    <div className="flex flex-col max-w-screen-lg mx-auto">
      {/* Left sidebar - contains customization controls */}
      <div className=" p-6">
        <h2 className="text-md uppercase text-center mb-6">
          Customize Your Bouquet
        </h2>
        <div className="space-y-4 flex flex-col items-center justify-center">
          {/* Randomize button - shuffles the flower arrangement */}
          <button
            onClick={randomizeFlowers}
            className="uppercase text-white bg-black px-5 py-3"
          >
            Try a new Arrangement
          </button>
          <button
            onClick={changeGreenery}
            className="uppercase text-black border border-black px-5 py-3"
          >
            Change Greenery
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center relative py-4 my-16">
        <div className="relative w-[500px] min-h-[410px]">
          {/* Bush background images - positioned absolutely to stay fixed */}
          {/* Bottom bush layer */}

          <Image
            src={`/${bouquet.mode}/bush/bush-${bouquet.greenery + 1}.png`}
            alt="bush background"
            width={600}
            height={500}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"
            priority
          />

          {/* Flower container - flowers can move around within this area */}

          <div className="flex flex-wrap reverse w-[300px] justify-center items-center -space-x-4 -space-y-20 relative m-auto">
            {/* Map through each flower type and create individual flower instances */}
            {bouquet.flowers.flatMap(
              (flower: { id: number; count: number }, flowerIndex: number) => {
                // Get flower data from the imported flowers array
                const flowerData = flowers.find((f) => f.id === flower.id);
                if (!flowerData) return [];

                // For each flower type, create the specified number of instances
                return Array(flower.count)
                  .fill(null)
                  .map((_, instanceIndex) => {
                    // Generate random rotation for each flower (-5 to +5 degrees)
                    const rotation = Math.random() * 10 - 5;

                    // Determine the visual order of this flower instance
                    // If flowerOrder has values, use it; otherwise use default order
                    const index =
                      bouquet.flowerOrder.length > 0
                        ? bouquet.flowerOrder[
                            flowerIndex * flower.count + instanceIndex
                          ] ?? flowerIndex * flower.count + instanceIndex
                        : flowerIndex * flower.count + instanceIndex;

                    // Get dimensions based on flower size
                    const dimensions = getFlowerDimensions(flowerData.size);

                    return (
                      <div
                        key={`${flowerIndex}-${instanceIndex}`}
                        className="flex items-center justify-center pt-4 relative"
                        style={{ order: index }} // CSS order property controls visual arrangement
                      >
                        {/* Individual flower image */}
                        <Image
                          src={`${bouquet.mode}/flowers/${flowerData.name}.png`}
                          alt={flowerData.name}
                          width={dimensions}
                          height={dimensions}
                          className="relative z-10 transition-transform hover:scale-105"
                          style={{ transform: `rotate(${rotation}deg)` }} // Apply random rotation
                          priority
                        />
                      </div>
                    );
                  });
              }
            )}
          </div>

          {/* Top bush layer */}

          <div>
            <Image
              src={`/${bouquet.mode}/bush/bush-${bouquet.greenery + 1}-top.png`}
              alt="bush top"
              width={600}
              height={500}
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
