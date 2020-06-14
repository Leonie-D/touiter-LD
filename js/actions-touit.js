function addTouit(name, message, nbLikes, nbComments, idtouit, listeTouits) {
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
    buttonComment.setAttribute('id', 'buttonComment'+idtouit);
    buttonComment.textContent = 'Commentaires';
    buttonComment.addEventListener('click', function _openCollapse(ev){
        ev.preventDefault();
        afficherCollapse(idtouit, nbComments);
        buttonComment.textContent = 'Fermer';
        buttonComment.removeEventListener('click', _openCollapse);
    });

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

    const collapsible = document.createElement('div');
    collapsible.setAttribute('class', 'collapsible');
    collapsible.setAttribute('id', 'collapsible'+idtouit);

    // insertion des éléments
    listeTouits.appendChild(touit);
    touit.appendChild(card);
    card.appendChild(touitTitle);
    card.appendChild(touitContent);
    card.appendChild(touitLike);
    card.appendChild(touitComment);
    card.appendChild(buttonComment);
    card.appendChild(buttonLike);
    card.appendChild(buttonUnlike);
    touit.appendChild(collapsible);
};

// récupération des touits
let latestTS = "";
const listeTouits = document.querySelector('.liste-touits');
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
            addTouit(pseudo, message, nbLikes, nbComments, idtouit, listeTouits);
        };
        latestTS = "?ts="+(JSON.parse(getTouitsRequest.responseText).ts.toString());
    };
});

function openAndSend(ts) {
    getTouitsRequest.open("GET", endpointLI + ts, true);
    getTouitsRequest.send();
};

openAndSend(latestTS);

// mise à jour régulière des nouveaux touits
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

// affichage du collapse avec les commentaires et le formulaire pour en poster un
function afficherCollapse(idtouit, nbComments) {
    const collapsibleDiv = document.getElementById('collapsible'+idtouit);

    // création des éléments de la div :
    // liste des commentaires
    const commentsList = document.createElement('ul');
    commentsList.setAttribute('class', 'comments-liste');
    collapsibleDiv.appendChild(commentsList);
    readComments(idtouit, nbComments, commentsList);
    // formulaire
    const commentForm = document.createElement('form');
    commentForm.setAttribute('class', 'comment-form');

    const pseudoLabel = document.createElement('label');
    pseudoLabel.setAttribute('for', 'comment-pseudo');
    pseudoLabel.setAttribute('class', 'screen-reader-text');
    pseudoLabel.textContent = 'Pseudo';

    const pseudoInput = document.createElement('input');
    pseudoInput.setAttribute('type', 'text');
    pseudoInput.setAttribute('id', 'comment-pseudo');
    pseudoInput.setAttribute('placeholder', 'Pseudo');
    pseudoInput.setAttribute('maxlength', '16');

    const commentLabel = document.createElement('label');
    commentLabel.setAttribute('for', 'comment');
    commentLabel.setAttribute('class', 'screen-reader-text');
    commentLabel.textContent = 'Message';

    const commentTextarea = document.createElement('textarea');
    commentTextarea.setAttribute('id', 'comment');
    commentTextarea.setAttribute('placeholder', 'Laisser un commentaire');
    commentTextarea.setAttribute('maxlength', '256');

    const commentSubmit = document.createElement('button');
    commentSubmit.setAttribute('class', 'btn btn-reverse');
    commentSubmit.setAttribute('id', 'comment-submit');
    commentSubmit.textContent = 'Envoyer';
    commentSubmit.addEventListener('click', function(ev){
        ev.preventDefault;
        envoyerComment(idtouit);
    });

    collapsibleDiv.appendChild(commentForm);
    commentForm.appendChild(pseudoLabel);
    commentForm.appendChild(pseudoInput);
    commentForm.appendChild(commentLabel);
    commentForm.appendChild(commentTextarea);
    commentForm.appendChild(commentSubmit);

    // affichage de la div
    collapsibleDiv.style.display = 'flex';

    // modification du bouton pour ouvrir en fermeture
    const commentButton = document.getElementById('buttonComment'+idtouit);
    commentButton.addEventListener('click', function _closeCollapse(ev){
        ev.preventDefault();
        closeCollapsible(idtouit);
        commentButton.textContent = 'Commentaires';
        commentButton.removeEventListener('click', _closeCollapse);
        commentButton.addEventListener('click', function _openCollapse(ev){
            ev.preventDefault();
            afficherCollapse(idtouit, nbComments);
            commentButton.textContent = 'Fermer';
            commentButton.removeEventListener('click', _openCollapse);
        });
    });

    // envoi d'un nouveau commentaire lors de la validation du formulaire
    commentSubmit.addEventListener('submit', function(ev){
        ev.preventDefault();
        envoyerComment(idtouit);
    });
};

