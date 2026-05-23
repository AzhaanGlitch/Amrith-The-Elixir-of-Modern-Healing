import os
import pickle
import json

base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, 'models', 'general_medicine.pkl')

print(f"Loading model from {model_path}...")
with open(model_path, 'rb') as f:
    model = pickle.load(f)

classes = list(model.classes_)
print(f"Number of classes: {len(classes)}")

# Load symptoms from app.py
from app import SYMPTOM_LIST

info = {
    "diseases": classes,
    "symptoms": SYMPTOM_LIST
}

export_path = os.path.join(base_dir, 'model_info.json')
with open(export_path, 'w') as f:
    json.dump(info, f, indent=2)

print(f"Exported to {export_path} successfully!")
