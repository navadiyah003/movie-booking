const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const request = require('request-promise');

exports.createPdfForTicket = async (req, res) => {
  const ticket = req.body;

  // Set appropriate response headers
  res.setHeader('Content-Disposition', 'inline; filename="movie_ticket.pdf"');
  res.setHeader('Content-Type', 'application/pdf');

  // Create a stream to pipe the PDF content to the response
  const doc = new PDFDocument({ size: 'A5' });
  const stream = doc.pipe(res);

  try {
    // Background color with shadow effect
    doc.save()
      .rect(0, 0, doc.page.width, doc.page.height)
      .fill('#F3F3F3')
      .opacity(0.5)
      .restore();

    // Add the dummy auditorium name
    const auditoriumName = 'Sample Auditorium';
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#333');
    doc.text(auditoriumName, 20, 20);

    // Download the image from the provided link
    if (ticket.poster) {
     const imageBuffer = await request.get({ uri: ticket.poster, encoding: null });
      // Add the downloaded image to the PDF
      if (imageBuffer) {
        doc.image(imageBuffer, 20, 40, { width: 100 });
      } else {
        // Handle if the image download fails
        console.error('Image download failed');
      }
    }



    // Format release date
    const formattedReleaseDate = new Date(ticket.releaseDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Information details
    const yOffset = 40;
    const contentXOffset = 140;
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#333');
    doc.text(`${ticket.title}`, contentXOffset, yOffset);
    doc.font('Helvetica').fontSize(10).fillColor('#555');
    doc.text(`(${ticket.language})`, contentXOffset, yOffset + 15); // Separate line for language

    // Display date and time on a single line
    const dateTimeText = `${formattedReleaseDate} | ${ticket.showTime}`;
    doc.text(dateTimeText, contentXOffset, yOffset + 35);

    doc.text(`Kolkata, VR Mall, West Bengal`, contentXOffset, yOffset + 55);

    // Create a table-like format with borders
    const tableYOffset = 150;
    const tableRowHeight = 15;
    const tableCellWidth = doc.page.width - 40; // Adjusted to the full width of the PDF
    const tableBorderWidth = 0.5;

    doc.lineWidth(tableBorderWidth);

    // Draw horizontal lines and add space to the top of each row
    for (let i = 0; i < 5; i++) {
      const rowYOffset = tableYOffset + i * tableRowHeight + 5; // Added space at the top
      doc.moveTo(20, rowYOffset).lineTo(20 + tableCellWidth, rowYOffset).stroke();
    }

    doc.font('Helvetica-Bold').fontSize(10).fillColor('#333');

    // Table content alignment and position adjustments
    doc.text('Booking ID', 20, tableYOffset + 9, { width: tableCellWidth, align: 'left' });
    doc.font('Helvetica').fontSize(8).fillColor('#333');
    doc.text(ticket.bookingId, 10, tableYOffset + 9, { width: tableCellWidth, align: 'right' });
    doc.font('Helvetica').fontSize(8).fillColor('#333');
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#333');
    doc.text('Seat No', 20, tableYOffset + tableRowHeight + 9, { width: tableCellWidth, align: 'left' });
    doc.font('Helvetica').fontSize(8).fillColor('#333');
    doc.text(ticket.seatNo, 10, tableYOffset + tableRowHeight + 9, { width: tableCellWidth, align: 'right' });
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#333');
    doc.text('No. of Seats Booked', 20, tableYOffset + 2 * tableRowHeight + 9, { width: tableCellWidth, align: 'left' });
    doc.font('Helvetica').fontSize(8).fillColor('#333');
    doc.text(ticket.noOfSeatsBook.toString(), 10, tableYOffset + 2 * tableRowHeight + 9, { width: tableCellWidth, align: 'right' });
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#333');
    doc.text('Amount', 20, tableYOffset + 3 * tableRowHeight + 9, { width: tableCellWidth, align: 'left' });
    doc.font('Helvetica').fontSize(8).fillColor('#333');
    doc.text(`Rs.${ticket.amount}`, 10, tableYOffset + 3 * tableRowHeight + 9, { width: tableCellWidth, align: 'right' });
    const disclaimerText = `
      Disclaimer: Please read and follow the rules and guidelines set by the auditorium management.
      1. Kindly arrive at least 15 minutes before the showtime.
      2. Mobile phones and other electronic devices should be turned off during the movie.
      3. Outside food and drinks are not allowed inside the auditorium.
      4. Please cooperate with the auditorium staff for a pleasant experience.
    `;
    doc.font('Helvetica').fontSize(8).fillColor('#555');
    doc.text(disclaimerText, 20, tableYOffset + 5 * tableRowHeight + 60, { align: 'left', width: tableCellWidth });
    // Add a dummy description below the content
    const dummyDescription = 'Thank you for choosing our services.';
    doc.font('Helvetica').fontSize(8).fillColor('#555');
    doc.text(dummyDescription, 20, tableYOffset + 5 * tableRowHeight + 15, { align: 'left' });

    // Finalize the PDF
    doc.end();

    // Handle errors during PDF generation
    doc.on('error', (err) => {
      console.error('PDF Generation Error:', err);
      res.status(500).send('PDF Generation Error');
    });

    // Handle errors during response sending
    stream.on('error', (err) => {
      console.error('Response Error:', err);
    });
  } catch (err) {
    console.error('Error downloading image:', err);
    res.status(500).send('Error downloading image');
  }
};
