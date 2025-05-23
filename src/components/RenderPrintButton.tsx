"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaPrint } from "react-icons/fa";

const RenderPrintButton = ({ item }: { item: any }) => {
  // console.log("Item:", item);
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

    // Header Section
    const header = () => {
      const pageWidth = doc.internal.pageSize.width; // Get the page width
      const imageWidth = 25;
      const imageHeight = 15;

      const centerX = pageWidth / 2; // Center of the page
      const imageY = 5;              // Y-position for the logo
      const textY = imageY + imageHeight + 5; // Position the text below the image

      // Add logo image (centered)
      doc.addImage(
        logoBase64,
        "PNG",
        centerX - imageWidth / 2, // Center the image horizontally
        imageY,
        imageWidth,
        imageHeight
      );

      // Set font to bold
      doc.setFont("helvetica", "bold");

      // Set the text color (adjust RGB if needed)
      doc.setTextColor(0, 123, 255);

      // Set font size
      doc.setFontSize(12);

      // Add the text (centered below the logo)
      doc.text("Alok Health Care and Diagnostic Solution", centerX, textY, {
        align: "center",
      });
    };


    // Patient Information Section
    const patientInfo = () => {
      const { Patient, referredBy, createdAt } = item;
      const createdDate = new Date(createdAt).toLocaleString();
      const patientGender = Patient?.gender || "N/A";
      const patientAge = Patient?.dateOfBirth || "N/A";

      const boxX = 10;
      const boxY = 30;
      const boxWidth = 85;
      const boxHeight = 22;

      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.rect(boxX, boxY, boxWidth, boxHeight);

      doc.setFontSize(8);
      doc.setTextColor(40);

      // doc.text(`Address: ${Patient?.address || "N/A"}`, boxX + 50, boxY + 10);
      doc.text(`Memo No: ${item.memoNo}`, boxX + 2, boxY + 5);
      doc.text(`Date: ${createdDate}`, boxX + 40, boxY + 5);

      doc.text(`Name: ${Patient?.name || "N/A"}`, boxX + 2, boxY + 10);

      doc.text(`Contact: ${Patient?.phone || "N/A"}`, boxX + 2, boxY + 15);
      doc.text(`Age: ${patientAge}`, boxX + 40, boxY + 15);
      doc.text(`Sex: ${patientGender}`, boxX + 60, boxY + 15);

      doc.text(`Refd By: ${referredBy?.name || "N/A"}`, boxX + 2, boxY + 20);
    };

    // Test Table Section
    const testTable = () => {
      const tableStartY = 55;
      const pageWidth = doc.internal.pageSize.getWidth();
      const tableWidth = 90;
      const centerX = (pageWidth - tableWidth) / 2;

      const testsData = item.MemoToTest?.map((test: any, index: number) => [
        index + 1,
        test.testName || "N/A",
        test.price || "N/A",
        test.roomNo || "N/A",
        test.deliveryTime ? `${test.deliveryTime}` : "N/A",
      ]) || [];

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

    // Summary Section
    const summary = () => {
      const finalY = (doc as any).previousAutoTable.finalY + 5;

      const {
        totalAmount,
        paidAmount,
        dueAmount,
        discount,
        paymentMethod,
        extraDiscount
      } = item;

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
      doc.text(`Total Amount: ${totalAmount} BDT`, rightX, finalY + 1 * rowHeight);

      doc.text(`Discount: ${extraDiscount || 0} BDT`, rightX, finalY + 2 * rowHeight);

      const payableAmount =
        totalAmount - (totalAmount * (discount || 0) / 100) - (extraDiscount || 0);

      doc.text(`Payable Amount: ${payableAmount} BDT`, rightX, finalY + 3 * rowHeight);
      doc.text(`Received: ${paidAmount || 0} BDT`, rightX, finalY + 4 * rowHeight);
      doc.text(`Due Amount: ${dueAmount || 0} BDT`, rightX, finalY + 5 * rowHeight);
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
