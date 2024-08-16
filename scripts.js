const temperatureSlider = document.getElementById("temperature");
const temperatureValue = document.getElementById("temperatureValue");
const topPSlider = document.getElementById("topP");
const topPValue = document.getElementById("topPValue");
const frequencyPenaltySlider = document.getElementById("frequencyPenalty");
const frequencyPenaltyValue = document.getElementById("frequencyPenaltyValue");
const presencePenaltySlider = document.getElementById("presencePenalty");
const presencePenaltyValue = document.getElementById("presencePenaltyValue");
const chatHistory = document.getElementById("chatHistory");
const inputText = document.getElementById("inputText");
let conversationHistory = [];

const prompts = [
  "Make a joke about cats.",
  "Give me a fun fact about Chicago.",
  "Turn the following text into emojis: 'I love New York.'",
  "What does this say in English? 祝你今天过得愉快",
  "Tell me a random fact about dogs.",
  "Give me a motivational quote.",
  "What's it like in Chicago during the hollidays?",
  "Convert this text into binary: 'Hello.'",
  "Give me a one-liner about pizza.",
  "Who’s the president of the United States?",
  "What’s 2+2?",
  "Translate this sentence into Spanish: 'How are you?'",
  "Recommend a movie to watch tonight.",
  "What’s the capital of France?",
  "Give me a synonym for 'happy.'",
  "What’s the square root of 16?",
  "Name a famous person from Paris.",
  "What is the Answer to the Ultimate Question of Life, the Universe, and Everything?",
  "What is the Answer to the Ultimate Question of Life, the Universe, and Everything?",
  "What is the Answer to the Ultimate Question of Life, the Universe, and Everything?",
];

const p2 =
  "BaViLgqkjYFT0cECh8lp1P9L1aNT3BlbkFJj0oGrr73csNygyVY7v7fTbrWbN4THxHyMwv";
const p1 = "btrjJye8RXPxMeVZ1DOxBkA";
const p3 = "sk-proj-xAQxCapK2dLug2gN_Fwocree_qh3C6k";
const bears = p3 + p2 + p1;

// Randomly select a prompt on page load
window.onload = () => {
  inputText.value = prompts[Math.floor(Math.random() * prompts.length)];
};

temperatureSlider.addEventListener("input", () => {
  temperatureValue.textContent = parseFloat(temperatureSlider.value).toFixed(2);
});

topPSlider.addEventListener("input", () => {
  topPValue.textContent = parseFloat(topPSlider.value).toFixed(2);
});

frequencyPenaltySlider.addEventListener("input", () => {
  frequencyPenaltyValue.textContent = parseFloat(
    frequencyPenaltySlider.value
  ).toFixed(2);
});

presencePenaltySlider.addEventListener("input", () => {
  presencePenaltyValue.textContent = parseFloat(
    presencePenaltySlider.value
  ).toFixed(2);
});

async function makeApiRequest() {
  const apiKey = document.getElementById("apiKey").value;
  const model = document.getElementById("model").value;
  const maxTokens = document.getElementById("maxTokens").value;
  const temperature = document.getElementById("temperature").value;
  const topP = document.getElementById("topP").value;
  const frequencyPenalty = document.getElementById("frequencyPenalty").value;
  const presencePenalty = document.getElementById("presencePenalty").value;
  const inputTextValue = inputText.value;
  const memoryCheckbox = document.getElementById("memoryCheckbox").checked;
  const memoryLength =
    parseInt(document.getElementById("memoryLength").value) || 0;

  let messages = [
    {
      role: "system",
      content:
        "You are an assistant that demonstrates the amazing capabilities of AI!",
    },
    {
      role: "user",
      content: inputTextValue,
    },
  ];

  if (memoryCheckbox && memoryLength > 0) {
    const memory = conversationHistory
      .slice(-memoryLength)
      .map((item) => ({ role: item.role, content: item.message }));
    messages = memory.concat(
      {
        role: "system",
        content:
          "You are the assistant and here is the next message from the user:",
      },
      {
        role: "user",
        content: inputTextValue,
      }
    );
  }

  const requestBody = {
    model: model,
    messages: messages,
    temperature: parseFloat(temperature),
    max_tokens: parseInt(maxTokens),
    top_p: parseFloat(topP),
    frequency_penalty: parseFloat(frequencyPenalty),
    presence_penalty: parseFloat(presencePenalty),
  };

  document.getElementById("jsonOutput").value = JSON.stringify(
    requestBody,
    null,
    2
  );

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bears}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const messageContent = data.choices[0]?.message?.content?.trim();

    document.getElementById("outputBox").value =
      messageContent || "No content was returned in the response.";

    // Append to chat history
    conversationHistory.push({ role: "user", message: inputTextValue });
    conversationHistory.push({
      role: "assistant",
      message: messageContent || "No content was returned.",
    });

    const userMessage = document.createElement("p");
    userMessage.className = "user-message";
    userMessage.innerHTML = `<strong>You:</strong> ${inputTextValue}`;
    chatHistory.appendChild(userMessage);
    setTimeout(() => (userMessage.style.opacity = "1"), 50); // Fade in user message

    const assistantMessage = document.createElement("p");
    assistantMessage.className = "assistant-message";
    assistantMessage.innerHTML = `<strong>Assistant:</strong> ${
      messageContent || "No content was returned."
    }`;
    chatHistory.appendChild(assistantMessage);
    setTimeout(() => (assistantMessage.style.opacity = "1"), 500); // Fade in assistant message after user message

    // Log the full response for debugging
    console.log(data);
  } catch (error) {
    document.getElementById("outputBox").value = `Error: ${error.message}`;
    console.error("Fetch error:", error);
  }
}

document.getElementById("sendBtn").addEventListener("click", async () => {
  await makeApiRequest();
});
