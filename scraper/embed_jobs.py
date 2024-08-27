import openai
import json
import os
from dotenv import load_dotenv
import pandas
import pymongo

#Importing environment variables
env_path = "../.env"
load_dotenv(dotenv_path=env_path)

#Testing env
openaiKey = os.getenv('OPENAI_KEY')

#Configuring env with key
openai.api_key = openaiKey

# Load JSON file
with open('careers.json', 'r') as f:
    data = json.load(f)


#Embedding function for first careers.json file
def getEmbeddings1(text):
    response = openai.embeddings.create(model="text-embedding-ada-002", input=text).data[0].embedding
    return response

#Setting up mongodb client
client = pymongo.MongoClient("mongodb+srv://mao:QYpwTSbRT4PnI44D@cluster0.6hdzt.mongodb.net/")
collection = client["classRecommender"]["embedded_jobskills"]

# Prepare lists to store data
job_ids = []
single_embeddings = []
title_embeddings = []
skills_embeddings = []
sector_embeddings = []
description_column = []
documents = []

# These are the fields to embed: job title, employment type, job category, salary, requirements, skills_required, requirements_and_role, and the company info.
for job in data['jobs'][10001:]:
    # Extract fields
    job_id = job.get('job_id')
    job_title = job.get('job_title', '')
    company_name = job.get('company_name', '')
    skills = ', '.join(job.get('skills_required', []))
    sector = ', '.join(job.get('job_category', []))
    
    # Combine job title, company name, and sector
    description = f"{job_title} at {company_name}, {sector}"
    description_column.append(description)

    # Create embeddings
    single_text = f"{job_title} {skills} {sector} {job.get('company_info', '')}"
    single_embedding = getEmbeddings1(single_text)
    
    job_title_embedding = getEmbeddings1(job_title)
    skills_embedding = getEmbeddings1(skills)
    sector_embedding = getEmbeddings1(sector)
    
    # Append to lists
    # job_ids.append(job_id)
    # single_embeddings.append(single_embedding)
    # title_embeddings.append(title_embedding)
    # skills_embeddings.append(skills_embedding)
    # sector_embeddings.append(sector_embedding)
    document = {
    "job_id": job_id,
    "description": description,
    "single_embedding": single_embedding,
    "job_title_embedding": job_title_embedding,
    "skills_embedding": skills_embedding,
    "sector_embedding": sector_embedding
    }
    documents.append(document)

collection.insert_many(documents)
