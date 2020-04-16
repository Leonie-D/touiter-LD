// ATTENTION: la modification des likes (par moi ou par un autre utilisateur) ne se voit qu'après reload de la page (non automatique)

function ajouterLike(ev, idtouit) {
    ev.preventDefault();
    const request = new XMLHttpRequest();
    request.open('PUT', endpointLKSend, true); // faut-il ajouter un écouteur d'évènement ? que nous permettrait-il de faire ?
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send('message_id='+idtouit);
};

function removeLike(ev, idtouit) {
    ev.preventDefault();
    const request = new XMLHttpRequest();
    request.open('DELETE', endpointLKRemove, true); // faut-il ajouter un écouteur d'évènement ? que nous permettrait-il de faire ?
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send('message_id='+idtouit);
};