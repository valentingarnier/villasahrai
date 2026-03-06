import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    const now = new Date().toLocaleString("fr-FR", {
      timeZone: "Africa/Casablanca",
      dateStyle: "long",
      timeStyle: "short",
    });

    const { data, error } = await resend.emails.send({
      from: "Villa Sahrai <hello@yourclaw.dev>",
      to: "valentingarnier@live.fr",
      subject: "Nouvelle connexion — Villa Sahrai",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #d97706;">Villa Sahrai</h2>
          <p>Nouvelle connexion détectée :</p>
          <ul>
            <li><strong>Email :</strong> ${email ?? "inconnu"}</li>
            <li><strong>Nom :</strong> ${name ?? "inconnu"}</li>
            <li><strong>Date :</strong> ${now}</li>
          </ul>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ id: data?.id });
  } catch (err) {
    console.error("Notify login error:", err);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
