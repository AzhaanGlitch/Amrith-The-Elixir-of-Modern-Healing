"""
Amrith ML Service — Flask API for AI Diagnostics
Loads .h5 (Keras/TF) and .pkl (scikit-learn) models for medical predictions.

Place your trained models in the 'models/' subdirectory:
  ml_service/
    models/
      fever_model.pkl
      skin_cancer_model.h5
      pneumonia_model.h5
      ...
"""

import os
import json
import glob
import traceback
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# ─── Configuration ────────────────────────────────────────────
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

# Cache loaded models in memory
loaded_models = {}


# ─── Model Loading Utilities ─────────────────────────────────

def load_keras_model(path):
    """Load a .h5 Keras/TensorFlow model."""
    try:
        import tensorflow as tf
        model = tf.keras.models.load_model(path)
        print(f"  ✅ Loaded Keras model: {os.path.basename(path)}")
        return {'type': 'keras', 'model': model}
    except Exception as e:
        print(f"  ❌ Failed to load Keras model {path}: {e}")
        return None


def load_sklearn_model(path):
    """Load a .pkl scikit-learn model."""
    try:
        import pickle
        with open(path, 'rb') as f:
            model = pickle.load(f)
        print(f"  ✅ Loaded sklearn model: {os.path.basename(path)}")
        return {'type': 'sklearn', 'model': model}
    except Exception as e:
        print(f"  ❌ Failed to load sklearn model {path}: {e}")
        return None


def discover_and_load_models():
    """Scan the models/ directory and load all .h5 and .pkl files."""
    print("\n🔍 Scanning for ML models...")

    h5_files = glob.glob(os.path.join(MODELS_DIR, '*.h5'))
    pkl_files = glob.glob(os.path.join(MODELS_DIR, '*.pkl'))

    if not h5_files and not pkl_files:
        print("  ⚠️  No models found in ml_service/models/")
        print("     Place your .h5 and .pkl files there to enable predictions.\n")
        return

    for path in h5_files:
        name = os.path.splitext(os.path.basename(path))[0]
        result = load_keras_model(path)
        if result:
            loaded_models[name] = result

    for path in pkl_files:
        name = os.path.splitext(os.path.basename(path))[0]
        result = load_sklearn_model(path)
        if result:
            loaded_models[name] = result

    print(f"\n📦 Total models loaded: {len(loaded_models)}\n")


# ─── Prediction Logic ────────────────────────────────────────

def predict_with_image(model_info, image_path, target_size=(224, 224)):
    """Run prediction on an image using a Keras model."""
    from PIL import Image

    img = Image.open(image_path).convert('RGB').resize(target_size)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    model = model_info['model']
    prediction = model.predict(img_array, verbose=0)

    confidence = float(np.max(prediction)) * 100
    predicted_class = int(np.argmax(prediction))

    return {
        'predicted_class': predicted_class,
        'confidence': round(confidence, 2),
        'raw_output': prediction.tolist(),
    }


def predict_with_tabular(model_info, features):
    """Run prediction on tabular data using a sklearn model."""
    model = model_info['model']
    features_array = np.array(features).reshape(1, -1)

    prediction = model.predict(features_array)
    result = {
        'predicted_class': int(prediction[0]) if hasattr(prediction[0], '__int__') else str(prediction[0]),
    }

    # Try to get probability if available
    if hasattr(model, 'predict_proba'):
        proba = model.predict_proba(features_array)
        result['confidence'] = round(float(np.max(proba)) * 100, 2)
        result['probabilities'] = proba.tolist()
    else:
        result['confidence'] = 75.0

    return result


def map_risk_level(confidence):
    """Map confidence score to a risk level string."""
    if confidence >= 80:
        return 'Critical'
    elif confidence >= 60:
        return 'High'
    elif confidence >= 40:
        return 'Moderate'
    else:
        return 'Low'


# ─── API Routes ──────────────────────────────────────────────

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'OK',
        'service': 'Amrith ML Service',
        'models_loaded': len(loaded_models),
        'model_names': list(loaded_models.keys()),
    })


@app.route('/models', methods=['GET'])
def list_models():
    models_info = []
    for name, info in loaded_models.items():
        models_info.append({
            'name': name,
            'type': info['type'],
            'framework': 'TensorFlow/Keras' if info['type'] == 'keras' else 'scikit-learn',
        })
    return jsonify({'models': models_info, 'total': len(models_info)})


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        test_id = data.get('testId', '')
        input_type = data.get('inputType', 'TABULAR')
        answers = data.get('answers', {})
        file_paths = data.get('files', [])

        # Try to find a matching model
        # Naming convention: test_id maps to model name
        # e.g., "heart-failure" -> "heart_failure" or "heart-failure"
        model_key = test_id.replace('-', '_')
        model_info = loaded_models.get(model_key) or loaded_models.get(test_id)

        # If no specific model found, try generic department models
        if not model_info:
            # Try partial match
            for key in loaded_models:
                if test_id.replace('-', '_') in key or key in test_id.replace('-', '_'):
                    model_info = loaded_models[key]
                    break

        # If still no model, return a simulated result
        if not model_info:
            score = np.random.randint(25, 75)
            return jsonify({
                'prediction': f'Analysis for {test_id}',
                'confidence': float(score),
                'risk_level': map_risk_level(score),
                'details': {
                    'note': f'No trained model found for "{test_id}". '
                            f'Place a model file named "{model_key}.h5" or "{model_key}.pkl" in ml_service/models/',
                    'available_models': list(loaded_models.keys()),
                },
                'model_version': 'fallback-v1.0',
            })

        # ── Run actual prediction ─────────────────────────
        result = {}

        if input_type == 'IMAGE' and file_paths:
            result = predict_with_image(model_info, file_paths[0])
        elif input_type == 'TABULAR' and answers:
            # Convert answer dict values to numeric features
            features = []
            for key, val in answers.items():
                if isinstance(val, (int, float)):
                    features.append(val)
                elif isinstance(val, str):
                    features.append(1 if val.lower() in ['yes', 'true'] else 0)
                else:
                    features.append(0)
            result = predict_with_tabular(model_info, features)
        elif input_type == 'HYBRID':
            # Run both image and tabular if available
            if file_paths and model_info['type'] == 'keras':
                result = predict_with_image(model_info, file_paths[0])
            elif answers and model_info['type'] == 'sklearn':
                features = [float(v) if isinstance(v, (int, float)) else (1 if str(v).lower() in ['yes', 'true'] else 0) for v in answers.values()]
                result = predict_with_tabular(model_info, features)
        else:
            return jsonify({'error': 'Invalid input type or missing data'}), 400

        confidence = result.get('confidence', 50.0)

        return jsonify({
            'prediction': f'Class {result.get("predicted_class", "Unknown")}',
            'confidence': confidence,
            'risk_level': map_risk_level(confidence),
            'details': result,
            'model_version': f'{model_key}-v1.0',
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ─── Start Server ────────────────────────────────────────────
if __name__ == '__main__':
    discover_and_load_models()

    port = int(os.environ.get('ML_PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'

    print(f"🧠 Amrith ML Service starting on port {port}")
    print(f"   Health check: http://localhost:{port}/health\n")

    app.run(host='0.0.0.0', port=port, debug=debug)
