/*
Tygo
Js script shared layout
 */

const header = document.querySelector('.nav-header');
const footer = document.querySelector('.nav-footer');

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