import sys
import os
import requests
from PIL import Image

# Ensure standard output doesn't crash on Windows with emojis
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def run_test():
    url = "http://localhost:5001"
    
    # 1. Create a dummy image
    image_path = os.path.join(os.path.dirname(__file__), "test_image.jpg")
    print(f"Creating dummy image at: {image_path}")
    img = Image.new('RGB', (224, 224), color = 'red')
    img.save(image_path)
    
    try:
        # 2. Check initial model status
        print("\n--- Model Status Before Prediction ---")
        res_models = requests.get(f"{url}/models")
        print(f"Status Code: {res_models.status_code}")
        models_data = res_models.json()
        print(f"Loaded Count: {models_data.get('loaded_count')}")
        for m in models_data.get('models', []):
            if m['name'] in ('skin_cancer', 'skin_cancer_onc'):
                print(f"Model: {m['name']}, Status: {m['status']}")
        
        # 3. Request image prediction
        print("\n--- Sending Image Prediction Request ---")
        payload = {
            "testId": "skin-cancer",
            "inputType": "IMAGE",
            "answers": {},
            "files": [image_path]
        }
        res_predict = requests.post(f"{url}/predict", json=payload)
        print(f"Status Code: {res_predict.status_code}")
        predict_data = res_predict.json()
        print(f"Prediction Result: {predict_data}")
        
        # 4. Check model status after prediction
        print("\n--- Model Status After Prediction ---")
        res_models_after = requests.get(f"{url}/models")
        models_data_after = res_models_after.json()
        print(f"Loaded Count: {models_data_after.get('loaded_count')}")
        for m in models_data_after.get('models', []):
            if m['name'] in ('skin_cancer', 'skin_cancer_onc'):
                print(f"Model: {m['name']}, Status: {m['status']}")
                
    except Exception as e:
        print(f"Request failed: {e}")
        
    finally:
        # Clean up image
        if os.path.exists(image_path):
            os.remove(image_path)
            print("\nRemoved dummy image.")

if __name__ == "__main__":
    run_test()
