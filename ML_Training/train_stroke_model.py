import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

def train_model():
    print("Loading dataset...")
    # 1. Load the CSV file from the dataset folder
    dataset_path = os.path.join('dataset', 'stroke_risk.csv')
    try:
        df = pd.read_csv(dataset_path)
    except FileNotFoundError:
        print(f"Error: Could not find '{dataset_path}'.")
        print("Please place the CSV file in the 'ML_Training/dataset' folder and try again.")
        return

    # 2. Preprocess the Data
    print("Preprocessing data...")
    # Drop the ID column as it's not useful for prediction
    if 'id' in df.columns:
        df = df.drop('id', axis=1)

    # Convert BMI from string 'N/A' to numeric NaN, then fill missing values with the median
    if 'bmi' in df.columns:
        df['bmi'] = pd.to_numeric(df['bmi'], errors='coerce')
        df['bmi'] = df['bmi'].fillna(df['bmi'].median())

    # Map categorical variables to simple integers
    # The frontend MUST send questions in this exact order with these numeric mappings.
    if 'gender' in df.columns:
        df['gender'] = df['gender'].map({'Male': 0, 'Female': 1, 'Other': 2}).fillna(0)
    
    if 'ever_married' in df.columns:
        df['ever_married'] = df['ever_married'].map({'No': 0, 'Yes': 1}).fillna(0)
        
    if 'Residence_type' in df.columns:
        df['Residence_type'] = df['Residence_type'].map({'Rural': 0, 'Urban': 1}).fillna(0)
    
    # For multi-class strings, map them to integers
    if 'work_type' in df.columns:
        df['work_type'] = df['work_type'].map({
            'Private': 0, 
            'Self-employed': 1, 
            'Govt_job': 2, 
            'children': 3, 
            'Never_worked': 4
        }).fillna(0)
    
    if 'smoking_status' in df.columns:
        df['smoking_status'] = df['smoking_status'].map({
            'never smoked': 0, 
            'Unknown': 1, 
            'formerly smoked': 2, 
            'smokes': 3
        }).fillna(1)

    # 3. Define Features (X) and Target (y)
    if 'stroke' not in df.columns:
        print("Error: Target column 'stroke' not found in dataset!")
        return
        
    X = df.drop('stroke', axis=1)
    y = df['stroke']

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
    # We dynamically find the path so this script works out-of-the-box
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(base_dir, 'backend', 'ml_service', 'models')
    
    # Ensure the models directory exists
    os.makedirs(target_dir, exist_ok=True)
    
    model_path = os.path.join(target_dir, 'stroke_risk.pkl')
    
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"\nSuccess! Model securely exported to: {model_path}")
    print("\nIMPORTANT: In your frontend, the 'answers' object MUST be sent in this EXACT order:")
    print(list(X.columns))

if __name__ == "__main__":
    train_model()
