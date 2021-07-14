const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName;

const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUser', ( userName) => addMessage('Chat Bot', `${userName} has joined the conversation!`));
socket.on('removeUser', ( userName ) => addMessage('Chat Bot', `${userName} has left the conversation...`));

const login = (event) => {
  event.preventDefault();
  if(userNameInput.value) {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('join', userName);
  } else {
    alert ('Please enter your login')
  }
}

loginForm.addEventListener('submit', login);

const sendMessage = (event) => {
  event.preventDefault();
  
  if(messageContentInput.value) {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContentInput.value })
    messageContentInput.value = '';
  } else {
    alert ('Please enter your message')
  }
}

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author === userName) {
    message.classList.add('message--self')
  } else if(author === 'Chat Bot') {
    message.classList.add('message--chatbot')
  } else {
    message.classList.add('message--received');
  }
  message.innerHTML = `
    <h3 class="message__author">
      ${userName === author ? 'You' : author}
    </h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}

addMessageForm.addEventListener('submit', sendMessage);