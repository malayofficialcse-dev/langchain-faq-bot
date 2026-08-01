import "dotenv/config";

import {TextLoader} from "langchain/document_loaders/fs/text";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {Chroma} from "@langchain/community/vectorstores/chroma";

import {embeddings} from "./config/ollama";

async function ingest() {
    try {
        console.log("Loading document...");

        const loader = new TextLoader("./data/faq.txt");
        const docs = await loader.load();

        console.log(`Loaded ${docs.length} document(s)`);

        console.log("Splitting document...");

        const aplitter = new RecursiveCharacterTextSplitter({
            chunkSize:300,
            chunkOverlap:50,
        });

        const splitDocs = await aplitter.splitDocuments(docs);
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