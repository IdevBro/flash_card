// src/hooks/useLocalStorage.js
import { useState, useEffect } from "react";

// Ma'lumotni LocalStorage'dan oladigan funksiya
function getStoredValue(key, initialValue) {
  try {
    const item = window.localStorage.getItem(key);
    // Agar ma'lumot mavjud bo'lsa, uni JSON formatida qaytaradi
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    // Xato yuz bersa (masalan, brauzer LocalStorage'ni bloklagan bo'lsa)
    console.error("LocalStorage'dan o'qishda xato:", error);
    return initialValue;
  }
}

// Custom Hook: useLocalStorage
export default function useLocalStorage(key, initialValue) {
  // initialValue - LocalStorage bo'sh bo'lganda ishlatiladigan qiymat
  const [value, setValue] = useState(() => {
    return getStoredValue(key, initialValue);
  });

  // value o'zgarganda LocalStorage'ni yangilash
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("LocalStorage'ga yozishda xato:", error);
    }
  }, [key, value]); // key yoki value o'zgarganda ishlaydi

  return [value, setValue];
}
