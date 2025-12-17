// src/components/Home.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import { ArrowLeft, ArrowRight, Edit3, Download } from "lucide-react";
import { exportTodayWordsToPDF, exportAllWordsToPDF } from "../utils/pdfExport";

const formatDate = (date) => date.toISOString().split("T")[0];
const today = formatDate(new Date());
const yesterday = formatDate(new Date(Date.now() - 86400000));

const FILTER_TYPES = {
  ALL: "Hammasi",
  TODAY: "Bugungi",
  LEARNED: "O'rganilgan",
  UNLEARNED: "O'rganilmagan",
};

export default function Home({ cards, setCards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState(FILTER_TYPES.ALL);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // --- Filterlangan kartalarni olish ---
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      switch (filter) {
        case FILTER_TYPES.TODAY:
          return card.dateAdded === today;
        case FILTER_TYPES.YESTERDAY:
          return card.dateAdded === yesterday;
        case FILTER_TYPES.LEARNED:
          return card.isLearned;
        case FILTER_TYPES.UNLEARNED:
          return !card.isLearned;
        case FILTER_TYPES.ALL:
        default:
          return true;
      }
    });
  }, [cards, filter]);

  // --- O‘rganish holatini yangilash ---
  const handleLearn = (cardId) => {
    const updatedCards = cards.map((card) => {
      if (card.id === cardId) {
        return { ...card, isLearned: !card.isLearned };
      }
      return card;
    });
    setCards(updatedCards);
  };

  // --- Navigatsiya (takrorlanmas) ---
  const handleNext = () => {
    if (filteredCards.length <= 1) return;
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, filteredCards.length - 1)
    );
  };

  const handlePrev = () => {
    if (filteredCards.length <= 1) return;
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  // --- Swipe funksiyalari ---
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 50;
    if (isSwipe) {
      if (distance > 0) handleNext();
      else handlePrev();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const currentCard =
    filteredCards.length > 0 ? filteredCards[currentIndex] : null;

  return (
    <div
      className="flex flex-col items-center min-h-screen bg-gray-100 pt-10 pb-20"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <header className="w-full text-center mb-4 relative">
        <h1 className="text-4xl font-extrabold text-gray-800">
          <span className="text-[#01B428]">Me</span>
          <span className="text-[#CA0021]">Mora</span>
        </h1>

        {/* PDF Yuklab Olish Tugmalari */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => exportTodayWordsToPDF(cards)}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            title="Bugungi so'zlarni PDF yuklab olish"
          >
            <Download className="w-4 h-4" />
            Bugungi
          </button>
          <button
            onClick={() => exportAllWordsToPDF(cards)}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            title="Barcha so'zlarni PDF yuklab olish"
          >
            <Download className="w-4 h-4" />
            Barchasi
          </button>
        </div>
      </header>

      {/* Filtrlash Tugmalari */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 w-full max-w-lg px-4 grid grid-cols-2">
        {Object.values(FILTER_TYPES).map((type) => (
          <button
            key={type}
            onClick={() => {
              setFilter(type);
              setCurrentIndex(0); // filter o‘zgarganda indexni reset qilish
            }}
            className={`
              px-3 py-2 text-sm rounded-[5px] transition duration-150 ease-in-out
              ${filter === type
                ? "bg-gray-700 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"
              }
            `}
          >
            {type} (
            {
              cards.filter((card) => {
                if (type === FILTER_TYPES.ALL) return true;
                if (type === FILTER_TYPES.LEARNED) return card.isLearned;
                if (type === FILTER_TYPES.UNLEARNED) return !card.isLearned;
                if (type === FILTER_TYPES.TODAY)
                  return card.dateAdded === today;
                if (type === FILTER_TYPES.YESTERDAY)
                  return card.dateAdded === yesterday;
                return false;
              }).length
            }
            )
          </button>
        ))}
      </div>

      <main className="w-full max-w-lg px-4">
        {currentCard ? (
          <div className="w-full flex flex-col items-center relative">
            <Card
              card={currentCard}
              currentIndex={currentIndex}
              filteredCards={filteredCards}
              onLearn={handleLearn}
            />
            <Link
              to={`/edit/${currentCard.id}`}
              className="absolute right-4 top-4 p-2 bg-blue-500 text-white rounded-lg shadow-md z-10 hover:bg-blue-600 transition"
              title="Tahrirlash"
            >
              <Edit3 className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="text-center p-10 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-600">
              "{filter}" bo'yicha hech qanday so'z yo'q.
            </p>
            <Link
              to="/add"
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Yangi so'z qo'shish
            </Link>
          </div>
        )}
      </main>

      {/* Mobil Navigatsiya Tugmalari */}
      {currentCard && (
        <div className="flex  px-4 justify-between items-center w-full mt-8 md:hidden">
          <button onClick={handlePrev}>
            <ArrowLeft className="cursor-pointer bg-gray-700 text-white rounded-[10px] py-[15px] px-[15px] w-full h-full" />
          </button>
          <Link
            to="/add"
            className="text-[24px]  bg-gray-700 text-white px-[70px] py-[10px] text-center shadow-lg rounded-[10px] transition"
            title="Yangi karta qo'shish"
          >
            +
          </Link>
          <button onClick={handleNext}>
            <ArrowRight className="cursor-pointer bg-gray-700 text-white rounded-[10px] py-[15px] px-[15px] w-full h-full" />
          </button>
        </div>
      )}
    </div>
  );
}
