import requests
import os
import glob
import sys
from PIL import Image

# Ensure standard output doesn't crash on Windows with emojis
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def run_test():
    url = "http://localhost:5001"
    
    # Create dummy image
    image_path = os.path.join(os.path.dirname(__file__), "test_image.jpg")
    img = Image.new('RGB', (224, 224), color = 'red')
    img.save(image_path)
    
    # Get all registered model names from /models
    res_models = requests.get(f"{url}/models")
    models = res_models.json().get('models', [])
    print(f"Testing {len(models)} registered models...")
    
    for m in models:
        name = m['name']
        m_type = m['type']
        
        # Build payload
        payload = {
            "testId": name.replace('_', '-'),
            "inputType": "IMAGE" if m_type in ('keras', 'pytorch') else "TABULAR",
            "answers": {
                "q_symptoms": ["Fever", "Headache"],
                "age": 45,
                "gender": "Male",
                "bp_sys": 130,
                "bp_dia": 80,
                "chest_pain": "None",
                "sob": "No",
                "edema": "No",
                "fatigue": 2,
                "palpitations": "No",
                "history": ["None"],
                "bp": "120/80",
                "rate": 72,
                "tremor": "No",
                "frequency": "1",
                "numbness": "No",
                "smoker": "No"
            },
            "files": [image_path] if m_type in ('keras', 'pytorch') else []
        }
        
        try:
            res_predict = requests.post(f"{url}/predict", json=payload)
            if res_predict.status_code != 200 or 'error' in res_predict.json():
                print(f"FAILED: Model {name} ({m_type}) - Status {res_predict.status_code}, Response: {res_predict.json()}")
            else:
                print(f"SUCCESS: Model {name} ({m_type})")
        except Exception as e:
            print(f"ERROR: Model {name} ({m_type}) - {e}")
            
    if os.path.exists(image_path):
        os.remove(image_path)

if __name__ == "__main__":
    run_test()
