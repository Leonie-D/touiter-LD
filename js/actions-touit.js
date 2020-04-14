const submitBtn = document.getElementById('submit');

submitBtn.addEventListener('click', function(ev){
    ev.preventDefault;
    const pseudo = document.getElementById('pseudo').value;
    const message = document.getElementById('msg').value;
    console.log(pseudo);
    console.log(message);
    addTouit(pseudo, message);
});

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