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
    if (!("speechSynthesis" in window)) {
        voiceStatus.textContent = "Speech output is not supported.";
        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

function getResponse(input) {
    const text = input.toLowerCase().trim();

    if (text.includes("hello") || text.includes("hi")) {
        return "Hello! It's wonderful to hear from you. How may I assist you?";
    }

    if (text.includes("your name") || text.includes("who are you")) {
        return "I am A.Z.R.A., your personal digital assistant.";
    }

    if (text.includes("who created you")) {
        return "I was created by my developer as a personal AI assistant project.";
    }

    if (text.includes("what can you do") || text.includes("capabilities")) {
        return "I can communicate, answer programmed questions, and help with tasks. My advanced AI brain is still being developed.";
    }

    if (text.includes("time")) {
        return "The current time is " + new Date().toLocaleTimeString() + ".";
    }

    if (text.includes("date") || text.includes("today")) {
        return "Today's date is " + new Date().toLocaleDateString() + ".";
    }

    if (text.includes("how are you")) {
        return "My systems are running smoothly! Thank you for asking.";
    }

    if (text.includes("thank you") || text.includes("thanks")) {
        return "You're welcome! I'm always ready to help.";
    }

    if (text.includes("help")) {
        return "Of course! Tell me what you need help with.";
    }

    if (text.includes("bye") || text.includes("goodbye")) {
        return "Goodbye! A.Z.R.A. systems standing by.";
    }

    return "I'm still learning how to respond to that. My advanced AI brain is not connected yet.";
}

function sendMessage() {
    const text = userInput.value.trim();

    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    const response = getResponse(text);

    setTimeout(() => {
        addMessage(response, "azra");
        speak(response);
    }, 400);
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") sendMessage();
});

document.querySelectorAll(".quick").forEach(button => {
    button.addEventListener("click", function() {
        userInput.value = this.dataset.message;
        sendMessage();
    });
});

// MICROPHONE SYSTEM
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    micButton.addEventListener("click", function() {
        voiceStatus.textContent = "Listening...";
        micButton.textContent = "🔴";

        try {
            recognition.start();
        } catch (error) {
            voiceStatus.textContent = "Please try again.";
            micButton.textContent = "🎙️";
        }
    });

    recognition.onresult = function(event) {
        const spokenText = event.results[0][0].transcript;
        userInput.value = spokenText;
        voiceStatus.textContent = "Voice recognized!";
        micButton.textContent = "🎙️";
        sendMessage();
    };

    recognition.onerror = function(event) {
        voiceStatus.textContent = "Microphone error: " + event.error;
        micButton.textContent = "🎙️";
    };

    recognition.onend = function() {
        micButton.textContent = "🎙️";
    };

} else {
    micButton.disabled = true;
    voiceStatus.textContent =
        "Speech recognition is not supported by this browser.";
}
