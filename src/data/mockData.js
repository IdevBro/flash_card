// src/data/mockData.js

// Yordamchi funksiya: Bugungi sanani (YYYY-MM-DD) formatida beradi
const formatDate = (date) => date.toISOString().split("T")[0];

// Bugungi sana
const today = formatDate(new Date());

// Kechagi sana
const yesterday = formatDate(new Date(Date.now() - 86400000)); // 24 soat milisaniyada

export const MOCK_CARDS = [];
