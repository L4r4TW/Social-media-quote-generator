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

      // // Set canvas size to match image
      // canvas.width = img.width;
      // canvas.height = img.height;

      // // Draw the image on the canvas
      // ctx.drawImage(img, 0, 0);

      // // Set the text style
      // ctx.font = "bold 48px Arial"; // Larger font size
      // ctx.fillStyle = "white"; // Text color
      // ctx.textAlign = "center";
      // ctx.textBaseline = "middle";
      // ctx.lineWidth = 4; // Text outline width

      // // Add a text shadow for better readability
      // ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      // ctx.shadowBlur = 10;

      // // Calculate text position
      // const x = canvas.width / 2;
      // const y = canvas.height / 2;

      // // Add the quote text to the canvas
      // ctx.fillText(quoteText, x, y); // Centered position for quote
      // ctx.font = "italic 24px Arial"; // Smaller font size for author
      // ctx.fillText(`- ${quoteAuthor}`, x, y + 60); // Adjust y for author below quote

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
