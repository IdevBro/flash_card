// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import { MOCK_CARDS } from "./data/mockData";
import Home from "./components/Home"; // Yangi Home komponenti
import CardForm from "./components/CardForm"; // Yangi CardForm komponenti

export default function App() {
  // Ma'lumotlar LocalStorage'da saqlanadi va App.jsx orqali bolalarga uzatiladi
  const [cards, setCards] = useLocalStorage("flashcards", MOCK_CARDS);

  return (
    <Router>
      <Routes>
        {/* Asosiy sahifa (Kartalarni ko'rish) */}
        <Route path="/" element={<Home cards={cards} setCards={setCards} />} />

        {/* Yangi karta qo'shish sahifasi */}
        <Route
          path="/add"
          element={<CardForm cards={cards} setCards={setCards} />}
        />

        {/* Mavjud kartani tahrirlash sahifasi */}
        <Route
          path="/edit/:id"
          element={<CardForm cards={cards} setCards={setCards} />}
        />
      </Routes>
    </Router>
  );
}
