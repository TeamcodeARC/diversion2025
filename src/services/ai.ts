import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBi2qRZJAAmvzBKg2AfkUTuTs6IMkU0uEc');

export async function getPowerInsights(data: any) {
  try {
    const prompt = `Analyze the following power grid metrics and provide insights:
      Current Load: ${data.load}%
      Efficiency: ${data.efficiency}%
      Renewable Energy: ${data.renewable}%
      Weather Impact: Temperature ${data.weather.temperature}°C, Wind ${data.weather.windSpeed}m/s

      Provide 3 specific recommendations for optimizing the power grid based on these metrics.
      Format the response as a JSON array of strings.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch {
      return [text];
    }
  } catch (error) {
    console.error('Error getting AI insights:', error);
    return ['Unable to generate insights at this time'];
  }
}