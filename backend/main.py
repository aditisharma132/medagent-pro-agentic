from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Agents and Tools (assuming running with uvicorn relative to backend folder)
from agents.task_planner import TaskPlanner
from agents.case_decider import CaseDecider
from tools.huggingface_client import HuggingFaceVisionClient

load_dotenv()

app = FastAPI(title="MedAgent-Pro Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize singletons for simplicity
planner = TaskPlanner()
decider = CaseDecider()
vision_client = HuggingFaceVisionClient()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "MedAgent-Pro API is running seamlessly."}

@app.post("/diagnose")
async def start_diagnosis(
    case_context: str = Form(...), 
    clinical_guidelines: str = Form(""), 
    file: UploadFile = File(None)
):
    """
    Step 1: Upload a case and request the task-level Planner to formulate a reasoning plan.
    """
    # Generate the initial hierarchical plan based on guidelines and context
    plan = planner.generate_plan(clinical_guidelines=clinical_guidelines, case_context=case_context)
    return {"status": "success", "agent": "Planner", "plan": plan}

@app.post("/execute_step")
async def execute_reasoning_step(
    plan: str = Form(...), 
    current_state: str = Form(...), 
    tools_results: str = Form("")
):
    """
    Step 2: The Decider agent executes the plan step-by-step.
    """
    # Evaluate current step and output either a tool call request or a conclusion
    decision = decider.decide_next_step(diagnostic_plan=plan, current_state=current_state, tool_results=tools_results)
    return {"status": "success", "agent": "Decider", "decision": decision}
