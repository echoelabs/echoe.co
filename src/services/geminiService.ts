export const generateEchoeResponse = async (
  userMessage: string,
  context: string
): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage, context }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.text || "I'm optimizing the connection. Ask me again in a second?";
  } catch (error) {
    console.error('Chat API Error:', error);
    return "I'm in demo mode right now. Try asking me to process orders, check candle stock, or draft a reply to Sarah!";
  }
};
