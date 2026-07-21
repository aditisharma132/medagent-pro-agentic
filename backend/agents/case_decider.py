import google.generativeai as genai
import os

class CaseDecider:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
        else:
            print("Warning: GEMINI_API_KEY environment variable not set.")
            
        # For complex diagnostic decisions, 1.5 Pro is recommended
        self.model = genai.GenerativeModel('gemini-1.5-pro')

    def decide_next_step(self, diagnostic_plan: str, current_state: str, tool_results: str) -> str:
        """
        Executes the current step of the diagnostic plan, factoring in prior tool results.
        """
        prompt = f"""
        You are a medical decider agent executing a diagnostic plan.
        
        Diagnostic Plan: 
        {diagnostic_plan}
        
        Current State of Reasoning:
        {current_state}
        
        Latest Tool Results (e.g. from vision models):
        {tool_results}
        
        Based on the above, what is the next logical reasoning step? If all evidence has been gathered, output a final structured diagnosis. 
        If more visual tools need to be called, specify which tools and what they should look for.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error computing next step: {str(e)}"
