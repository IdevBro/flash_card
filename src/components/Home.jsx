// src/components/Home.jsx - App.jsx dan ko'chirilgan asosiy kontent
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom"; // Link qo'shildi
import Card from "./Card";
import { ArrowLeft, ArrowRight, Edit3 } from "lucide-react";
import Logo from "../assets/logo.png";
// ... (Oldingi App.jsx dagi formatDate, today, yesterday, FILTER_TYPES larni bu yerga ko'chiring)
const formatDate = (date) => date.toISOString().split("T")[0];
const today = formatDate(new Date());
const yesterday = formatDate(new Date(Date.now() - 86400000));
const FILTER_TYPES = {
  ALL: "Hammasi",
  TODAY: "Bugungi",
  // YESTERDAY: "Kechagi",
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
        <div className="flex items-center justify-center gap-[30px]">
          <img className="w-[100px]" src={Logo} alt="" />
          <h1 className="text-4xl font-extrabold text-gray-800">
            {" "}
            <span className="text-[#01B428]">Me</span>
            <span className="text-[#CA0021]">Mora</span>
          </h1>
        </div>
        {/* YANGI KARTA QO'SHISH tugmasi */}
      </header>

      {/* Filtrlash Tugmalari (oldingi kod) */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 w-full max-w-lg px-4  grid grid-cols-2">
        {Object.values(FILTER_TYPES).map((type) => (
          <button
            key={type}
            onClick={() => {
              setFilter(type);
              setCurrentIndex(0);
            }}
            className={`
                            px-3 py-2 text-sm rounded-[5px] transition duration-150 ease-in-out
                            ${
                              filter === type
                                ? "bg-gray-700 text-white shadow-md"
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

      <main className="w-full max-w-lg px-4   ">
        {currentCard ? (
          <>
            <div className="w-full flex flex-col items-center relative">
              <Card
                card={currentCard}
                currentIndex={currentIndex}
                filteredCards={filteredCards}
                onLearn={handleLearn}
              />
              {/* Tahrirlash tugmasi (kartaning yuqorisida) */}
              <Link
                to={`/edit/${currentCard.id}`}
                className=" absolute right-4 top-4  p-2 bg-blue-500 text-white rounded-lg shadow-md z-10 hover:bg-blue-600 transition"
                title="Tahrirlash"
              >
                <Edit3 className="w-5 h-5" />
              </Link>
            </div>
          </>
        ) : (
          <div className="  text-center p-10 bg-white rounded-lg shadow">
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
        <div className="flex w-full max-w-lg px-4 justify-between  mt-8 md:hidden">
          <button onClick={handlePrev} className="... ">
            {" "}
            <ArrowLeft className="  active:bg-gray-600 cursor-pointer bg-gray-700 text-white rounded-[10px] py-[10px] px-[15px] w-[100%] h-[100%]" />
          </button>
          <Link
            to="/add"
            className=" text-[24px] p-3 bg-gray-700 text-white w-[50%] text-center  shadow-lg rounded-[10px] transition"
            title="Yangi karta qo'shish"
          >
            +
          </Link>
          <button onClick={handleNext} className="... ">
            {" "}
            <ArrowRight className=" active:bg-gray-600  px-[15px] cursor-pointer py-[10px] w-[100%] h-[100%] bg-gray-700 text-white w-[50%] text-center  shadow-lg rounded-[10px] " />{" "}
          </button>
        </div>
      )}
    </div>
  );
}

// QAYD: App.jsx dagi navigatsiya tugmalariga berilgan Tailwind klasslarini
// Home.jsx ga to'g'ri ko'chirishni unutmang.
