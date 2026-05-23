import os
import tensorflow as tf
from tensorflow.keras.models import load_model

def test_load_keras_model():
    model_path = os.path.join("models", "skin_cancer.keras")
    
    print(f"Loading model from: {model_path}")
    
    try:
        # Load the model
        model = load_model(model_path)
        print("\n✅ Successfully loaded the skin cancer model!")
        
        # Print out the model summary to see its architecture and input shape
        print("\nModel Architecture Summary:")
        model.summary()
        
        # We can extract the input shape to know exactly what size images this model expects
        input_shape = model.input_shape
        print(f"\n✅ Expected Input Shape: {input_shape}")
        
    except Exception as e:
        print(f"\n❌ Failed to load the model. Error: {e}")

if __name__ == "__main__":
    test_load_keras_model()
