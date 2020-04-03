const toggleMenu = document.querySelector('.toggle-menu');
const menu = document.querySelector('.menu');
const menuLink = Array.from(document.querySelectorAll('.menu a[href^=\'#\']'));

function menuManagement() {
  const open = JSON.parse(toggleMenu.getAttribute('aria-expanded')); //JSON.parse permet de convertir la string en vrai booleen
  toggleMenu.setAttribute('aria-expanded', !open); //!open permet de basculer entre true et false sur le aria-expanded
  menu.hidden = !menu.hidden;
  document.body.dataset.burger = !open;
};


toggleMenu.addEventListener('click', menuManagement);

for (let link of menuLink) {
  link.addEventListener('click', menuManagement);
};