// récupérer les commentaires
function readComments(idtouit, nbComments, commentsList) {
    const request = new XMLHttpRequest();
    request.open('GET', endpointCMTList+'?message_id='+idtouit, true);
    request.addEventListener('readystatechange', function(){
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200 && nbComments > 0) {
            const allComments = JSON.parse(request.responseText).comments;
            for (let com of allComments) {
                // création des éléments
                const touitCommentLi = document.createElement("li");

                const touitCommentSender = document.createElement("p");
                touitCommentSender.setAttribute('class', 'comment-pseudo');
                touitCommentSender.textContent = com.name;

                const touitCommentContent = document.createElement("p");
                touitCommentContent.setAttribute('class', 'comment-content');
                touitCommentContent.textContent = com.comment;

                // insertion sous le touit
                commentsList.appendChild(touitCommentLi);
                touitCommentLi.appendChild(touitCommentSender);
                touitCommentLi.appendChild(touitCommentContent);
            };
        };
    });
    request.send();
};

// envoi de commentaires
function envoyerComment(idtouit) {
    const name = document.getElementById('comment-pseudo').value;
    const commentaire = document.getElementById('comment').value;
    const request = new XMLHttpRequest();
    request.open('POST', endpointCMTSend, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.addEventListener('readystatechange', function(){
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200 && JSON.parse(request.responseText).error !== undefined) {
            document.getElementById('comment-pseudo').value = "";
            document.getElementById('comment').value = "";
            alert(JSON.parse(request.responseText).error);
        } else if (request.readyState === XMLHttpRequest.DONE && request.status === 200 && JSON.parse(request.responseText).error === undefined) {
            document.getElementById('comment-pseudo').value = "";
            document.getElementById('comment').value = "";
            closeCollapsible(idtouit);
        };
    });
    request.send('name='+name+'&comment='+commentaire+'&message_id='+idtouit);
};

// fermeture de la collapse
function closeCollapsible(idtouit) {
    const collapsibleDiv = document.getElementById('collapsible'+idtouit);
    // vider la div
    while (collapsibleDiv.firstChild) {
        collapsibleDiv.removeChild(collapsibleDiv.firstChild);
    };
    // ne plus afficher la div
    collapsibleDiv.style.display = 'none';
};

// affichage des touits les plus likés
const listeTopTouits = document.querySelector('.top-touits');
getTopTouits = new XMLHttpRequest();
getTopTouits.open('GET', endpointLKTop, true);
getTopTouits.addEventListener('readystatechange', function(){
    if (getTopTouits.readyState === XMLHttpRequest.DONE && getTopTouits.status === 200) { 
        const tousLesMessages = JSON.parse(getTopTouits.responseText).top;
        for (let touit of tousLesMessages) {
            const pseudo = touit.name;
            const message = touit.message;
            const nbLikes = touit.likes;
            const nbComments = touit.comments_count;
            const idtouit = touit.id;
            addTouit(pseudo, message, nbLikes, nbComments, idtouit, listeTopTouits);
        };
    };
});
getTopTouits.send();

// affichage des influenceurs
function addInfluenceur(nom, nbMessages, nbComments) {
    const influenceur = document.createElement('li');

    const nomInfluenceur = document.createElement('h4');
    nomInfluenceur.textContent = nom;

    const nbMessagesSent = document.createElement('p');
    nbMessagesSent.textContent = nbMessages + ' touits';

    const nbCommentsSent = document.createElement('p');
    nbCommentsSent.textContent = nbComments + ' commentaires';

    const listInfluenceurs = document.querySelector('.top-pseudos');
    listInfluenceurs.appendChild(influenceur);
    influenceur.appendChild(nomInfluenceur);
    influenceur.appendChild(nbMessagesSent);
    influenceur.appendChild(nbCommentsSent);
};

getInfluenceurs = new XMLHttpRequest();
getInfluenceurs.open('GET', endpointINF, true);
getInfluenceurs.addEventListener('readystatechange', function(){
    if (getInfluenceurs.readyState === XMLHttpRequest.DONE && getInfluenceurs.status === 200) { 
        const lesInfluenceurs = Object.entries(JSON.parse(getInfluenceurs.responseText).influencers);
        for (let influenceur of lesInfluenceurs) {
            const nom = influenceur[0];
            const nbMessages = influenceur[1].messages;
            const nbComments = influenceur[1].comments;
            addInfluenceur(nom, nbMessages, nbComments);
        };
    };
});
getInfluenceurs.send();

// affichage des trendings
const topTrend = document.querySelector('.top-themes');

getTrendings = new XMLHttpRequest();
getTrendings.open('GET', endpointTR, true);
getTrendings.addEventListener('readystatechange', function(){
    if (getTrendings.readyState === XMLHttpRequest.DONE && getTrendings.status === 200) { 
        const trendings = Object.entries(JSON.parse(getTrendings.responseText));
        trendings.sort(function(a, b){
            return b[1]-a[1];
        });
        for (let i=0; i<10; i++) {
            const trendingList = document.createElement('li');
            trendingList.textContent = '#'+trendings[i][0];
            topTrend.appendChild(trendingList);
        };
    };
});
getTrendings.send();