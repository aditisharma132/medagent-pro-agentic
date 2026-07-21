import os
import requests

class HuggingFaceVisionClient:
    """
    Client for interacting with Hugging Face Inference Endpoints for medical vision tasks.
    These tools will be invoked by the Case-Level Decider agent when quantitative visual data is needed.
    """
    def __init__(self):
        self.api_key = os.getenv("HF_TOKEN")
        if not self.api_key:
            print("Warning: HF_TOKEN environment variable not set.")
            
        self.headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
        
    def perform_segmentation(self, image_bytes: bytes, model_url: str) -> dict:
        """
        Calls a Hugging Face Inference Endpoint for Image Segmentation.
        Example usage: Lung nodule segmentation, lesion boundary detection.
        """
        response = requests.post(model_url, headers=self.headers, data=image_bytes)
        if response.status_code == 200:
            return {"status": "success", "data": response.json()}
        else:
            return {"status": "error", "message": f"HF API Error {response.status_code}", "details": response.text}

    def perform_classification(self, image_bytes: bytes, model_url: str) -> dict:
        """
        Calls a Hugging Face Inference Endpoint for Image Classification.
        Example usage: Diabetic retinopathy grading, tumor malignancy prediction.
        """
        response = requests.post(model_url, headers=self.headers, data=image_bytes)
        if response.status_code == 200:
            return {"status": "success", "data": response.json()}
        else:
            return {"status": "error", "message": f"HF API Error {response.status_code}", "details": response.text}
