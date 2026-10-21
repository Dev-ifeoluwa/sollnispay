import { Injectable } from '@nestjs/common';

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

@Injectable()
export class MailService {
    // Render's free tier blocks SMTP ports, so we send through an HTTP API (Brevo).
    // To switch provider later (e.g. Resend), only this method needs to change.
    private async send(to: string, subject: string, html: string) {
        const apiKey = process.env.BREVO_API_KEY;
        const fromEmail = process.env.MAIL_FROM_EMAIL;
        if (!apiKey) throw new Error('BREVO_API_KEY is not set');
        if (!fromEmail) throw new Error('MAIL_FROM_EMAIL is not set');

        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify({
                sender: { name: process.env.MAIL_FROM_NAME ?? 'Sollnis Pay', email: fromEmail },
                to: [{ email: to }],
                subject,
                htmlContent: html,
            }),
        });

        if (!res.ok) {
            throw new Error(`Mail provider error ${res.status}: ${await res.text()}`);
        }
    }

    async sendPasswordResetOtp(to: string, firstName: string, otp: string) {
        const html = `
          <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px">
            <h2 style="margin:0 0 12px">Reset your password</h2>
            <p>Hi ${escapeHtml(firstName)},</p>
            <p>Use this code to reset your Sollnis Pay password:</p>
            <p style="font-size:32px;letter-spacing:8px;font-weight:bold;margin:24px 0">${otp}</p>
            <p>This code expires in <strong>10 minutes</strong>. Never share it with anyone, including Sollnis Pay staff.</p>
            <p style="color:#666;font-size:13px">If you did not request this, you can safely ignore this email. Your password will not change.</p>
          </div>`;
        await this.send(to, 'Your Sollnis Pay password reset code', html);
    }

    async sendPasswordChanged(to: string, firstName: string) {
        const html = `
          <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px">
            <h2 style="margin:0 0 12px">Your password was changed</h2>
            <p>Hi ${escapeHtml(firstName)},</p>
            <p>The password on your Sollnis Pay account was just changed.</p>
            <p style="color:#666;font-size:13px">If this was not you, reset your password again immediately and contact support.</p>
          </div>`;
        await this.send(to, 'Your Sollnis Pay password was changed', html);
    }
}