from google import genai
import os

class TaskPlanner:
    def __init__(self):
        # Using Gemini 1.5 Flash for rapid, coherent planning as outlined in the paper replication
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model_id = 'gemini-2.0-flash'

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
        
        Output a strict, logically ordered diagnostic plan mapping out the steps to take to confirm the diagnosis. Do not output anything other than the steps.
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt
            )
            return response.text
        except Exception as e:
            return f"Error generating plan: {str(e)}"
