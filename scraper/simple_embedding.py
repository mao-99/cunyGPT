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
client = pymongo.MongoClient("mongodb+srv://mao:QYpwTSbRT4PnI44D@cluster0.6hdzt.mongodb.net/")
collection = client["classRecommender"]["simpleJobCollection"]

# Load CSV file
data = pd.read_csv('postings.csv')

# Iterate through each row in the CSV file
for index, row in data.iterrows():
    company = row['company_name']
    title = row['title']
    desc = row['description']
    skills = row['skills_desc']
    single = str(company) + ", " + str(title) + ", " + str(desc) + ", " + str(skills)

    # Generate embeddings
    embedding = get_embeddings(single)

    # Prepare document with the required schema
    
    document = {
        'company' : company,
        'title' : title,
        'desc' : desc,
        'skills' : skills,
        'embedding': embedding
    }
    # print(document)
    # Insert document into MongoDB collection
    collection.insert_one(document)

print("Data insertion complete.")
