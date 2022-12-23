
document.addEventListener("DOMContentLoaded", function () {
            var btnst = true;
    document.body.addEventListener('click', toggleBtn);

    function toggleBtn(e) {
        var test = e.target.id;
        if (test === "toggleSpan" || test === "toggleBtn") {
            if (btnst == true) {
                document.querySelector('.toggle span').classList.add('toggle');
                document.getElementById('sidebar').classList.add('sidebarshow');
                btnst = false;
            } else if (btnst == false) {
                document.querySelector('.toggle span').classList.remove('toggle');
                document.getElementById('sidebar').classList.remove('sidebarshow');
                btnst = true;
            }
        }
    }    
})