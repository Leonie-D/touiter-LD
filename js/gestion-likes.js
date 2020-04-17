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