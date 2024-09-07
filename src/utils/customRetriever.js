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
const counselingCollection = database.collection("simpleCounselingCollection");
const foodCollection = database.collection("simpleFoodCollection");
const healthCollection = database.collection("simpleHealthCollection");
const housingCollection = database.collection("simpleHousingCollection");
const pantryCollection = database.collection("simplePantryCollection");
const securityCollection = database.collection("simpleSecurityCollection");

let model = new OpenAIEmbeddings({
model: "text-embedding-ada-002",
apiKey: openAIKey,
batchSize: 1536,
stripNewLines: true,
});
  

export class customFoodRetriever extends BaseRetriever {
  //This is a custom retriever object that retrieves relevant food data from the food vector database.
  lc_namespace = ["langchain", "retrievers"];

  //This is the class constructor.
  constructor({
    client, 
    dbName,
    cunyFoodCollectionName,
    pantryFoodCollectionName,
    vectorModel,
    llm,
    ...fields
  }) {
    super(fields);
    this.client = client;
    this.dbName = dbName;
    this.cunyFoodCollectionName = cunyFoodCollectionName;
    this.pantryFoodCollectionName = pantryFoodCollectionName;
    this.vectorModel = vectorModel;
    this.llm = llm;
  }

  async _getRelevantDocuments(query) {
    //This is the function that gets the relevant data from the vector database
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const cunyFoodCollection = db.collection(this.cunyFoodCollectionName);
      const nyFoodPantryCollection = db.collection(this.pantryFoodCollectionName);

      //Embed the input query
      const queryVector = await this.vectorModel.embedQuery(String(query));

      //Create vector search pipelines to query and get results
      const pipeline = [
        {
          "$vectorSearch" : {
            "exact" : false,
            "index" : "default",
            "limit" : 5,
            "numCandidates" : 20,
            "path" : "embedding",
            "queryVector" : queryVector,
          }
        }, {
          "$project": {
            "_id" : 0,
            "name": 1,
            "address": 1,
            "phone": 1,
            "email": 1,
            "hours": 1,
            "score": { "$meta": "vectorSearchScore" },
          }
        }
      ]
      const pipeline2 = [
        {
          "$vectorSearch" : {
            "exact" : false,
            "index" : "default",
            "limit" : 5,
            "numCandidates" : 37,
            "path" : "embedding",
            "queryVector" : queryVector,
          }
        }, {
          "$project": {
            "name": 1,
            "address": 1,
            "phone": 1,
            "borough": 1,
            "hours": 1,
            "score": { "$meta": "vectorSearchScore" },
          }
        }
      ]
      //Query each collection with their respective pipelines
      const cunyFoodPantries = await cunyFoodCollection.aggregate(pipeline).toArray();
      const nyFoodPantries = await nyFoodPantryCollection.aggregate(pipeline2).toArray();


      //Prompt to clean up retrieved data
      const pantryListExtractionPrompt = PromptTemplate.fromTemplate(`Given these two lists that represent a list of pantries in the City University of New York (CUNY) network and New York Pantries respectively,
      Return important information about each pantry and return a list of pantry objects in this format: [pantry_name, pantry_address, pantry_borough, cuny_pantry/general_ny_pantry, hours, phone, contact information, ...other details]
      : {cunyFoodPantries}, {nyFoodPantries}`)
      
      //Create rag chains based off the earlier prompt
      const pantryChain = pantryListExtractionPrompt.pipe(this.llm).pipe(new StringOutputParser());
      const pantryList = await cunyFoodPantries + await nyFoodPantries

      console.log(cunyFoodPantries);
      console.log(nyFoodPantries)
      
      //console.log(pantryList)

      const documents = [
        new Document({
            pageContent: `Pantries: ${cunyFoodPantries.map(doc => JSON.stringify(doc)).join(', ')} ${nyFoodPantries.map(doc => JSON.stringify(doc)).join(', ')}`,
            metadata: { type: "pantries", originalQuery: query },
        }),
        ...cunyFoodPantries.map((doc) => {
            return new Document({
                pageContent: `Name: ${doc.name} - ${doc.address} - ${doc.phone} - ${doc.email} - ${doc.hours}`,
                metadata: { type: "course", score: doc.score },
            });
        }),
        ...nyFoodPantries.map((doc) => {
            return new Document({
                pageContent: `Borough: ${doc.borough} - Name: ${doc.name} - ${doc.address} - ${doc.phone} - ${doc.email} - ${doc.hours}`,
                metadata: { type: "course", score: doc.score },
            });
        })
    ];
    
    //Return the data
    console.log(documents);
    return documents;
    } finally {
      console.log("Completed food retrieval!");
    }
  }
}

