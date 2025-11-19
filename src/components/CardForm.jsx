// src/components/CardForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const formatDate = (date) => date.toISOString().split("T")[0];

export default function CardForm({ cards, setCards }) {
  const navigate = useNavigate();
  const { id } = useParams(); // URL parametrini olish (tahrirlash uchun)

  // Forma holati
  const [formData, setFormData] = useState({
    word: "",
    definition: "",
  });

  // Tahrirlash rejimini aniqlash
  const isEditing = id !== undefined;

  // Tahrirlash rejimida bo'lsa, mavjud ma'lumotlarni yuklash
  useEffect(() => {
    if (isEditing) {
      const cardToEdit = cards.find((c) => c.id === id);
      if (cardToEdit) {
        setFormData({
          word: cardToEdit.word,
          definition: cardToEdit.definition,
        });
      } else {
        // Agar ID topilmasa, bosh sahifaga qaytaramiz
        navigate("/");
      }
    }
  }, [isEditing, id, cards, navigate]);

  // Input o'zgarishlarini boshqarish
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Formani yuborish
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.word.trim() || !formData.definition.trim()) {
      alert("Iltimos, so'z va ta'rifni kiriting.");
      return;
    }

    if (isEditing) {
      // Tahrirlash logikasi
      const updatedCards = cards.map((c) =>
        c.id === id
          ? {
              ...c,
              word: formData.word.trim(),
              definition: formData.definition.trim(),
            }
          : c
      );
      setCards(updatedCards);
    } else {
      // Yangi qo'shish logikasi
      const newCard = {
        id: Date.now().toString(), // Vaqt shtampi asosida unikal ID
        word: formData.word.trim(),
        definition: formData.definition.trim(),
        dateAdded: formatDate(new Date()),
        isLearned: false,
      };
      setCards([newCard, ...cards]); // Yangi kartani ro'yxatning boshiga qo'shamiz
    }

    navigate("/"); // Asosiy sahifaga qaytish
  };

  // O'chirish funksiyasi
  const handleDelete = () => {
    if (!window.confirm("Rostdan ham bu kartani o'chirmoqchimisiz?")) return;

    const remainingCards = cards.filter((c) => c.id !== id);
    setCards(remainingCards);
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-xl rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        {isEditing ? "Kartani Tahrirlash" : "Yangi Karta Qo'shish"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="word"
          >
            So'z (Old Tomoni)
          </label>
          <input
            type="text"
            id="word"
            name="word"
            value={formData.word}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder="Masalan: Ephemeral"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="definition"
          >
            Ta'rif/Tarjima (Orqa Tomoni)
          </label>
          <textarea
            id="definition"
            name="definition"
            value={formData.definition}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 resize-none"
            placeholder="Juda qisqa muddat davom etadigan, o'tkinchi"
            required
          ></textarea>
        </div>

        <div className="flex justify-between gap-3">
          <button
            type="submit"
            className="flex-grow px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-200"
          >
            {isEditing ? "Saqlash" : "Qo'shish"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-200"
            >
              O'chirish
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full mt-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200"
        >
          Bekor qilish
        </button>
      </form>
    </div>
  );
}
