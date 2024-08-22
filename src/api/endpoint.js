import { formatDocumentsAsString } from "langchain/util/document";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as fs from 'fs';
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { configDotenv } from "dotenv";
import { pipe } from "framer-motion";





// Logging to verify
const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);
const database = client.db("classRecommender");
const jobCollection = database.collection("simpleJobCollection");
const coursesCollection = database.collection("simpleCourseCollection");

let model = new OpenAIEmbeddings({
model: "text-embedding-ada-002",
});





// async function run() {
//     // Wait for Atlas to sync index
//     console.log("Waiting for initial sync...");
//     await new Promise(resolve => setTimeout(() => {
//     resolve();
//     }, 10));
//     try {
//       // Configure your Atlas collection
//       const database = client.db("classRecommender");
//       const collection = database.collection("simpleJobCollection");
//       const coursesCollection = database.collection("simpleCourseCollection")
//       const dbConfig = {  
//         collection: collection,
//         indexName: "default", // The name of the Atlas search index to use.
//         embeddingKey: "embedding", // Field name for the vector embeddings. Defaults to "embedding".
//       };
//       const coursesDbConfig = {
//         collection: coursesCollection,
//         indexName: "default",
//         embeddingKey: "embedding"
//       }
      
//       // Ensure that the collection is empty
//       // await collection.deleteMany({});
  
//       // Save online PDF as a file
//     //   const rawData = await fetch("https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE4HkJP");
//     //   const pdfBuffer = await rawData.arrayBuffer();
//     //   const pdfData = Buffer.from(pdfBuffer);
//     //   fs.writeFileSync("atlas_best_practices.pdf", csv);
  
//       // Load and split the sample data
//       // const loader = new CSVLoader(`postings.csv`);
//       // const data = await loader.load();
//       // const textSplitter = new RecursiveCharacterTextSplitter({
//       //   chunkSize: 200,
//       //   chunkOverlap: 20,
//       // });
//       // const docs = await textSplitter.splitDocuments(data);
  
//       // Instantiate Atlas as a vector store
//       const coursesVectorStore = await new MongoDBAtlasVectorSearch(new OpenAIEmbeddings(), coursesDbConfig);
//       const coursesRetriever = coursesVectorStore.asRetriever();
//       const coursesprompt = PromptTemplate.fromTemplate(`Answer with the top classes where a user is able to pick up these skills. 
//         Answer in the format: college, class code, description based on context .

        
//         Question: which cuny school can I learn the skills highlighted here: {answer}
//         `);

//       const coursesmodel = new ChatOpenAI({});
//       const courseschain = RunnableSequence.from([
//         {
//           context: coursesRetriever.pipe(formatDocumentsAsString),
//           answer: new RunnablePassthrough(),
//         },
//         coursesprompt,
//         coursesmodel,
//         new StringOutputParser(),
//       ])
//       const vectorStore = await new MongoDBAtlasVectorSearch(new OpenAIEmbeddings(), dbConfig);      // Implement RAG to answer questions on your data 
//         const retriever = vectorStore.asRetriever();
//         const prompt = PromptTemplate.fromTemplate(`Answer the question based on the following context:
//         {context}

//         Question: {question}`);
//         const model = new ChatOpenAI({});
//         const chain = RunnableSequence.from([
//         {
//             context: retriever.pipe(formatDocumentsAsString),
//             question: new RunnablePassthrough(),
//         },
//         prompt,
//         model,
//         new StringOutputParser(),
//         ]);

//         // Prompt the LLM
//         const question = "What skills do I need to be an Admin Assistant for  Bukit Batuk  in  Indoor Sales ";  
//         const answer = await chain.invoke(question);
//         const coursesanswer = await courseschain.invoke(answer)
//         console.log("Question: " + question);
//         console.log("Answer: " + answer);
//         console.log("Final anwer: " + coursesanswer);

//         // Return source documents
//         const retrievedResults = await retriever.invoke(question)
//         const documents = retrievedResults.map((documents => ({
//         pageContent: documents.pageContent,
//         pageNumber: documents.metadata.loc.pageNumber,

//         //Getting courses that teach this

//         })))

//     } finally {
//       // Ensure that the client will close when you finish/error
//       await client.close();
//     }
//   }
// run().catch(console.dir);
  
async function runScript() {
    client.connect()

    async function skillsVectorSearch(userQuery, collection) {
        try {
            await client.connect();
            let query = await model.embedQuery(String(userQuery));
            const pipeline = [
                {
                    "$vectorSearch": {
                        "exact": false,
                        "index": "default",
                        "limit": 6,
                        "numCandidates": 10000,
                        "path": "embedding",
                        "queryVector": query
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "company": 1, 
                        "title": 1,  
                        "desc": 1,  
                        "score": {"$meta": "vectorSearchScore"}
                    }
                },
            ]
            const result = collection.aggregate(pipeline);
            let final = []
            await result.forEach(doc => final.push(doc));
            return final
        } finally {
            console.log("Job Skills Searched")
        }
    }
    
    async function coursesVectorSearch(userQuery, collection) {
        try {
           await client.connect();
        //    const database = client.db("classRecommender");
        //    const collection = database.collection("simpleCourseCollection");
           let query = await model.embedQuery(String(userQuery));
           const pipeline = [
            {
                "$vectorSearch": {
                    "exact": false,
                    "index": "default",
                    "limit": 6,
                    "numCandidates": 10000,
                    "path": "embedding",
                    "queryVector": query
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "course": 1, 
                    "college": 1,  
                    "desc": 1,  
                    "score": {"$meta": "vectorSearchScore"}
                }
            },
        ]
        const result = collection.aggregate(pipeline);
        let final = []
        await result.forEach((doc) => final.push(doc));
        return final
        } finally {
            console.log("Courses Searched")
        }
    }
    
    
    
    const getResponse = async (query) => {
        let embeddedQuery = await skillsVectorSearch(query, jobCollection)
        // console.log(embeddedQuery)
        const jobDescriptions = embeddedQuery.map(doc => doc.desc).join("\n");
        let skillsExtractionPrompt = PromptTemplate.fromTemplate(
            `Analyze this text and extract a list of skills needed for the intended profession in an array format;
             [skill1, skill2, skill3, ...]. 
             Make the maximum number of skills 10 and simplify and summarize each skill into as little number of words possible, in some cases a one word description suffices: {jobDescriptions}`
        )
        let llm = new ChatOpenAI({model: "gpt-4-0125-preview"})
        // let skChain = RunnableSequence.from([
        //     {
        //         jobDescriptions: new RunnablePassthrough(),
        //     },
        //     skillsExtractionPrompt,
        //     llm,
        //     new StringOutputParser(),
        // ])
        let skillsChain = skillsExtractionPrompt.pipe(llm).pipe(new StringOutputParser())
        const skillsList = await skillsChain.invoke({ jobDescriptions })
        let coursesQuery = await coursesVectorSearch(skillsList, coursesCollection)
        console.log("Skills: ", skillsList)
        console.log("Courses: ", coursesQuery)
        return {skillsList, coursesQuery}
    }
    
    await getResponse("I would love to be a professional boxer, wrestler, or fighter")
    
    await client.close();
}

runScript()