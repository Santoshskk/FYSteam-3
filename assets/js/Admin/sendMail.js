/* 
    @author Othaim Ibo
    -
*/


// 
window.onload = () => {

// Retrieve email of the user.
const email = document.getElementById('email');

// Set a subject for the email.
const subject = "";

// HTML & CSS body for the email.
const body = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Email - Wachtwoord vergeten ?</title>
  <style>
    		.nav:hover {
			border-radius: 3px;
			background-color: #D9260F;
		}
		.subhead {
			color: #fff;
			letter-spacing: 2px;
		}
		.h1 {
			font-size: 20px;
			font-weight: 700;
			color: #fff;
		}
		.h2 {
			font-size: 18px;
			font-weight: 700;
			color: #D9260F;
		}
		.main_txt {
			font-size: 14px;
			color: #2e2e2e;
		}
		.footer_txt {
			font-size: 12px;
			font-weight: 600;
			color: #fff;
		}
    </style>
</head>

<body style="margin: 0; padding: 0; background-color: #eeeeee;">
	<table align="center" style=" cellpadding: 0; cellspacing: 0; width: 100%;">
		<tr>
			<td>

				<table align="center" style="  border: 1px solid #00499c; border-radius: 3px; background-color: #D9260F; cellpadding: 0; cellspacing: 0; width: 450px;">
					<tr>
						<td bgcolor="#D9260F" style="padding: 15px;">

							<table width="70" align="left" border="0" cellpadding="0" cellspacing="0">
								<tr>
									<td height="70" style="padding: 0 20px 20px 0;">
										<img class="fix" src="http://localhost:8080/HBO%20-%20ICT/22-23/Projects/FastenYourSeatbelt/Fys-local/assets/img/tripbuddylogo1.png" width="150" height="70" border="0" alt="ICTadmin - Icon" />
									</td>
								</tr>
							</table>

							<table class="col425" align="left" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 425px;">
								<tr>
									<td height="70">

										<table width="100%" border="0" cellspacing="0" cellpadding="0">
											<tr>
												<td class="subhead" style="padding: 0 0 0 3px;">
													TripBuddy
												</td>
											</tr>
											<tr>
												<td class="h1" style="padding: 5px 0 0 0;">
													Wachtwoord vergeten ?
												</td>
											</tr>
										</table>

									</td>
								</tr>
							</table>

							<table align="center" style="cellpadding: 0; cellspacing: 0; width: 600px;">
								<tr style="background-color: #ed3a23;">
									<td align="center" style="padding: 10px; border-radius: 3px;">
										<a href="https://www.ictadmin.nl/" class="nav" style="padding: 7px 10px; margin: 0 1px 0 1px; text-decoration: none; color: white;">Home</a>
										<a href="http://localhost:8080/ICTadmin/ICTadmin(test)/src/index.php" class="nav" style="padding: 7px 10px; margin: 0 1px 0 1px; text-decoration: none; color: white;">Login</a>
										<a href="http://localhost:8080/ICTadmin/ICTadmin(test)/src/signup.php" class="nav" style="padding: 7px 10px; margin: 0 1px 0 1px; text-decoration: none; color: white;">Signup</a>
									</td>
								</tr>
							</table>

						</td>
					</tr>
					<tr>
						<td bgcolor="#dadada" style="border-radius: 5px;">

							<table align="center" style=" cellpadding: 0; cellspacing: 0; width: 600px;">
								<tr>
									<td align="center">

										<table align="center" style=" cellpadding: 0; cellspacing: 0; width: 600px;">
											<tr>
												<td colspan="2" align="center" style="">
													<img class="fix" style="width: 70%;" src="http://localhost:8080/HBO%20-%20ICT/22-23/Projects/FastenYourSeatbelt/Fys-local/assets/img/tripbuddylogo.png" width="70" height="70" border="0" alt="ICTadmin - Logo" />
												</td>
											</tr>
											<tr>
												<td align="left" style=" width: 100%;">

													<table style="width: 100%;">
														<tr>
															<td align="left" class="h2" style="width: 100%;">
																Beste klant,
															</td>
														</tr>
														<tr>
															<td align="left" style=" width: 100%;">
																<br>
																U heeft laten weten dat u uw wachtwoord vergeten bent.
																<br>
																Gebruik voor het maken van een nieuw wachtwoord deze tijdelijke code:
																<br>
																<b>< Code ></b>
																<br>
																Deze code vervalt na een dag !
																<br>
															</td>
														</tr>
														<tr>
															<td align="left" style=" width: 100%;">
																<br> Klantenservice <br> TripBuddy <br> <p class="main_txt">Dit is een automatisch verzonden mail, antwoorden is niet mogelijk.</p>
															</td>
														</tr>
													</table>

												</td>
											</tr>
										</table>

									</td>
								</tr>
							</table>

						</td>
					</tr>
					<tr>
						<td align="left" bgcolor="#D9260F">

							<br>

							<table style="width: 100%;">
								<tr>
									<td align="center" class="footer_txt" style="">
									&reg;	TripBuddy
									</td>
								</tr>
								<tr>
								    <td align="center" class="footer_txt" style="">
										Wibautstraat 3b, Amsterdam 1091 GH
									</td>
								</tr>
							</table>

							<br>

						</td>
					</tr>
				</table>

			</td>
		</tr>
	</table>

</body>

</html>

`;


	// Check if the form has been submitted. (Probably should add the form at the start of the page aswell...)
    form.addEventListener('submit', e => {
        e.preventDefault();

		// Check if the mail exists in db.
        emailExists(email);

        // check if email exists.
        function emailExists(email) {
            FYSCloud.API.queryDatabase("SELECT * FROM user WHERE email = (?)", [email]
            ).then(data => {
                if (data.length > 0) {
                    var fullName = data.firstName + " " + data.lastName;

					// If email exists fill all the parameters to send the mail.
                    sendEmail(fullName, email, subject, body)
                }
            }).catch(err => {
                console.log(err);
            })
        }


        // The function that will send the email
        function sendEmail(receiverName, receiverAdress, subject, body) {
            FYSCloud.API.sendEmail({
                from: {
                    name: "is102",
                    address: "is102@fys.cloud"
                },
                to: [{
                    name: receiverName,
                    address: receiverAdress,
                }],
                subject: subject,
                html: body
            }).then(data => {
				// Successfully sent email!
                console.log(data);
            }).catch(err => {
				// Error! went wrong.
                console.log(err);
            });
        }

    })
}



