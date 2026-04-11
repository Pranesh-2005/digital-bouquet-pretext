import Image from "next/image";
import { flowers } from "../../data/data";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import Bouquet from "../bouquet/Bouquet";
import { useBouquet } from "../../context/BouquetContext";
import type { Bouquet as BouquetType } from "@/types/bouquet";
import { useState } from "react";

export default function ShareBouquet() {
  const { bouquet } = useBouquet();
  const router = useRouter();
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateBouquet = async (bouquet: BouquetType) => {
    setIsLoading(true);
    const short_id = nanoid(8);

    const { data, error } = await supabase
      .from("bouquets")
      .insert([
        {
          short_id: short_id,
          mode: bouquet.mode,
          flowers: bouquet.flowers,
          letter: bouquet.letter,
          timestamp: bouquet.timestamp,
          greenery: bouquet.greenery,
          flowerOrder: bouquet.flowerOrder,
        },
      ])
      .select();

    if (error || !data || data.length === 0) {
      console.error("Error creating bouquet:", error);
      setIsLoading(false);
      return;
    }

    const bouquetId = data[0].id;
    const fullLink = `${window.location.origin}/bouquet/${short_id}`;
    setShareLink(fullLink);
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-md uppercase text-center mb-10">SEND THE BOUQUET</h2>

      <Bouquet bouquet={bouquet} />

      {!shareLink ? (
        <button
          onClick={() => handleCreateBouquet(bouquet)}
          disabled={isLoading}
          className="uppercase text-white bg-black px-5 py-3 disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "CREATE SHAREABLE LINK"}
        </button>
      ) : (
        <div className="mt-8 p-6 bg-gray-100 rounded">
          <p className="mb-4">Your shareable link:</p>
          <div className="flex gap-2 justify-center items-center">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="px-4 py-2 border border-gray-400 rounded w-full max-w-md"
            />
            <button
              onClick={copyToClipboard}
              className="uppercase text-white bg-black px-5 py-3"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}