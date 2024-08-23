import { StreamingTextResponse, LangChainStream, Message } from 'ai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { vectorStore, coursesStore, skillsStore } from '@/utils/openai';
import { LangChainAdapter } from 'ai';
import { NextResponse } from 'next/server';
import { BufferMemory } from "langchain/memory";
import { formatDocumentsAsString } from "langchain/util/document";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, PromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { CustomRetriever } from '@/utils/customRetriever';
import { BaseMessage } from "@langchain/core/messages";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import * as fs from 'fs';
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { configDotenv } from "dotenv";
import { pipe } from "framer-motion";
import { mongoDbUri, openAIKey } from '@/keys/keys';



// Logging to verify
const client = new MongoClient(mongoDbUri);
const database = client.db("classRecommender");
const jobCollection = database.collection("simpleJobCollection");
const coursesCollection = database.collection("simpleCourseCollection");

let model = new OpenAIEmbeddings({
model: "text-embedding-ada-002",
apiKey: openAIKey,
batchSize: 1536,
stripNewLines: true,
});

let llm = new ChatOpenAI({model: "gpt-4-0125-preview"})

const retriever = new CustomRetriever({
    client: client,
    jobDbName: "classRecommender",
    jobCollectionName: "simpleJobCollection",
    coursesDbName: "classRecommender",
    coursesCollectionName: "simpleCourseCollection",
    vectorModel: model,
    llm: llm,
  });

