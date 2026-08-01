import {ChatOllama, OllamaEmbeddings} from "@langchain/ollama";
import dotenv from "dotenv"

dotenv.config();

export const llm = new ChatOllama({
    baseUrl:process.env.OLLAMA_URL,
    model:"llama3.2",
    temperature:0,
});

export const embeddings = new OllamaEmbeddings({
    baseUrl:process.env.OLLAMA_URL,
    model:"nomic-embed-text",
});