export class customSecurityResourceRetriever extends BaseRetriever {
  //This is a custom retriever object that retrieves relevant security data from the security vector database.
  lc_namespace = ["langchain", "retrievers"];

  //This is the constructor for the security resource retriever class
  constructor({
    client,
    dbName,
    securityResourceCollectionName,
    vectorModel,
    llm,
    ...fields
  }) {
    super(fields);
    this.client = client;
    this.dbName = dbName;
    this.securityResourceCollectionName = securityResourceCollectionName;
    this.vectorModel = vectorModel;
    this.llm = llm;
  }

  async _getRelevantDocuments(query) {
    //This is the function that gets the relevant data from the vector database
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const securityResourceCollection = db.collection(this.securityResourceCollectionName);

      //Embed user query
      const queryVector = await this.vectorModel.embedQuery(String(query));

      //Create vector search pipelines to query and get results
      const pipeline = [
        {
          "$vectorSearch": {
            "exact": false,
            "index": "default",
            "limit": 5,
            "numCandidates": 20,
            "path": "embedding",
            "queryVector": queryVector,
          }
        }, {
          "$project": {
            "_id": 0,
            "name": 1,
            "address": 1,
            "phone": 1,
            "email": 1,
            "hours": 1,
            "score": { "$meta": "vectorSearchScore" },
          }
        }
      ];

      //This gets the data from the db using the above pipeline
      const securityResources = await securityResourceCollection.aggregate(pipeline).toArray();


      //Return the data
      const documents = securityResources.map((doc) => {
        return new Document({
          pageContent: `Name: ${doc.name} - ${doc.address} - ${doc.phone} - ${doc.email} - ${doc.hours}`,
          metadata: { type: "security_resource", score: doc.score },
        });
      });

      console.log(documents);
      return documents;
    } finally {
      console.log("Completed security resource retrieval!");
    }
  }
}

export class customHousingRetriever extends BaseRetriever {
  //This is a custom retriever object that retrieves relevant housing data from the housing vector database.
  lc_namespace = ["langchain", "retrievers"];

  //This is the constructor for the housing resource retriever class
  constructor({
    client,
    dbName,
    housingCollectionName,
    vectorModel,
    llm,
    ...fields
  }) {
    super(fields);
    this.client = client;
    this.dbName = dbName;
    this.housingCollectionName = housingCollectionName;
    this.vectorModel = vectorModel;
    this.llm = llm;
  }

  async _getRelevantDocuments(query) {
    //This is the function that gets the relevant data from the vector database
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const housingCollection = db.collection(this.housingCollectionName);

      //Embed a user's query
      const queryVector = await this.vectorModel.embedQuery(String(query));

      //This is the pipeline that is used to retrieve data from the vector database
      const pipeline = [
        {
          "$vectorSearch": {
            "exact": false,
            "index": "default",
            "limit": 5,
            "numCandidates": 20,
            "path": "embedding",
            "queryVector": queryVector,
          }
        }, {
          "$project": {
            "_id": 0,
            "name": 1,
            "address": 1,
            "phone": 1,
            "email": 1,
            "hours": 1,
            "score": { "$meta": "vectorSearchScore" },
          }
        }
      ];

      //This is the call that uses the above pipeline to get the relevant data
      const housingResources = await housingCollection.aggregate(pipeline).toArray();

      //Return data
      const documents = housingResources.map((doc) => {
        return new Document({
          pageContent: `Name: ${doc.name} - ${doc.address} - ${doc.phone} - ${doc.email} - ${doc.hours}`,
          metadata: { type: "housing_resource", score: doc.score },
        });
      });

      console.log(documents);
      return documents;
    } finally {
      console.log("Completed housing resource retrieval!");
    }
  }
}


