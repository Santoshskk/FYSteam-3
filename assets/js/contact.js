document.addEventListener("DOMContentLoaded", function (e){
    // op verzenden klikken slaat info op en reset form
    document.querySelector("#sendButton").addEventListener("click", function (e){

        // object maken met de gegevens uit form
        const form ={
            firstname: document.querySelector("#firstname").value.trim(),
            prefix: document.querySelector("#prefix").value.trim(),
            lastname: document.querySelector("#lastname").value.trim(),
            email: document.querySelector("#email").value.trim(),
            question: document.querySelector("#question").value.trim()
        }

        // checken of de velden leeg zijn
        if(form.firstname !== "" &&
            form.lastname !== "" &&
            form.email !== "" &&
            form.email.includes('@') &&
            form.question !== "" ){

            let fullName;
            // juiste fullName maken bij geen tussenvoegsels
            if (form.prefix === ""){
                fullName = form.firstname + " " + form.lastname;
            }else{
                fullName = form.firstname + " " + form.prefix + " " + form.lastname;
            }

            // correcte datetime format maken
            let today = new Date();
            let date = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDay();
            let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let dateTime =  date + " " + time;

            // query om message in database te zetten
            FYSCloud.API.queryDatabase(
                "INSERT INTO message (fullName, email, time, message) VALUES (?, ?, ?, ?);"
                ,[fullName, form.email, dateTime, form.question]
            ).then(// form legen
                document.querySelector("#contactForm").reset()
            )

            e.preventDefault();

            // Get the modal
            let modal = document.getElementById("succesModal");

            // When the user clicks the button, open the modal
            modal.style.display = "block";

            let span = document.getElementById("closeSpan");

            // When the user clicks anywhere outside the modal, close it
            span.addEventListener("click", function () {
                modal.style.display = "none";
            })

            // When the user clicks anywhere outside the modal, close it
            window.onclick = function (event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            }
        }
    });
});