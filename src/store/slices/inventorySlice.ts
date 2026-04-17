import { StateCreator } from 'zustand';
import { GameState } from '../types';
import { initialState, getItemPickupLimit, RECIPE_LOOKUP } from '../initialState';
import { audio } from '../../audio';

export interface InventorySlice {
  inventory: string[];
  inventoryCounts: Record<string, number>;
  addToInventory: (item: string) => boolean;
  removeFromInventory: (item: string) => void;
  hasItem: (item: string) => boolean;
  canPickupItem: (item: string) => boolean;
  itemPickupCounts: Record<string, number>;
  combineItems: (item1: string, item2: string) => boolean;
}

export const createInventorySlice: StateCreator<GameState, [], [], InventorySlice> = (
  set,
  get,
) => ({
  inventory: initialState.inventory,
  inventoryCounts: initialState.inventoryCounts,
  itemPickupCounts: initialState.itemPickupCounts,
  addToInventory: (item) => {
    let didAdd = false;
    set((state) => {
      const pickedCount = state.itemPickupCounts[item] ?? 0;
      const pickupLimit = getItemPickupLimit(item);

      if (pickedCount >= pickupLimit) {
        return state;
      }

      didAdd = true;
      const newInventoryCounts = Object.assign(Object.create(null), state.inventoryCounts);
      newInventoryCounts[item] = (state.inventoryCounts[item] ?? 0) + 1;

      const newItemPickupCounts = Object.assign(Object.create(null), state.itemPickupCounts);
      newItemPickupCounts[item] = pickedCount + 1;

      return {
        inventory: [...state.inventory, item],
        inventoryCounts: newInventoryCounts,
        itemPickupCounts: newItemPickupCounts,
      };
    });
    if (didAdd) {
      audio.playPickup();
    }
    return didAdd;
  },
  removeFromInventory: (item) => {
    set((state) => {
      const index = state.inventory.indexOf(item);
      if (index !== -1) {
        const newInventory = [...state.inventory];
        newInventory.splice(index, 1);
        const newCounts = Object.assign(Object.create(null), state.inventoryCounts);
        if (newCounts[item] > 1) {
          newCounts[item]--;
        } else {
          delete newCounts[item];
        }
        return { inventory: newInventory, inventoryCounts: newCounts };
      }
      console.warn(`Attempted to remove item from inventory that does not exist: ${item}`);
      return state;
    });
  },
  hasItem: (item) => (get().inventoryCounts[item] ?? 0) > 0,
  canPickupItem: (item) => {
    const state = get();
    const pickedCount = state.itemPickupCounts[item] ?? 0;
    return pickedCount < getItemPickupLimit(item);
  },
  combineItems: (item1, item2) => {
    const key = item1 < item2 ? `${item1}|${item2}` : `${item2}|${item1}`;
    const recipe = RECIPE_LOOKUP[key];

    if (!recipe) return false;

    const inv = get().inventory;
    const idx1 = inv.indexOf(item1);
    const idx2 = inv.indexOf(item2, item1 === item2 ? idx1 + 1 : 0);

    if (idx1 === -1 || idx2 === -1) return false;

    set((state) => {
      const newInventory = [...state.inventory];
      const i1 = newInventory.indexOf(item1);
      const i2 = newInventory.indexOf(item2, item1 === item2 ? i1 + 1 : 0);

      const higher = Math.max(i1, i2);
      const lower = Math.min(i1, i2);

      newInventory.splice(higher, 1);
      newInventory.splice(lower, 1);
      newInventory.push(recipe.result);

      const newCounts = Object.assign(Object.create(null), state.inventoryCounts);
      if (newCounts[item1] > 1) {
        newCounts[item1]--;
      } else {
        delete newCounts[item1];
      }
      if (newCounts[item2] > 1) {
        newCounts[item2]--;
      } else {
        delete newCounts[item2];
      }
      newCounts[recipe.result] = (newCounts[recipe.result] ?? 0) + 1;

      return {
        inventory: newInventory,
        inventoryCounts: newCounts,
        ...(recipe.flagToSet && {
          flags: { ...state.flags, [recipe.flagToSet]: true },
        }),
      };
    });

    audio.playPickup();
    return true;
  },
});
