// Add drag and drop functionality
const uploadBox = document.querySelector('.upload-box');
const fileInput = document.getElementById('imageInput');

uploadBox.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadBox.style.borderColor = '#667eea';
  uploadBox.style.background = 'linear-gradient(135deg, #667eea10 0%, #764ba220 100%)';
});

uploadBox.addEventListener('dragleave', (e) => {
  e.preventDefault();
  uploadBox.style.borderColor = '#cbd5e1';
  uploadBox.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
});

uploadBox.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadBox.style.borderColor = '#cbd5e1';
  uploadBox.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    uploadBox.querySelector('.upload-text').textContent = `Selected: ${files[0].name}`;
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    uploadBox.querySelector('.upload-text').textContent = `Selected: ${e.target.files[0].name}`;
  }
});

// Enhanced submit function with better animations
async function submitFlower() {
    console.log("Submit function triggered ✅");
    const fileInput = document.getElementById("imageInput");
    const flowerImage = document.getElementById("flowerImage");
    const flowerDescription = document.getElementById("flowerDescription");
    const loadingText = document.getElementById("loadingText");
    const resultSection = document.getElementById("resultSection");

    // Debug: Print initial element states
    console.log("fileInput:", fileInput);
    console.log("flowerImage:", flowerImage);
    console.log("flowerDescription:", flowerDescription);
    console.log("loadingText:", loadingText);
    console.log("resultSection:", resultSection);

    // Clear previous results
    flowerDescription.innerHTML = "";
    flowerImage.hidden = true;
    resultSection.classList.remove('success-animation');
    loadingText.hidden = false;

    // Debug: Print file input files
    console.log("fileInput.files:", fileInput.files);

    if (fileInput.files.length === 0) {
      loadingText.hidden = true;
      showAlert("⚠️ Please upload an image.");
      console.log("No file uploaded, aborting submitFlower.");
      return;
    }

    const file = fileInput.files[0];
    console.log("Selected file:", file);

    const formData = new FormData();
    formData.append("file", file);

    // Debug: Print FormData keys
    for (let pair of formData.entries()) {
      console.log("FormData entry:", pair[0], pair[1]);
    }

    // ✅ Add selected model
    const model = document.getElementById("modelSelect").value;
    formData.append("model", model);

    try {
      console.log("Sending fetch request...");
      const response = await fetch("https://56587b9573f1.ngrok-free.app/flower-info/by-image", {
        method: "POST",
        body: formData,
      });
      console.log("Fetch response received:", response);

      if (!response.ok) {
        console.error("Fetch response not ok:", response.status, response.statusText);
        throw new Error("Server error");
      }

      const data = await response.json();
      console.log("Response JSON data:", data);

      flowerImage.src = URL.createObjectURL(file);
      flowerImage.hidden = false;

      // Use model prediction as name
      const name = data.prediction || "Unknown Flower";
      console.log("Predicted name:", name);

      // Parse description sections
      const rawDescription = data.description || "";
      console.log("Raw description:", rawDescription);

      // Try classic sections first
      const historyMatch = rawDescription.match(/History:\s*([\s\S]*?)(?=Important facts:|$)/i);
      const factsMatch = rawDescription.match(/Important facts:\s*([\s\S]*)/i);
      let html = `<div class="flower-section flower-title"><span class="section-label">🌸 Name:</span> ${name}</div>`;

      if (historyMatch || factsMatch) {
        const history = historyMatch ? historyMatch[1].trim().split(/\n|\d+\. /).filter(Boolean) : [];
        const facts = factsMatch ? factsMatch[1].trim().split(/(?:- |•)/).filter(f => f.trim()) : [];
        if (history.length) {
          html += `<div class="flower-section flower-history"><span class="section-label">📜 History:</span><ul>`;
          history.forEach(h => html += `<li>${h.replace(/<br>/g, '')}</li>`);
          html += `</ul></div>`;
        }
        if (facts.length) {
          html += `<div class="flower-section flower-facts"><span class="section-label">💡 Important Facts:</span><ul>`;
          facts.forEach(f => html += `<li>${f.replace(/<br>/g, '')}</li>`);
          html += `</ul></div>`;
        }
      } else {
        // Try markdown-style bold headers (e.g., **Section Title**)
        const sectionRegex = /\*\*(.+?)\*\*\s*([\s\S]*?)(?=(\*\*|$))/g;
        let match;
        let foundSection = false;
        while ((match = sectionRegex.exec(rawDescription)) !== null) {
          foundSection = true;
          const sectionTitle = match[1].trim();
          const sectionContent = match[2].trim().replace(/\n/g, '<br>');
          html += `<div class="flower-section"><span class="section-label"><strong>${sectionTitle}</strong></span><div>${sectionContent}</div></div>`;
        }
        // If no sections found, just show the whole description as plain text
        if (!foundSection && rawDescription) {
          html += `<div class="flower-section"><div>${rawDescription.replace(/\n/g, '<br>')}</div></div>`;
        }
      }
      flowerDescription.innerHTML = html || 'No description available.';
      resultSection.hidden = false;  
      resultSection.classList.add('success-animation');
      console.log("Result HTML set.");

    } catch (error) {
      console.error("Error in submitFlower:", error);
      flowerDescription.innerHTML = `
        <div style="color: #ef4444; background: #fef2f2; padding: 1rem; border-radius: 8px; border-left: 4px solid #ef4444;">
          ❌ Error: ${error.message}
        </div>`;
    } finally {
      loadingText.hidden = true;
      console.log("Loading text hidden, submitFlower finished.");
    }
}
  
  // Helper: Show temporary alert
  function showAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `
      <div style="
        position: fixed; 
        top: 20px; 
        right: 20px; 
        background: #fbbf24; 
        color: white; 
        padding: 1rem 1.5rem; 
        border-radius: 8px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
      ">
        ${message}
      </div>`;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
  }
// Add enter key support for text input

// Allow selecting a sample image and setting it as the file input
function selectSampleImage(imagePath) {
  fetch(imagePath)
    .then(res => res.blob())
    .then(blob => {
      const file = new File([blob], imagePath, { type: blob.type });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      uploadBox.querySelector('.upload-text').textContent = `Selected: ${file.name}`;
    });
}

// Add slide-in animation for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);