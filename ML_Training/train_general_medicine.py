import pandas as pd
import numpy as np
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def train_model():
    print("Loading Disease Symptoms dataset...")
    dataset_path = os.path.join('dataset', 'disease_symptoms_prediction.csv')
    try:
        df = pd.read_csv(dataset_path)
    except FileNotFoundError:
        print(f"Error: Could not find '{dataset_path}'")
        return

    print("Preprocessing data (Converting into binary symptom matrix)...")
    # Clean up whitespace in string columns
    df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
    
    # Get all unique symptoms
    symptoms = set()
    for col in df.columns[1:]:
        unique_vals = df[col].dropna().unique()
        for val in unique_vals:
            if isinstance(val, str) and val.strip() != "":
                symptoms.add(val.strip())
                
    symptoms = sorted(list(symptoms))
    
    # Create a new binary dataframe
    binary_data = []
    for index, row in df.iterrows():
        row_symptoms = [str(val).strip() for val in row.values[1:] if pd.notna(val) and str(val).strip() != ""]
        binary_row = {symptom: (1 if symptom in row_symptoms else 0) for symptom in symptoms}
        binary_row['Disease'] = row['Disease']
        binary_data.append(binary_row)
        
    binary_df = pd.DataFrame(binary_data)
    
    X = binary_df.drop('Disease', axis=1)
    y = binary_df['Disease']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest Classifier (This may take a moment)...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print("\nModel Evaluation:")
    print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(base_dir, 'backend', 'ml_service', 'models')
    os.makedirs(target_dir, exist_ok=True)
    
    # Save this as a generic 'general_medicine.pkl' 
    model_path = os.path.join(target_dir, 'general_medicine.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"\nSuccess! Model securely exported to: {model_path}")
    print("\nIMPORTANT: Since there are 131 unique symptoms, your frontend needs to send an array of 131 boolean values (0 or 1).")
    print("The exact order of symptoms is printed to 'symptoms_list.txt' in this directory.")
    
    with open("symptoms_list.txt", "w") as f:
        for s in X.columns:
            f.write(f"{s}\n")

if __name__ == "__main__":
    train_model()
