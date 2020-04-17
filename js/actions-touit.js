function addTouit(name, message, nbLikes, nbComments, idtouit) {
    // attention aux accords --> mettre un s ou non ?
    let likeTag = " like";
    if (nbLikes > 1 || nbLikes < -1) {
        likeTag += "s";
    };

    let commentTag = " comment";
    if (nbComments > 1) {
        commentTag += "s";
    };

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
    touitLike.setAttribute('class', 'info');
    touitLike.textContent = nbLikes + likeTag;

    const touitComment = document.createElement('p');
    touitComment.setAttribute('class', 'info');
    touitComment.textContent = nbComments + commentTag;

    const buttonComment = document.createElement("button");
    buttonComment.setAttribute('class', 'btn');
    buttonComment.textContent = 'Commentaires';
    buttonComment.addEventListener('click', function(ev){
        ev.preventDefault();
        // affichage de la modal avec le touit, les commentaires et le formulaire pour en ajouter un




        // récupération des éléments de formulaire
        // commentSubmit.addEventListener('click', function(ev){
        //     ev.preventDefault();
        //     const request = new XMLHttpRequest();
        //     request.open('POST', endpointCMTSend, true);
        //     request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //     request.addEventListener('readystatechange', function(){
        //         if (request.readyState === XMLHttpRequest.DONE && request.status === 200 && JSON.parse(request.responseText).error !== undefined) {
        //             alert(JSON.parse(request.responseText).error);
        //         };
        //     });
        //     request.send('name='+nameInput.value+'&comment='+commentInput.value+'&message_id='+idtouit);
        //     commentForm.dataset.visibility = false;
        // });

        // // mise en place
        // card.appendChild(commentForm);
        // commentForm.appendChild(nameLabel);
        // commentForm.appendChild(nameInput);
        // commentForm.appendChild(commentLabel);
        // commentForm.appendChild(commentInput);
        // commentForm.appendChild(commentSubmit);
    });

    // const buttonReadComments = document.createElement("button");
    // buttonReadComments.setAttribute('class', 'btn');
    // buttonReadComments.textContent = 'Afficher les commentaires';
    // let clickCountRead = 0;
    // buttonReadComments.addEventListener('click', function(ev){
    //     ev.preventDefault();
    //     clickCountRead ++;
    //     if (clickCountRead === 1) {
    //         const request = new XMLHttpRequest();
    //         request.open('GET', endpointCMTList+'?message_id='+idtouit, true);
    //         request.addEventListener('readystatechange', function(){
    //             if (request.readyState === XMLHttpRequest.DONE && request.status === 200 && nbComments > 0) {
    //                 const allComments = JSON.parse(request.responseText).comments;
    //                 for (let com of allComments) {
    //                     // création des éléments
    //                     const touitCommentSender = document.createElement("p");
    //                     touitCommentSender.setAttribute('class', 'comment');
    //                     touitCommentSender.textContent = com.name;
    //                     const touitCommentContent = document.createElement("p");
    //                     touitCommentContent.setAttribute('class', 'comment');
    //                     touitCommentContent.textContent = com.comment;
    //                     // insertion sous le touit
    //                     card.appendChild(touitCommentSender);
    //                     card.appendChild(touitCommentContent);
    //                 };
    //             };
    //         });
    //         request.send();
    //     } else if (clickCountRead % 2 === 0) {
    //         console.log('faire un display:none');
    //     } else {
    //         console.log('faire un display:block');
    //     };
    //     // Ajouter une structure (ul/li) autour des commentaires pour futur layout
    // });

    const buttonLike = document.createElement("button");
    buttonLike.setAttribute('class', 'btn like-btn');
    buttonLike.textContent = 'Like';
    buttonLike.addEventListener('click', function(ev){
        ajouterLike(ev, idtouit);
    });

    const buttonUnlike = document.createElement("button");
    buttonUnlike.setAttribute('class', 'btn unlike-btn');
    buttonUnlike.textContent = "Don't like";
    buttonUnlike.addEventListener('click', function(ev){
        removeLike(ev, idtouit);
    });

    // insertion des éléments
    const listeTouits = document.querySelector('.liste-touits');
    listeTouits.appendChild(touit);
    touit.appendChild(card);
    card.appendChild(touitTitle);
    card.appendChild(touitContent);
    card.appendChild(touitLike);
    card.appendChild(touitComment);
    card.appendChild(buttonAddComment);
    card.appendChild(buttonReadComments);
    card.appendChild(buttonLike);
    card.appendChild(buttonUnlike);

    cardPosition(); // reorganise les touits
};

// récupération des touits
let latestTS = "";
const getTouitsRequest = new XMLHttpRequest();
getTouitsRequest.addEventListener('readystatechange', function(){
    if (getTouitsRequest.readyState === XMLHttpRequest.DONE && getTouitsRequest.status === 200) { 
        const tousLesMessages = JSON.parse(getTouitsRequest.responseText).messages;
        for (let touit of tousLesMessages) {
            const pseudo = touit.name;
            const message = touit.message;
            const nbLikes = touit.likes;
            const nbComments = touit.comments_count;
            const idtouit = touit.id;
            addTouit(pseudo, message, nbLikes, nbComments, idtouit);
        };
        latestTS = "?ts="+(JSON.parse(getTouitsRequest.responseText).ts.toString());
    };
});

function openAndSend(ts) {
    getTouitsRequest.open("GET", endpointLI + ts, true);
    getTouitsRequest.send();
};

openAndSend(latestTS);

// mise à jour régulière
setInterval(function(){
    openAndSend(latestTS)
}, 3000);


// actualisation de tous les touits
const refreashButton = document.getElementById('refreash');
refreashButton.addEventListener('click', function(ev){
    ev.preventDefault();
    // préalablement effacer tous les touits
    const listeTouits = document.querySelector('.liste-touits');
    while (listeTouits.firstChild) {
    listeTouits.removeChild(listeTouits.firstChild);
    };
    openAndSend(""); 
});

// envoi de touit
const touitForm = document.getElementById('touit-form');

touitForm.addEventListener('submit', function(ev){
    ev.preventDefault();
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