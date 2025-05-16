const nodemailer = require("nodemailer");

const condivisioneSchedaSpese = async (req, userModel, emailList, baseUrl) => {   
            console.log("emailList", emailList); // Debugging
            // Create a test account or replace with real credentials.
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: "tommasoversetto@gmail.com",
                    pass:  process.env.GOOGLE_SMTP_PASS,
                },
            });
            // Get the sender's full user information to access their email
            const sender = await userModel.findById(req.user.id);
            const emailLsitCleaned = [] 
            emailList.map((email) => emailLsitCleaned.push(email.email));
            try {
                const info = await transporter.sendMail({
                    from: `${sender.name} <${sender.email}>`,  // Properly formatted sender
                    // to: req.body.condivisoConList.join(','),  // Array of emails joined by commas
                    to: emailLsitCleaned,  // Array of emails joined by commas
                    subject: "Shared Expense Sheet",
                    text: `An expense sheet "${req.body.titolo}" has been shared with you.`,
                    html: `Sei stato aggiunto a alla scheda spese "${req.body.titolo}"<br/><b>Registrati: <a href="${baseUrl}/register">Registrati</a><br>Accedi: <a href="${baseUrl}/login">Accedi</a></b>`,
                });
                
                console.log("Message sent:", info.messageId);
            } catch (error) {
                console.error("Error sending email:", error);
            }
        
}


const rimossoSchedaSpese = async (req, userModel, emailList) => {   
            // console.log(req, '--------------rimossoSchedaSpese req.body'); // Debugging
            // Create a test account or replace with real credentials.
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: "tommasoversetto@gmail.com",
                    pass:  process.env.GOOGLE_SMTP_PASS,
                },
            });
            // Get the sender's full user information to access their email
            const sender = await userModel.findById(req.user.id);

            try {
                const info = await transporter.sendMail({
                    from: `${sender.name} <${sender.email}>`,  // Properly formatted sender
                    // to: req.body.condivisoConList.join(','),  // Array of emails joined by commas
                    to: emailList,  // Array of emails joined by commas
                    subject: "Shared Expense Sheet",
                    text: `An expense sheet "${req.schedaSpesa.titolo}" has been shared with you.`,
                    html: `Sei stato rimosso dalla scheda spese "${req.schedaSpesa.titolo}" <br/> <p>Conttatta <a href="mailto:${req.user.email}">${req.user.email}</a> per info</p>`,
                });
                
                console.log("Message sent:", info.messageId);
            } catch (error) {
                console.error("Error sending email:", error);
            }
        
}

module.exports = { condivisioneSchedaSpese, rimossoSchedaSpese }