const header = document.querySelector('.header');
const sidenav = document.querySelector('.sidenav');
const footer = document.querySelector('.footer');

//set header all page
if(header != null) {
    fetch('assets/temp/header.html')
        .then(function (response) {
            return response.text();
        })
        .then(function (body) {
            header.innerHTML = body;
        });
}

//set side nav 
if(sidenav != null) {
    fetch('assets/temp/sideNav.html')
        .then(function (response) {
            return response.text();
        })
        .then(function (body) {
            sidenav.innerHTML = body;
        });
}

//set footer all pages
if(footer != null) {
    fetch('assets/temp/footer.html')
        .then(function (response) {
            return response.text();
        })
        .then(function (body) {
            footer.innerHTML = body;
        });
}