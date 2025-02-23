import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { Alert } from '../types';

const resend = new Resend('re_123456789'); // Replace with your Resend API key
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function sendAlertNotification(alert: Alert) {
  try {
    // Get subscribers from Supabase
    const { data: subscribers } = await supabase
      .from('alert_subscribers')
      .select('email');

    if (!subscribers?.length) return;

    // Send email to each subscriber
    const emailPromises = subscribers.map(subscriber => 
      resend.emails.send({
        from: 'alerts@powergrid.com',
        to: subscriber.email,
        subject: `Power Grid Alert: ${alert.type.toUpperCase()}`,
        html: `
          <div style="font-family: system-ui, sans-serif; padding: 20px;">
            <h2 style="color: ${
              alert.type === 'danger' ? '#DC2626' :
              alert.type === 'warning' ? '#F59E0B' : '#3B82F6'
            };">
              ${alert.type.toUpperCase()} Alert
            </h2>
            <p style="color: #374151;">${alert.message}</p>
            <p style="color: #6B7280; font-size: 14px;">
              Detected at ${new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        `
      })
    );

    await Promise.all(emailPromises);
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
}