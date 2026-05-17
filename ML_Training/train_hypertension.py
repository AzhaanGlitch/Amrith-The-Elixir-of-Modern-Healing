import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

def train_model():
    print("Loading Hypertension dataset...")
    # 1. Load the CSV file from the dataset folder
    dataset_path = os.path.join('dataset', 'hypertension.csv')
    try:
        df = pd.read_csv(dataset_path)
    except FileNotFoundError:
        print(f"Error: Could not find '{dataset_path}'.")
        print("Please place the CSV file in the 'ML_Training/dataset' folder and try again.")
        return

    # 2. Preprocess the Data
    print("Preprocessing data...")

    # Map categorical variables to simple integers
    # The frontend MUST send questions in this exact order with these numeric mappings.
    if 'BP_History' in df.columns:
        df['BP_History'] = df['BP_History'].map({'Normal': 0, 'Prehypertension': 1, 'Hypertension': 2}).fillna(0)
    
    if 'Medication' in df.columns:
        df['Medication'] = df['Medication'].map({
            'None': 0, 
            'ACE Inhibitor': 1, 
            'Beta Blocker': 2, 
            'Diuretic': 3, 
            'Other': 4
        }).fillna(0)
        
    if 'Family_History' in df.columns:
        df['Family_History'] = df['Family_History'].map({'No': 0, 'Yes': 1}).fillna(0)
    
    if 'Exercise_Level' in df.columns:
        df['Exercise_Level'] = df['Exercise_Level'].map({'Low': 0, 'Moderate': 1, 'High': 2}).fillna(0)
    
    if 'Smoking_Status' in df.columns:
        df['Smoking_Status'] = df['Smoking_Status'].map({'Non-Smoker': 0, 'Smoker': 1}).fillna(0)

    if 'Has_Hypertension' in df.columns:
        df['Has_Hypertension'] = df['Has_Hypertension'].map({'No': 0, 'Yes': 1}).fillna(0)

    # 3. Define Features (X) and Target (y)
    if 'Has_Hypertension' not in df.columns:
        print("Error: Target column 'Has_Hypertension' not found in dataset!")
        return
        
    X = df.drop('Has_Hypertension', axis=1)
    y = df['Has_Hypertension']

    # 4. Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 5. Train the Model
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)

    # 6. Evaluate the Model
    y_pred = model.predict(X_test)
    print("\nModel Evaluation:")
    print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # 7. Save the model to the backend's models folder
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(base_dir, 'backend', 'ml_service', 'models')
    
    # Ensure the models directory exists
    os.makedirs(target_dir, exist_ok=True)
    
    model_path = os.path.join(target_dir, 'hypertension.pkl')
    
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"\nSuccess! Model securely exported to: {model_path}")
    print("\nIMPORTANT: In your frontend, the 'answers' object MUST be sent in this EXACT order:")
    print(list(X.columns))

if __name__ == "__main__":
    train_model()
