import {
    BaseRetriever,
    // type BaseRetrieverInput,
  } from "@langchain/core/retrievers";
  import { Document } from "@langchain/core/documents";
  import { MongoClient } from "mongodb";
  import { ChatOpenAI } from "@langchain/openai";
  import { PromptTemplate } from "@langchain/core/prompts";
  import { StringOutputParser } from "@langchain/core/output_parsers";
  import { OpenAIEmbeddings } from "@langchain/openai";
  import { openAIKey, mongoDbUri } from "@/keys/keys.js";

const OPENAI_KEY = openAIKey
const ATLAS_URI = mongoDbUri

// Logging to verify
const client = new MongoClient(ATLAS_URI);
const database = client.db("classRecommender");
const jobCollection = database.collection("simpleJobCollection");
const coursesCollection = database.collection("simpleCourseCollection");

let model = new OpenAIEmbeddings({
model: "text-embedding-ada-002",
apiKey: openAIKey,
batchSize: 1536,
stripNewLines: true,
});
  
//   export interface CustomRetrieverInput extends BaseRetrieverInput {
//     client: MongoClient;
//     jobDbName: string;
//     jobCollectionName: string;
//     coursesDbName: string;
//     coursesCollectionName: string;
//     vectorModel: any;  // Replace with your actual vector model
//     llm: ChatOpenAI;  // Your LLM instance
//   }
  
  export class CustomRetriever extends BaseRetriever {
    lc_namespace = ["langchain", "retrievers"];
  
    constructor({
      client,
      jobDbName,
      jobCollectionName,
      coursesDbName,
      coursesCollectionName,
      vectorModel,
      llm,
      ...fields
    }) {
      super(fields);
      this.client = client;
      this.jobDbName = jobDbName;
      this.jobCollectionName = jobCollectionName;
      this.coursesDbName = coursesDbName;
      this.coursesCollectionName = coursesCollectionName;
      this.vectorModel = vectorModel;
      this.llm = llm;
    }
  
    async _getRelevantDocuments(query) {
      try {
        // 1. Connect to MongoDB
        await this.client.connect()
        const jobDb = this.client.db(this.jobDbName);
        const jobCollection = jobDb.collection(this.jobCollectionName);
        const coursesDb = this.client.db(this.coursesDbName);
        const coursesCollection = coursesDb.collection(this.coursesCollectionName);
  
        // 2. Embed the user's query
        const queryVector = await this.vectorModel.embedQuery(String(query));
  
        // 3. Perform the first vector search on the job/skills database
        const jobPipeline = [
          {
            "$vectorSearch": {
              "exact": false,
              "index": "default",
              "limit": 6,
              "numCandidates": 10000,
              "path": "embedding",
              "queryVector": queryVector,
            },
          },
          {
            "$project": {
              "_id": 0,
              "desc": 1,  // Adjust field names as necessary
              "score": { "$meta": "vectorSearchScore" },
            },
          },
        ];
        const jobResults = await jobCollection.aggregate(jobPipeline).toArray();
        const jobDescriptions = jobResults.map((doc) => doc.desc).join("\n");
  
        // 4. Use LLM to extract skills from job descriptions
        const skillsExtractionPrompt = PromptTemplate.fromTemplate(`
          Analyze this text and extract a list of skills needed for the intended profession in an array format;
          [skill1, skill2, skill3, ...]. 
          Make the maximum number of skills 10 and simplify and summarize each skill into as little number of words possible, in some cases a one word description suffices: {jobDescriptions}`
        );
        const skillsChain = skillsExtractionPrompt
          .pipe(this.llm)
          .pipe(new StringOutputParser());
        const skillsList = await skillsChain.invoke({ jobDescriptions });
  
        // 5. Perform the second vector search on the courses database using extracted skills
        const coursesPipeline = [
          {
            "$vectorSearch": {
              "exact": false,
              "index": "default",
              "limit": 6,
              "numCandidates": 10000,
              "path": "embedding",
              "queryVector": await this.vectorModel.embedQuery(skillsList),
            },
          },
          {
            "$project": {
              "_id": 0,
              "course": 1,
              "college": 1,
              "desc": 1,
              "score": { "$meta": "vectorSearchScore" },
            },
          },
        ];
        const coursesResults = await coursesCollection
          .aggregate(coursesPipeline)
          .toArray();
  
        // 6. Combine and return results as a list of documents
        const documents = [
          new Document({
            pageContent: `Skills: ${skillsList}`,
            metadata: { type: "skills", originalQuery: query },
          }),
          ...coursesResults.map(
            (doc) =>
              new Document({
                pageContent: `Course: ${doc.course} - ${doc.college}\n${doc.desc}`,
                metadata: { type: "course", score: doc.score },
              })
          ),
        ];
  
        return documents;
      } finally {
        console.log("Completed custom retrieval process.");
        // Optionally, close the MongoDB connection if necessary
      }
    }
  }
  