function search() {


    var input = document.getElementById("myInput");

    var filter = input.value.toUpperCase();

    var div = document.getElementById("profiles");

    var tr = div.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        var td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            var txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
}