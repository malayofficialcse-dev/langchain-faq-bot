import "dotenv/config"

import readline from "node:readline/promises";
import { stdin,stdout } from "node:process";

import {ChatPromptTemplate} from "@langchain/core/prompts";
import {Chroma} from "@langchain/community/vectorstores/chroma";

import { embeddings, llm } from "./config/ollama.js";

async function chat() {
    const vectorStore = new Chroma (
        embeddings,
        {
            collectionName:"faq",
            url:process.env.CHROMA_URL,
        }
    );

    const retriever = vectorStore.asRetriever({
        k: 3,
    });

    const prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful AI assistant.
        Use ONLY the following context.

        Context: {context}
        Question: {question}
        Answer:`);

        const rl = readline.createInterface({
            input:stdin,
            output:stdout,
        });

        while(true) {
            const question = await rl.question("\n Ask : ");
            if(question.toLocaleLowerCase() === "exit") {
                break;
            } 

            const docs = await retriever.invoke(question);

            const context = docs.map(doc => doc.pageContent).join("\n\n");

            const message = await prompt.invoke({
                context,
                question,
            });

            const response = await llm.invoke(message);
            console.log("\nAI : ");
            console.log(response.content);

        }
        rl.close();

}

chat();