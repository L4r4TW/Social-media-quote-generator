document.addEventListener("DOMContentLoaded", async () => {
  const imageUrl =
    "https://api.unsplash.com/photos/random?client_id=Kag9FomqzMz9Ltwlsh86xZGC4lp4GaL_21FgN2BphtU&w=1800&h=1800";
  const quoteUrl = "https://api.quotable.io/random";

  try {
    // Fetch the image URL from Unsplash
    const imageResponse = await fetch(imageUrl);
    const imageData = await imageResponse.json();
    const imageSrc = imageData.urls.raw + "&w=1800&h=1800";

    // Fetch the quote from Quotable
    const quoteResponse = await fetch(quoteUrl);
    const quoteData = await quoteResponse.json();
    const quoteText = quoteData.content;
    const quoteAuthor = quoteData.author;

    console.log("Image URL:", imageSrc); // Debugging
    console.log("Quote:", quoteText); // Debugging
    console.log("Author:", quoteAuthor); // Debugging

    // Create a new image element
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "Anonymous"; // To avoid CORS issues

    img.onload = () => {
      // // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      console.log("Loaded");

      const aspectRatio = img.width / img.height;
      let newWidth, newHeight;

      if (img.width < img.height) {
        newWidth = 1080;
        newHeight = 1080 / aspectRatio;
      } else {
        newHeight = 1080;
        newWidth = 1080 * aspectRatio;
      }

      // Set canvas size
      canvas.width = 1080;
      canvas.height = 1080;

      // Draw image to canvas, cropping the longer side
      ctx.drawImage(
        img,
        (newWidth - 1080) / 2, // Start X to crop from center
        (newHeight - 1080) / 2, // Start Y to crop from center
        1080, // Width to draw
        1080, // Height to draw
        0,
        0,
        1080,
        1080
      );

      // Step 2: Add a semi-transparent dark layer
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Black with 50% opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Covers the entire canvas

      // Define the margins
      const margin = 130; // You can adjust the margin
      const maxWidth = canvas.width - margin * 2; // Width available for text
      const maxHeight = canvas.height - margin * 2; // Height available for text

      // Add text shadow for better visibility
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)"; // Shadow color
      ctx.shadowBlur = 10; // Blur level of the shadow
      ctx.shadowOffsetX = 5; // Horizontal shadow offset
      ctx.shadowOffsetY = 5; // Vertical shadow offset

      // Dynamically adjust text size
      drawDynamicText(ctx, quoteText, margin, margin, maxWidth, maxHeight);

      function drawDynamicText(ctx, quoteText, x, y, maxWidth, maxHeight) {
        let fontSize = 150; // Starting font size

        // Loop to find the maximum font size that fits in the margins
        do {
          ctx.font = `${fontSize}px Oswald`;
          var lines = wrapText(ctx, quoteText, maxWidth);
          fontSize--;
          console.log(`Fontsize: ${fontSize}`);
        } while (fontSize > 0 && lines.length * fontSize * 1.2 > maxHeight);

        // Center the text vertically within the available height
        let lineHeight = fontSize * 1.2;
        let totalHeight = lines.length * lineHeight;
        let startY = (canvas.height - totalHeight) / 2;

        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        // Draw the text line by line
        lines.forEach((line, index) => {
          ctx.fillText(
            line,
            canvas.width / 2,
            startY + (index + 1) * lineHeight
          );
        });
      }

      // Function to wrap text
      function wrapText(ctx, quoteText, maxWidth) {
        const words = quoteText.split(" ");
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + " " + word).width;
          if (width < maxWidth) {
            currentLine += " " + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        return lines;
      }

      // Convert canvas to data URL
      const dataURL = canvas.toDataURL("image/png");

      // Create or get the img element to display the final image
      let imgElement = document.getElementById("final-image");
      if (!imgElement) {
        imgElement = document.createElement("img");
        imgElement.id = "final-image";
        document.body.appendChild(imgElement);
      }
      imgElement.src = dataURL;
    };

    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
  } catch (error) {
    console.error("Error fetching image or quote:", error);
  }
});
