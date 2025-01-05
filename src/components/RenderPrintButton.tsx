"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaPrint } from "react-icons/fa";

const RenderPrintButton = ({ item }: { item: any }) => {
  const generatePdf = async () => {
    const doc = new jsPDF({ format: "a6" });

    // Function to convert an image file to Base64
    const loadLogoAsBase64 = async (path: string) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          } else {
            reject("Failed to load image");
          }
        };
        img.onerror = () => reject("Image failed to load");
      });
    };

    const logoBase64 = await loadLogoAsBase64("/images/logo/logo.png");

    // Calculate age as a number
    const calculateAge = (dob: string | null): string => {
      if (!dob) return "N/A";
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
      }
      return age.toString();
    };

    // Header Section
    const header = () => {
      const pageWidth = doc.internal.pageSize.width; // Get the page width
      const imageWidth = 25;
      const imageHeight = 15;
      const leftX = 10; // Position for the logo
      const spaceBetween = 5; // Space between the logo and the text

      const rightX = leftX + imageWidth + spaceBetween; // Adjust text position by adding space after the logo
      const imageY = 5;
      const textY = imageY + imageHeight / 2 + 5; // Align text vertically with the logo

      // Add logo image
      doc.addImage(logoBase64, "PNG", leftX, imageY, imageWidth, imageHeight);

      // Set font to bold
      doc.setFont("helvetica", "bold");

      // Set the logo color (replace r, g, b with the actual logo's RGB values)
      doc.setTextColor(0, 123, 255);  // Example color (blue, replace with your logo color)

      // Set font size
      doc.setFontSize(18);

      // Add the text "Alok Health Care" in the right column with some space after the logo
      doc.text("Alok Health Care", rightX, textY);
    };

    // Patient Information Section
    const patientInfo = () => {
      const { Patient, referredBy, createdAt } = item;
      const createdDate = new Date(createdAt).toLocaleString();
      const patientGender = Patient?.gender || "N/A";
      const patientAge = Patient?.dateOfBirth ? calculateAge(Patient.dateOfBirth) : "N/A";

      const boxX = 10;
      const boxY = 25;
      const boxWidth = 85;
      const boxHeight = 22;

      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.rect(boxX, boxY, boxWidth, boxHeight);

      doc.setFontSize(8);
      doc.setTextColor(40);

      doc.text(`ID No: ${item.id}`, boxX + 2, boxY + 5);
      doc.text(`Name: ${Patient?.name || "N/A"}`, boxX + 2, boxY + 10);
      doc.text(`Sex: ${patientGender}`, boxX + 2, boxY + 15);
      doc.text(`Age: ${patientAge}`, boxX + 30, boxY + 15);
      doc.text(`Contact: ${Patient?.phone || "N/A"}`, boxX + 50, boxY + 15);
      doc.text(`Refd By: ${referredBy?.name || "N/A"}`, boxX + 2, boxY + 20);
      doc.text(`Date: ${createdDate}`, boxX + 40, boxY + 20);
    };

    // Test Table Section
    const testTable = () => {
      const tableStartY = 50;
      const pageWidth = doc.internal.pageSize.getWidth();
      const tableWidth = 90;
      const centerX = (pageWidth - tableWidth) / 2;

      const testsData = item.tests.map((test: any, index: number) => [
        index + 1,
        test.name,
        test.price,
        test.roomNo || "N/A",
        test.deliveryTime ? `${test.deliveryTime} days` : "N/A",]);

      autoTable(doc, {
        head: [["SL", "Test/Service", "Price", "Room No", "Delivery Time"]],
        body: testsData,
        startY: tableStartY,
        styles: { fontSize: 7, cellPadding: 1 },
        headStyles: { fillColor: [0, 82, 204], textColor: [255, 255, 255] },
        tableWidth: "wrap",
        margin: { left: centerX },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 35 },
          2: { cellWidth: 15, halign: "left" },
          3: { cellWidth: 15, halign: "left" },
          4: { cellWidth: 15, halign: "left" },
        },
      });
    };

    const summary = () => {
      const finalY = (doc as any).previousAutoTable.finalY + 5;
      const { totalAmount, paidAmount, dueAmount, discount, paymentMethod } = item;

      const leftX = 10;
      const rightX = 60;
      const rowHeight = 5;

      const paymentStatus = paymentMethod === "PAID" ? "PAID" : "DUE";
      const statusColor = paymentMethod === "PAID" ? [0, 128, 0] : [255, 0, 0];
      const boxWidth = 30;
      const boxHeight = 10;

      // Draw the payment status box
      doc.setDrawColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(leftX, finalY, boxWidth, boxHeight);

      const textX = leftX + boxWidth / 2;
      const textY = finalY + boxHeight / 2 + 3;
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(paymentStatus, textX, textY, { align: "center" });

      // Display the financial details
      doc.setFontSize(8);
      doc.text(`Total Amount: ${totalAmount} BDT`, rightX, finalY);
      doc.text(`Discount: ${discount || 0} %`, rightX, finalY + rowHeight);
      const payableAmount = totalAmount - (totalAmount * (discount || 0) / 100);
      doc.text(`Payable Amount: ${payableAmount} BDT`, rightX, finalY + 2 * rowHeight);
      doc.text(`Received: ${paidAmount || 0} BDT`, rightX, finalY + 3 * rowHeight);
      doc.text(`Due Amount: ${dueAmount || 0} BDT`, rightX, finalY + 4 * rowHeight);
    };

    // Footer Section
    const footer = () => {
      const footerStartY = 135;
      const pageWidth = doc.internal.pageSize.getWidth();
      const footerHeight = 15;

      doc.setDrawColor(0);
      doc.setFillColor(137, 179, 194);
      doc.rect(0, footerStartY, pageWidth, footerHeight, "F");

      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);

      const locationText = "Location: House No. 71(1st floor), Sadar Hospital Road, Pirojpur Sadar 8500.";
      doc.text(locationText, pageWidth / 2, footerStartY + 5, { align: "center" });

      const contactText = "Email: alokpirojpur@gmail.com | Phone: +8801332-851999";
      doc.text(contactText, pageWidth / 2, footerStartY + 8, { align: "center" });

      const websiteURL = "Website: www.alokhealthcare.com";
      doc.text(websiteURL, pageWidth / 2, footerStartY + 11, { align: "center" });
    };

    header();
    patientInfo();
    testTable();
    summary();
    footer();

    const pdfBlob = doc.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);

    // Open the PDF and auto print it
    const pdfWindow = window.open(pdfURL, "_blank");
    pdfWindow?.print();
  };

  return (
    <button onClick={generatePdf} className="flex items-center gap-2 p-2 rounded-md">
      <FaPrint size={18} />
    </button>
  );
};

export default RenderPrintButton;
