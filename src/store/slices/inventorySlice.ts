import { StateCreator } from 'zustand';
import { GameState } from '../types';
import { initialState, getItemPickupLimit, RECIPE_LOOKUP } from '../initialState';
import { audio } from '../../audio';

export interface InventorySlice {
  inventory: string[];
  inventoryCounts: Record<string, number>;
  addToInventory: (item: string) => boolean;
  removeFromInventory: (item: string) => void;
  removeItemsFromInventory: (items: string[]) => void;
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
  removeItemsFromInventory: (items) => {
    if (!items || items.length === 0) return;

    const inventoryCounts = get().inventoryCounts;
    let hasAnyToRemove = false;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item !== undefined && (inventoryCounts[item] ?? 0) > 0) {
        hasAnyToRemove = true;
        break;
      }
    }

    if (!hasAnyToRemove) {
      const uniqueFailedItems = new Set(items);
      uniqueFailedItems.forEach((item) => {
        if (item !== undefined) {
          console.warn('Attempted to remove item from inventory that does not exist: ' + item);
        }
      });
      return;
    }

    set((state) => {
      // ⚡ Bolt Optimization: Transitioned O(M * N) array scan with splice/indexOf
      // to O(M + N) frequency map approach to prevent redundant shifts.
      // Expected impact: Eliminates O(N^2) overhead during multiple item removals.
      const removeCounts: Record<string, number> = Object.create(null);
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item !== undefined) {
          removeCounts[item] = (removeCounts[item] || 0) + 1;
        }
      }

      let changed = false;
      const newInventory: string[] = [];
      const newCounts = Object.assign(Object.create(null), state.inventoryCounts);

      for (let i = 0; i < state.inventory.length; i++) {
        const item = state.inventory[i];
        if (item === undefined) continue;

        if (removeCounts[item] && removeCounts[item] > 0) {
          changed = true;
          removeCounts[item]--;
          if (newCounts[item] > 1) {
            newCounts[item]--;
          } else {
            delete newCounts[item];
          }
        } else {
          newInventory.push(item);
        }
      }

      for (const item in removeCounts) {
        if (removeCounts[item] && removeCounts[item] > 0) {
          console.warn(`Attempted to remove item from inventory that does not exist: ${item}`);
        }
      }

      return changed ? { inventory: newInventory, inventoryCounts: newCounts } : state;
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
