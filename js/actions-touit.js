function addTouit(name, message) {
    // création des éléments
    const touit = document.createElement("li");
    touit.setAttribute('class', 'touit');
    const card = document.createElement("article");
    card.setAttribute('class', 'card');
    const touitTitle = document.createElement("h4");
    touitTitle.setAttribute('class', 'card-title');
    touitTitle.textContent = name;
    const touitContent = document.createElement("p");
    touitContent.setAttribute('class', 'card-text');
    touitContent.textContent = message;
    const touitLike = document.createElement("p");
    touitLike.setAttribute('class', 'like');
    touitLike.textContent = 'nb likes';
    const buttonAction = document.createElement("button");
    buttonAction.setAttribute('class', 'btn action-btn');
    buttonAction.textContent = 'Actions ?'
    const buttonLike = document.createElement("button");
    buttonLike.setAttribute('class', 'btn like-btn');
    buttonLike.textContent = 'Like';

    // insertion des éléments
    const listeTouits = document.querySelector('.liste-touits');
    listeTouits.appendChild(touit);
    touit.appendChild(card);
    card.appendChild(touitTitle);
    card.appendChild(touitContent);
    card.appendChild(touitLike);
    card.appendChild(buttonAction);
    card.appendChild(buttonLike);

    cardPosition(); // reorganise les touits
};

// récupération des touits et mise à jour régulière
let latestTS = "";
const getTouitsRequest = new XMLHttpRequest();
getTouitsRequest.addEventListener('readystatechange', function(){
    if (getTouitsRequest.readyState === XMLHttpRequest.DONE && getTouitsRequest.status === 200) { 
        const tousLesMessages = JSON.parse(getTouitsRequest.responseText).messages;
        for (let touit of tousLesMessages) {
            const pseudo = touit.name;
            const message = touit.message;
            addTouit(pseudo, message);
        };
        latestTS = "?ts="+(JSON.parse(getTouitsRequest.responseText).ts.toString());
    };
});

function openAndSend(ts) {
    getTouitsRequest.open("GET", endpointLI + ts, true);
    getTouitsRequest.send();
};

openAndSend(latestTS);

setInterval('openAndSend(latestTS)', 30000);

// envoi de touit
const submitBtn = document.getElementById('submit');

submitBtn.addEventListener('click', function(ev){
    ev.preventDefault;
    const pseudo = document.getElementById('pseudo').value;
    const message = document.getElementById('msg').value;

    const nouveauMessage = new FormData();
    nouveauMessage.append('name', pseudo);
    nouveauMessage.append('message', message);

    const postTouitRequest = new XMLHttpRequest();
    postTouitRequest.open("POST", endpointSE, true);
    postTouitRequest.addEventListener('readystatechange', function(){
        if (postTouitRequest.readyState === XMLHttpRequest.DONE && postTouitRequest.status === 200 && JSON.parse(postTouitRequest.responseText).error !== undefined) {
            alert(JSON.parse(postTouitRequest.responseText).error);
        };
    });
    postTouitRequest.send(nouveauMessage);

    openAndSend(latestTS);
});