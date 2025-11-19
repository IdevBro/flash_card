// src/components/Home.jsx - App.jsx dan ko'chirilgan asosiy kontent
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom"; // Link qo'shildi
import Card from "./Card";
import { ArrowLeft, ArrowRight, Edit3 } from "lucide-react";

// ... (Oldingi App.jsx dagi formatDate, today, yesterday, FILTER_TYPES larni bu yerga ko'chiring)
const formatDate = (date) => date.toISOString().split("T")[0];
const today = formatDate(new Date());
const yesterday = formatDate(new Date(Date.now() - 86400000));
const FILTER_TYPES = {
  ALL: "Hammasi",
  TODAY: "Bugungi",
  YESTERDAY: "Kechagi",
  LEARNED: "O'rganilgan",
  UNLEARNED: "O'rganilmagan",
};
// ...

// Faqat props sifatida cards va setCards larni qabul qiladi
export default function Home({ cards, setCards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState(FILTER_TYPES.ALL);
  // Swipe holatlari...
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // useMemo Filtrlash Logikasi (App.jsx dan ko'chirilgan)
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // ... (Filtrlash mantiqi)
      switch (filter) {
        case FILTER_TYPES.TODAY:
          return card.dateAdded === today;
        case FILTER_TYPES.YESTERDAY:
          return card.dateAdded === yesterday;
        case FILTER_TYPES.LEARNED:
          return card.isLearned === true;
        case FILTER_TYPES.UNLEARNED:
          return card.isLearned === false;
        case FILTER_TYPES.ALL:
        default:
          return true;
      }
    });
  }, [cards, filter]);

  // Boshqa funksiyalar (handleLearn, handleNext, handlePrev, swipe funksiyalari)
  // to'liq App.jsx dan ko'chiriladi va bu yerda ishlatiladi.

  // --- O'rganish Holatini Yangilash ---
  const handleLearn = (cardId) => {
    const updatedCards = cards.map((card) => {
      if (card.id === cardId) {
        return { ...card, isLearned: !card.isLearned };
      }
      return card;
    });
    setCards(updatedCards);
  };

  // --- Navigatsiya Funksiyalari ---
  const handleNext = () => {
    if (filteredCards.length <= 1) return;
    const currentCard = filteredCards[currentIndex];
    const cardToMove = cards.find((c) => c.id === currentCard.id);
    const remainingCards = cards.filter((c) => c.id !== currentCard.id);
    remainingCards.push(cardToMove);
    setCards(remainingCards);

    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    if (filteredCards.length <= 1) return;
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + filteredCards.length) % filteredCards.length
    );
  };

  // --- Surish (Swipe) Funksiyalari ---
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 50;

    if (isSwipe) {
      if (distance > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Render
  const currentCard =
    filteredCards.length > 0
      ? filteredCards[currentIndex % filteredCards.length]
      : null;

  return (
    <div
      className="flex flex-col items-center min-h-screen bg-gray-100 pt-10 pb-20"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <header className="w-full text-center mb-4 relative">
        <h1 className="text-4xl font-extrabold text-gray-800">📚 FLASHCARD</h1>
        {/* YANGI KARTA QO'SHISH tugmasi */}
        <Link
          to="/add"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
          title="Yangi karta qo'shish"
        >
          +
        </Link>
      </header>

      {/* Filtrlash Tugmalari (oldingi kod) */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 w-full max-w-lg px-4">
        {Object.values(FILTER_TYPES).map((type) => (
          <button
            key={type}
            onClick={() => {
              setFilter(type);
              setCurrentIndex(0);
            }}
            className={`
                            px-3 py-1 text-sm rounded-full transition duration-150 ease-in-out
                            ${
                              filter === type
                                ? "bg-red-600 text-white shadow-md"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"
                            }
                        `}
          >
            {type} (
            {
              cards.filter((card) => {
                // Faqat umumiy kartalar sonini ko'rsatish uchun
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

      <main className="w-full max-w-lg p-4 flex justify-center relative">
        {currentCard ? (
          <>
            {/* Tahrirlash tugmasi (kartaning yuqorisida) */}
            <Link
              to={`/edit/${currentCard.id}`}
              className="absolute top-0 right-4 p-2 bg-blue-500 text-white rounded-lg shadow-md z-10 hover:bg-blue-600 transition"
              title="Tahrirlash"
            >
              <Edit3 className="w-5 h-5" />
            </Link>

            {/* Navigatsiya Tugmalari va Card komponenti */}
            <button onClick={handlePrev} className="... hidden md:block">
              {" "}
              <ArrowLeft className="w-6 h-6 text-gray-800" />{" "}
            </button>

            <Card card={currentCard} onLearn={handleLearn} />

            <button onClick={handleNext} className="... hidden md:block">
              {" "}
              <ArrowRight className="w-6 h-6 text-gray-800" />{" "}
            </button>
          </>
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

      {/* Mobil Navigatsiya Tugmalari (oldingi kod) */}
      {currentCard && (
        <div className="flex w-full max-w-sm justify-between px-4 mt-8 md:hidden">
          <button onClick={handlePrev} className="... ">
            {" "}
            <ArrowLeft className="w-5 h-5 mr-2" /> Oldingi{" "}
          </button>
          <button onClick={handleNext} className="... ">
            {" "}
            Keyingi <ArrowRight className="w-5 h-5 ml-2" />{" "}
          </button>
        </div>
      )}

      {currentCard && (
        <div className="mt-8 text-center text-gray-600">
          <p>
            Joriy karta: {currentIndex + 1} / {filteredCards.length}
          </p>
          <p className="text-xs mt-1">Ko'rsatilmoqda: {filter}</p>
        </div>
      )}
    </div>
  );
}

// QAYD: App.jsx dagi navigatsiya tugmalariga berilgan Tailwind klasslarini
// Home.jsx ga to'g'ri ko'chirishni unutmang.
