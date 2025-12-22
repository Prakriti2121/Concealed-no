import jsPDF from "jspdf";
import type { Product } from "@/types/types";

// Helper function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Helper function to load image with CORS handling
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => resolve(img);
    img.onerror = () => {
      const img2 = new Image();
      img2.onload = () => resolve(img2);
      img2.onerror = reject;
      img2.src = src;
    };

    img.src = src;
  });
};

export const generateProductPDF = async (product: Product) => {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set PDF metadata with product title
    pdf.setProperties({
      title: product.title,
      subject: `${product.title} - Wine Product Information`,
      author: "Wine Store",
      keywords: product.tagLine || product.title,
      creator: "Wine Store PDF Generator",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPosition = margin;

    // Title Section
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(29, 41, 57);
    const titleLines = pdf.splitTextToSize(product.title, contentWidth);
    titleLines.forEach((line: string) => {
      pdf.text(line, margin, yPosition);
      yPosition += 7;
    });

    yPosition += 1;

    // Tagline
    if (product.tagLine) {
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(120, 120, 120);
      const tagLines = pdf.splitTextToSize(product.tagLine, contentWidth);
      tagLines.forEach((line: string) => {
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
    }

    yPosition += 3;

    // Separator line
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Price Section with subtle background
    pdf.setFillColor(255, 250, 245);
    pdf.roundedRect(margin, yPosition - 3, contentWidth, 12, 1, 1, "F");

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(224, 148, 78);
    pdf.text(`€${product.price.toFixed(2)}`, margin + 3, yPosition + 4);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(120, 120, 120);
    const productCodeText = product.sortiment
      ? `${product.sortiment} • ${product.productCode}`
      : product.productCode;
    const codeWidth = pdf.getTextWidth(productCodeText);
    pdf.text(
      productCodeText,
      pageWidth - margin - codeWidth - 3,
      yPosition + 4
    );

    yPosition += 16;

    // Two-column layout
    const leftColumnX = margin;
    const rightColumnX = margin + 70;
    const rightColumnWidth = contentWidth - 70;

    // Product Image - Natural aspect ratio with max dimensions
    const imageStartY = yPosition;
    let imageHeight = 0;

    try {
      const img = await loadImage(
        product.largeImage || "/placeholder-wine.png"
      );

      // Calculate dimensions maintaining aspect ratio
      const maxWidth = 60;
      const maxHeight = 100;
      let imgWidth = maxWidth;
      let imgHeight = (img.height / img.width) * maxWidth;

      // If height exceeds max, scale down based on height
      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = (img.width / img.height) * maxHeight;
      }

      imageHeight = imgHeight;

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL("image/png", 0.95);

        // Center image in left column
        const imgXPosition = leftColumnX + (65 - imgWidth) / 2;
        pdf.addImage(
          imgData,
          "PNG",
          imgXPosition,
          imageStartY,
          imgWidth,
          imgHeight
        );
      }
    } catch (error) {
      console.error("Error loading image:", error);
      imageHeight = 80;
    }

    // Badges below image with subtle styling
    const badgeY = imageStartY + imageHeight + 6;
    const badges = [];
    if (product.isNew) badges.push("Uusi");
    if (product.organic) badges.push("Luomu");
    if (product.featured) badges.push("Suositeltu");
    if (product.availableOnlyOnline) badges.push("Vain verkossa");

    if (badges.length > 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.roundedRect(leftColumnX, badgeY - 2, 60, 8, 1, 1, "F");

      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(224, 148, 78);
      const badgeText = badges.join(" • ");
      const badgeLines = pdf.splitTextToSize(badgeText, 55);
      let badgeYPos = badgeY + 2;
      badgeLines.forEach((line: string) => {
        const lineWidth = pdf.getTextWidth(line);
        const centerX = leftColumnX + (60 - lineWidth) / 2;
        pdf.text(line, centerX, badgeYPos);
        badgeYPos += 3.5;
      });
    }

    // Right column content with card-style sections
    let rightYPosition = imageStartY;

    // Helper function for section with border
    const addInfoCard = (
      title: string,
      y: number,
      content: () => number
    ): number => {
      const startY = y;

      // Draw section title
      pdf.setFillColor(255, 250, 245);
      pdf.rect(rightColumnX, y, rightColumnWidth, 8, "F");

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(224, 148, 78);
      pdf.text(title, rightColumnX + 3, y + 5);

      y += 10;

      // Content area
      const contentY = content();

      // Draw border around entire card
      pdf.setDrawColor(240, 240, 240);
      pdf.setLineWidth(0.5);
      pdf.rect(rightColumnX, startY, rightColumnWidth, contentY - startY + 2);

      return contentY + 5;
    };

    // Product Details Card
    if (
      product.producerUrl ||
      product.region ||
      product.vintage ||
      product.alcohol
    ) {
      rightYPosition = addInfoCard("Tuotetiedot", rightYPosition, () => {
        let y = rightYPosition + 14;
        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 60);

        if (product.producerUrl) {
          const producer = product.producerUrl.split("/").pop() || "Tuottaja";
          pdf.setFont("helvetica", "bold");
          pdf.text("Tuottaja:", rightColumnX + 3, y);
          pdf.setFont("helvetica", "normal");
          const producerLines = pdf.splitTextToSize(
            producer,
            rightColumnWidth - 30
          );
          producerLines.forEach((line: string, index: number) => {
            pdf.text(line, rightColumnX + (index === 0 ? 25 : 3), y);
            if (index < producerLines.length - 1) y += 4;
          });
          y += 7;
        }

        if (product.region) {
          pdf.setFont("helvetica", "bold");
          pdf.text("Alue:", rightColumnX + 3, y);
          pdf.setFont("helvetica", "normal");
          pdf.text(product.region, rightColumnX + 25, y);
          y += 7;
        }

        if (product.vintage) {
          pdf.setFont("helvetica", "bold");
          pdf.text("Vuosikerta:", rightColumnX + 3, y);
          pdf.setFont("helvetica", "normal");
          pdf.text(product.vintage, rightColumnX + 25, y);
          y += 7;
        }

        if (product.alcohol) {
          pdf.setFont("helvetica", "bold");
          pdf.text("Alkoholi:", rightColumnX + 3, y);
          pdf.setFont("helvetica", "normal");
          pdf.text(`${product.alcohol}%`, rightColumnX + 25, y);
          y += 7;
        }

        return y;
      });
    }

    // Taste Profile Card
    if (product.taste) {
      const tasteArray = Array.isArray(product.taste)
        ? product.taste
        : typeof product.taste === "string"
        ? JSON.parse(product.taste)
        : Object.values(product.taste || {});

      if (tasteArray.length > 0) {
        rightYPosition = addInfoCard("Makuprofiili", rightYPosition, () => {
          let y = rightYPosition + 14;
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(60, 60, 60);
          const tasteText = tasteArray.join(", ");
          const tasteLines = pdf.splitTextToSize(
            tasteText,
            rightColumnWidth - 6
          );
          tasteLines.forEach((line: string) => {
            pdf.text(line, rightColumnX + 3, y);
            y += 5;
          });
          return y + 1;
        });
      }
    }

    // Wine Details Card
    if (product.bottleVolume || product.composition || product.closure) {
      rightYPosition = addInfoCard("Viinin tiedot", rightYPosition, () => {
        let y = rightYPosition + 14;
        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 60);

        if (product.bottleVolume) {
          pdf.setFont("helvetica", "bold");
          pdf.text("Tilavuus:", rightColumnX + 3, y);
          pdf.setFont("helvetica", "normal");
          pdf.text(`${product.bottleVolume} ml`, rightColumnX + 25, y);
          y += 7;
        }

        if (product.composition) {
          pdf.setFont("helvetica", "bold");
          pdf.text("Koostumus:", rightColumnX + 3, y);
          pdf.setFont("helvetica", "normal");
          const compLines = pdf.splitTextToSize(
            product.composition,
            rightColumnWidth - 30
          );
          compLines.forEach((line: string, index: number) => {
            pdf.text(line, rightColumnX + (index === 0 ? 28 : 3), y);
            y += 4;
          });
          y += 3;
        }

        if (product.closure) {
          pdf.setFont("helvetica", "bold");
          pdf.text("Sulkija:", rightColumnX + 3, y);
          pdf.setFont("helvetica", "normal");
          pdf.text(product.closure, rightColumnX + 25, y);
          y += 7;
        }

        return y;
      });
    }

    // Move to full width for remaining sections
    yPosition = Math.max(rightYPosition, imageStartY + imageHeight + 30);

    // Food Pairings Section
    const foodPairings: string[] = [];
    if (product.vegetables) foodPairings.push("Vihannekset");
    if (product.roastedVegetables) foodPairings.push("Paahdetut vihannekset");
    if (product.softCheese) foodPairings.push("Pehmeä juusto");
    if (product.hardCheese) foodPairings.push("Kova juusto");
    if (product.starches) foodPairings.push("Tärkkelys");
    if (product.fish) foodPairings.push("Kala");
    if (product.richFish) foodPairings.push("Rasvainen kala");
    if (product.whiteMeatPoultry)
      foodPairings.push("Valkoinen liha/Siipikarja");
    if (product.lambMeat) foodPairings.push("Lammas");
    if (product.porkMeat) foodPairings.push("Sianliha");
    if (product.redMeatBeef) foodPairings.push("Punainen liha/Naudanliha");
    if (product.gameMeat) foodPairings.push("Riistaliha");
    if (product.curedMeat) foodPairings.push("Suolattu liha");
    if (product.sweets) foodPairings.push("Makeiset");

    if (foodPairings.length > 0) {
      const sectionStartY = yPosition;

      pdf.setFillColor(255, 250, 245);
      pdf.rect(margin, yPosition, contentWidth, 8, "F");

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(224, 148, 78);
      pdf.text("Ruokayhdistelmät", margin + 3, yPosition + 5);
      yPosition += 10;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);
      const pairingText = foodPairings.join(" • ");
      const pairingLines = pdf.splitTextToSize(pairingText, contentWidth - 6);
      pairingLines.forEach((line: string) => {
        pdf.text(line, margin + 3, yPosition);
        yPosition += 4;
      });
      yPosition += 2;

      pdf.setDrawColor(240, 240, 240);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, sectionStartY, contentWidth, yPosition - sectionStartY);
      yPosition += 5;
    }

    // Producer Description
    if (
      product.producerDescription &&
      product.producerDescription.trim() !== ""
    ) {
      if (yPosition > pageHeight - 70) {
        pdf.addPage();
        yPosition = margin + 10;
      }

      const sectionStartY = yPosition;

      pdf.setFillColor(255, 250, 245);
      pdf.rect(margin, yPosition, contentWidth, 8, "F");

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(224, 148, 78);
      pdf.text("Tietoa tuottajasta", margin + 3, yPosition + 5);
      yPosition += 10;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);
      const cleanDescription = stripHtmlTags(product.producerDescription);
      const descLines = pdf.splitTextToSize(cleanDescription, contentWidth - 6);
      const maxDescLines = Math.min(descLines.length, 15);

      for (let i = 0; i < maxDescLines; i++) {
        pdf.text(descLines[i], margin + 3, yPosition);
        yPosition += 4;
      }
      yPosition += 2;

      pdf.setDrawColor(240, 240, 240);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, sectionStartY, contentWidth, yPosition - sectionStartY);
      yPosition += 5;
    }

    // Additional Info
    if (product.additionalInfo) {
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = margin + 10;
      }

      const sectionStartY = yPosition;

      pdf.setFillColor(255, 250, 245);
      pdf.rect(margin, yPosition, contentWidth, 8, "F");

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(224, 148, 78);
      pdf.text("Lisätietoja", margin + 3, yPosition + 5);
      yPosition += 10;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);
      const infoLines = pdf.splitTextToSize(
        product.additionalInfo,
        contentWidth - 6
      );
      const maxInfoLines = Math.min(infoLines.length, 10);

      for (let i = 0; i < maxInfoLines; i++) {
        pdf.text(infoLines[i], margin + 3, yPosition);
        yPosition += 4;
      }
      yPosition += 2;

      pdf.setDrawColor(240, 240, 240);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, sectionStartY, contentWidth, yPosition - sectionStartY);
      yPosition += 5;
    }

    // Awards
    if (product.awards) {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin + 10;
      }

      const sectionStartY = yPosition;

      pdf.setFillColor(255, 250, 245);
      pdf.rect(margin, yPosition, contentWidth, 8, "F");

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(224, 148, 78);
      pdf.text("Palkinnot", margin + 3, yPosition + 5);
      yPosition += 10;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);
      const awardLines = pdf.splitTextToSize(product.awards, contentWidth - 6);
      const maxAwardLines = Math.min(awardLines.length, 8);

      for (let i = 0; i < maxAwardLines; i++) {
        pdf.text(awardLines[i], margin + 3, yPosition);
        yPosition += 4;
      }
      yPosition += 2;

      pdf.setDrawColor(240, 240, 240);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, sectionStartY, contentWidth, yPosition - sectionStartY);
    }

    // Footer
    const footerY = pageHeight - 12;
    pdf.setDrawColor(224, 148, 78);
    pdf.setLineWidth(0.5);
    pdf.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(224, 148, 78);

    if (product.buyLink) {
      pdf.textWithLink("Osta tämä viini →", margin, footerY, {
        url: product.buyLink,
      });
    }

    pdf.setTextColor(120, 120, 120);
    const dateText = `Luotu: ${new Date().toLocaleDateString("fi-FI")}`;
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.text(dateText, pageWidth - margin - dateWidth, footerY);

    // Generate filename from product title
    const sanitizedTitle = product.title
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase()
      .substring(0, 50);
    const filename = `${sanitizedTitle}-${product.productCode}.pdf`;

    // Save the PDF with the proper filename
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
