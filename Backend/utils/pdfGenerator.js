const fs = require("fs");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const path = require("path");

async function generatePDF(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 Size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const drawText = (text, x, y, size = 12, color = rgb(0, 0, 0)) => {
    page.drawText(text, { x, y, size, font, color });
  };

  let y = 800;

  // === 1. Logo ===
  try {
    const logoBytes = fs.readFileSync(path.join(__dirname, "../assets/logo.png")); // Change path as needed
    const logoImage = await pdfDoc.embedPng(logoBytes);
    page.drawImage(logoImage, { x: 50, y: y - 60, width: 60, height: 60 });
  } catch (err) {
    drawText("Your Business Name", 50, y, 18);
  }

  // === 2. Invoice Title ===
  drawText(`Invoice ${data.invoiceNo || "000000"}`, 450, y, 14);
  y -= 30;
  drawText(`Tax Invoice`, 450, y, 10);

  // === 3. Bill To Section ===
  y -= 60;
  drawText("BILL TO", 50, y, 10);
  y -= 15;
  drawText(data.clientName || "Client Name", 50, y);
  y -= 15;
  drawText(data.address || "Client Address", 50, y);

  // === 4. Invoice Metadata Box ===
  const orange = rgb(1, 0.6, 0);
  const dark = rgb(0.2, 0.2, 0.2);
  const metaY = 690;
  const metaX = 50;
  const boxHeight = 30;
  const boxWidth = 120;

  const metaData = [
    { title: "Invoice No.", value: data.invoiceNo || "000000" },
    { title: "Issue date", value: data.issueDate || "N/A" },
    { title: "Due date", value: data.dueDate || "N/A" },
    { title: "Total due (LKR)", value: `Rs ${data.total?.toFixed(2) || "0.00"}`, dark: true },
  ];

  metaData.forEach((item, i) => {
    const x = metaX + i * boxWidth;
    const color = item.dark ? dark : orange;
    page.drawRectangle({ x, y: metaY, width: boxWidth, height: boxHeight, color });
    drawText(item.title, x + 5, metaY + 16, 8, rgb(1, 1, 1));
    drawText(item.value, x + 5, metaY + 5, 10, rgb(1, 1, 1));
  });

  // === 5. Table Header ===
  let tableY = metaY - 60;
  const tableStartX = 50;
  drawText("Description", tableStartX, tableY);
  drawText("Quantity", tableStartX + 250, tableY);
  drawText("Unit Price", tableStartX + 350, tableY);
  drawText("Amount", tableStartX + 450, tableY);
  tableY -= 15;

  // === 6. Items ===
  data.items?.forEach(item => {
    drawText(item.description, tableStartX, tableY);
    drawText(item.qty.toString(), tableStartX + 250, tableY);
    drawText(`Rs ${item.unitPrice.toFixed(2)}`, tableStartX + 350, tableY);
    drawText(`Rs ${(item.qty * item.unitPrice).toFixed(2)}`, tableStartX + 450, tableY);
    tableY -= 15;
  });

  // === 7. Totals ===
  tableY -= 20;
  drawText(`Subtotal: Rs ${data.subtotal?.toFixed(2) || "0.00"}`, tableStartX + 350, tableY);
  tableY -= 15;
  drawText(`Tax: Rs ${data.tax?.toFixed(2) || "0.00"}`, tableStartX + 350, tableY);
  tableY -= 15;
  drawText(`Discount: Rs ${data.discount?.toFixed(2) || "0.00"}`, tableStartX + 350, tableY);
  tableY -= 15;
  drawText(`Total: Rs ${data.total?.toFixed(2) || "0.00"}`, tableStartX + 350, tableY, 12, rgb(0, 0, 0));

  // === 8. Signature ===
  if (fs.existsSync(path.join(__dirname, "../assets/signature.png"))) {
    const signImg = fs.readFileSync(path.join(__dirname, "../assets/signature.png"));
    const signature = await pdfDoc.embedPng(signImg);
    page.drawImage(signature, { x: 400, y: 100, width: 120, height: 50 });
  }
  drawText("Issued by, signature:", 400, 160);

  // === 9. Footer ===
  drawText("Your Business Name", 50, 40, 10);
  drawText("5 Martin Pl, Sydney NSW", 50, 30, 10);
  drawText("+61 2000 0000", 250, 30, 10);
  drawText("yourbusinessname.com.au", 350, 30, 10);
  drawText("email@yourbusinessname.com.au", 350, 20, 10);

  // === Save the file ===
  const fileName = `invoice_${Date.now()}.pdf`;
  const filePath = path.join("generated_pdfs", fileName);

  if (!fs.existsSync("generated_pdfs")) {
    fs.mkdirSync("generated_pdfs");
  }

  fs.writeFileSync(filePath, await pdfDoc.save());

  return { fileName };
}

module.exports = { generatePDF };
