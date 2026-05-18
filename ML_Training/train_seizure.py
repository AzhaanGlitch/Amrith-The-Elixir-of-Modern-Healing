import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

def train_model():
    print("Loading Seizures dataset...")
    # 1. Load the CSV file from the dataset folder
    dataset_path = os.path.join('dataset', 'seizures.csv')
    try:
        df = pd.read_csv(dataset_path)
    except FileNotFoundError:
        print(f"Error: Could not find '{dataset_path}'.")
        print("Please place the CSV file in the 'ML_Training/dataset' folder and try again.")
        return

    # 2. Preprocess the Data
    print("Preprocessing data...")
    
    # Drop the patient sample ID column (usually the first column, named 'Unnamed: 0' or 'Unnamed')
    # If the first column is named 'Unnamed', pandas loads it as 'Unnamed' or 'Unnamed: 0'
    first_col = df.columns[0]
    if 'Unnamed' in first_col:
        df = df.drop(first_col, axis=1)

    # In the UCI Epileptic Seizure Recognition dataset:
    # y = 1 is Epileptic Seizure activity
    # y = 2, 3, 4, 5 are other brainwave states (Non-Seizure)
    # We map y to a binary outcome: 1 for Seizure, 0 for Non-Seizure
    if 'y' not in df.columns:
        print("Error: Target column 'y' not found in dataset!")
        return

    df['y'] = df['y'].apply(lambda val: 1 if val == 1 else 0)

    X = df.drop('y', axis=1)
    y = df['y']

    # 3. Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 4. Train the Model
    print("Training Random Forest Classifier on EEG signals...")
    # Using n_jobs=-1 to train faster using all CPU cores
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced', n_jobs=-1)
    model.fit(X_train, y_train)

    # 5. Evaluate the Model
    y_pred = model.predict(X_test)
    print("\nModel Evaluation:")
    print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # 6. Save the model to the backend's models folder
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(base_dir, 'backend', 'ml_service', 'models')
    
    # Ensure the models directory exists
    os.makedirs(target_dir, exist_ok=True)
    
    model_path = os.path.join(target_dir, 'seizure.pkl')
    
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"\nSuccess! Seizure model securely exported to: {model_path}")
    print("\nIMPORTANT: In your frontend, the 'answers' object MUST send 178 EEG continuous values.")
    print(f"Features: {list(X.columns[:5])} ... {list(X.columns[-5:])}")

if __name__ == "__main__":
    train_model()
