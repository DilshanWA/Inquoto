const fs = require("fs");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

const { bucket } = require("../config/firebase");

const { bucket } = require("../config/firebase"); // Optional if using Firebase Storage


async function generatePDF(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 750]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const drawText = (text, x, y, size = 12) => {
    page.drawText(text, {
      x, y,
      size,
      font,
      color: rgb(0, 0, 0)
    });
  };

  let y = 700;

  drawText(`Invoice/Quotation`, 250, y, 18);
  y -= 30;

  drawText(`Client: ${data.clientName || "N/A"}`, 50, y);
  y -= 20;
  drawText(`Company: ${data.companyName || "N/A"}`, 50, y);
  y -= 20;
  drawText(`Email: ${data.email || "N/A"}`, 50, y);
  y -= 20;
  drawText(`Phone: ${data.phone || "N/A"}`, 50, y);
  y -= 20;
  drawText(`Address: ${data.address || "N/A"}`, 50, y);
  y -= 30;

  drawText(`Items:`, 50, y);
  y -= 20;

  data.items?.forEach((item, i) => {
    drawText(`${i + 1}. ${item.description} - ${item.qty} ${item.unitType} @ ${item.unitPrice}`, 60, y);
    y -= 20;
  });

  y -= 10;
  drawText(`Tax: ${data.tax || 0}`, 50, y);
  y -= 20;
  drawText(`Discount: ${data.discount || 0}`, 50, y);

  const pdfBytes = await pdfDoc.save();

  // Save locally
  const fileName = `invoice_${Date.now()}.pdf`;
  const filePath = `generated_pdfs/${fileName}`;

  if (!fs.existsSync("generated_pdfs")) {
    fs.mkdirSync("generated_pdfs");
  }

  fs.writeFileSync(filePath, pdfBytes);
  console.log(` PDF saved to ${filePath}`);

  

  return fileName;
}

module.exports = { generatePDF };
