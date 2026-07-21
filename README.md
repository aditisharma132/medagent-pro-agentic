# MedAgent-Pro (Replication)

This project is a modern, modular replication of the **MedAgent-Pro** architecture originally proposed at ICLR 2026. It leverages a hierarchical reasoning framework (TaskPlanner and CaseDecider) for multi-modal medical diagnostics.

## Architecture

This iteration is optimized for scalable web deployment:

- **Frontend (Vercel)**: Built with Next.js, React, and Tailwind CSS. Provides a premium, dark-mode medical dashboard that visualizes the logical pipeline of the AI agents in real-time.
- **Backend (Railway)**: Built with Python and FastAPI. The execution orchestrator that houses the asynchronous medical agents.
- **Agent LLMs**: Replaces traditional local models with Google's **Gemini 1.5** via API for rapid text planning and complex reasoning.
- **Visual Tools**: Utilizes **Hugging Face Inference Endpoints** to run quantitative visual evaluations (like image segmentation and object grounding) on-demand, executing via functional HTTP requests rather than holding massive weights in local memory.

## Deployment Instructions

### Backend (Railway)
1. Fork or push this repository to GitHub.
2. In Railway, create a new project from your GitHub repo.
3. Target the `backend/` directory explicitly.
4. Set your environment variables in Railway (`GEMINI_API_KEY`, `HF_TOKEN`).
5. Railway's builder will automatically detect the provided `Dockerfile` and start the FastAPI service.

### Frontend (Vercel)
1. In Vercel, import your GitHub repository.
2. Target the `frontend/` root directory.
3. Vercel will automatically detect the `package.json` as a Next.js instance and deploy seamlessly. 
4. Remember to update the backend fetch API keys in the frontend once your Railway server goes live.

## Tech Stack
* Next.js 14
* Tailwind CSS
* FastAPI (Python)
* Gemini Generative AI SDK
* Hugging Face Endpoints HTTP Client
* Docker 
