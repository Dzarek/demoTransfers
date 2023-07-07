import { mailOptions, transporter } from "../../config/nodemailer";
import { render } from "@react-email/render";
import { Email } from "../../config/emailSkin";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const data = req.body;
    const dataUpperCase = data.name.toUpperCase();
    const convertDate = data.convertDate;
    const emailHtml = render(
      <Email dataUpperCase={dataUpperCase} convertDate={convertDate} />
    );
    if (!data) {
      return res.status(400).json({ message: "Bad request" });
    }
    try {
      await transporter.sendMail({
        ...mailOptions,
        subject: `NOWY TRANSFER OD ${dataUpperCase}`,
        text: "",
        // html: `<p><strong>${dataUpperCase}</strong> dodał nowy transfer w terminie <strong>${data.convertDate}</strong> ! Potwierdź zlecenie w aplikacji: https://airportgr8way.vercel.app/</p>`,
        html: emailHtml,
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }
  }

  return res.status(400).json({ message: "Bad request" });
};

export default handler;
