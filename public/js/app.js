const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

// get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chat room
socket.emit("joinRoom", { username, room }); //sending the usrename and room name from frontend to server

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //auto scroll down on new messages
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Getting message text
  const msg = e.target.elements.msg.value;

  // Emitting message to server
  socket.emit("chatMessage", msg);

  //clearing the input div
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});
// How this particular process(e.target.elements.msg.value) work??

// e (Event Object):

// The event object e is passed as a parameter to the event listener function when the form is submitted.
// e.preventDefault(); prevents the default form submission behavior (which would reload the page).
// e.target (Event Target):

// e.target refers to the element that triggered the event.
// Since this event is attached to chatForm, e.target is the <form> element.
// e.target.elements (Form Elements Collection):

// e.target.elements is a collection of all the form fields inside the form.
// It allows accessing form fields by their name attribute.
// e.target.elements.msg (Accessing the Input Field):

// If there is an <input> field inside the form with name="msg", then e.target.elements.msg refers to that input field.
// e.target.elements.msg.value (Getting the Input Value):

// .value retrieves the text typed inside the input field

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
             ${message.text}
            </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
