import { OpenAIStream, OpenAIStreamPayload } from './helper';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}

export const config = {
  runtime: 'edge',
};

export async function POST(req: Request): Promise<Response> {
  const { prompt, genre } = (await req.json()) as {
    prompt?: string;
    genre?: string;
  };

  if (!prompt) {
    return new Response('No prompt in the request', { status: 400 });
  }
  
  //* python
  
  industry = input("What industry are you writing to?")
  person = input("What is their role?")
  product = input("What is your product?")
  
  def token_limiter(content):
    //* 1 token is appropximately 4 characters, if we overshoot then damn
    tokens_start = 4000
    tokens_content = len(content)*4
    tokens_available = token_start - tokens_content
    return tokens_available
  
  
  
  content = f"You are a salesperson selling your {product} and are writing a sales email to a client: {person} who works in {industry}. Write a 100 word email pitching the product. Start the email with a joke about the client's industry."
  

  //const content = `Create a short ${genre} story, no more than 100 words, in the voice of philosoper Nietzsche based on the following topic: ${prompt}.`;

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content,
      },
    ],
    //changed temperature
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: tokens_available,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
