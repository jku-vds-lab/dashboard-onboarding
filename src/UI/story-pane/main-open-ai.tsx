import { Configuration, OpenAIApi } from "openai";

export default function OpenAI() {
  debugger;
  debugger;
  const configuration = new Configuration({
    organization: "org-UHILsVnnYBaXU6LsY8WtZjSU",
    apiKey: "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",
  });

  const DEFAULT_PARAMS = {
    model: "text-davinci-002",
    messages: [{ role: "user", content: "Say this is a test!" }],
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  // const openai = new OpenAIApi(configuration);

  async function query(params = {}) {
    const params_ = { ...DEFAULT_PARAMS, ...params };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(configuration.apiKey),
      },
      body: JSON.stringify(params_),
    };
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      requestOptions
    );
    const data = await response.json();
    return data.choices[0].text;
  }

  query()
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });

  return <div>Open AI</div>;
}
