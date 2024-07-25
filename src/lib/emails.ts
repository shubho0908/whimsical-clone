import { transporter } from "@/lib/nodemailer";

export const sendWelcomeMail = async (email: string, name: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL as string,
      to: email,
      subject: "Welcome to Whimsical Clone 🎉",
      text: `Hello ${name}, Welcome to Whimsical Clone`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};

export const sendInvitationMail = async (
  inviterEmail: string,
  invitedEmail: string,
  inviteId: string
) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL as string,
      to: invitedEmail,
      subject: `Invitation to join ${inviterEmail}'s Workspace`,
      text: `Hello, ${invitedEmail}! You have been invited to join ${inviterEmail}'s Workspace. Please click on the link below to accept the invitation.\nLink: ${process.env.APP_URL}/workspace/accept-invite?inviteId=${inviteId}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};
