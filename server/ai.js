import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { NVIDIA_API_KEY } = process.env;

export async function chat(messages) {
  if (!NVIDIA_API_KEY) {
    throw new Error('NVIDIA_API_KEY is not defined in environment variables.');
  }

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'nvidia/llama-3.1-nemotron-70b-instruct',
      messages: messages,
      temperature: 0.5,
      max_tokens: 1024
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Nvidia API error: ${response.status} - ${text}`);
  }

  return response.json();
}
