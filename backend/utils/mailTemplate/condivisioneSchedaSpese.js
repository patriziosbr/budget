// Email service - using Mailjet HTTP API (works on Render free tier)
const Mailjet = require('node-mailjet');
const mailjet = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_SECRET_KEY
});

const condivisioneSchedaSpese = async (req, userModel, emailList, baseUrl) => {
    console.log(emailList, '--------------condivisioneSchedaSpese emailList'); // Debugging

    const emailLsitCleaned = []
    emailList.map((email) => emailLsitCleaned.push(email.email));
    try {
        await mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAILJET_FROM_EMAIL || 'noreply@yourdomain.com',
                        Name: 'Budget App'
                    },
                    To: emailLsitCleaned.map(email => ({ Email: email })),
                    Subject: "Shared Expense Sheet - Invitation",
                    HTMLPart: `An expense sheet "${req.body.titolo}" has been shared with you. You have been added to the expense sheet "${req.body.titolo}"<br/><b>Register: <a href="${baseUrl}/register">Register</a><br>Login: <a href="${baseUrl}/login">Login</a></b>`,
                }
            ]
        });
        console.log("Message sent condivisioneSchedaSpese:");
    } catch (error) {
        console.error("Error sending email condivisioneSchedaSpese: ", error);
    }

}


const rimossoSchedaSpese = async (req, userModel, emailList) => {
    console.log(emailList, '--------------rimossoSchedaSpese emailList'); // Debugging

    try {
        await mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.MAILJET_FROM_EMAIL || 'noreply@yourdomain.com',
                        Name: 'Budget App'
                    },
                    To: emailList.map(email => ({ Email: email })),
                    Subject: "Shared Expense Sheet - Removed",
                    HTMLPart: `An expense sheet "${req.schedaSpesa.titolo}" has been shared with you. You have been removed from the expense sheet "${req.schedaSpesa.titolo}" <br/> <p>Contact <a href="mailto:${req.user.email}">${req.user.email}</a> for more information</p>`,
                }
            ]
        });
        console.log("Message sent rimossoSchedaSpese:");
    } catch (error) {
        console.error("Error sending email rimossoSchedaSpese:", error);
    }

}

module.exports = { condivisioneSchedaSpese, rimossoSchedaSpese }