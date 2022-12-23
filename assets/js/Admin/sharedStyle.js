const header = document.querySelector('.header');
const sidenav = document.querySelector('.sidenav');
const footer = document.querySelector('.footer');

//set header all page
if(header != null) {
    fetch('../assets/temp/Admin/header.html')
        .then(function (response) {
            return response.text();
        })
        .then(function (body) {
            header.innerHTML = body;
        });
}

//set side nav 
if(sidenav != null) {
    fetch('../assets/temp/Admin/sideNav.html')
        .then(function (response) {
            return response.text();
        })
        .then(function (body) {
            sidenav.innerHTML = body;
        });
}

//set footer all pages
if(footer != null) {
    fetch('../assets/temp/Admin/footer.html')
        .then(function (response) {
            return response.text();
        })
        .then(function (body) {
            footer.innerHTML = body;
        });
}