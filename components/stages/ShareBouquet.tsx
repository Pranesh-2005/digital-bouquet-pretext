"use client";

import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";
import Bouquet from "../bouquet/Bouquet";
import { useBouquet } from "../../context/BouquetContext";
import type { Bouquet as BouquetType } from "@/types/bouquet";
import { useState, useRef, useCallback } from "react";

export default function ShareBouquet() {
  const { bouquet } = useBouquet();

  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const bouquetRef = useRef<HTMLDivElement>(null);

  const handleCreateBouquet = async (b: BouquetType) => {
    setIsLoading(true);
    const short_id = nanoid(8);

    const { data, error } = await supabase
      .from("bouquets")
      .insert([{
        short_id,
        mode: b.mode,
        flowers: b.flowers,
        letter: b.letter,
        timestamp: b.timestamp,
        greenery: b.greenery,
        flowerOrder: b.flowerOrder ?? [],
      }])
      .select();

    if (error || !data || data.length === 0) {
      console.error("Error creating bouquet:", error);
      setIsLoading(false);
      return;
    }

    setShareLink(`${window.location.origin}/bouquet/${short_id}`);
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  };

const handleSavePng = useCallback(async () => {
  if (!bouquetRef.current) return;
  setIsSaving(true);

  try {
    const domToImage = (await import("dom-to-image-more")).default;
    document.body.classList.add("clean-capture");
    await document.fonts.ready;
    await new Promise((r) => requestAnimationFrame(r));
    const imgs = Array.from(bouquetRef.current.querySelectorAll("img"));
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((res) => {
              img.onload = () => res();
              img.onerror = () => res();
            })
      )
    );

    const node = bouquetRef.current;
    const rect = node.getBoundingClientRect();

    const dataUrl = await domToImage.toPng(node, {
      width: rect.width,
      height: rect.height + 60,
      bgcolor: "#F5F5DC",
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
        isolation: "isolate",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
      },

      cacheBust: true,
    });

    const link = document.createElement("a");

    const safeName =
      bouquet.letter.recipient?.replace(/\s+/g, "-") || "bouquet";

    link.download = `digibouquet-${safeName}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("PNG export failed:", err);
    alert("Failed to save PNG. Please try again.");
  } finally {
    setIsSaving(false);
    document.body.classList.remove("clean-capture");
  }
}, [bouquet]);

  return (
    <div className="text-center">
      <h2 className="text-md uppercase text-center mb-10">SEND THE BOUQUET</h2>

      {/*
        padding-bottom-16 gives the -translate-y-[50px] letter card room
        to render within the ref div's bounding box.
        overflow-visible ensures it isn't clipped by the parent.
      */}
      <div
        ref={bouquetRef}
        className="inline-block pb-16"
        style={{ overflow: "visible" }}
      >
        <Bouquet bouquet={bouquet} />
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <button
          onClick={handleSavePng}
          disabled={isSaving}
          className="uppercase text-black bg-white border border-black px-5 py-3 disabled:opacity-50"
        >
          {isSaving ? "SAVING..." : "SAVE AS PNG"}
        </button>

        {!shareLink ? (
          <button
            onClick={() => handleCreateBouquet(bouquet)}
            disabled={isLoading}
            className="uppercase text-white bg-black px-5 py-3 disabled:opacity-50"
          >
            {isLoading ? "CREATING..." : "CREATE SHAREABLE LINK"}
          </button>
        ) : (
          <div className="mt-4 p-6 bg-gray-100 rounded w-full max-w-md">
            <p className="mb-4">Your shareable link:</p>
            <div className="flex gap-2 justify-center items-center">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="px-4 py-2 border border-gray-400 rounded w-full"
              />
              <button
                onClick={copyToClipboard}
                className="uppercase text-white bg-black px-5 py-3"
              >
                COPY
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}