import pandas as pd
import numpy as np
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

def train_model():
    print("Loading Arrhythmia ECG dataset (This may take a while since it's 100MB)...")
    dataset_path = os.path.join('dataset', 'arrhythmia.csv')
    try:
        # We'll use a subset if it's too large, but Random Forest handles 100k rows decently well.
        df = pd.read_csv(dataset_path, header=None) # MIT-BIH usually has no header
    except FileNotFoundError:
        print(f"Error: Could not find '{dataset_path}'")
        return

    print(f"Dataset loaded! Shape: {df.shape}")
    print("Preprocessing data...")
    
    # In the standard MIT-BIH dataset format from Kaggle, 
    # there are 187 columns of signal data, and the 188th column is the target class (0-4).
    # Class 0: Normal, 1: Supraventricular, 2: Ventricular, etc.
    
    X = df.iloc[:, :-1]  # All columns except the last one
    y = df.iloc[:, -1]   # The very last column is the label

    # Split into train and test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest Classifier on ECG signals...")
    print("(Please be patient, training on 100MB of time-series data will take a few minutes!)")
    
    # We use n_jobs=-1 to use all CPU cores and speed it up
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    print("Evaluating Model...")
    y_pred = model.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save the model
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(base_dir, 'backend', 'ml_service', 'models')
    os.makedirs(target_dir, exist_ok=True)
    
    model_path = os.path.join(target_dir, 'arrhythmia.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"\nSuccess! Arrhythmia model securely exported to: {model_path}")
    print("\nIMPORTANT FOR FRONTEND:")
    print("Because this model analyzes raw ECG signals, your frontend must send an array of 187 decimal numbers (voltage readings over time), NOT a simple questionnaire!")

if __name__ == "__main__":
    train_model()
