# CUNYGPT

**Built by:** Mubarak Odufade, Jack Hachicho, Harmain Munir, Idris Hassan

## Introduction

CUNYGPT is designed to provide CUNY students with easy access to essential resources right at their fingertips! Say goodbye to the hassle of searching for hyperlinks and endlessly browsing on Google. With CUNYGPT, all the information you need is just a chat away.

## Features

- **Chat Application:** CUNYGPT is a chat application that allows students to interact with a custom chat appliaction designed specifically to answer questions related to their essential needs.
- **Resource Access:** The app provides a streamlined way to access helpful resources, ensuring students have the support they need without the frustration of traditional search methods.

## Technologies Used

- **Front-End:**
  - **Next.js:** The framework used to build the project.
  - **React:** Managed the chat interface and passed chat history to the backend API routes.
  - **Vercel's AI SDK:** Integrated to add chat capabilities to the frontend.
  - **Chakra UI:** Utilized for designing and styling the user interface.

- **Back-End:**
  - **Python:** Used with Selenium and Pandas to get and clean the data.
  - **MongoDB Atlas:** Utilized as the vector database.
  - **OpenAI:** Used to generate embeddings for each data entry.
  - **Langchain:** Implemented for RAG (retrieval-augmented generation) and contextual implementation.
  - **OpenAI APIs:** Various integrations to generate embeddings, prompts, and feed them into RAG chains.

## Getting Started

To run CUNYGPT locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repo/cunygpt.git
   ```
2. **Install Dependencies:**
   ```bash
   cd cunygpt
   npm install
   ```
   > *Note:* This command only needs to be run once during the initial setup.
   
3. **Run the Application:**
   ```bash
   npm run dev
   ```

## Acknowledgements

Special thanks to the team for their hard work and dedication to this project. Your contributions have made CUNYGPT possible.
