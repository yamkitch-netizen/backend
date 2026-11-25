import MenuItem from "./models/MenuItem.js";

export const defaultMenuItems = [
  // Breakfast
  { category: "breakfast", name: "Roti + Sabji", price: 26, desc: "3 Roti + Aloo Dum / Mixed Vegetables", isBase: true, sortOrder: 1 },
  { category: "breakfast", name: "Puri + Sabji", price: 26, desc: "4 Puri + Aloo Dum / Mixed Vegetables", isBase: true, sortOrder: 2 },
  { category: "breakfast", name: "Roti + Tadka", price: 37, desc: "3 Roti + Egg Tadka", isBase: true, sortOrder: 3 },
  { category: "breakfast", name: "Puri + Tadka", price: 37, desc: "4 Puri + Egg Tadka", isBase: true, sortOrder: 4 },
  { category: "breakfast", name: "Plain Maggi", price: 40, desc: "Plain Maggi with butter", isBase: false, sortOrder: 5 },
  { category: "breakfast", name: "Egg Maggi", price: 59, desc: "Egg Maggi with butter", isBase: false, sortOrder: 6 },
  { category: "breakfast", name: "Half Boiled Omelette", price: 15, desc: "Soft-runny omelette", isBase: false, sortOrder: 7 },
  { category: "breakfast", name: "Half Boiled Egg", price: 12, desc: "1 soft-boiled egg", isBase: false, sortOrder: 8 },
  { category: "breakfast", name: "Proper Boiled Omelette", price: 15, desc: "Fully cooked omelette", isBase: false, sortOrder: 9 },
  { category: "breakfast", name: "Salad", price: 59, desc: "Fresh green salad", isBase: false, sortOrder: 10 },

  // Lunch
  { category: "lunch", name: "Plain Meal (Lunch)", price: 59, desc: "Plain Rice + Dal + Vegetable Fry", isBase: true, sortOrder: 1 },
  { category: "lunch", name: "Mixed / Seasonal Vegetables (Lunch)", price: 19, desc: "Aloo Dum / Mixed Vegetables & others", isBase: false, sortOrder: 2 },
  { category: "lunch", name: "Omelette (Lunch)", price: 15, desc: "Chicken", isBase: false, sortOrder: 3 },
  { category: "lunch", name: "Egg Tadka (Lunch)", price: 30, desc: "Chicken", isBase: false, sortOrder: 4 },
  { category: "lunch", name: "Chicken Curry (Lunch)", price: 59, desc: "with Butter (4 Pieces + 1 Potato)", isBase: false, sortOrder: 5 },
  { category: "lunch", name: "Paneer Curry (Lunch)", price: 59, desc: "Paneer with butter gravy", isBase: false, sortOrder: 6 },
  { category: "lunch", name: "Chicken Dum Biryani (Lunch)", price: 119, desc: "(1 Chicken Piece + 1 Potato + 1 Boiled Egg)", isBase: false, sortOrder: 7 },

  // Dinner
  { category: "dinner", name: "Plain Meal (Dinner)", price: 59, desc: "Plain Rice + Dal + Vegetable Fry", isBase: true, sortOrder: 1 },
  { category: "dinner", name: "Mixed / Seasonal Vegetables (Dinner)", price: 19, desc: "Aloo Dum / Mixed Vegetables & others", isBase: false, sortOrder: 2 },
  { category: "dinner", name: "Omelette (Dinner)", price: 15, desc: "Chicken", isBase: false, sortOrder: 3 },
  { category: "dinner", name: "Egg Tadka (Dinner)", price: 30, desc: "Chicken", isBase: false, sortOrder: 4 },
  { category: "dinner", name: "Chicken Curry (Dinner)", price: 59, desc: "with Butter (4 Pieces + 1 Potato)", isBase: false, sortOrder: 5 },
  { category: "dinner", name: "Paneer Curry (Dinner)", price: 59, desc: "Paneer with butter gravy", isBase: false, sortOrder: 6 },
  { category: "dinner", name: "Chicken Dum Biryani (Dinner)", price: 119, desc: "(1 Chicken Piece + 1 Potato + 1 Boiled Egg)", isBase: false, sortOrder: 7 },
];

export async function seedMenuIfEmpty() {
  const count = await MenuItem.countDocuments();
  if (count === 0) {
    await MenuItem.insertMany(defaultMenuItems);
    console.log(`Seeded ${defaultMenuItems.length} default menu items.`);
  }
}
