# Flower Classifier Frontend

This is the **frontend UI** for the Flower Classification and Description app. It allows users to upload a flower image, choose a model, and view a generated description powered by an AI backend.

- **Hosted on Netlify**  
-  **Connected to a FastAPI backend via ngrok tunnel**

## Features

- **Image Upload & Drag-and-Drop:** Easily upload or drag-and-drop a flower image.
- **Sample Image Selection:** Choose from preloaded flowers like rose, sunflower, and tulip.
- **Model Selector:** Switch between different backend models (e.g., Baseline CNN, Model 2, Model 3).
- **AI Descriptions:** LLM-generated output includes flower history, traits, and cultural facts.
- **Animations & Feedback:** User-friendly animations and status feedback during processing.

## How It Works

This UI is **frontend-only** and sends requests to the backend’s API endpoint:

# Run Locally
If just working on UI, can spin up a local web server

1. Run Server (port number can be what you want, common is 8000)
```bash
python -m http.server 3000
```

2. (Optional, if want to test with backend) Run Docker/local server of the backend (other branch) and start ngrok

IMPORTANT: when ngrok is started, it will give a url and the current url (api) in script will have to be updated to that.
It will be the first http address after 'Fowarding'
