document.addEventListener("DOMContentLoaded", function (e){
    // op verzenden klikken slaat info op en reset form
    document.querySelector("#sendButton").addEventListener("click", function (e){
        // checken of de velden leeg zijn
        if(document.querySelector("#firstname").value !== "" &&
            document.querySelector("#prefix").value !== "" &&
            document.querySelector("#email").value !== "" &&
            document.querySelector("#question").value !== "" ){

            // zorgen dat het form niet reset automatisch
            e.preventDefault();

            // object maken met de gegevens uit form
            const form ={
                voornaam: document.querySelector("#firstname").value,
                tussenvoegsel: document.querySelector("#prefix").value,
                achternaam: document.querySelector("#lastname").value,
                email: document.querySelector("#email").value,
                vraag: document.querySelector("#question").value
            }

            // voor nu nog naar console, later database?
            console.log(form);

            // form legen
            document.querySelector("#contactForm").reset();
        }
    });
});