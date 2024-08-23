import { OpenAIEmbeddings } from '@langchain/openai';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { MongoClient } from "mongodb";
import { openAIKey, mongoDbUri } from '@/keys/keys';
import dotenv from 'dotenv';
dotenv.config();

let embeddingsInstance = null;

const client = new MongoClient(mongoDbUri);
const myDb = client.db("classRecommender")
const myJobCollection = myDb.collection("simpleJobCollection")
const myCourseCollection = myDb.collection("simpleCourseCollection")

export function getEmbeddingsTransformer() {
    try {
        // Ensure embeddingsInstance is initialized only once for efficiency
        if (!embeddingsInstance) {
            embeddingsInstance = new OpenAIEmbeddings();
        }

        return embeddingsInstance;
    } catch (error) {
        // Handle errors gracefully, providing informative messages and potential mitigation strategies
        console.error("Error creating OpenAIEmbeddings instance:", error);

        // Consider retrying based on error type or implementing exponential backoff for robustness
        // Log details about the error and retry attempt for debugging purposes
        console.error("Retrying creation of OpenAIEmbeddings...");
        embeddingsInstance = new OpenAIEmbeddings(); // Attempt retry

        // If multiple retries fail, provide a clear fallback mechanism or throw a more specific error
        if (!embeddingsInstance) {
            throw new Error("Failed to create OpenAIEmbeddings instance after retries. Check the logs for details.");
        }

        return embeddingsInstance; // Return the successfully created instance after retries
    }
}

export function coursesStore() {
    const vectorStore = new MongoDBAtlasVectorSearch(new OpenAIEmbeddings(),{
        collection: myCourseCollection,
        indexName: "default",
        embeddingKey: "embedding"
    }
    );
    return vectorStore;
}

export function skillsStore() {
    const vectorStore = new MongoDBAtlasVectorSearch(new OpenAIEmbeddings(),{
        collection: myJobCollection,
        indexName: "default",
        embeddingKey: "embedding"
    });
    return vectorStore;
}

export function vectorStore() {
    const vectorStore = new MongoDBAtlasVectorSearch(
        new OpenAIEmbeddings(),
        searchArgs()
    );
    return vectorStore
}

export function searchArgs() {
    const searchArgs = {
        collection,
        indexName: "vector_index",
        textKey: "text",
        embeddingKey: "text_embedding",
    }
    return searchArgs;
}