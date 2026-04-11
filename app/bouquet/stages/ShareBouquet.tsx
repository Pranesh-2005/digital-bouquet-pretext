import Image from "next/image";
import { flowers } from "@/data/data";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import Bouquet from "../components/Bouquet";

export default function ShareBouquet({
  bouquet,
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
}) {
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

  const router = useRouter();

  const handleCreateBouquet = async (bouquet: {
    mode: string;
    flowers: Array<{ id: number; count: number }>;
    letter: {
      sender: string;
      recipient: string;
      message: string;
    };
    timestamp: number;
    greenery: number;
    flowerOrder: number[];
  }) => {
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
      .select(); // returns inserted row(s)

    if (error || !data || data.length === 0) {
      console.error("Error creating bouquet:", error);
      return;
    }

    const bouquetId = data[0].id;
    router.push(`/bouquet/${bouquetId}`);
  };

  return (
    <div className="text-center">
      <h2 className="text-md uppercase text-center mb-10">SEND THE BOUQUET</h2>

      <Bouquet bouquet={bouquet} />
      <button
        onClick={() => {
          console.log("Sending bouquet");
          handleCreateBouquet(bouquet);
        }}
        className="uppercase text-white bg-black px-5 py-3"
      >
        CREATE SHAREABLE LINK
      </button>
    </div>
  );
}
