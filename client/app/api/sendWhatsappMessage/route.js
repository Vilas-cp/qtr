import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(request) {
  try {
    const { message, to } = await request.json();

    if (!message || !to) {
      return new Response(JSON.stringify({ error: 'Message and recipient number are required' }), { status: 400 });
    }

    
    const formattedTo = `whatsapp:${to}`; 

    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`, 
      to: formattedTo, 
    });

    console.log('Twilio Response:', response);

    return new Response(JSON.stringify({ success: true, data: response }), { status: 200 });
  } catch (error) {
    console.error('Error sending message:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

