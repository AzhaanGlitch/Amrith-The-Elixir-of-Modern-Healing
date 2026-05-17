import pandas as pd
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

def train_model():
    print("Loading Heart Failure dataset...")
    dataset_path = os.path.join('dataset', 'heart_failure.csv')
    try:
        df = pd.read_csv(dataset_path)
    except FileNotFoundError:
        print(f"Error: Could not find '{dataset_path}'")
        return

    print("Preprocessing data...")
    # Target column is 'num'. Values 1-4 indicate heart disease, 0 indicates no disease.
    # We will convert this into a binary classification problem (0 = No, 1 = Yes)
    df['num'] = df['num'].apply(lambda x: 1 if x > 0 else 0)

    # Some columns like 'thal' or 'ca' might have '?' for missing values in this classic UCI dataset
    df = df.replace('?', pd.NA).dropna()

    X = df.drop('num', axis=1)
    y = df['num']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print("\nModel Evaluation:")
    print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(base_dir, 'backend', 'ml_service', 'models')
    os.makedirs(target_dir, exist_ok=True)
    
    model_path = os.path.join(target_dir, 'heart_failure.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    print(f"\n✅ Success! Model securely exported to: {model_path}")
    print("\n⚠️ IMPORTANT: In your frontend, the 'answers' object MUST be sent in this EXACT order:")
    print(list(X.columns))

if __name__ == "__main__":
    train_model()
