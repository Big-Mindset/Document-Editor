import nodemailer from "nodemailer"

export let sendEmail = async ({ email, html, subject }) => {
    console.log(process.env.NODEMAILER_PASSWROD, process.env.Email_FROM);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.Email_FROM,
            pass: process.env.NODEMAILER_PASSWROD,
        },
    });
    try {

        await transporter.sendMail({
            from: process.env.Email_FROM,
            subject,
            to: email,
            html,

        })
    } catch (error) {
        console.log(error);

    }
}