const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

/**
 * Fills a fixed-layout certificate template with student name, event title, and date.
 * Coordinates and font size come from the certificate_templates row (see schema.sql) —
 * they are set once when the template is designed, not computed dynamically.
 *
 * @param {object} template - row from certificate_templates
 * @param {object} data - { studentName, eventTitle, eventDate }
 * @returns {Promise<Buffer>} filled PDF as a buffer, ready to upload
 */
async function generateCertificate(template, data) {
  const templatePath = path.join(__dirname, "..", "templates", template.file_path);
  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `Certificate template file not found at ${templatePath}. Place a template PDF there and update certificate_templates.file_path.`
    );
  }

  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const draw = (text, x, y) =>
    page.drawText(text, { x, y, size: template.font_size, font, color: rgb(0.1, 0.1, 0.1) });

  draw(data.studentName, template.name_x, template.name_y);
  draw(data.eventTitle, template.event_x, template.event_y);
  draw(data.eventDate, template.date_x, template.date_y);

  const filledBytes = await pdfDoc.save();
  return Buffer.from(filledBytes);
}

module.exports = { generateCertificate };
