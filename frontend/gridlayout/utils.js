
//get element by id
function get(id) {
    return document.getElementById(id);
}

function createElement(tag='div',classList=[],id='') {
    const elem = document.createElement(tag);
    if(id !== '') elem.id = id;
    classList.forEach(className => {
        elem.classList.add(className);        
    });

    return elem;
}