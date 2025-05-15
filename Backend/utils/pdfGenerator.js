const fs = require("fs");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const path = require("path");

async function generatePDF(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const drawText = (text, x, y, size = 10, bold = false) => {
    page.drawText(String(text ?? ""), {
      x,
      y,
      size,
      font: bold ? fontBold : font,
      color: rgb(0, 0, 0),
    });
  };

  // === 1. Draw Header Image ===
  const headerImageBytes = fs.readFileSync(
    path.join(__dirname, "../assets/logo.png")
  );
  const headerImage = await pdfDoc.embedPng(headerImageBytes);
  page.drawImage(headerImage, {
    x: 400,
    y: 780,
    width: 150,
    height: 40,
  });






  // === 4. Table Layout ===
  const startX = 30;
  const startY = 620;
  const tableWidth = 530;
  const rowHeight = 25;

  const columns = [
    { label: "Description", width: 260 },
    { label: "Quantity", width: 70 },
    { label: "Unit Price", width: 100 },
    { label: "Total", width: 100 },
  ];

  const items = data.items || [];
  const totalAmount = String(data.total ?? "0.00");

  drawText("Estimate:", startX, startY + 150, 10, true);
  drawText(data.companyName, startX, startY + 130, 10);
  drawText(data.companyAddress, startX, startY + 110, 10);
  

  
  drawText("Estimate for:", startX, startY + 80, 10, true);
  drawText(data.customerName, startX, startY + 60, 10);
  drawText(data.customerAddress, startX, startY + 40, 10);
  // === 5. Table Header ===
  let currentY = startY;
  let currentX = startX;
  columns.forEach((col) => {
    drawText(col.label, currentX + 3, currentY - 15, 10, true);
    currentX += col.width;
  });

  // Line after header
  page.drawLine({
    start: { x: startX, y: currentY - rowHeight },
    end: { x: startX + tableWidth, y: currentY - rowHeight },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // === 6. Table Rows ===
  currentY -= rowHeight;
  items.forEach((item) => {
    currentX = startX;
    drawText(String(item.description ?? ""), currentX + 3, currentY - 15);
    currentX += columns[0].width;
    drawText(String(item.quantity ?? ""), currentX + 3, currentY - 15);
    currentX += columns[1].width;
    drawText(String(item.unitPrice ?? ""), currentX + 3, currentY - 15);
    currentX += columns[2].width;
    drawText(String(item.quantity * item.unitPrice?? ""), currentX + 3, currentY - 15);
    currentY -= rowHeight;

    // Line after row
    page.drawLine({
      start: { x: startX, y: currentY },
      end: { x: startX + tableWidth, y: currentY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  });

  // === 7. Total Row ===
  drawText("Total", startX + columns[0].width + columns[1].width + 3, currentY - 15, 10, true);
  drawText(totalAmount, startX + columns[0].width + columns[1].width + columns[2].width + 3, currentY - 15, 10, true);
  currentY -= rowHeight;

  // === 8. Notes & Terms ===
  drawText("Note:", startX, currentY - 80, 10, true);
  drawText("Please make the payment within 30 days.", startX, currentY - 95);
  drawText("Terms & Conditions:", startX, currentY - 120, 10, true);
  drawText("All goods sold are non-refundable.", startX, currentY - 135);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

module.exports = { generatePDF };
