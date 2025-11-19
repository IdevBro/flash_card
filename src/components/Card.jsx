// src/components/Card.jsx
import React, { useState } from "react";
import { Check, X } from "lucide-react";

export default function Card({ card, onLearn }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleLearnClick = (e) => {
    e.stopPropagation(); // Flip bo‘lib ketishining oldini oladi
    onLearn(card.id);
  };

  return (
    <div
      onClick={handleFlip}
      className={`
        relative w-full h-[400px] max-w-sm cursor-pointer 
        rounded-2xl shadow-2xl transition-transform duration-700 
        preserve-3d
        ${isFlipped ? "rotate-y-180" : ""}
      `}
      style={{ perspective: "1000px" }}
    >
      {/* ---------------- FRONT SIDE ---------------- */}
      <div
        className={`
          absolute inset-0 p-8 rounded-2xl text-white
          flex flex-col items-center justify-center text-center
          backface-hidden transition-opacity duration-300
          ${isFlipped ? "opacity-0" : "opacity-100"}
          ${card.isLearned ? "bg-green-600" : "bg-red-600"}
        `}
      >
        <p className="text-4xl font-bold select-none">{card.word}</p>

        {/* O‘rganilgan belgisi */}
        {card.isLearned && (
          <div className="absolute top-4 right-4 text-white p-2 rounded-full bg-green-700 opacity-90">
            <Check className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* ---------------- BACK SIDE ---------------- */}
      <div
        className={`
          absolute inset-0 p-8 rounded-2xl bg-gray-700 text-white
          flex flex-col justify-between 
          backface-hidden rotate-y-180 
          transition-opacity duration-300
          ${isFlipped ? "opacity-100" : "opacity-0"}
        `}
      >
        {/* Word */}
        <p className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-500">
          {card.word}
        </p>

        {/* Definition */}
        <p className="text-xl flex-grow overflow-y-auto select-none">
          {card.definition}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-400">
            Qo‘shilgan: {card.dateAdded}
          </div>

          {/* Learn toggle button */}
          <button
            onClick={handleLearnClick}
            className={`
              p-2 rounded-full shadow-lg transition duration-200 
              ${
                card.isLearned
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }
            `}
            title={
              card.isLearned
                ? "O‘rganilmagan deb belgilash"
                : "O‘rganildi deb belgilash"
            }
          >
            {card.isLearned ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Check className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
