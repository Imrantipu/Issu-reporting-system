import jsPDF from 'jspdf';

/**
 * Generate and download a PDF invoice for a payment
 * @param {Object} payment - Payment object from the database
 * @param {Object} user - User information
 */
export const generateInvoice = (payment, user) => {
  const doc = new jsPDF();

  // Page dimensions
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  // Colors
  const primaryColor = [6, 182, 212]; // Cyan-500
  const secondaryColor = [16, 185, 129]; // Emerald-500
  const textColor = [15, 23, 42]; // Slate-900
  const grayColor = [100, 116, 139]; // Slate-500

  // Header Background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 50, 'F');

  // Company/App Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Public Infrastructure', margin, 25);
  doc.setFontSize(16);
  doc.text('Issue Reporting System', margin, 35);

  // Invoice Title
  doc.setTextColor(...textColor);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth - margin, 35, { align: 'right' });

  // Invoice Details
  let y = 65;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);

  // Invoice number and date (right aligned)
  doc.text(`Invoice #: ${payment._id.slice(-8).toUpperCase()}`, pageWidth - margin, y, { align: 'right' });
  y += 6;
  doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, pageWidth - margin, y, { align: 'right' });

  // Bill To Section
  y = 65;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Bill To:', margin, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  doc.text(user?.name || user?.email || 'Unknown User', margin, y);

  y += 6;
  doc.setTextColor(...grayColor);
  if (user?.email) {
    doc.text(user.email, margin, y);
    y += 6;
  }
  if (user?.phone) {
    doc.text(user.phone, margin, y);
    y += 6;
  }
  if (user?.address) {
    const addressLines = doc.splitTextToSize(user.address, 80);
    doc.text(addressLines, margin, y);
    y += addressLines.length * 6;
  }

  // Table Header
  y += 15;
  doc.setFillColor(241, 245, 249); // Slate-100
  doc.rect(margin, y, pageWidth - (margin * 2), 10, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Description', margin + 5, y + 7);
  doc.text('Amount', pageWidth - margin - 5, y + 7, { align: 'right' });

  // Table Row
  y += 10;
  doc.setFont('helvetica', 'normal');

  // Description based on payment type
  let description = '';
  if (payment.type === 'subscription') {
    description = 'Premium Subscription - Monthly';
  } else if (payment.type === 'boost') {
    description = `Issue Boost Priority - Issue #${payment.issue ? payment.issue._id?.slice(-8).toUpperCase() || payment.issue : 'N/A'}`;
  }

  doc.text(description, margin + 5, y + 7);
  doc.text(`${payment.amount} BDT`, pageWidth - margin - 5, y + 7, { align: 'right' });

  // Divider line
  y += 10;
  doc.setDrawColor(...grayColor);
  doc.line(margin, y, pageWidth - margin, y);

  // Subtotal
  y += 8;
  doc.setTextColor(...grayColor);
  doc.text('Subtotal:', pageWidth - margin - 60, y);
  doc.text(`${payment.amount} BDT`, pageWidth - margin - 5, y, { align: 'right' });

  y += 6;
  doc.text('Tax (0%):', pageWidth - margin - 60, y);
  doc.text('0 BDT', pageWidth - margin - 5, y, { align: 'right' });

  // Total
  y += 10;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - margin - 60, y - 2, pageWidth - margin, y - 2);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Total:', pageWidth - margin - 60, y + 5);
  doc.text(`${payment.amount} BDT`, pageWidth - margin - 5, y + 5, { align: 'right' });

  // Payment Status
  y += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Status:', margin, y);

  // Status badge
  const statusText = payment.status.charAt(0).toUpperCase() + payment.status.slice(1);
  const statusWidth = doc.getTextWidth(statusText) + 8;

  if (payment.status === 'completed') {
    doc.setFillColor(16, 185, 129); // Emerald-500
  } else if (payment.status === 'pending') {
    doc.setFillColor(245, 158, 11); // Amber-500
  } else {
    doc.setFillColor(239, 68, 68); // Red-500
  }

  doc.roundedRect(margin + 50, y - 4, statusWidth, 7, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(statusText, margin + 54, y + 1);

  // Payment Method
  y += 10;
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  doc.text('Payment Method: Stripe (Card Payment)', margin, y);

  // Transaction ID
  if (payment.stripePaymentIntentId) {
    y += 6;
    doc.setTextColor(...grayColor);
    doc.setFontSize(8);
    doc.text(`Transaction ID: ${payment.stripePaymentIntentId}`, margin, y);
  }

  // Footer
  const footerY = pageHeight - 30;
  doc.setDrawColor(...grayColor);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for using our service!', pageWidth / 2, footerY + 8, { align: 'center' });
  doc.text('For support, contact: support@publicreporting.com', pageWidth / 2, footerY + 14, { align: 'center' });

  // Page number
  doc.setFontSize(8);
  doc.text('Page 1 of 1', pageWidth - margin, pageHeight - 10, { align: 'right' });

  // Generate filename
  const filename = `invoice-${payment._id.slice(-8)}-${new Date(payment.createdAt).toISOString().split('T')[0]}.pdf`;

  // Save PDF
  doc.save(filename);
};

export default generateInvoice;
