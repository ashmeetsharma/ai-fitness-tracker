import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { imageBase64 } = await req.json();

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Analyze this food image and give calories, protein, fat, carbs." },
            { type: "input_image", image_base64: imageBase64 }
          ]
        }
      ]
    });

    const result = response.output_text;

    return Response.json({ result });

  } catch (error) {
    console.error("FOOD ANALYSIS ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
