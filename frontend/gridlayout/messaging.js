const form = get('chat-form');

form.onsubmit = (event) => {
    event.preventDefault();
    console.log(event);
}

function addMessage(from, message){
    
}