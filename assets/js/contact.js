document.addEventListener("DOMContentLoaded", function (e){
    // op verzenden klikken slaat info op en reset form
    document.querySelector("#Verzendknop").addEventListener("click", function (e){
        // checken of de velden leeg zijn
        if(document.querySelector("#voornaam").value !== "" &&
            document.querySelector("#achternaam").value !== "" &&
            document.querySelector("#email").value !== "" &&
            document.querySelector("#vraag").value !== "" ){

            // zorgen dat het form niet reset automatisch
            e.preventDefault();

            // object maken met de gegevens uit form
            const form ={
                voornaam: document.querySelector("#voornaam").value,
                tussenvoegsel: document.querySelector("#tussenvoegsel").value,
                achternaam: document.querySelector("#achternaam").value,
                email: document.querySelector("#email").value,
                vraag: document.querySelector("#vraag").value
            }

            // voor nu nog naar console, later database?
            console.log(form);

            // form legen
            document.querySelector("#contactForm").reset();
        }
    });
});