
const chatForm = get('chat-form');
const msgInput = get('chat-message-input');
const msgWindow = get('chat-messages');


chatForm.onsubmit = (event) => {
    event.preventDefault();
    
    // console.log(event);
    if(msgInput.value !== '') {
        displayMessage(username, msgInput.value);

        //send message to server
        socket.emit('chat-message', {
            message : msgInput.value
        });
        
        //empty input
        msgInput.value = ''; 
    }
}

function displayMessage(from, message){
    // console.log(`${from}: ${message}`)
    msgWindow.appendChild(createMessage(from,message));    
    msgWindow.scrollTop = msgWindow.scrollHeight;
}

function createMessage(username,message) {
    const cm = createElement('div',['chat-message']);
    const un = createElement('div',['username']);
    const msg = createElement('div',['message']);
    
    un.innerText = username;
    msg.innerText = message;

    cm.appendChild(un);
    cm.appendChild(msg);    

    return cm;
}


