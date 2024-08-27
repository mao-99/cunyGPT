import openai
import csv
import os
import json
from dotenv import load_dotenv
import pandas as pd
import pymongo

# Importing environment variables
env_path = "../.env"
load_dotenv(dotenv_path=env_path)

# Testing env
openaiKey = os.getenv('OPENAI_KEY')

# Configuring env with key
openai.api_key = openaiKey

# Embedding function
def get_embeddings(text):
    response = openai.embeddings.create(model="text-embedding-ada-002", input=text).data[0].embedding
    return response

# Setting up MongoDB client
client = pymongo.MongoClient("mongodb+srv://mao:YSzCqIA5sXvVSeze@cluster0.6hdzt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
collection = client["classRecommender"]["simpleFoodCollection"]

# Load CSV file
data = pd.read_csv('cunyFoodResources.csv')

#Borough,Name,Address,phone,Email,Hours,Type

# Iterate through each row in the CSV file
for index, row in data.iterrows():
    # Create a Pandas DataFrame for the current row
    data = row.to_frame().T

    # Combine relevant fields to create a document for embedding
    document_text = f"{row['Borough']} {row['Name']} {row['Address']} {row['Phone']} {row['Email']} {row['Hours']} {row['Type']}"

    # Embed the document
    embedding = get_embeddings(document_text)

    # Create a document to insert into MongoDB Atlas
    document = {
        "borough": row['Borough'],
        "name": row['Name'],
        "address": row['Address'],
        "phone": row['Phone'],
        "email": row['Email'],
        "hours": row['Hours'],
        "type": row['Type'],
        "embedding": embedding
    }

    # Insert the document into MongoDB Atlas
    collection.insert_one(document)


print("Data insertion complete.")
