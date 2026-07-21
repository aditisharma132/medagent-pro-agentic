import google.generativeai as genai
import os

class TaskPlanner:
    def __init__(self):
        # Retrieve the API key from environment variables
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
        else:
            print("Warning: GEMINI_API_KEY environment variable not set.")
            
        # Using 1.5 Flash as it is fast and capable for planning text structures
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def generate_plan(self, clinical_guidelines: str, case_context: str) -> str:
        """
        Generates a step-by-step diagnostic plan based on RAG guidelines and the patient case.
        """
        prompt = f"""
        You are a medical task planner agent (MedAgent-Pro). 
        Based on the following clinical guidelines:
        
        {clinical_guidelines}
        
        And this metadata and context for a patient case:
        {case_context}
        
        Generate a strict, step-by-step diagnostic plan that a Decider agent can execute.
        Do not skip steps required by the guidelines. Ensure the plan includes what visual tools to use if needed.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating plan: {str(e)}"
