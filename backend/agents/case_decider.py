from google import genai
import os

class CaseDecider:
    def __init__(self):
        # Using Gemini 1.5 Pro for advanced comparative reasoning
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model_id = 'gemini-2.0-flash'

    def decide_next_step(self, diagnostic_plan: str, current_state: str, tool_results: str) -> str:
        """
        Evaluates the current state and triggers either a visual tool action or finalizes the diagnosis.
        """
        prompt = f"""
        You are a medical decider agent executing a diagnostic plan.
        
        Diagnostic Plan: 
        {diagnostic_plan}
        
        Current State of Reasoning:
        {current_state}
        
        Latest Tool Results:
        {tool_results}
        
        Analyze the current state and the tool results. Output your reasoning on what to do next. Output one clear conclusion at the end (e.g. Action required, Tool required, or Final Diagnosis).
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt
            )
            return response.text
        except Exception as e:
            return f"Error computing next step: {str(e)}"
