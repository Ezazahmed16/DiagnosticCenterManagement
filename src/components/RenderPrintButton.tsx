"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaPrint } from "react-icons/fa";

const RenderPrintButton = ({ item }: { item: any }) => {
  const generatePdf = async () => {
    const doc = new jsPDF();

    // Function to convert an image file to Base64
    const loadLogoAsBase64 = async (path: string) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.src = path; // Dynamic path
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

    // Load the logo dynamically
    const logoBase64 = await loadLogoAsBase64("/images/logo/logo.png");

    // Header Section (with logo)
    const header = () => {
      doc.setFontSize(16);
      doc.setTextColor(40);

      // Add logo image
      const imageWidth = 30;
      const imageHeight = 15;
      const imageX = 90;
      const imageY = 5;
      doc.addImage(logoBase64, "PNG", imageX, imageY, imageWidth, imageHeight);

      // Add text below the logo
      doc.setFontSize(12);
      doc.setTextColor(80);
      doc.text(
        "House no. 71(1st floor), sadar hospital road, pirojpur sadar 8500.",
        105,
        imageY + imageHeight + 6,
        { align: "center" }
      );

      // Calculate the position for both Hotline and Email, centered together
      const hotlineText = "Hotline: +880 13 3285 1999";
      const emailText = "Email: alokpirojpur@gmail.com";

      const hotlineWidth = doc.getTextWidth(hotlineText); // Width of the Hotline text
      const emailWidth = doc.getTextWidth(emailText); // Width of the Email text
      const totalWidth = hotlineWidth + emailWidth + 20; // Add some space between the texts (adjustable)

      const centerX = doc.internal.pageSize.width / 2;  // Page center

      // Calculate the starting X position so the combined width is centered
      const startX = centerX - totalWidth / 2;

      // Add Hotline and Email texts next to each other, both centered
      doc.text(hotlineText, startX, imageY + imageHeight + 12);
      doc.text(emailText, startX + hotlineWidth + 20, imageY + imageHeight + 12); // Adding space between the texts


      // Draw a border below the header
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(10, imageY + imageHeight + 18, 200, imageY + imageHeight + 18);
    };

    // Border line after Header
    const borderLineAfterHeader = () => {
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(10, 40, 200, 40); // Below the header section
    };

    // Patient Information Section
    const patientInfo = () => {
      const { Patient, referredBy, createdAt } = item;
      const createdDate = new Date(createdAt).toLocaleString();
      const patientGender = Patient?.gender || "N/A";
      const patientAge = Patient?.dateOfBirth
        ? new Date(Patient.dateOfBirth).toLocaleDateString("en-GB")
        : "N/A";

      doc.setFontSize(12);
      doc.setTextColor(40);

      const patientInfoStartY = 45; // Position after the header

      // First column: ID and Date
      doc.text(`ID No: ${item.id}`, 10, patientInfoStartY);
      doc.text(`Date: ${createdDate}`, 130, patientInfoStartY);

      // Second column: Name, Gender, and Age
      doc.text(`Name: ${Patient?.name || "N/A"}`, 10, patientInfoStartY + 7);
      doc.text(`Sex: ${patientGender}`, 70, patientInfoStartY + 7);
      doc.text(`Age: ${patientAge}`, 130, patientInfoStartY + 7);

      // Third column: Contact and Referred By
      doc.text(`Contact: ${Patient?.phone || "N/A"}`, 10, patientInfoStartY + 14);
      doc.text(`Refd By: ${referredBy?.name || "N/A"}`, 70, patientInfoStartY + 14);

      // Draw a border below the patient info section
      doc.line(10, patientInfoStartY + 20, 200, patientInfoStartY + 20);
    };

    // Border line after Patient Info
    const borderLineAfterPatientInfo = () => {
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      // doc.line(10, 85, 200, 85); // Below the patient info section
    };

    // Test Table Section
    const testTable = () => {
      const tableStartY = 70; // Start after patient info section
      const testsData = item.tests.map((test: any, index: number) => [
        index + 1,
        test.name,
        test.price,
        test.roomNo || "N/A",
      ]);

      autoTable(doc, {
        head: [["SL", "Test/Service", "Price", "Room No"]],
        body: testsData,
        startY: tableStartY,
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [0, 82, 204], textColor: [255, 255, 255] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 90 },
          2: { cellWidth: 40, halign: "right" },
          3: { cellWidth: 40, halign: "center" },
        },
      });
    };

    // Summary Section
    const summary = () => {
      const finalY = (doc as any).previousAutoTable.finalY + 10;
      const { totalAmount, paidAmount, dueAmount, discount, paymentMethod } = item;

      doc.setFontSize(12);
      doc.setTextColor(40);
      doc.text("Summary", 10, finalY);

      doc.setFontSize(14);
      doc.text(`Total Amount: ${totalAmount} BDT`, 150, finalY, { align: "right" });
      doc.text(`Discount: ${discount || 0} BDT`, 150, finalY + 7, { align: "right" });
      doc.text(`Paid Amount: ${paidAmount || 0} BDT`, 150, finalY + 14, { align: "right" });
      doc.text(`Due Amount: ${dueAmount || 0} BDT`, 150, finalY + 21, { align: "right" });

      const paymentStatus = paymentMethod === "PAID" ? "PAID" : "DUE";
      const statusColor = paymentMethod === "PAID" ? [0, 128, 0] : [255, 0, 0];

      const boxX = 10;
      const boxY = finalY + 28;
      const boxWidth = 50;
      const boxHeight = 12;

      // Draw a thin black border for the status
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 0);
      doc.rect(boxX, boxY, boxWidth, boxHeight);

      // Add text inside the box
      doc.setFont("bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(paymentStatus, boxX + boxWidth / 2, boxY + 8, { align: "center" });

      // Draw a bold border for the status
      doc.setLineWidth(2);
      doc.setDrawColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.rect(boxX, boxY, boxWidth, boxHeight);
    };

    // Footer Section
    const footer = () => {
      const footerStartY = 280;
      const pageCount = doc.getNumberOfPages();

      doc.setFontSize(14);
      doc.setTextColor(80);
      doc.setLineWidth(0.5);
      doc.line(12, footerStartY - 5, 200, footerStartY - 10);

      doc.text("Your health is our commitment.", 105, footerStartY, { align: "center" });

    };

    // Add Sections to the PDF
    header();
    borderLineAfterHeader();
    patientInfo();
    borderLineAfterPatientInfo();
    testTable();
    summary();
    footer();

    // Open the PDF in a new browser tab
    const pdfBlob = doc.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL, "_blank");
  };

  return (
    <button onClick={generatePdf} className="flex items-center gap-2 p-2 rounded-md">
      <FaPrint size={18} />
    </button>
  );
};

export default RenderPrintButton;
