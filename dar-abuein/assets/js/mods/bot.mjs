"use strict";

import apiCall from "service";
import { createElement, addMessage } from "interface";
import { autoResizeTextarea, copyToClipboard } from "utils";

const id = (elementId) => document.getElementById(elementId);

// Apply for an API key https://platform.deepseek.com/api_keys

/** Load the AI provider's secret key from the server. */
const loadAIChatBotSecretKey = async (provider) => {
    switch (provider.toLowerCase().trim()) {
        case "alibaba":
        case "deepseek":
        case "openai":
            return await apiCall({
                endpoint: `config/${provider}`,
                method: "POST"
            });
    }
};

/** Start chatting. */
const startChattingWithAIChatBot = async (provider, body, token) => {
    switch (provider.toLowerCase().trim()) {
        case "alibaba":
            return await apiCall({
                endpoint: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
                method: "POST",
                body: body,
                cookies: false,
                token: token,
                output: "json",
                external: true,
            });
        case "deepseek":
        case "openai":
            return await apiCall({
                endpoint: `https://api.${provider}.com/v1/chat/completions`,
                method: "POST",
                body: body,
                cookies: false,
                token: token,
                output: "json",
                external: true,
            });
    }
};

const typeText = (element, text, speed = 30) => {
    let i = 0;
    // element.textContent = "";

    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
};

const initializeAIChatBot = async () => {
    id("openChatBot").onclick = () => id("myChatBot").showModal();
    id("startChatBot").onclick = () => sendMessage();
};

const sendMessage  = () => {
    const form = id("chatBotForm"),
        input = form.elements["chatBotInput"],
        output = form.elements["result"],
        select = form.elements["provider"],
        selectX = form.elements["model"],
        message = input.value.trim();

    //output.textContent = "Processing...";
    //const selectText = select.options[select.selectedIndex].text;
    
    //input.addEventListener("input", () => autoResizeTextarea(input));
    //autoResizeTextarea(input);

    if (message === "") return;
    appendMessage("user", message);
    input.value = "";
    
    setTimeout(async () => {
        const botResponse = await getBotResponse(
            select.options[select.selectedIndex].value,
            selectX.options[selectX.selectedIndex].value,
            message,
            output
        );
        appendMessage("bot", botResponse);
    }, 500);
};

const appendMessage = (sender, text) => {
    const chatBox = document.getElementById("chat-box"),
        messageDiv = createElement("div", {
            classList: `message ${sender}`,
            textContent: text
        });
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
};

const getBotResponse = async (provider, model, input, output) => {
    try {
        const { apiKey } = await loadAIChatBotSecretKey(provider);
        if (!apiKey) addMessage("No secret key returned from the server for this AI bot. Please check and try again.");

        const responses = {
            "hello": "Hi there! How can I help you?",
            "how are you?": "I'm just a bot, but I'm doing great!",
            "bye": "Goodbye! Have a great day!"
        };

        let initialResponse = responses[input.toLowerCase()];
        if (!initialResponse) {
            
            const requestBody = {
                model: model,
                "store": true,
                
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant."
                    },
                    {
                        role: "user",
                        content: input
                    }
                ]
            };

            initialResponse = await startChattingWithAIChatBot(provider, requestBody, apiKey);
        }

        if (initialResponse && output) {
            console.log(initialResponse);
            //output.innerHTML = "";
            typeText(output, initialResponse.choices[0].message.content.trim());
            output.appendChild(createElement("button", {
                type: "button",
                id: "copyButton",
                title: "Copy to Clipboard!",
                textContent: "Copy to Clipboard!",
                onclick: () => copyToClipboard(output)
            }));

        } else if (!initialResponse) output.textContent = "Please start conversation first...";
    } catch (error) {
        console.error("Error:", error);
        output.textContent = "An error occurred while generating the output.";
    }
};

export {
    initializeAIChatBot
};