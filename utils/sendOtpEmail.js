import nodemailer from 'nodemailer'

const sendOtpEmail = async(email, otp) =>{
    const transporter = nodemailer.createTransport({
        service : 'email',
        auth: {
            user : 'your-email@gmail.com',
            pass : 'your-email-password'
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'email',
        subject: 'OTP send for Registration',
        text: `Your OTP is: ${otp}.This OTP expired in 10 minutes! `
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Sent OTP to email! ")
    } catch (error) {
        console.error("Error Sending OTP!", error)
    }
}
export default sendOtpEmail;