import type { BouquetFlower } from "@/types/bouquet";

export function generateDefaultFlowerOrder(flowers: BouquetFlower[]): number[] {
  const totalFlowers = flowers.reduce((sum, flower) => sum + flower.count, 0);
  return Array.from({ length: totalFlowers }, (_, i) => i);
}

export function createFlowerCountMap(
  flowers: BouquetFlower[]
): Record<number, number> {
  const map: Record<number, number> = {};
  flowers.forEach((flower) => {
    map[flower.id] = flower.count;
  });
  return map;
}

export function calculateTotalFlowers(flowers: BouquetFlower[]): number {
  return flowers.reduce((sum, flower) => sum + flower.count, 0);
}

export function validateFlowerCount(flowers: BouquetFlower[]): boolean {
  const total = calculateTotalFlowers(flowers);
  return total >= 6 && total <= 10;
}
