
const messages = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const micButton = document.getElementById("micButton");
const voiceStatus = document.getElementById("voiceStatus");

// AZRA VOICE SETTINGS
const voiceSettings = {
    language: "en-US",
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
};

let selectedVoice = null;

// Find a suitable calm English voice
function chooseVoice() {
    if (!window.speechSynthesis) return;

    const voices = window.speechSynthesis.getVoices();

    const englishVoices = voices.filter(voice =>
        voice.lang.toLowerCase().startsWith("en")
    );

    selectedVoice =
        englishVoices.find(voice =>
            /samantha|karen|moira|tessa|serena/i.test(voice.name)
        ) ||
        englishVoices.find(voice =>
            /female/i.test(voice.name)
        ) ||
        englishVoices[0] ||
        null;
}

if (window.speechSynthesis) {
    chooseVoice();

    window.speechSynthesis.onvoiceschanged = chooseVoice;
}

// DISPLAY MESSAGES
function addMessage(text, sender) {
    const message = document.createElement("div");

    message.classList.add("message", sender);

    message.textContent =
        (sender === "azra" ? "A.Z.R.A.: " : "You: ") + text;

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;
}

// SPEAKING SYSTEM
function speak(text) {
    if (!window.speechSynthesis) {
        voiceStatus.textContent = "Speech output is unavailable.";
        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = voiceSettings.language;
    speech.rate = voiceSettings.rate;
    speech.pitch = voiceSettings.pitch;
    speech.volume = voiceSettings.volume;

    if (selectedVoice) {
        speech.voice = selectedVoice;
    }

    window.speechSynthesis.speak(speech);

    voiceStatus.textContent = "A.Z.R.A. is speaking.";
    
    speech.onend = function() {
        voiceStatus.textContent = "Voice system standing by.";
    };

    speech.onerror = function() {
        voiceStatus.textContent = "Speech playback encountered an error.";
    };
}

// RESPONSE SYSTEM
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
        return "My systems are running smoothly. Thank you for asking.";

    if (text.includes("thank you") || text.includes("thanks"))
        return "You're welcome. I'm always ready to help.";

    if (text.includes("help"))
        return "Of course. Tell me what you need help with.";

    if (text.includes("bye") || text.includes("goodbye"))
        return "Goodbye. A.Z.R.A. systems standing by.";

    return "I'm still learning how to respond to that. My advanced AI brain is not connected yet.";
}

// SEND MESSAGE
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
    if (event.key === "Enter") {
        sendMessage();
    }
});

// QUICK BUTTONS
document.querySelectorAll(".quick").forEach(function(button) {
    button.addEventListener("click", function() {
        userInput.value = button.dataset.message;
        sendMessage();
    });
});

// MICROPHONE BUTTON
// Uses the iPad's built-in keyboard dictation.
// It does not use Safari speech recognition.

micButton.addEventListener("click", function() {
    voiceStatus.textContent =
        "Use the microphone on your iPad keyboard to dictate.";

    userInput.focus();
});
