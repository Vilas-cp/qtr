import twilio from 'twilio';

// Initialize Twilio client with environment variables
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Export POST method handler
export async function POST(request) {
  try {
    // Parse the incoming request JSON
    const { message, to } = await request.json();

    // Validate that the message and recipient phone number are provided
    if (!message || !to) {
      return new Response(
        JSON.stringify({ error: 'Message and recipient number are required' }),
        { status: 400 }
      );
    }

    // Send the WhatsApp message using Twilio API
    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`, // Your Twilio WhatsApp number
      to: `whatsapp:${to}`, // Dynamic recipient phone number
    });
    console.log('hi');
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, data: response }),
      { status: 200 }
   
    );
  } catch (error) {
    console.error('Error sending message:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
