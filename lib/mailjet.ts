import Mailjet from 'node-mailjet';

// Configuration Mailjet - initialisation lazy pour éviter les erreurs au build
let mailjetClient: Mailjet | null = null;

function getMailjetClient(): Mailjet {
  if (!mailjetClient) {
    mailjetClient = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY || '',
      apiSecret: process.env.MAILJET_SECRET_KEY || '',
    });
  }
  return mailjetClient;
}

interface EmailOptions {
  to: string;
  toName?: string;
  subject: string;
  textContent: string;
  htmlContent?: string;
}

/**
 * Envoie un email via Mailjet
 */
export async function sendEmail({
  to,
  toName = '',
  subject,
  textContent,
  htmlContent,
}: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
      console.error('Mailjet API keys not configured');
      return {
        success: false,
        error: 'Service d\'envoi d\'email non configuré',
      };
    }

    const mailjet = getMailjetClient();
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL || 'noreply@example.com',
            Name: process.env.MAILJET_SENDER_NAME || 'Wawa Salon',
          },
          To: [
            {
              Email: to,
              Name: toName,
            },
          ],
          Subject: subject,
          TextPart: textContent,
          HTMLPart: htmlContent || textContent.replace(/\n/g, '<br>'),
        },
      ],
    });

    await request;

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return {
      success: false,
      error: 'Erreur lors de l\'envoi de l\'email',
    };
  }
}

/**
 * Envoie un email de confirmation de rendez-vous
 */
export async function sendAppointmentConfirmation({
  to,
  clientName,
  serviceName,
  appointmentDate,
  appointmentId,
}: {
  to: string;
  clientName: string;
  serviceName: string;
  appointmentDate?: Date;
  appointmentId: string;
}): Promise<{ success: boolean; error?: string }> {
  const dateStr = appointmentDate
    ? new Date(appointmentDate).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'À confirmer';

  const textContent = `
Bonjour ${clientName},

Nous avons bien reçu votre demande de rendez-vous.

Détails de votre rendez-vous :
- Service : ${serviceName}
- Date : ${dateStr}
- Référence : ${appointmentId}

Nous vous confirmerons prochainement votre rendez-vous.

Cordialement,
L'équipe Wawa Salon
  `.trim();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Confirmation de rendez-vous</h2>
      <p>Bonjour <strong>${clientName}</strong>,</p>
      <p>Nous avons bien reçu votre demande de rendez-vous.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Détails de votre rendez-vous :</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Service :</strong> ${serviceName}</li>
          <li><strong>Date :</strong> ${dateStr}</li>
          <li><strong>Référence :</strong> ${appointmentId}</li>
        </ul>
      </div>
      
      <p>Nous vous confirmerons prochainement votre rendez-vous.</p>
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Cordialement,<br>
        <strong>L'équipe Wawa Salon</strong>
      </p>
    </div>
  `;

  return sendEmail({
    to,
    toName: clientName,
    subject: 'Confirmation de votre rendez-vous - Wawa Salon',
    textContent,
    htmlContent,
  });
}

/**
 * Envoie un email de notification de nouveau rendez-vous à l'admin
 */
export async function sendNewAppointmentNotification({
  adminEmail,
  clientName,
  clientPhone,
  clientEmail,
  serviceName,
  appointmentDate,
  appointmentId,
}: {
  adminEmail: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceName: string;
  appointmentDate?: Date;
  appointmentId: string;
}): Promise<{ success: boolean; error?: string }> {
  const dateStr = appointmentDate
    ? new Date(appointmentDate).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'À définir';

  const textContent = `
Nouveau rendez-vous reçu !

Client : ${clientName}
Téléphone : ${clientPhone}
${clientEmail ? `Email : ${clientEmail}` : ''}

Service : ${serviceName}
Date : ${dateStr}
Référence : ${appointmentId}

Connectez-vous à l'administration pour gérer ce rendez-vous.
  `.trim();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Nouveau rendez-vous reçu !</h2>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Informations client :</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Nom :</strong> ${clientName}</li>
          <li><strong>Téléphone :</strong> ${clientPhone}</li>
          ${clientEmail ? `<li><strong>Email :</strong> ${clientEmail}</li>` : ''}
        </ul>
        
        <h3>Détails du rendez-vous :</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Service :</strong> ${serviceName}</li>
          <li><strong>Date :</strong> ${dateStr}</li>
          <li><strong>Référence :</strong> ${appointmentId}</li>
        </ul>
      </div>
      
      <p>Connectez-vous à l'administration pour gérer ce rendez-vous.</p>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `Nouveau RDV - ${clientName} - ${serviceName}`,
    textContent,
    htmlContent,
  });
}
