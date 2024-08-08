
const searchButton = document.querySelector('#search');
const searchInput = document.querySelector('#search_profile');


searchButton.addEventListener('click',e => {
    const input = searchInput.value;
    if(!input) return
    //redirect to profile.html 
    window.location.href = `./resources/profile.html?search=${input}`;
});