document.addEventListener("DOMContentLoaded", () => {

    const sendBtn = document.getElementById("sendButton");
    const input = document.getElementById("messageInput");
    const chatBox = document.getElementById("chatBox");
    const clearBtn = document.getElementById("clearChat");
    const deleteBtn = document.getElementById("deleteSelected");

    let messages = JSON.parse(localStorage.getItem("chat")) || [];

    function displayMessages() {
        chatBox.innerHTML = "";

        messages.forEach((msg, index) => {
            let div = document.createElement("div");
            div.classList.add("message", msg.type);

            div.innerHTML = `
                <input type="checkbox" class="selectMsg" data-index="${index}">
                <div class="message-content">
                    <span>${msg.text}</span><br>
                    <span class="time">${msg.time}</span>
                </div>
            `;

            chatBox.appendChild(div);
        });

        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function getAIReply(text) {
        text = text.toLowerCase();

        if (text.includes("hi") || text.includes("hello")) return "Hey there! 😊";
        if (text.includes("how are you")) return "I'm doing great! What about you?";
        if (text.includes("name")) return "I'm your AI assistant 🤖";

        let replies = [
            "That's interesting 🤔",
            "Tell me more!",
            "Nice! 😄",
            "Okay, go on..."
        ];

        return replies[Math.floor(Math.random() * replies.length)];
    }

    function sendMessage() {
        let text = input.value.trim();
        if (text === "") return;

        let time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

        messages.push({ text, time, type: "sent" });
        localStorage.setItem("chat", JSON.stringify(messages));

        input.value = "";
        displayMessages();

        let typing = document.createElement("div");
        typing.classList.add("message", "typing");
        typing.innerText = "AI is typing...";
        chatBox.appendChild(typing);

        setTimeout(() => {
            typing.remove();

            let reply = getAIReply(text);
            let replyTime = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

            messages.push({ text: reply, time: replyTime, type: "received" });
            localStorage.setItem("chat", JSON.stringify(messages));

            displayMessages();
        }, 1200);
    }

    // EVENTS
    sendBtn.addEventListener("click", sendMessage);

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    // DELETE SELECTED
    deleteBtn.addEventListener("click", () => {
        let checkboxes = document.querySelectorAll(".selectMsg:checked");

        let indexes = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));

        messages = messages.filter((_, i) => !indexes.includes(i));

        localStorage.setItem("chat", JSON.stringify(messages));
        displayMessages();
    });

    // CLEAR ALL
    clearBtn.addEventListener("click", () => {
        if (confirm("Clear all chats?")) {
            messages = [];
            localStorage.removeItem("chat");
            displayMessages();
        }
    });

    displayMessages();
});