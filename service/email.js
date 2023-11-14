import { createTransport } from 'nodemailer';

const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "noreply@softnumen.com",
        pass: "N7f4z61E5DLZKbRS",
    },
});
export default transporter