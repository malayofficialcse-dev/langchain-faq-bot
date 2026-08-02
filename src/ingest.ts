import "dotenv/config";
import { readFile } from "node:fs/promises";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {Chroma} from "@langchain/community/vectorstores/chroma";

import {embeddings} from "./config/ollama.js";

async function ingest() {
    try {
        console.log("Loading document...");

        const text = await readFile("./data/faq.txt", "utf8");
        const docs = [{ pageContent: text, metadata: {} }];

        console.log(`Loaded ${docs.length} document(s)`);

        console.log("Splitting document...");

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 300,
            chunkOverlap: 50,
        });

        const splitDocs = await splitter.splitDocuments(docs);
        console.log(`Created ${splitDocs.length} chunks`);
        console.log("cheating embedding and storing in chromadb");

        await Chroma.fromDocuments(
            splitDocs,
            embeddings,
            {
                collectionName:"faq",
                url:process.env.CHROMA_URL,
            }
        );

        console.log("Documents loaded successfully");
    } catch (error) {
        console.error(error);
    }
}

ingest();