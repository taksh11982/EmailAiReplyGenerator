# 🤖 AI Email Reply Generator

An intelligent Chrome extension that generates professional email replies using Google's Gemini AI, seamlessly integrated into Gmail's compose interface.


 Features

- 🚀 **One-Click AI Replies**: Generate professional email responses instantly
- 🎯 **Smart Context Understanding**: Analyzes incoming email content for relevant replies
- 🎨 **Gmail Integration**: Seamlessly blends with Gmail's native interface
- 🔧 **Customizable Tone**: Professional tone settings for appropriate responses
- ⚡ **Fast & Reliable**: Quick response generation with error handling

## 🛠️ Technology Stack

### Frontend (Chrome Extension)
- **JavaScript**: Content script injection and DOM manipulation
- **Chrome Extension APIs**: Gmail integration
- **CSS**: Custom styling to match Gmail interface

### Backend (Spring Boot)
- **Java 17+**: Core backend development
- **Spring Boot**: RESTful API framework
- **Spring WebFlux**: Reactive web client for API calls
- **Google Gemini AI**: Advanced language model for reply generation

## 📋 Prerequisites

- Java 17 or higher
- Chrome Browser
- Google Gemini AI API Key
- Maven (for building Spring Boot app)

## 🚀 Installation & Setup

### 1. Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/email-auto-reply-extension.git
   cd email-auto-reply-extension/backend
   ```

2. **Get Gemini AI API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Generate your API key

3. **Configure Application Properties**
   ```properties
   # src/main/resources/application.properties
   gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
   gemini.api.key=YOUR_GEMINI_API_KEY_HERE
   server.port=8080
   ```

4. **Run the Backend**
   ```bash
   mvn spring-boot:run
   ```

### 2. Chrome Extension Setup

1. **Navigate to Extension Folder**
   ```bash
   cd ../chrome-extension
   ```

2. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `chrome-extension` folder

3. **Verify Installation**
   - Go to Gmail
   - Click "Compose" to write a new email
   - Look for the blue "AI Reply" button in the toolbar

## 💡 How to Use

1. **Open Gmail** in your Chrome browser
2. **Click "Compose"** to start writing an email or reply to an existing email
3. **Click the "AI Reply" button** in the compose toolbar
4. **Wait for generation** - the button will show "Generating..."
5. **Review and edit** the generated reply as needed
6. **Send your email** using Gmail's send button

## 🏗️ Project Structure

```
email-auto-reply-extension/
├── backend/
│   ├── src/main/java/com/email/emailautoreply/
│   │   ├── EmailAutoReplyApplication.java
│   │   ├── EmailController.java
│   │   ├── EmailService.java
│   │   └── EmailRequest.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── chrome-extension/
│   ├── manifest.json
│   ├── content-script.js
│   └── icons/
└── README.md
```

## 🔧 API Endpoints

### Generate Email Reply
```
POST /api/email/generate
Content-Type: application/json

{
    "emailContent": "Original email content here",
    "tone": "professional"
}
```

**Response:**
```
Thank you for your email. I'll get back to you soon.
```
