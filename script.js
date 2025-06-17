async function uploadImage() {
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];
  
    if (!file) {
      alert("Please select an image");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("https://your-backend-url.com/classify", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Server error");
      }
  
      const data = await response.json();
      document.getElementById("result").innerText = data.description;
    } catch (error) {
      console.error(error);
      document.getElementById("result").innerText = "Error: " + error.message;
    }
  }
  