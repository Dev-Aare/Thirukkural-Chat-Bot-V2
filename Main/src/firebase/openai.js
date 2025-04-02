import OpenAI from "openai";

const openai = new OpenAI({
  apiKey:
    "",
  dangerouslyAllowBrowser: true,
});

export const getAIResponse = async (query, couplets) => {
  const prompt = `
    You are an expert on Thirukural, a Tamil classic with 1330 couplets. Data format:
    {
      "Number": 1,
      "Line1": "அகர முதல எழுத்தெல்லாம் ஆதி",
      "Line2": "பகவன் முதற்றே உலகு.",
      "Translation": "'A' leads letters; the Ancient Lord Leads and lords the entire world",
      "mv": "எழுத்துக்கள் எல்லாம் அகரத்தை அடிப்படையாக கொண்டிருக்கின்றன...",
      "sp": "எழுத்துக்கள் எல்லாம் அகரத்தில் தொடங்குகின்றன...",
      "mk": "அகரம் எழுத்துக்களுக்கு முதன்மை...",
      "explanation": "As the letter A is the first of all letters...",
      "couplet": "A, as its first of letters...",
      "transliteration1": "Akara Mudhala Ezhuththellaam Aadhi",
      "transliteration2": "Pakavan Mudhatre Ulaku"
    }
    Query: "${query}"
    Couplets: ${JSON.stringify(couplets)}
    Respond with relevant couplets or complete the sentence if it starts with a phrase.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: prompt }],
  });
  return response.choices[0].message.content || "Something Went Wrong.";
};
