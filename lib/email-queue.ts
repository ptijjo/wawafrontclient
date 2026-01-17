// Envoi d'emails direct (sans queue Redis)
// Pour un usage avec peu de connexions, l'envoi direct est suffisant
// Si besoin d'une queue plus tard, on pourra facilement l'ajouter

import { sendAppointmentConfirmation, sendNewAppointmentNotification } from './mailjet';

// Fonctions helper pour envoyer les emails (directement, sans queue)
// Ces fonctions peuvent être appelées de manière asynchrone sans bloquer la réponse

export async function queueAppointmentConfirmation(data: {
  to: string;
  clientName: string;
  serviceName: string;
  appointmentDate?: Date;
  appointmentId: string;
}) {
  // Envoyer l'email de manière asynchrone (ne bloque pas)
  // On utilise setImmediate pour ne pas bloquer la réponse HTTP
  setImmediate(async () => {
    try {
      await sendAppointmentConfirmation(data);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
      // L'erreur est loggée mais n'affecte pas la réponse HTTP
    }
  });
  
  // Retourner immédiatement (l'email sera envoyé en arrière-plan)
  return Promise.resolve();
}

export async function queueNewAppointmentNotification(data: {
  adminEmail: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceName: string;
  appointmentDate?: Date;
  appointmentId: string;
}) {
  // Envoyer l'email de manière asynchrone (ne bloque pas)
  setImmediate(async () => {
    try {
      await sendNewAppointmentNotification(data);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de notification:', error);
      // L'erreur est loggée mais n'affecte pas la réponse HTTP
    }
  });
  
  // Retourner immédiatement (l'email sera envoyé en arrière-plan)
  return Promise.resolve();
}
