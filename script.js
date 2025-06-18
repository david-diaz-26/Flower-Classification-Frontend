async function submitFlower() {
    const fileInput = document.getElementById("imageInput");
    const flowerNameInput = document.getElementById("flowerName");
    const flowerImage = document.getElementById("flowerImage");
    const flowerDescription = document.getElementById("flowerDescription");
    const loadingText = document.getElementById("loadingText");
  
    // Clear previous result
    flowerDescription.innerText = "";
    flowerImage.hidden = true;
  
    // Show loading animation
    loadingText.hidden = false;
  
    if (fileInput.files.length > 0) {
      // Handle image upload
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const response = await fetch("https://5654-2601-644-400-7a60-8d45-c902-fbce-eccf.ngrok-free.app/flower-info/by-image", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error("Server error");
        }
  
        const data = await response.json();
        flowerImage.src = URL.createObjectURL(file);
        flowerImage.hidden = false;
        flowerDescription.innerText = data.description;
  
      } catch (error) {
        console.error(error);
        flowerDescription.innerText = "Error: " + error.message;
      } finally {
        // Hide loading animation after response or error
        loadingText.hidden = true;
      }
  
    } else if (flowerNameInput.value.trim() !== "") {
      // Handle flower name text input
      const flowerName = flowerNameInput.value.trim();
  
      try {
        const response = await fetch("https://5654-2601-644-400-7a60-8d45-c902-fbce-eccf.ngrok-free.app/flower-info/by-name", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ flower_name: flowerName }),
        });
  
        if (!response.ok) {
          throw new Error("Server error");
        }
  
        const data = await response.json();
        flowerDescription.innerText = data.description;
  
      } catch (error) {
        console.error(error);
        flowerDescription.innerText = "Error: " + error.message;
      } finally {
        // Hide loading animation after response or error
        loadingText.hidden = true;
      }
  
    } else {
      loadingText.hidden = true;  // Just in case
      alert("Please upload an image or type a flower name.");
    }
  }
  