const fs = require("fs");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const path = require("path");

async function generatePDF(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const drawText = (text, x, y, size = 10, bold = false, color = rgb(0, 0, 0)) => {
    page.drawText(String(text ?? ""), {
      x,
      y,
      size,
      font: bold ? fontBold : font,
      color,
    });
  };

  // === 1. Draw Header Image ===
  const headerImageBytes = fs.readFileSync(
    path.join(__dirname, "../assets/logo.png")
  );
  const headerImage = await pdfDoc.embedPng(headerImageBytes);
  page.drawImage(headerImage, {
    x: 500,
    y: 770,
    width: 50,
    height: 40,
  });

  // === 2. Company Info & Customer Info ===
  let yPos = 740;
  drawText("Estimate:", 30, yPos, 10, true);
  yPos -= 15;
  drawText("NeoMac Engineering (pvt)", 30, yPos);
  yPos -= 15;
  drawText("Address: No 175B 3/5, Alvitigala Mawatha, Colombo 08", 30, yPos);

  yPos -= 40;
  drawText("Estimate for:", 30, yPos, 10, true);
  yPos -= 15;
  drawText(data.customerName, 30, yPos);
  yPos -= 15;
  drawText(data.customerAddress, 30, yPos);

  // === 3. Document Metadata ===
  drawText(data.docType.toUpperCase(), 250, 810, 20, true);
  drawText("Date:", 400, 720, 10, true);
  drawText(data.date, 460, 720);
  drawText("Valid Until:", 400, 700, 10, true);
  drawText(data.validity, 460, 700);
  drawText(`${data.docType} ID:`, 400, 680, 10, true);
  drawText(data.id, 460, 680);

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

  // === 5. Table Header (Black Background, White Text) ===
  let currentY = startY;
  let currentX = startX;

  // Draw black background for header row
  page.drawRectangle({
    x: startX,
    y: currentY - rowHeight,
    width: tableWidth,
    height: rowHeight,
    color: rgb(0, 0, 0),
  });

  // Draw white text headers
  currentX = startX;
  columns.forEach((col) => {
    drawText(col.label, currentX + 3, currentY - 15, 10, true, rgb(1, 1, 1));
    currentX += col.width;
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
    drawText(String(item.quantity * item.unitPrice ?? ""), currentX + 3, currentY - 15);
    currentY -= rowHeight;

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

  // === 8. Note & Terms ===
  drawText("Note:", startX, currentY - 60, 10, true);
  drawText("Please make the payment within 30 days.", startX, currentY - 75);
  drawText("Terms & Conditions:", startX, currentY - 100, 10, true);
  drawText("All goods sold are non-refundable.", startX, currentY - 115);

  // === 9. Signature Section ===
  drawText("Authorized Signature:", 400, currentY - 160, 10, true);
  page.drawLine({
    start: { x: 400, y: currentY - 175 },
    end: { x: 550, y: currentY - 175 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // === 10. Contact Info Row at Bottom ===
  page.drawLine({
    start: { x: 30, y: 70 },
    end: { x: 565, y: 70 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  drawText("Email: info@neomac.lk", 40, 50, 9);
  drawText("Phone: +94 74 209 6870 ", 240, 50, 9);
  drawText("Website: www.neomac.lk", 440, 50, 9);

  // === 11. Return PDF Bytes ===
  return await pdfDoc.save();
}

module.exports = { generatePDF };
