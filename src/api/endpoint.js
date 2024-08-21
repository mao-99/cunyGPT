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

process.env.OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
process.env.ATLAS_CONNECTION_STRING = import.meta.env.VITE_MONGODB_ATLAS_URI;
const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);

async function run() {
    // Wait for Atlas to sync index
    console.log("Waiting for initial sync...");
    await new Promise(resolve => setTimeout(() => {
    resolve();
    }, 10));
    try {
      // Configure your Atlas collection
      const database = client.db("classRecommender");
      const collection = database.collection("simpleJobOpening");
      const coursesCollection = database.collection("embedded_cuny_courses")
      const dbConfig = {  
        collection: collection,
        indexName: "vector_index", // The name of the Atlas search index to use.
        textKey: "text", // Field name for the raw text content. Defaults to "text".
        embeddingKey: "embedding", // Field name for the vector embeddings. Defaults to "embedding".
      };
      const coursesDbConfig = {
        collection: coursesCollection,
        indexName: "default",
        textKey: "description",
        embeddingKey: "description_embedding"
      }
      
      // Ensure that the collection is empty
      // await collection.deleteMany({});
  
      // Save online PDF as a file
    //   const rawData = await fetch("https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE4HkJP");
    //   const pdfBuffer = await rawData.arrayBuffer();
    //   const pdfData = Buffer.from(pdfBuffer);
    //   fs.writeFileSync("atlas_best_practices.pdf", csv);
  
      // Load and split the sample data
      // const loader = new CSVLoader(`postings.csv`);
      // const data = await loader.load();
      // const textSplitter = new RecursiveCharacterTextSplitter({
      //   chunkSize: 200,
      //   chunkOverlap: 20,
      // });
      // const docs = await textSplitter.splitDocuments(data);
  
      // Instantiate Atlas as a vector store
      const coursesVectorStore = await new MongoDBAtlasVectorSearch(new OpenAIEmbeddings(), coursesDbConfig);
      const coursesRetriever = coursesVectorStore.asRetriever();
      const coursesprompt = PromptTemplate.fromTemplate(`Answer with the top classes where a user is able to pick up these skills. 
        Answer in the format: college, class code, description based on context .

        
        Question: which cuny school can I learn the skills highlighted here: {answer}
        `);

      const coursesmodel = new ChatOpenAI({});
      const courseschain = RunnableSequence.from([
        {
          context: coursesRetriever.pipe(formatDocumentsAsString),
          answer: new RunnablePassthrough(),
        },
        coursesprompt,
        coursesmodel,
        new StringOutputParser(),
      ])
      const vectorStore = await new MongoDBAtlasVectorSearch(new OpenAIEmbeddings(), dbConfig);      // Implement RAG to answer questions on your data 
        const retriever = vectorStore.asRetriever();
        const prompt = PromptTemplate.fromTemplate(`Answer the question based on the following context:
        {context}

        Question: {question}`);
        const model = new ChatOpenAI({});
        const chain = RunnableSequence.from([
        {
            context: retriever.pipe(formatDocumentsAsString),
            question: new RunnablePassthrough(),
        },
        prompt,
        model,
        new StringOutputParser(),
        ]);

        // Prompt the LLM
        const question = "What skills do I need to be an Admin Assistant for  Bukit Batuk  in  Indoor Sales ";  
        const answer = await chain.invoke(question);
        const coursesanswer = await courseschain.invoke(answer)
        console.log("Question: " + question);
        console.log("Answer: " + answer);
        console.log("Final anwer: " + coursesanswer);

        // Return source documents
        const retrievedResults = await retriever.invoke(question)
        const documents = retrievedResults.map((documents => ({
        pageContent: documents.pageContent,
        pageNumber: documents.metadata.loc.pageNumber,

        //Getting courses that teach this

        })))

    } finally {
      // Ensure that the client will close when you finish/error
      await client.close();
    }
  }
run().catch(console.dir);
  