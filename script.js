const messages = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const micButton = document.getElementById("micButton");
const voiceStatus = document.getElementById("voiceStatus");

function addMessage(text, sender) {
    const message = document.createElement("div");
    message.classList.add("message", sender);
    message.textContent =
        (sender === "azra" ? "A.Z.R.A.: " : "You: ") + text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function speak(text) {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}

function getResponse(input) {
    const text = input.toLowerCase().trim();

    if (text.includes("hello") || text.includes("hi"))
        return "Hello! It's wonderful to hear from you. How may I assist you?";

    if (text.includes("your name") || text.includes("who are you"))
        return "I am A.Z.R.A., your personal digital assistant.";

    if (text.includes("who created you"))
        return "I was created by my developer as a personal AI assistant project.";

    if (text.includes("what can you do") || text.includes("capabilities"))
        return "I can communicate, answer programmed questions, and help with tasks. My advanced AI brain is still being developed.";

    if (text.includes("time"))
        return "The current time is " + new Date().toLocaleTimeString() + ".";

    if (text.includes("date") || text.includes("today"))
        return "Today's date is " + new Date().toLocaleDateString() + ".";

    if (text.includes("how are you"))
        return "My systems are running smoothly! Thank you for asking.";

    if (text.includes("thank you") || text.includes("thanks"))
        return "You're welcome! I'm always ready to help.";

    if (text.includes("help"))
        return "Of course! Tell me what you need help with.";

    if (text.includes("bye") || text.includes("goodbye"))
        return "Goodbye! A.Z.R.A. systems standing by.";

    return "I'm still learning how to respond to that. My advanced AI brain is not connected yet.";
}

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    const response = getResponse(text);

    setTimeout(function() {
        addMessage(response, "azra");
        speak(response);
    }, 400);
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") sendMessage();
});

document.querySelectorAll(".quick").forEach(function(button) {
    button.addEventListener("click", function() {
        userInput.value = button.dataset.message;
        sendMessage();
    });
});

// MICROPHONE SYSTEM
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

micButton.addEventListener("click", function() {
    voiceStatus.textContent = "Microphone button activated!";

    if (!SpeechRecognition) {
        voiceStatus.textContent =
            "Speech recognition is not supported in this browser.";
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceStatus.textContent = "Listening...";

    recognition.onresult = function(event) {
        userInput.value = event.results[0][0].transcript;
        voiceStatus.textContent = "Voice recognized!";
        sendMessage();
    };

    recognition.onerror = function(event) {
        voiceStatus.textContent = "Microphone error: " + event.error;
    };

    recognition.onend = function() {
        micButton.textContent = "🎙️";
    };

    try {
        recognition.start();
    } catch (error) {
        voiceStatus.textContent = "Could not start microphone.";
    }
});
