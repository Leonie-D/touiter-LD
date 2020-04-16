function cardPosition() {
    const touits = Array.from(document.querySelectorAll(".touit"));

    for (let touit of touits) {
        touit.style.order = touits.length - touits.indexOf(touit);
    };
};