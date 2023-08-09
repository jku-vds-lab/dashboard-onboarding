import { Configuration, OpenAIApi, CreateChatCompletionRequest } from "openai";

export default async function OpenAI() {
  let queryResult = "";
  const configuration = new Configuration({
    apiKey: "",
  });

  const DEFAULT_PARAMS = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Say this is a test!" }],
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  // Delete it
  delete configuration.baseOptions.headers["User-Agent"];

  const api = new OpenAIApi(configuration);

  // const openai = new OpenAIApi(configuration);
  // const chatCompletion: CreateChatCompletionRequest = {
  //   model: "gpt-3.5-turbo",
  //   messages: [
  //     {
  //       role: "system",
  //       content:
  //         "Explain a line chart. X-axis shows time, y-axis shows new hires",
  //     },
  //   ],
  //   max_tokens: 20,
  // };
  // const response = await openai.createChatCompletion(chatCompletion);
  // const queryResult = response.data;

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
      queryResult = result;
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });

  return queryResult;
}
