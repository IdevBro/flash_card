// src/utils/pdfExport.js
import { jsPDF } from "jspdf";

const formatDate = (date) => date.toISOString().split("T")[0];
const today = formatDate(new Date());

/**
 * PDF yaratish uchun umumiy funksiya
 * @param {Array} cards - So'zlar massivi
 * @param {string} filename - PDF fayl nomi
 */
const generatePDF = (cards, filename) => {
    const doc = new jsPDF();

    // Sarlavha
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("So'zlar Ro'yxati", 105, 20, { align: "center" });

    // Sana
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Yuklab olingan sana: ${today}`, 105, 28, { align: "center" });

    // Chiziq
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);

    // So'zlar ro'yxati
    doc.setFontSize(12);

    let yPosition = 45;
    const pageHeight = 280;
    const lineHeight = 10;
    const columnWidth = 85;
    const leftColumnX = 20;
    const rightColumnX = 110;

    cards.forEach((card, index) => {
        const column = index % 2; // 0 = chap, 1 = o'ng
        const row = Math.floor(index / 2);

        // Har bir 2 ta so'zdan keyin yangi qator
        if (column === 0 && index > 0) {
            yPosition += lineHeight;
        }

        // Sahifa tugaganida yangi sahifa
        if (yPosition > pageHeight) {
            doc.addPage();
            yPosition = 20;
        }

        const xPosition = column === 0 ? leftColumnX : rightColumnX;
        const text = `${index + 1}. ${card.word} - ${card.definition}`;

        // Matnni qisqartirish (agar juda uzun bo'lsa)
        const maxWidth = columnWidth - 5;
        const truncatedText = doc.getTextWidth(text) > maxWidth
            ? text.substring(0, 30) + "..."
            : text;

        doc.text(truncatedText, xPosition, yPosition);
    });

    // Umumiy so'zlar soni
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
            `Jami: ${cards.length} ta so'z | Sahifa ${i}/${totalPages}`,
            105,
            290,
            { align: "center" }
        );
        doc.setTextColor(0);
    }

    // PDF'ni yuklab olish
    doc.save(filename);
};

/**
 * Bugungi so'zlarni PDF formatda yuklab olish
 * @param {Array} cards - Barcha so'zlar massivi
 */
export const exportTodayWordsToPDF = (cards) => {
    const todayCards = cards.filter((card) => card.dateAdded === today);

    if (todayCards.length === 0) {
        alert("Bugun qo'shilgan so'zlar yo'q!");
        return;
    }

    generatePDF(todayCards, `sozlar_bugungi_${today}.pdf`);
};

/**
 * Barcha so'zlarni PDF formatda yuklab olish
 * @param {Array} cards - Barcha so'zlar massivi
 */
export const exportAllWordsToPDF = (cards) => {
    if (cards.length === 0) {
        alert("Hech qanday so'z yo'q!");
        return;
    }

    generatePDF(cards, `sozlar_barchasi_${today}.pdf`);
};
