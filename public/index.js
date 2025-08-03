const socket = io();

const usernameModal = document.getElementById("username-modal");
const usernameInput = document.getElementById("username-input");
const joinChatButton = document.getElementById("join-chat-button");
const chatContainer = document.querySelector(".chat-container");

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const emojiButton = document.getElementById("emoji-button");

let currentUser = { username: "Guest", color: "#000000" };

usernameModal.style.display = "flex";
chatContainer.style.display = "none";

joinChatButton.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username) {
    currentUser.username = username;
    socket.emit("new user", username);
    usernameModal.style.display = "none";
    chatContainer.style.display = "flex";
    input.focus();
  } else {
    alert("Please enter a username!");
  }
});

socket.on("user info", (userInfo) => {
  currentUser.color = userInfo.color;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

emojiButton.addEventListener("click", () => {
  input.value += "😊";
  input.focus();
});

socket.on("chat message", (message) => {
  const item = document.createElement("div");
  item.classList.add("message");

  const usernameSpan = document.createElement("span");
  usernameSpan.classList.add("username");
  usernameSpan.textContent = message.username;
  usernameSpan.style.color = message.color;

  const messageText = document.createElement("p");
  messageText.textContent = message.text;

  const timestampSpan = document.createElement("span");
  timestampSpan.classList.add("timestamp");
  timestampSpan.textContent = message.timestamp;

  item.appendChild(usernameSpan);
  item.appendChild(messageText);
  item.appendChild(timestampSpan);

  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

const checkbox = document.getElementById("checkbox");
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});