export async function skillsVectorSearch(userQuery, collection) {
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

export async function coursesVectorSearch(userQuery, collection) {
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

// export const getResponse = async (query) => {
//     let embeddedQuery = await skillsVectorSearch(query, jobCollection)
//     // console.log(embeddedQuery)
//     const jobDescriptions = embeddedQuery.map(doc => doc.desc).join("\n");
//     let skillsExtractionPrompt = PromptTemplate.fromTemplate(
//         `Analyze this text and extract a list of skills needed for the intended profession in an array format;
//          [skill1, skill2, skill3, ...]. 
//          Make the maximum number of skills 10 and simplify and summarize each skill into as little number of words possible, in some cases a one word description suffices: {jobDescriptions}`
//     )
//     let llm = new ChatOpenAI({model: "gpt-4-0125-preview"})
//     // let skChain = RunnableSequence.from([
//     //     {
//     //         jobDescriptions: new RunnablePassthrough(),
//     //     },
//     //     skillsExtractionPrompt,
//     //     llm,
//     //     new StringOutputParser(),
//     // ])
//     let skillsChain = skillsExtractionPrompt.pipe(llm).pipe(new StringOutputParser())
//     const skillsList = await skillsChain.invoke({ jobDescriptions })
//     let coursesQuery = await coursesVectorSearch(skillsList, coursesCollection)
//     console.log("Skills: ", skillsList)
//     console.log("Courses: ", coursesQuery)
//     return {skillsList, coursesQuery}
// }

// async function runScript() {
//     client.connect()

//     await getResponse("I would love to be a professional fighter")
    
//     await client.close();
// }

// runScript()

export async function POST(req) {
    console.log("Found me")
    try {
        const { stream, handlers } = LangChainAdapter;
        const body = await req.json();
        // const messages = body.messages ?? [];
        //const question = messages[messages.length - 1].content;
        const question = body.message
        let chat_history = body.history
        chat_history = Object.values(chat_history).join()
        console.log(question)

        const model = new ChatOpenAI({
            temperature: 0.8,
            streaming: true,
            callbacks: [handlers],
        });

        // Use skillsVectorSearch to get relevant job skills
        const skillsResults = await skillsVectorSearch(question, jobCollection);
        // console.log("These are skillsResults", skillsResults)
        // Extract skills from the results
        const jobDescriptions = skillsResults.map(doc => doc.desc).join("\n");
        // console.log("Afrer mapping 1")
        const skillsExtractionPrompt = PromptTemplate.fromTemplate(
            `Analyze this text and extract a list of skills needed for the intended profession in an array format;
             [skill1, skill2, skill3, ...]. 
             Make the maximum number of skills 10 and simplify and summarize each skill into as little number of words possible, in some cases a one word description suffices: {jobDescriptions}`
        );
        const llm = new ChatOpenAI({model: "gpt-4-0125-preview"});
        const skillsChain = skillsExtractionPrompt.pipe(llm).pipe(new StringOutputParser());
        // console.log("Check 3")
        const skillsList = await skillsChain.invoke({ jobDescriptions });
        // console.log("Check 4")
        // Use coursesVectorSearch to get relevant courses
        const coursesResults = await coursesVectorSearch(skillsList, coursesCollection);
        // console.log("After courses search. Check 4", coursesResults)
        // Combine the results into a context
        const context = formatRetrievedInfo(skillsList, coursesResults);
        // console.log("Check 5. Trying to format results", context)

        // Create a prompt template that includes the context
        const promptTemplate = PromptTemplate.fromTemplate(`
            Context: {context}
            
            Human: {question}
            
            AI: Based on the job skills and courses relevant to your query, here's my response:
        `);
        // console.log("Check 5.5, after prompt")
        // Set up the conversation chain with the new context and prompt


        //New Section 
        // console.log("This is the new section. Check 6.1 -------------------------------")
        // Contextualize question
        const contextualizeQSystemPrompt = `
        Given a chat history and the latest user question
        which might reference context in the chat history,
        formulate a standalone question which can be understood
        without the chat history. Do NOT answer the question, just
        reformulate it if needed and otherwise return it as is.`;
        const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
        ["system", contextualizeQSystemPrompt],
        new MessagesPlaceholder("chat_history"),
        ["human", "{input}"],
        ]);

        const historyAwareRetriever = await createHistoryAwareRetriever({
        llm,
        retriever,
        rephrasePrompt: contextualizeQPrompt,
        });

        // Answer question
        const qaSystemPrompt = `
        You are an assistant for question-answering tasks. Use
        the following pieces of retrieved context to answer the
        question. If you don't know the answer, just say that you
        don't know. Keep the answer
        concise.
        \n\n
        {context}`;
        const qaPrompt = ChatPromptTemplate.fromMessages([
        ["system", qaSystemPrompt],
        new MessagesPlaceholder("chat_history"),
        ["human", "{input}"],
        ]);


        // Below we use createStuffDocuments_chain to feed all retrieved context
        // into the LLM. Note that we can also use StuffDocumentsChain and other
        // instances of BaseCombineDocumentsChain.
        const questionAnswerChain = await createStuffDocumentsChain({
            llm,
            prompt: qaPrompt,
        });
        
        const ragChain = await createRetrievalChain({
            retriever: historyAwareRetriever,
            combineDocsChain: questionAnswerChain,
        });

        const finalFormattingPrompt = PromptTemplate.fromTemplate(
            `Analyze this text and format the text by adding double line breaks between paragraphs or numbered elements. If possible embolden or underline numbered list elements;
            {finalResponse};
            `
        );
        
        // Usage:
        const response2 = await ragChain.invoke({
            chat_history,
            input: question,
        });
        // console.log("This is the other rag chain. Check 6.2: ", response2)
        console.log("This is backend: ", response2.answer)
        const resultChain = finalFormattingPrompt.pipe(llm).pipe(new StringOutputParser());
        // console.log("Check 3")
        const result = response2.answer
        const finalResponse = await resultChain.invoke({ finalResponse: result });
        const response = {
            answer: response2.answer,
          };
        return NextResponse.json(response)
        // return new Response(response2.answer)
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Error Processing' }, { status: 500 });
    } finally {
        console.log("Expecting next question")
    }
}

function formatRetrievedInfo(skillsResults, coursesResults) {
    return `
    Relevant Job Skills: ${JSON.stringify(skillsResults, null, 2)}

    Relevant Courses:
    ${coursesResults.map(course => `${course.course} - ${course.college} (${course.desc})`).join('\n')}
    `;
}

