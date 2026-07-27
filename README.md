# StudyMate
# 🎓 StudyMate — AI-Powered Study Assistant (Vector RAG)

StudyMate is an intelligent, full-stack AI study platform built with **FastAPI**, **React**, **Qdrant Vector Database**, and **Hugging Face Inference Models**. It converts large PDF study materials into an interactive knowledge base with semantic search, multi-turn vector-augmented chat, and hierarchical study guide generation.

---

## ✨ Features

- 📄 **Full-Text PDF Extraction**: Reads entire multi-page documents without artificial length limits or text truncations.
- 🎯 **Semantic Vector Search (Qdrant)**: Replaces simple keyword matching with dense 384-dimensional vector embeddings (`sentence-transformers/all-MiniLM-L6-v2`) stored in Qdrant.
- 💬 **Context-Aware Vector RAG Chat**: Converts student questions into embeddings, retrieves the Top-K most relevant chunks from Qdrant, and generates precise, grounded answers.
- 📝 **Hierarchical Study Guide Engine (Map-Reduce)**: Summarizes individual PDF chunks and aggregates them into a structured Markdown study guide containing:
  - Main Topic & Learning Objectives
  - Key Concepts & Definitions
  - Formulas, Facts, and Practical Examples
  - Chapter Summaries & Practice Exam Questions
- 🏗️ **Modular Service Architecture**: Decoupled, scalable Python services (`pdf`, `embedding`, `qdrant`, `summary`, `chat`) built for easy extension (MongoDB, Auth, Quiz Generation, Flashcards).

---

## 🏗️ System Architecture

```text
               ┌────────────────┐
               │  React Frontend│
               └───────┬────────┘
                       │ HTTP / REST
                       ▼
            ┌──────────────────────┐
            │   FastAPI Backend    │
            └──────────┬───────────┘
                       │
     ┌─────────────────┼──────────────────┬─────────────────┐
     ▼                 ▼                  ▼                 ▼
┌─────────┐   ┌────────────────┐   ┌─────────────┐   ┌────────────┐
│ PDF     │   │ Embedding      │   │ Qdrant      │   │ Summary &  │
│ Service │   │ Service (HF)   │   │ Vector DB   │   │ Chat LLMs  │
└─────────┘   └────────────────┘   └─────────────┘   └────────────┘
