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
collection = client["classRecommender"]["embedded_cuny_courses"]

# Load CSV file
data = pd.read_csv('cuny_courses.csv')

# Iterate through each row in the CSV file
for index, row in data.iterrows():
    course = row['Course']
    college = row['College']
    description = row['Description']

    # Generate embeddings
    course_embedding = get_embeddings(course)
    college_embedding = get_embeddings(college)
    description_embedding = get_embeddings(description)

    # Prepare document with the required schema
    
    document = {
        "course": course,
        "college": college,
        "description": description,
        "course_embedding": course_embedding,
        "college_embedding": college_embedding,
        "description_embedding": description_embedding
    }
    # print(document)
    # Insert document into MongoDB collection
    collection.insert_one(document)

print("Data insertion complete.")