export class customCounselingRetriever extends BaseRetriever {
  //This is a custom retriever object that retrieves relevant counseling data from the counseling vector database.
  lc_namespace = ["langchain", "retrievers"];

  constructor({
    //This is the constructor for the counseling resource retriever class
    client,
    dbName,
    counselingCollectionName,
    vectorModel,
    llm,
    ...fields
  }) {
    super(fields);
    this.client = client;
    this.dbName = dbName;
    this.counselingCollectionName = counselingCollectionName;
    this.vectorModel = vectorModel;
    this.llm = llm;
  }

  async _getRelevantDocuments(query) {
    //This is the function that gets the relevant data from the vector database
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const counselingCollection = db.collection(this.counselingCollectionName);

      //Embed a user's query
      const queryVector = await this.vectorModel.embedQuery(String(query));

      //This is the pipeline that is used to retrieve data from the vector database
      const pipeline = [
        {
          "$vectorSearch": {
            "exact": false,
            "index": "default",
            "limit": 5,
            "numCandidates": 20,
            "path": "embedding",
            "queryVector": queryVector,
          }
        }, {
          "$project": {
            "_id": 0,
            "name": 1,
            "address": 1,
            "phone": 1,
            "email": 1,
            "hours": 1,
            "score": { "$meta": "vectorSearchScore" },
          }
        }
      ];

      //This is the call that uses the above pipeline to get the relevant data
      const counselingResources = await counselingCollection.aggregate(pipeline).toArray();

      // console.log("Counseling resources: ", counselingResources)

      //Return data
      const documents = counselingResources.map((doc) => {
        return new Document({
          pageContent: `Name: ${doc.name} - ${doc.address} - ${doc.phone} - ${doc.email} - ${doc.hours}`,
          metadata: { type: "counseling_resource", score: doc.score },
        });
      });

      console.log(documents);
      return documents;
    } finally {
      console.log("Completed counseling resource retrieval!");
    }
  }
}

export class customHealthRetriever extends BaseRetriever {
  //This is a custom retriever object that retrieves relevant health data from the health vector database.
  lc_namespace = ["langchain", "retrievers"];

  constructor({
    //This is the constructor for the health resource retriever class
    client,
    dbName,
    healthCollectionName,
    vectorModel,
    llm,
    ...fields
  }) {
    super(fields);
    this.client = client;
    this.dbName = dbName;
    this.healthCollectionName = healthCollectionName;
    this.vectorModel = vectorModel;
    this.llm = llm;
  }

  async _getRelevantDocuments(query) {
    //This is the function that gets the relevant data from the vector database
    try {
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const healthCollection = db.collection(this.healthCollectionName);

      //Embed a user's query
      const queryVector = await this.vectorModel.embedQuery(String(query));

      //This is the pipeline that is used to retrieve data from the vector database
      const pipeline = [
        {
          "$vectorSearch": {
            "exact": false,
            "index": "default",
            "limit": 5,
            "numCandidates": 20,
            "path": "embedding",
            "queryVector": queryVector,
          }
        }, {
          "$project": {
            "_id": 0,
            "name": 1,
            "address": 1,
            "phone": 1,
            "email": 1,
            "hours": 1,
            "score": { "$meta": "vectorSearchScore" },
          }
        }
      ];

      //This is the call that uses the above pipeline to get the relevant data
      const healthResources = await healthCollection.aggregate(pipeline).toArray();

      const documents = healthResources.map((doc) => {
        return new Document({
          pageContent: `Name: ${doc.name} - ${doc.address} - ${doc.phone} - ${doc.email} - ${doc.hours}`,
          metadata: { type: "health_resource", score: doc.score },
        });
      });

      // console.log(documents);
      //Return data
      return documents;
    } finally {
      console.log("Completed health resource retrieval!");
    }
  }
}

export class CustomRetriever extends BaseRetriever {
  //This is a custom retriever object that retrieves relevant courses data from the cuny courses vector database
  // using a list of extracted skills
  lc_namespace = ["langchain", "retrievers"];

  constructor({
    //This is the constructor for the courses resource retriever class
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
            "desc": 1, 
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
    }
  }
}
