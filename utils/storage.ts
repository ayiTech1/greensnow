// utils/storage.ts
import * as SecureStore from 'expo-secure-store';

export const secureStore = {
  async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
  async getItem(key: string) {
    return await SecureStore.getItemAsync(key);
  },
  async deleteItem(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
};