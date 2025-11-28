import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';

// Simulate realistic AI response time (1-2.5 seconds)
const simulateDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500));

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message, context } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = import.meta.env.GEMINI_API_KEY;

    // If no API key, return demo response with simulated delay
    if (!apiKey) {
      await simulateDelay();
      const demoResponse = getDemoResponse(message);
      return new Response(JSON.stringify({ text: demoResponse }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: `You are "echoe", a hyper-efficient, friendly AI commerce assistant for a solopreneur in the year 2026.

Role: You manage the user's online store (inventory, orders, customer chats) from a single chat interface.
Tone: Professional, succinct, slightly witty, and reassuring. Avoid technical jargon.

Current Dashboard State (Context):
${context || 'No context provided'}

Task: Respond to the user's message based on the context. If they ask to do something (like process an order), confirm it's done. If they ask for info, provide it clearly.`,
      },
    });

    return new Response(
      JSON.stringify({
        text: response.text || "I'm optimizing the connection. Ask me again in a second?",
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Gemini API Error:', error);
    await simulateDelay();
    const demoResponse = getDemoResponse('');
    return new Response(JSON.stringify({ text: demoResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Demo responses when API is not available
function getDemoResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes('process') || lowerMsg.includes('order')) {
    return "Done! I've processed the pending orders and sent confirmation emails to customers. Tracking numbers will be generated once shipped.";
  }
  if (lowerMsg.includes('candle') || lowerMsg.includes('stock')) {
    return 'You have 42 Soy Candles in stock. At current sales velocity, you have about 3 weeks of inventory remaining.';
  }
  if (lowerMsg.includes('sarah') || lowerMsg.includes('reply') || lowerMsg.includes('draft')) {
    return 'Draft ready: "Hi Sarah! The Linen Throw dimensions are 150cm x 200cm, perfect for a queen-size bed. Let me know if you have any other questions!"';
  }
  if (lowerMsg.includes('revenue') || lowerMsg.includes('sales')) {
    return "Today's revenue is up 12% compared to yesterday! You've had 3 new orders and strong traffic from Instagram.";
  }

  return "I'm in demo mode right now. Try asking me to process orders, check candle stock, or draft a reply to Sarah!";
}
