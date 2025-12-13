const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const condivisioneSchedaSpese = async (req, userModel, emailList, baseUrl) => {
    console.log("emailList: ", emailList); // Debugging
    // Create a test account or replace with real credentials.
    // const transporter = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 465,
    //     secure: true, // true for 465, false for other ports
    //     auth: {
    //         user: "tommasoversetto@gmail.com",
    //         pass:  process.env.GOOGLE_SMTP_PASS,
    //     },
    // });
    // Get the sender's full user information to access their email

    const emailLsitCleaned = []
    emailList.map((email) => emailLsitCleaned.push(email.email));
    try {
        const info = {
            to: emailLsitCleaned,  // Array of emails joined by commas
            from: process.env.EMAIL,
            subject: "Shared Expense Sheet - Invitation",
            html: `An expense sheet "${req.body.titolo}" has been shared with you. Sei stato aggiunto a alla scheda spese "${req.body.titolo}"<br/><b>Registrati: <a href="${baseUrl}/register">Registrati</a><br>Accedi: <a href="${baseUrl}/login">Accedi</a></b>`,
        };

        await sgMail
            .send(info)
            .then((res) => {
                console.log(res, 'Email sent')
            })
            .catch((error) => {
                console.error(error, "up")
                console.error(error.response.body, "up low")
            })

        console.log("Message sent condivisioneSchedaSpese:", info.messageId);
    } catch (error) {
        console.error("Error sending email condivisioneSchedaSpese: ", error);
    }

}


const rimossoSchedaSpese = async (req, userModel, emailList) => {
    console.log(emailList, '--------------rimossoSchedaSpese emailList'); // Debugging

    try {
        const info = {
            from: process.env.EMAIL, 
            to: emailList,  
            subject: "Shared Expense Sheet - Removed",
            html: `An expense sheet "${req.schedaSpesa.titolo}" has been shared with you. Sei stato rimosso dalla scheda spese "${req.schedaSpesa.titolo}" <br/> <p>Conttatta <a href="mailto:${req.user.email}">${req.user.email}</a> per info</p>`,
        };

      await  sgMail.send(info)
    .then((res) => {
      console.log(res, 'Email sent')
    })
    .catch((error) => {
      console.error(error, "up")
      console.error(error.response.body, "up")
    })

        console.log("Message sent rimossoSchedaSpese:", info.messageId);
    } catch (error) {
        console.error("Error sending email rimossoSchedaSpese:", error);
    }

}

module.exports = { condivisioneSchedaSpese, rimossoSchedaSpese }