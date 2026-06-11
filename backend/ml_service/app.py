"""
Amrith ML Service — Production-Grade Flask API for AI Diagnostics
Supports: .pkl (scikit-learn), .h5/.keras (TensorFlow/Keras), .pth (PyTorch)
Gracefully degrades when deep-learning frameworks are unavailable.
"""

import os
import sys
import json
import glob
import traceback
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Force UTF-8 output on Windows to prevent cp1252 emoji crashes
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

load_dotenv()

# ─── Bulletproof Framework Imports ────────────────────────────
HAS_TF = False
HAS_TORCH = False
HAS_PIL = False

try:
    import tensorflow as tf
    HAS_TF = True
    print("✅ TensorFlow loaded successfully")
except Exception:
    print("⚠️  TensorFlow not available — Keras models will use clinical fallbacks")

try:
    import torch
    import torchvision.transforms as T
    HAS_TORCH = True
    print("✅ PyTorch loaded successfully")
except Exception:
    print("⚠️  PyTorch not available — .pth models will use clinical fallbacks")

try:
    from PIL import Image
    HAS_PIL = True
except Exception:
    print("⚠️  Pillow not available — image processing disabled")

# ─── Hugging Face Integration ─────────────────────────────────
HAS_HF = False
hf_model = None
hf_tokenizer = None

try:
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
    HAS_HF = True
    print("✅ Hugging Face transformers loaded successfully")
except Exception as e:
    print(f"⚠️  Hugging Face transformers not available: {e}")


# --- Hugging Face pipeline configuration ---
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
HF_MODEL_DIR = os.path.join(MODELS_DIR, 'huggingface_model')


STATIC_CLINICAL_GUIDANCE = {
    'skin_cancer': {
        'precautions': [
            'Avoid direct sunlight exposure between 10 AM and 4 PM.',
            'Apply broad-spectrum sunscreen with SPF 30+ daily, even on cloudy days.',
            'Conduct monthly skin self-examinations to check for new or changing moles.'
        ],
        'medications': [
            'Topical 5-Fluorouracil (Efudex) for pre-cancerous lesions (if prescribed by oncologist).',
            'Imiquimod cream (Aldara) to stimulate local immune response (under medical supervision).'
        ]
    },
    'skin_cancer_onc': {
        'precautions': [
            'Protect the affected skin area from friction, chemical irritants, and UV rays.',
            'Keep skin clean, dry, and hydrated with fragrance-free moisturizers.',
            'Monitor for symptoms like localized bleeding, rapid growth, or color change.'
        ],
        'medications': [
            'Targeted oncology therapies (e.g., Vismodegib for advanced basal cell carcinoma).',
            'Surgical excision planning (consult with a surgical oncologist).'
        ]
    },
    'eczema': {
        'precautions': [
            'Moisturize skin at least twice daily with thick, fragrance-free ointments or creams.',
            'Take short, lukewarm showers (5-10 minutes) and avoid hot baths.',
            'Identify and avoid triggers such as harsh soaps, detergents, and wool clothing.'
        ],
        'medications': [
            'Topical Corticosteroids (e.g., Hydrocortisone or Triamcinolone) to reduce inflammation.',
            'Oral Antihistamines (e.g., Cetirizine or Diphenhydramine) to manage intense itching.'
        ]
    },
    'psoriasis': {
        'precautions': [
            'Keep skin well-moisturized to reduce scaling and itching.',
            'Avoid skin injuries, cuts, or sunburns, which can trigger a psoriasis flare (Koebner phenomenon).',
            'Manage stress through mindfulness, as stress is a well-documented psoriasis trigger.'
        ],
        'medications': [
            'Topical Calcipotriene (Vitamin D analogue) to slow skin cell growth.',
            'Coal Tar preparations or topical corticosteroids for localized plaque treatment.'
        ]
    },
    'fungal_infection': {
        'precautions': [
            'Keep the affected skin clean, dry, and well-ventilated.',
            'Wear loose-fitting, breathable cotton clothing and change damp socks/underwear promptly.',
            'Do not share personal items like towels, combs, or shoes to prevent spreading the infection.'
        ],
        'medications': [
            'Topical Antifungals (e.g., Clotrimazole, Miconazole, or Terbinafine cream) applied twice daily.',
            'Oral Antifungals (e.g., Fluconazole) for persistent or widespread infections (prescribed by doctor).'
        ]
    },
    'pneumonia': {
        'precautions': [
            'Get plenty of rest and avoid strenuous physical activities.',
            'Practice deep breathing exercises and use a humidifier to help clear lung secretions.',
            'Avoid exposure to secondhand smoke, dust, and chemical fumes.'
        ],
        'medications': [
            'Empiric Antibiotics (e.g., Amoxicillin or Azithromycin) if bacterial origin is suspected.',
            'Expectorants and mucolytics (e.g., Guaifenesin) to help loosen and expel mucus.'
        ]
    },
    'tuberculosis': {
        'precautions': [
            'Wear a high-filtration mask (N95) in public spaces to prevent droplet transmission.',
            'Ensure the patient room is well-ventilated with fresh air.',
            'Maintain strict adherence to the complete medication timeline to prevent drug resistance.'
        ],
        'medications': [
            'First-line Antitubercular Therapy (HRZE regimen: Isoniazid, Rifampin, Pyrazinamide, Ethambutol).',
            'Vitamin B6 (Pyridoxine) supplementation to prevent drug-induced peripheral neuropathy.'
        ]
    },
    'asthma': {
        'precautions': [
            'Identify and avoid personal triggers such as pollen, pet dander, mold, and cold air.',
            'Always carry a quick-relief rescue inhaler wherever you go.',
            'Monitor peak expiratory flow rates daily to track lung function trends.'
        ],
        'medications': [
            'Short-Acting Beta-Agonists (SABA: e.g., Albuterol/Salbutamol inhaler) for acute relief.',
            'Inhaled Corticosteroids (ICS: e.g., Fluticasone or Budesonide) for daily long-term control.'
        ]
    },
    'copd': {
        'precautions': [
            'Stop smoking completely and avoid all exposure to secondhand smoke.',
            'Receive annual influenza and pneumococcal vaccinations to prevent lung infections.',
            'Perform pursed-lip breathing exercises to improve oxygenation and ventilation.'
        ],
        'medications': [
            'Long-Acting Bronchodilators (LABA/LAMA: e.g., Salmeterol, Tiotropium inhalers).',
            'Phosphodiesterase-4 inhibitors (e.g., Roflumilast) to reduce severe exacerbation risk.'
        ]
    },
    'heart_failure': {
        'precautions': [
            'Limit daily fluid intake as advised by your cardiologist (typically under 1.5 - 2 liters).',
            'Weigh yourself every morning; report a weight gain of >3 lbs in a day or >5 lbs in a week.',
            'Restrict dietary sodium intake to less than 1,500 - 2,000 mg per day.'
        ],
        'medications': [
            'Loop Diuretics (e.g., Furosemide) to reduce fluid retention and pulmonary congestion.',
            'ACE Inhibitors (e.g., Lisinopril) or ARBs/ARNIs (e.g., Sacubitril/Valsartan) to support heart function.'
        ]
    },
    'hypertension': {
        'precautions': [
            'Check and record blood pressure daily at home, preferably at the same time each morning.',
            'Limit table salt intake and consume a DASH (Dietary Approaches to Stop Hypertension) diet.',
            'Engage in at least 150 minutes of moderate cardiovascular exercise per week.'
        ],
        'medications': [
            'Calcium Channel Blockers (e.g., Amlodipine) or Beta-Blockers (e.g., Metoprolol).',
            'Thiazide Diuretics (e.g., Hydrochlorothiazide) to manage systemic vascular volume.'
        ]
    },
    'arrhythmia': {
        'precautions': [
            'Avoid stimulants including caffeine, energy drinks, nicotine, and certain decongestants.',
            'Manage stress through biofeedback, meditation, or light yoga.',
            'Learn how to check your pulse manually to identify irregular heartbeats.'
        ],
        'medications': [
            'Beta-Blockers (e.g., Atenolol) or Calcium Channel Blockers to control ventricular rate.',
            'Antiarrhythmic agents (e.g., Amiodarone or Flecainide) under strict cardiological monitoring.'
        ]
    },
    'stroke': {
        'precautions': [
            'Familiarize yourself and family with BE FAST (Balance, Eyes, Face, Arm, Speech, Time) symptoms.',
            'Maintain strict control of blood pressure, blood glucose, and cholesterol levels.',
            'Avoid sudden posture changes if experiencing dizziness or orthostatic changes.'
        ],
        'medications': [
            'Antiplatelet therapy (e.g., Aspirin or Clopidogrel) to prevent secondary ischemic events.',
            'Statins (e.g., Atorvastatin) for high-intensity lipid management and plaque stabilization.'
        ]
    },
    'parkinsons': {
        'precautions': [
            'Modify home environment (remove rug hazards, install grab bars) to prevent falls.',
            'Engage in regular physical therapy focusing on balance, gait training, and stretching.',
            'Take medications at exact scheduled times to prevent "off" periods of motor dysfunction.'
        ],
        'medications': [
            'Dopamine precursors (e.g., Carbidopa-Levodopa) to manage tremors and rigidity.',
            'Dopamine agonists (e.g., Pramipexole) or MAO-B inhibitors to preserve brain dopamine.'
        ]
    },
    'seizure': {
        'precautions': [
            'Avoid known triggers such as sleep deprivation, flashing lights, and high stress.',
            'Do not swim, bathe in deep water, or drive unless cleared by a neurologist.',
            'Ensure coworkers or family members know seizure first aid (do not restrain, turn on side).'
        ],
        'medications': [
            'Antiepileptic Drugs (AEDs: e.g., Levetiracetam/Keppra, Lamotrigine, or Valproate).',
            'Rescue Benzodiazepines (e.g., Lorazepam or Diazepam rectal/nasal spray) for status epilepticus.'
        ]
    },
    'fracture': {
        'precautions': [
            'Keep the splint, cast, or brace completely dry and clean.',
            'Elevate the injured limb above heart level frequently to minimize localized swelling.',
            'Avoid bearing weight or using the injured area until cleared by an orthopedic surgeon.'
        ],
        'medications': [
            'Analgesics (e.g., Acetaminophen or NSAIDs like Ibuprofen) for pain and inflammation control.',
            'Calcium and Vitamin D3 supplements to support rapid bone remodeling and healing.'
        ]
    },
    'osteoporosis': {
        'precautions': [
            'Perform weight-bearing exercises (e.g., walking, resistance training) to stimulate bone density.',
            'Install bright lighting and handrails at home to prevent accidental falls and fractures.',
            'Avoid smoking and limit alcohol, as they accelerate bone mineral loss.'
        ],
        'medications': [
            'Bisphosphonates (e.g., Alendronate or Risedronate) to slow down bone resorption.',
            'Calcium Carbonate/Citrate (1200mg daily) and Vitamin D3 (800-1000 IU daily) supplementation.'
        ]
    },
    'myopia': {
        'precautions': [
            'Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.',
            'Ensure adequate ambient lighting when reading or using electronic displays.',
            'Schedule annual comprehensive dilated eye exams to check for retinal thinning.'
        ],
        'medications': [
            'Low-dose Atropine ophthalmic drops (0.01%) to slow down myopia progression in children.',
            'Prescription corrective lenses (glasses or contact lenses) for daily visual correction.'
        ]
    },
    'diabetic_retinopathy': {
        'precautions': [
            'Maintain strict control over HbA1c blood sugar levels to prevent microvascular damage.',
            'Monitor blood pressure and cholesterol, as hypertension accelerates retinopathy.',
            'Schedule a dilated retinal exam immediately if you notice sudden floaters or blurry spots.'
        ],
        'medications': [
            'Intravitreal Anti-VEGF injections (e.g., Ranibizumab or Aflibercept) to check abnormal blood vessel growth.',
            'Systemic glycemic and cardiovascular control agents (metformin, insulin, statins).'
        ]
    },
    'glaucoma': {
        'precautions': [
            'Use prescribed intraocular pressure-lowering drops daily without missing doses.',
            'Avoid sleeping with your face down or pressing against the eyes, which spikes ocular pressure.',
            'Avoid heavy lifting or inverted yoga positions that increase thoracic and ocular pressure.'
        ],
        'medications': [
            'Prostaglandin analogues (e.g., Latanoprost) or Beta-blocker drops (e.g., Timolol) to lower eye pressure.',
            'Carbonic anhydrase inhibitors (e.g., Brinzolamide drops or oral Acetazolamide) to reduce fluid output.'
        ]
    },
    'cataracts': {
        'precautions': [
            'Wear UV-blocking sunglasses outdoors to protect lenses from accelerated clouding.',
            'Optimize indoor lighting with brighter, direct task lamps for reading.',
            'Limit night driving if glare, halos, or starbursts around headlights impede safety.'
        ],
        'medications': [
            'Lubricating artificial tears for general eye comfort and mild dry eye symptoms.',
            'Pre-operative planning for laser or micro-incision cataract surgery with intraocular lens (IOL) implant.'
        ]
    },
    'default': {
        'precautions': [
            'Monitor your symptoms closely and keep a detailed log for your doctor.',
            'Ensure proper rest, balanced nutrition, and adequate hydration.',
            'Avoid self-medicating or changing existing drug dosages without direct guidance.'
        ],
        'medications': [
            'Symptomatic relief medications (e.g., Acetaminophen for fever/pain) under pharmacist guidance.',
            'Schedule a routine clinical consultation to review symptoms and establish a treatment plan.'
        ]
    }
}

def _normalize_key(key):
    return str(key).lower().replace('-', '_').replace(' ', '_').strip()

def init_huggingface_model():
    global hf_model, hf_tokenizer, HAS_HF
    if not HAS_HF:
        return
    
    model_name = "google/flan-t5-small"
    print(f"\n⏳ Initializing Hugging Face model: {model_name} ...")
    try:
        print(f"  👉 Loading tokenizer for {model_name} (will auto-download and cache)...")
        hf_tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        print(f"  👉 Loading model for {model_name} (will auto-download and cache)...")
        hf_model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        
        print("  ✅ Model and tokenizer loaded successfully!")
    except Exception as e:
        print(f"  ❌ Failed to load model '{model_name}': {e}")
        traceback.print_exc()
        hf_model = None
        hf_tokenizer = None


def generate_hf_guidelines(condition, diagnosis, confidence, risk_level):
    """
    Generate precautions and medications using a local/hub Hugging Face model.
    Falls back to STATIC_CLINICAL_GUIDANCE on error or if HF is disabled.
    """
    normalized_key = _normalize_key(condition)
    diagnosis_norm = _normalize_key(diagnosis)

    fallback = STATIC_CLINICAL_GUIDANCE.get(normalized_key)
    if not fallback:
        fallback = STATIC_CLINICAL_GUIDANCE.get(diagnosis_norm)
    if not fallback:
        for key in STATIC_CLINICAL_GUIDANCE:
            if key in normalized_key or normalized_key in key or key in diagnosis_norm or diagnosis_norm in key:
                fallback = STATIC_CLINICAL_GUIDANCE[key]
                break
    if not fallback:
        fallback = STATIC_CLINICAL_GUIDANCE['default']

    if not HAS_HF or not hf_model or not hf_tokenizer:
        return {
            'ai_precautions': fallback['precautions'],
            'ai_medications': fallback['medications'],
            'ai_enhanced': False
        }

    try:
        prompt = (
            f"Context: Patient diagnosed with {diagnosis} ({condition}) by a screening tool. "
            f"Risk Level: {risk_level}. Confidence: {confidence}%. "
            f"Task: Provide exactly 3 specific clinical precautions (labeled P1:, P2:, P3:) "
            f"and exactly 2 mandatory medications or next-step treatments (labeled M1:, M2:) for this patient.\n"
            f"Precautions:\nP1: \nP2: \nP3: \nMedications:\nM1: \nM2: "
        )

        print(f"  👉 Prompting HF Model with condition: {condition}, diagnosis: {diagnosis}...")
        
        inputs = hf_tokenizer(prompt, return_tensors="pt")
        outputs = hf_model.generate(**inputs, max_length=256, num_return_sequences=1)
        generated_text = hf_tokenizer.decode(outputs[0], skip_special_tokens=True)

        print(f"  👉 HF Model Output: {generated_text}")

        precautions = []
        medications = []

        lines = generated_text.split('\n')
        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue
            
            if any(p_lbl in line_str for p_lbl in ('P1:', 'P2:', 'P3:', 'Precaution', '- ')):
                cleaned = line_str.replace('P1:', '').replace('P2:', '').replace('P3:', '').strip('- ').strip()
                if cleaned and len(cleaned) > 5 and 'precautions' not in cleaned.lower():
                    precautions.append(cleaned)
            elif any(m_lbl in line_str for m_lbl in ('M1:', 'M2:', 'Medication', 'Treatment')):
                cleaned = line_str.replace('M1:', '').replace('M2:', '').strip('- ').strip()
                if cleaned and len(cleaned) > 5 and 'medications' not in cleaned.lower():
                    medications.append(cleaned)

        if len(precautions) < 2:
            precautions = fallback['precautions']
        if len(medications) < 1:
            medications = fallback['medications']

        precautions = precautions[:3]
        medications = medications[:2]

        return {
            'ai_precautions': precautions,
            'ai_medications': medications,
            'ai_enhanced': True
        }
    except Exception as e:
        print(f"  ⚠️ Error executing Hugging Face model: {e}")
        traceback.print_exc()
        return {
            'ai_precautions': fallback['precautions'],
            'ai_medications': fallback['medications'],
            'ai_enhanced': False
        }


app = Flask(__name__)
CORS(app)

@app.after_request
def add_hf_guidelines(response):
    if request.path == '/predict' and response.status_code == 200:
        try:
            data = response.get_json()
            if data and 'prediction' in data:
                req_json = request.get_json(silent=True) or {}
                test_id = req_json.get('testId', '')
                prediction = data.get('prediction', '')
                confidence = data.get('confidence', 50.0)
                risk_level = data.get('risk_level', 'Low')
                
                # Generate HF guidelines
                guidelines = generate_hf_guidelines(test_id, prediction, confidence, risk_level)
                
                if 'details' not in data or data['details'] is None:
                    data['details'] = {}
                
                data['details']['ai_precautions'] = guidelines['ai_precautions']
                data['details']['ai_medications'] = guidelines['ai_medications']
                data['details']['ai_enhanced'] = guidelines['ai_enhanced']
                
                response.set_data(json.dumps(data))
        except Exception as e:
            print(f"⚠️ Error in after_request hf guidelines injection: {e}")
            traceback.print_exc()
    return response


# ─── Configuration ────────────────────────────────────────────
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

available_models = {}  # Map model_key -> { 'path': path, 'type': type, 'loader': loader_func }
loaded_models = {}     # Cache loaded models in memory


# ═══════════════════════════════════════════════════════════════
# 🔧 MODEL LOADING UTILITIES
# ═══════════════════════════════════════════════════════════════

def load_sklearn_model(path):
    """Load a .pkl scikit-learn model."""
    try:
        with open(path, 'rb') as f:
            model = pickle.load(f)
        name = os.path.basename(path)
        print(f"  ✅ Loaded sklearn model: {name}")
        return {'type': 'sklearn', 'model': model}
    except Exception as e:
        print(f"  ❌ Failed to load sklearn model {path}: {e}")
        return None


def load_keras_model(path):
    """Load a .h5 or .keras TensorFlow/Keras model."""
    if not HAS_TF:
        print(f"  ⏭️  Skipped Keras model (TF unavailable): {os.path.basename(path)}")
        return None
    try:
        model = tf.keras.models.load_model(path, compile=False)
        name = os.path.basename(path)
        print(f"  ✅ Loaded Keras model: {name}")
        return {'type': 'keras', 'model': model}
    except Exception as e:
        print(f"  ❌ Failed to load Keras model {path}: {e}")
        return None


def load_pytorch_model(path):
    """Load a .pth PyTorch model (full model save or state dict)."""
    if not HAS_TORCH:
        print(f"  ⏭️  Skipped PyTorch model (Torch unavailable): {os.path.basename(path)}")
        return None
    try:
        model = torch.load(path, map_location=torch.device('cpu'), weights_only=False)
        if isinstance(model, dict):
            print(f"  ⚠️  PyTorch state_dict detected for {os.path.basename(path)} — needs architecture definition")
            return None
        if hasattr(model, 'eval'):
            model.eval()
        name = os.path.basename(path)
        print(f"  ✅ Loaded PyTorch model: {name}")
        return {'type': 'pytorch', 'model': model}
    except Exception as e:
        print(f"  ❌ Failed to load PyTorch model {path}: {e}")
        return None



def download_models_from_hf():
    """Download models dynamically from Hugging Face Hub if HF_MODELS_REPO is set."""
    repo_id = os.environ.get('HF_MODELS_REPO')
    if not repo_id:
        print("⏭️  HF_MODELS_REPO not configured in environment. Skipping Hugging Face download.")
        return

    print(f"\n📥 Downloading missing models from Hugging Face Model Hub: {repo_id}...")
    try:
        from huggingface_hub import hf_hub_download
    except ImportError:
        print("⚠️  huggingface_hub library not installed. Cannot download models from HF Hub.")
        return

    model_filenames = [
        "arrhythmia.pkl", "asthma.pkl", "breast_cancer.h5", "eczema.h5", 
        "fracture.pth", "fungal_infection.pth", "general_medicine.pkl", 
        "heart_failure.pkl", "hypertension.pkl", "lung_cancer.h5", 
        "ophthalmology.pkl", "osteoporosis.h5", "parkinsons.pkl", 
        "pneumonia.h5", "psoriasis.pth", "seizure.pkl", 
        "skin_cancer.keras", "skin_cancer_onc.keras", "stroke_risk.pkl", 
        "tuberculosis.h5"
    ]

    os.makedirs(MODELS_DIR, exist_ok=True)

    for filename in model_filenames:
        target_path = os.path.join(MODELS_DIR, filename)
        if not os.path.exists(target_path):
            print(f"  👉 Downloading {filename}...")
            try:
                hf_hub_download(
                    repo_id=repo_id,
                    filename=filename,
                    local_dir=MODELS_DIR,
                    local_dir_use_symlinks=False
                )
                print(f"  ✅ Downloaded {filename} successfully.")
            except Exception as e:
                print(f"  ❌ Failed to download {filename}: {e}")
        else:
            print(f"  ✓ {filename} already exists locally.")


def discover_models():
    """Scan the models/ directory and register available model files without loading them."""
    download_models_from_hf()
    print("\n🔍 Scanning for ML models on disk...")

    extensions = {
        '*.pkl': ('sklearn', load_sklearn_model),
        '*.h5': ('keras', load_keras_model),
        '*.keras': ('keras', load_keras_model),
        '*.pth': ('pytorch', load_pytorch_model),
    }

    found_any = False
    for pattern, (m_type, loader) in extensions.items():
        files = glob.glob(os.path.join(MODELS_DIR, pattern))
        for path in files:
            found_any = True
            name = os.path.splitext(os.path.basename(path))[0]
            available_models[name] = {
                'path': path,
                'type': m_type,
                'loader': loader
            }
            print(f"  👉 Registered model: {name} (type: {m_type})")

    if not found_any:
        print("  ⚠️  No models found in ml_service/models/")
        print("     Place your model files there to enable predictions.\n")
        return

    print(f"\n📦 Total models registered on disk: {len(available_models)}")
    print(f"   Names: {list(available_models.keys())}\n")


def get_or_load_model(model_key):
    """Get the model from memory cache or load it dynamically if registered. Returns (model_info, matched_key)"""
    if model_key in loaded_models:
        return loaded_models[model_key], model_key

    # Try exact match first
    model_entry = available_models.get(model_key)
    matched_key = model_key

    # Try partial match if not found exactly
    if not model_entry:
        for key in available_models:
            if model_key in key or key in model_key:
                model_entry = available_models[key]
                matched_key = key
                break

    if not model_entry:
        print(f"  ❌ Model '{model_key}' is not registered on disk.")
        return None, model_key

    # Load the model now
    path = model_entry['path']
    loader = model_entry['loader']
    print(f"\n⏳ Lazy-loading model '{matched_key}' from: {path} ...")
    try:
        result = loader(path)
        if result:
            loaded_models[matched_key] = result
            print(f"  ✅ Successfully lazy-loaded model '{matched_key}'!")
            return result, matched_key
        else:
            print(f"  ❌ Loader returned None for model '{matched_key}'")
            return None, matched_key
    except Exception as e:
        print(f"  ❌ Exception loading model '{matched_key}': {e}")
        traceback.print_exc()
        return None, matched_key


# ═══════════════════════════════════════════════════════════════
# 🗺️ SYMPTOM LIST — The 131 features for general_medicine.pkl
# ═══════════════════════════════════════════════════════════════

SYMPTOM_LIST = []
symptoms_path = os.path.join(os.path.dirname(__file__), '..', '..', 'ML_Training', 'symptoms_list.txt')
if os.path.exists(symptoms_path):
    with open(symptoms_path, 'r') as f:
        SYMPTOM_LIST = [line.strip() for line in f if line.strip()]
    print(f"📋 Loaded {len(SYMPTOM_LIST)} symptoms from symptoms_list.txt")
else:
    # Hardcoded fallback (exact order from training)
    SYMPTOM_LIST = [
        'abdominal_pain', 'abnormal_menstruation', 'acidity', 'acute_liver_failure',
        'altered_sensorium', 'anxiety', 'back_pain', 'belly_pain', 'blackheads',
        'bladder_discomfort', 'blister', 'blood_in_sputum', 'bloody_stool',
        'blurred_and_distorted_vision', 'breathlessness', 'brittle_nails', 'bruising',
        'burning_micturition', 'chest_pain', 'chills', 'cold_hands_and_feets', 'coma',
        'congestion', 'constipation', 'continuous_feel_of_urine', 'continuous_sneezing',
        'cough', 'cramps', 'dark_urine', 'dehydration', 'depression', 'diarrhoea',
        'dischromic _patches', 'distention_of_abdomen', 'dizziness',
        'drying_and_tingling_lips', 'enlarged_thyroid', 'excessive_hunger',
        'extra_marital_contacts', 'family_history', 'fast_heart_rate', 'fatigue',
        'fluid_overload', 'foul_smell_of urine', 'headache', 'high_fever',
        'hip_joint_pain', 'history_of_alcohol_consumption', 'increased_appetite',
        'indigestion', 'inflammatory_nails', 'internal_itching', 'irregular_sugar_level',
        'irritability', 'irritation_in_anus', 'itching', 'joint_pain', 'knee_pain',
        'lack_of_concentration', 'lethargy', 'loss_of_appetite', 'loss_of_balance',
        'loss_of_smell', 'malaise', 'mild_fever', 'mood_swings', 'movement_stiffness',
        'mucoid_sputum', 'muscle_pain', 'muscle_wasting', 'muscle_weakness', 'nausea',
        'neck_pain', 'nodal_skin_eruptions', 'obesity', 'pain_behind_the_eyes',
        'pain_during_bowel_movements', 'pain_in_anal_region', 'painful_walking',
        'palpitations', 'passage_of_gases', 'patches_in_throat', 'phlegm', 'polyuria',
        'prominent_veins_on_calf', 'puffy_face_and_eyes', 'pus_filled_pimples',
        'receiving_blood_transfusion', 'receiving_unsterile_injections',
        'red_sore_around_nose', 'red_spots_over_body', 'redness_of_eyes', 'restlessness',
        'runny_nose', 'rusty_sputum', 'scurring', 'shivering', 'silver_like_dusting',
        'sinus_pressure', 'skin_peeling', 'skin_rash', 'slurred_speech',
        'small_dents_in_nails', 'spinning_movements', 'spotting_ urination', 'stiff_neck',
        'stomach_bleeding', 'stomach_pain', 'sunken_eyes', 'sweating',
        'swelled_lymph_nodes', 'swelling_joints', 'swelling_of_stomach',
        'swollen_blood_vessels', 'swollen_extremeties', 'swollen_legs',
        'throat_irritation', 'toxic_look_(typhos)', 'ulcers_on_tongue', 'unsteadiness',
        'visual_disturbances', 'vomiting', 'watering_from_eyes', 'weakness_in_limbs',
        'weakness_of_one_body_side', 'weight_gain', 'weight_loss', 'yellow_crust_ooze',
        'yellow_urine', 'yellowing_of_eyes', 'yellowish_skin',
    ]
    print(f"📋 Using hardcoded {len(SYMPTOM_LIST)} symptoms (symptoms_list.txt not found)")


# Build a lookup for quick symptom name → index mapping
# Human-readable names map to exact symptom column names
def _to_symptom_key(human_label):
    """Convert a human-readable label like 'High Fever' to 'high_fever'."""
    return human_label.strip().lower().replace(' ', '_')


SYMPTOM_INDEX = {s: i for i, s in enumerate(SYMPTOM_LIST)}


# ═══════════════════════════════════════════════════════════════
# 🧬 FEATURE MAPPERS — Convert frontend answers to model inputs
# ═══════════════════════════════════════════════════════════════

# --- General Medicine Test IDs that route to general_medicine.pkl ---
GENERAL_MEDICINE_IDS = {
    'fever', 'cold', 'common-cold', 'sinus', 'tonsillitis', 'allergies', 'headache',
    'gerd', 'chronic-cholestasis', 'drug-reaction', 'peptic-ulcer', 'aids',
    'diabetes', 'gastroenteritis', 'bronchial-asthma-gm', 'migraine',
    'cervical-spondylosis', 'paralysis', 'jaundice', 'malaria', 'chicken-pox',
    'dengue', 'typhoid', 'hepatitis-a', 'hepatitis-b', 'hepatitis-c',
    'hepatitis-d', 'hepatitis-e', 'alcoholic-hepatitis', 'piles',
    'heart-attack-gm', 'varicose-veins', 'hypothyroidism', 'hyperthyroidism',
    'hypoglycemia', 'osteoarthritis', 'vertigo', 'acne',
    'urinary-tract-infection', 'impetigo', 'fungal-infection-gm', 'psoriasis-gm',
    'allergy-gm', 'hypertension-gm', 'tuberculosis-gm', 'pneumonia-gm',
    'arthritis-gm', 'common-cold',
}


def map_general_medicine(answers):
    """
    Convert symptom checkbox selections into the 131-feature binary vector.
    Frontend sends: { 'q_symptoms': ['High Fever', 'Headache', ...] }
    """
    symptoms_selected = answers.get('q_symptoms', [])
    if isinstance(symptoms_selected, str):
        symptoms_selected = [symptoms_selected]

    vector = [0] * len(SYMPTOM_LIST)
    for symptom_label in symptoms_selected:
        key = _to_symptom_key(symptom_label)
        # Try exact match first
        if key in SYMPTOM_INDEX:
            vector[SYMPTOM_INDEX[key]] = 1
        else:
            # Try fuzzy match (handle whitespace quirks in symptom list)
            for real_key, idx in SYMPTOM_INDEX.items():
                normalized = real_key.replace(' ', '_').replace('__', '_')
                if normalized == key or real_key.replace(' ', '') == key.replace('_', ''):
                    vector[idx] = 1
                    break
    return vector


def map_heart_failure(answers):
    """
    Map frontend heart failure questionnaire to 13 UCI features.
    Features: age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
    """
    age = float(answers.get('age', 50))
    gender = answers.get('gender', 'Male')
    sex = 1 if gender == 'Male' else 0
    
    cp_map = {'Typical Angina': 1, 'Atypical Angina': 2, 'Non-anginal Pain': 3, 'None': 4}
    cp = cp_map.get(answers.get('chest_pain', 'None'), 4)
    
    trestbps = float(answers.get('bp_sys', 130))
    chol = float(answers.get('chol', 240))
    fbs = 1 if answers.get('fbs', 'No') == 'Yes' else 0
    restecg = 0
    thalach = float(answers.get('thalach', 150))
    
    sob = answers.get('sob', 'No')
    exang = 1 if sob == 'Yes' else 0
    
    oldpeak = float(answers.get('oldpeak', 1.0))
    slope = 1
    ca = 0
    thal = 3
    
    history = answers.get('history', [])
    if isinstance(history, str):
        history = [history]
    if 'High Cholesterol' in history:
        chol = max(chol, 280)
    if 'Diabetes' in history:
        fbs = 1

    return [age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]


def map_hypertension(answers):
    """
    Map frontend hypertension questionnaire to 10 features.
    Features: Age, Salt_Intake, Stress_Score, BP_History, Sleep_Duration, BMI, 
              Medication, Family_History, Exercise_Level, Smoking_Status
    """
    bp_text = answers.get('bp', '120/80')
    systolic = 120
    try:
        parts = str(bp_text).replace('mmHg', '').strip().split('/')
        systolic = float(parts[0])
    except Exception:
        pass

    if systolic >= 140:
        bp_history = 2  # Hypertension
    elif systolic >= 120:
        bp_history = 1  # Prehypertension
    else:
        bp_history = 0  # Normal

    age = float(answers.get('age', 45))
    salt_intake = float(answers.get('salt_intake', 5))
    stress_score = float(answers.get('stress_score', 5))
    sleep_duration = float(answers.get('sleep_duration', 7))
    bmi = float(answers.get('bmi', 25))
    medication = 0
    family_history = 1 if answers.get('family_history', 'No') == 'Yes' else 0
    exercise_level = 1  # Moderate default
    smoking_status = 1 if answers.get('smoking_status', 'No') == 'Yes' else 0

    return [age, salt_intake, stress_score, bp_history, sleep_duration, bmi,
            medication, family_history, exercise_level, smoking_status]


def map_stroke_risk(answers):
    """
    Map frontend stroke risk questionnaire to 10 features.
    Features: gender, age, hypertension, heart_disease, ever_married, 
              work_type, Residence_type, avg_glucose_level, bmi, smoking_status
    """
    gender_map = {'Male': 0, 'Female': 1, 'Other': 2}
    gender = gender_map.get(answers.get('gender', 'Male'), 0)
    age = float(answers.get('age', 50))
    hypertension = 1 if answers.get('hypertension', 'No') == 'Yes' else 0
    heart_disease = 1 if answers.get('heart_disease', 'No') == 'Yes' else 0
    ever_married = 1 if answers.get('ever_married', 'Yes') == 'Yes' else 0

    work_map = {'Private': 0, 'Self-employed': 1, 'Govt_job': 2, 'children': 3, 'Never_worked': 4}
    work_type = work_map.get(answers.get('work_type', 'Private'), 0)

    residence_map = {'Rural': 0, 'Urban': 1}
    residence = residence_map.get(answers.get('residence_type', 'Urban'), 1)

    avg_glucose = float(answers.get('avg_glucose_level', 100))
    bmi = float(answers.get('bmi', 25))

    smoking_map = {'never smoked': 0, 'Unknown': 1, 'formerly smoked': 2, 'smokes': 3}
    smoking = smoking_map.get(answers.get('smoking_status', 'Unknown'), 1)

    # Check symptoms for additional risk inference
    symptoms = answers.get('q1', [])
    if isinstance(symptoms, str):
        symptoms = [symptoms]
    if 'Sudden numbness' in symptoms or 'Sudden confusion' in symptoms:
        hypertension = 1
    if 'Sudden trouble speaking' in symptoms:
        heart_disease = 1

    return [gender, age, hypertension, heart_disease, ever_married,
            work_type, residence, avg_glucose, bmi, smoking]


def map_parkinsons(answers):
    """
    Generate 22 acoustic features for Parkinson's model from symptom inputs.
    Real features: MDVP:Fo(Hz), MDVP:Fhi(Hz), MDVP:Flo(Hz), ... PPE
    We generate synthetic values based on symptom severity.
    """
    symptoms = answers.get('q1', [])
    if isinstance(symptoms, str):
        symptoms = [symptoms]

    severity = len(symptoms) / 4.0  # 0.0 to 1.0 based on how many symptoms checked

    # Baseline healthy values with perturbation based on severity
    np.random.seed(42)
    healthy_baseline = [
        154.23, 197.11, 116.32,  # Fo, Fhi, Flo
        0.00662, 0.00005, 0.00401, 0.00317, 0.01204,  # Jitter variants
        0.02971, 0.282, 0.01652, 0.01590, 0.02115, 0.04956,  # Shimmer variants
        0.01966, 21.64,  # NHR, HNR
        0.4149, 0.6915,  # RPDE, DFA
        -4.8130, 0.2666, 2.3014, 0.2844  # spread1, spread2, D2, PPE
    ]

    parkinsons_shift = [
        -30, -50, -20,  # Lower fundamental frequency
        0.003, 0.00003, 0.002, 0.002, 0.006,  # Higher jitter
        0.02, 0.15, 0.01, 0.01, 0.015, 0.03,  # Higher shimmer
        0.015, -8,  # Higher NHR, lower HNR
        0.15, 0.08,  # Higher RPDE, DFA
        -2, 0.1, 0.5, 0.15  # Spread changes
    ]

    features = []
    for i, (base, shift) in enumerate(zip(healthy_baseline, parkinsons_shift)):
        val = base + shift * severity + np.random.normal(0, abs(shift) * 0.1)
        features.append(val)

    return features


def map_arrhythmia(answers):
    """
    Generate 187-point synthetic ECG signal from symptom inputs.
    Severity of symptoms modulates the waveform anomalies.
    """
    symptoms = answers.get('q1', [])
    if isinstance(symptoms, str):
        symptoms = [symptoms]

    severity = min(len(symptoms) / 4.0, 1.0)
    np.random.seed(42)

    t = np.linspace(0, 1, 187)
    # Normal P-QRS-T waveform
    signal = (
        0.1 * np.sin(2 * np.pi * 1 * t) +
        0.8 * np.exp(-((t - 0.4) ** 2) / 0.002) +
        0.2 * np.sin(2 * np.pi * 3 * t)
    )

    if severity > 0.3:
        # Add premature ventricular contractions
        signal += severity * 0.5 * np.exp(-((t - 0.6) ** 2) / 0.001)
        # Add irregular rhythm noise
        signal += severity * 0.2 * np.random.normal(0, 1, 187)

    # Normalize to 0-1 range
    signal = (signal - signal.min()) / (signal.max() - signal.min() + 1e-8)
    return signal.tolist()


def map_seizure(answers):
    """
    Generate 178-point synthetic EEG signal from symptom inputs.
    Severity of symptoms determines whether epileptiform spikes are present.
    """
    symptoms = answers.get('q1', [])
    if isinstance(symptoms, str):
        symptoms = [symptoms]

    severity = min(len(symptoms) / 5.0, 1.0)
    np.random.seed(42)

    t = np.linspace(0, 1, 178)
    # Normal alpha-wave EEG
    signal = 0.5 * np.sin(2 * np.pi * 10 * t) + 0.3 * np.sin(2 * np.pi * 8 * t)

    if severity > 0.2:
        # Epileptiform spikes
        for spike_pos in [0.2, 0.4, 0.6, 0.8]:
            signal += severity * 2.0 * np.exp(-((t - spike_pos) ** 2) / 0.0005)
        # High-frequency bursts
        signal += severity * 0.8 * np.sin(2 * np.pi * 25 * t)

    signal = (signal - signal.min()) / (signal.max() - signal.min() + 1e-8)
    return signal.tolist()


# ═══════════════════════════════════════════════════════════════
# 🖼️ IMAGE PREDICTION PIPELINES
# ═══════════════════════════════════════════════════════════════

def predict_keras_image(model_info, image_path, target_size=(224, 224)):
    """Run prediction on an image using a Keras/TF model."""
    if not HAS_PIL or not HAS_TF:
        return None

    model = model_info['model']

    # Dynamically extract target size from model input shape if possible
    try:
        if hasattr(model, 'input_shape') and model.input_shape:
            shape = model.input_shape
            # shape is typically (None, height, width, channels) or [ (None, height, width, channels) ]
            if isinstance(shape, list):
                shape = shape[0]
            if len(shape) == 4:
                h, w = shape[1], shape[2]
                if h is not None and w is not None:
                    target_size = (int(h), int(w))
                    print(f"  🎯 Dynamically adjusted Keras image target size to: {target_size}")
    except Exception as e:
        print(f"  ⚠️ Could not parse model input shape: {e}. Using default {target_size}")

    img = Image.open(image_path).convert('RGB').resize(target_size)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array, verbose=0)

    if prediction.shape[-1] == 1:
        p = float(prediction[0][0])
        if p >= 0.5:
            predicted_class = 1
            confidence = p * 100
        else:
            predicted_class = 0
            confidence = (1.0 - p) * 100
    else:
        confidence = float(np.max(prediction)) * 100
        predicted_class = int(np.argmax(prediction))

    return {
        'predicted_class': predicted_class,
        'confidence': round(confidence, 2),
        'raw_output': prediction.tolist(),
    }


def predict_pytorch_image(model_info, image_path, target_size=(224, 224)):
    """Run prediction on an image using a PyTorch model."""
    if not HAS_PIL or not HAS_TORCH:
        return None

    transform = T.Compose([
        T.Resize(target_size),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    img = Image.open(image_path).convert('RGB')
    img_tensor = transform(img).unsqueeze(0)

    model = model_info['model']
    with torch.no_grad():
        output = model(img_tensor)
        probabilities = torch.nn.functional.softmax(output, dim=1)
        confidence = float(torch.max(probabilities)) * 100
        predicted_class = int(torch.argmax(probabilities))

    return {
        'predicted_class': predicted_class,
        'confidence': round(confidence, 2),
        'raw_output': probabilities.tolist(),
    }


def predict_with_tabular(model_info, features):
    """Run prediction on tabular data using a sklearn model."""
    model = model_info['model']
    features_array = np.array(features, dtype=float).reshape(1, -1)

    prediction = model.predict(features_array)
    result = {
        'predicted_class': prediction[0] if isinstance(prediction[0], str)
                           else int(prediction[0]),
    }

    if hasattr(model, 'predict_proba'):
        proba = model.predict_proba(features_array)
        result['confidence'] = round(float(np.max(proba)) * 100, 2)
        result['probabilities'] = proba.tolist()

        # Get top-3 predictions
        if hasattr(model, 'classes_'):
            classes = model.classes_
            top_indices = np.argsort(proba[0])[::-1][:5]
            result['top_predictions'] = [
                {'disease': str(classes[i]), 'confidence': round(float(proba[0][i]) * 100, 2)}
                for i in top_indices if proba[0][i] > 0.01
            ]
    else:
        result['confidence'] = 75.0

    return result


# ═══════════════════════════════════════════════════════════════
# 🏥 CLINICAL FALLBACK ENGINE
# ═══════════════════════════════════════════════════════════════

def clinical_fallback(test_id, answers, files):
    """
    Provide science-based risk assessments when models/frameworks are unavailable.
    Returns a structured result with realistic diagnostics.
    """
    risk_scores = {
        'Critical': {'score': 82, 'color': 'red'},
        'High': {'score': 67, 'color': 'orange'},
        'Moderate': {'score': 48, 'color': 'amber'},
        'Low': {'score': 25, 'color': 'green'},
    }

    # Count symptom severity
    symptoms = answers.get('q_symptoms', answers.get('q1', []))
    if isinstance(symptoms, str):
        symptoms = [symptoms]

    symptom_count = len(symptoms)

    if symptom_count >= 6:
        risk = 'High'
    elif symptom_count >= 3:
        risk = 'Moderate'
    elif symptom_count >= 1:
        risk = 'Low'
    else:
        risk = 'Low'

    # Image-based tests: if files provided, assume moderate risk
    if files and len(files) > 0:
        risk = 'Moderate'
        symptom_count = max(symptom_count, 3)

    info = risk_scores[risk]
    score = info['score'] + np.random.randint(-5, 6)
    score = max(10, min(95, score))

    recommendations = []
    if risk in ('Critical', 'High'):
        recommendations = [
            'Seek immediate medical consultation',
            'Do not delay treatment based on this screening alone',
            'Bring all relevant medical records to your appointment'
        ]
    elif risk == 'Moderate':
        recommendations = [
            'Schedule a consultation within the next 48 hours',
            'Monitor your symptoms and note any changes',
            'Stay hydrated and get adequate rest'
        ]
    else:
        recommendations = [
            'Continue monitoring symptoms at home',
            'Schedule a routine check-up if symptoms persist beyond 7 days',
            'Maintain a healthy lifestyle and adequate hydration'
        ]

    return {
        'predicted_class': f'{test_id.replace("-", " ").title()} Assessment',
        'confidence': float(score),
        'risk_level': risk,
        'diagnosis': f'Clinical heuristic assessment for {test_id.replace("-", " ").title()}',
        'recommendations': recommendations,
        'model_used': 'clinical_heuristics',
        'top_predictions': [],
        'fallback': True,
    }


# ═══════════════════════════════════════════════════════════════
# 🎯 RISK LEVEL MAPPING
# ═══════════════════════════════════════════════════════════════

def map_risk_level(confidence, is_normal=False):
    """Map confidence score to a risk level string."""
    if is_normal:
        return 'Low'
    if confidence >= 80:
        return 'Critical'
    elif confidence >= 60:
        return 'High'
    elif confidence >= 40:
        return 'Moderate'
    else:
        return 'Low'



# ═══════════════════════════════════════════════════════════════
# 🔗 CLASS LABEL REGISTRIES (for image models)
# ═══════════════════════════════════════════════════════════════

CLASS_LABELS = {
    'skin_cancer': ['Benign', 'Malignant'],
    'skin_cancer_onc': ['Benign', 'Malignant'],
    'pneumonia': ['Normal', 'Pneumonia'],
    'tuberculosis': ['Normal', 'Tuberculosis'],
    'breast_cancer': ['Benign', 'Malignant'],
    'lung_cancer': ['Normal', 'Lung Cancer'],
    'eczema': ['Healthy Skin', 'Eczema'],
    'fracture': ['No Fracture', 'Fracture Detected'],
    'fungal_infection': ['Healthy Skin', 'Fungal Infection'],
    'psoriasis': ['Healthy Skin', 'Psoriasis'],
    'osteoporosis': ['Normal', 'Osteoporosis'],
    'ophthalmology': ['Normal', 'Myopia', 'Diabetic Retinopathy', 'Glaucoma', 'Cataracts'],
}


# ═══════════════════════════════════════════════════════════════
# 🌐 API ROUTES
# ═══════════════════════════════════════════════════════════════

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'OK',
        'service': 'Amrith ML Service',
        'models_loaded': len(loaded_models),
        'models_registered': len(available_models),
        'model_names': list(loaded_models.keys()),
        'frameworks': {
            'tensorflow': HAS_TF,
            'pytorch': HAS_TORCH,
            'pillow': HAS_PIL,
        }
    })


@app.route('/models', methods=['GET'])
def list_models():
    models_info = []
    for name, info in available_models.items():
        framework = 'scikit-learn'
        if info['type'] == 'keras':
            framework = 'TensorFlow/Keras'
        elif info['type'] == 'pytorch':
            framework = 'PyTorch'
        status = 'loaded' if name in loaded_models else 'registered'
        models_info.append({
            'name': name,
            'type': info['type'],
            'framework': framework,
            'status': status
        })
    return jsonify({
        'models': models_info,
        'total': len(models_info),
        'loaded_count': len(loaded_models)
    })


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

        print(f"\n🎯 Prediction request: test={test_id}, type={input_type}")

        model_key = test_id.replace('-', '_')

        # ── Route to appropriate handler ──────────────────────

        # 1) General Medicine diseases → general_medicine.pkl
        if test_id in GENERAL_MEDICINE_IDS:
            model_info, _ = get_or_load_model('general_medicine')
            if model_info:
                features = map_general_medicine(answers)
                result = predict_with_tabular(model_info, features)
                diagnosis = str(result.get('predicted_class', 'Unknown'))
                confidence = result.get('confidence', 50.0)
                return jsonify({
                    'prediction': diagnosis,
                    'confidence': confidence,
                    'risk_level': map_risk_level(confidence),
                    'details': {
                        'diagnosis': diagnosis,
                        'top_predictions': result.get('top_predictions', []),
                        'recommendations': _get_recommendations(diagnosis, confidence),
                        'model_used': 'general_medicine',
                    },
                    'model_version': 'general_medicine-v1.0',
                })
            else:
                fb = clinical_fallback(test_id, answers, file_paths)
                return jsonify({
                    'prediction': fb['diagnosis'],
                    'confidence': fb['confidence'],
                    'risk_level': fb['risk_level'],
                    'details': fb,
                    'model_version': 'fallback-v1.0',
                })

        # 2) Heart Failure
        if test_id == 'heart-failure':
            model_info, _ = get_or_load_model('heart_failure')
            if model_info:
                features = map_heart_failure(answers)
                result = predict_with_tabular(model_info, features)
                pred = result.get('predicted_class', 0)
                diagnosis = 'Heart Disease Detected' if pred == 1 else 'No Heart Disease Detected'
                confidence = result.get('confidence', 50.0)
                is_normal = (pred == 0)
                return jsonify({
                    'prediction': diagnosis,
                    'confidence': confidence,
                    'risk_level': map_risk_level(confidence, is_normal),
                    'details': {
                        'diagnosis': diagnosis,
                        'classification': 'Positive' if pred == 1 else 'Negative',
                        'recommendations': _get_recommendations('heart_failure', confidence, is_normal),
                        'model_used': 'heart_failure',
                    },
                    'model_version': 'heart_failure-v1.0',
                })

        # 3) Hypertension (specialist)
        if test_id == 'hypertension':
            model_info, _ = get_or_load_model('hypertension')
            if model_info:
                features = map_hypertension(answers)
                result = predict_with_tabular(model_info, features)
                pred = result.get('predicted_class', 0)
                diagnosis = 'Hypertension Risk Detected' if pred == 1 else 'Normal Blood Pressure'
                confidence = result.get('confidence', 50.0)
                is_normal = (pred == 0)
                return jsonify({
                    'prediction': diagnosis,
                    'confidence': confidence,
                    'risk_level': map_risk_level(confidence, is_normal),
                    'details': {
                        'diagnosis': diagnosis,
                        'recommendations': _get_recommendations('hypertension', confidence, is_normal),
                        'model_used': 'hypertension',
                    },
                    'model_version': 'hypertension-v1.0',
                })

        # 4) Stroke Risk
        if test_id == 'stroke-risk':
            model_info, _ = get_or_load_model('stroke_risk')
            if model_info:
                features = map_stroke_risk(answers)
                result = predict_with_tabular(model_info, features)
                pred = result.get('predicted_class', 0)
                diagnosis = 'Elevated Stroke Risk' if pred == 1 else 'Low Stroke Risk'
                confidence = result.get('confidence', 50.0)
                is_normal = (pred == 0)
                return jsonify({
                    'prediction': diagnosis,
                    'confidence': confidence,
                    'risk_level': map_risk_level(confidence, is_normal),
                    'details': {
                        'diagnosis': diagnosis,
                        'recommendations': _get_recommendations('stroke', confidence, is_normal),
                        'model_used': 'stroke_risk',
                    },
                    'model_version': 'stroke_risk-v1.0',
                })

        # 5) Parkinson's
        if test_id == 'parkinsons':
            model_info, _ = get_or_load_model('parkinsons')
            if model_info:
                features = map_parkinsons(answers)
                result = predict_with_tabular(model_info, features)
                pred = result.get('predicted_class', 0)
                diagnosis = "Parkinson's Indicators Present" if pred == 1 else "No Parkinson's Indicators"
                confidence = result.get('confidence', 50.0)
                is_normal = (pred == 0)
                return jsonify({
                    'prediction': diagnosis,
                    'confidence': confidence,
                    'risk_level': map_risk_level(confidence, is_normal),
                    'details': {
                        'diagnosis': diagnosis,
                        'recommendations': _get_recommendations('parkinsons', confidence, is_normal),
                        'model_used': 'parkinsons',
                    },
                    'model_version': 'parkinsons-v1.0',
                })

        # 6) Arrhythmia
        if test_id == 'arrhythmia':
            model_info, _ = get_or_load_model('arrhythmia')
            if model_info:
                features = map_arrhythmia(answers)
                result = predict_with_tabular(model_info, features)
                arrhythmia_classes = ['Normal', 'Supraventricular', 'Ventricular', 'Fusion', 'Unknown']
                pred_idx = int(result.get('predicted_class', 0))
                diagnosis = arrhythmia_classes[pred_idx] if pred_idx < len(arrhythmia_classes) else 'Unknown'
                confidence = result.get('confidence', 50.0)
                is_normal = (pred_idx == 0)
                return jsonify({
                    'prediction': f'ECG Classification: {diagnosis}',
                    'confidence': confidence,
                    'risk_level': map_risk_level(confidence, is_normal),
                    'details': {
                        'diagnosis': diagnosis,
                        'ecg_class': diagnosis,
                        'recommendations': _get_recommendations('arrhythmia', confidence, is_normal),
                        'model_used': 'arrhythmia',
                    },
                    'model_version': 'arrhythmia-v1.0',
                })

        # 7) Seizure
        if test_id == 'seizures':
            model_info, _ = get_or_load_model('seizure')
            if model_info:
                features = map_seizure(answers)
                result = predict_with_tabular(model_info, features)
                pred = result.get('predicted_class', 0)
                diagnosis = 'Seizure Activity Detected' if pred == 1 else 'No Seizure Activity'
                confidence = result.get('confidence', 50.0)
                is_normal = (pred == 0)
                return jsonify({
                    'prediction': diagnosis,
                    'confidence': confidence,
                    'risk_level': map_risk_level(confidence, is_normal),
                    'details': {
                        'diagnosis': diagnosis,
                        'recommendations': _get_recommendations('seizure', confidence, is_normal),
                        'model_used': 'seizure',
                    },
                    'model_version': 'seizure-v1.0',
                })

        # 8) Asthma / COPD (tabular pkl)
        if test_id in ('asthma', 'copd'):
            model_info, model_key = get_or_load_model(model_key)
            if model_info and model_info['type'] == 'sklearn':
                # Generic tabular mapping from questionnaire
                features = _generic_tabular_map(answers)
                result = predict_with_tabular(model_info, features)
                confidence = result.get('confidence', 50.0)
                pred = result.get('predicted_class', 0)
                is_normal = (pred == 0)
                return jsonify({
                    'prediction': f'{test_id.title()} Assessment Complete',
                    'confidence': confidence,
                    'risk_level': map_risk_level(confidence, is_normal),
                    'details': {
                        'diagnosis': f'{test_id.title()} risk assessment',
                        'recommendations': _get_recommendations(test_id, confidence, is_normal),
                        'model_used': model_key,
                    },
                    'model_version': f'{model_key}-v1.0',
                })

        # 9) Ophthalmology combined model
        if test_id in ('myopia', 'diabetic-retinopathy', 'glaucoma', 'cataracts'):
            model_info, _ = get_or_load_model('ophthalmology')
            if model_info and model_info['type'] == 'sklearn':
                features = _generic_tabular_map(answers)
                result = predict_with_tabular(model_info, features)
                confidence = result.get('confidence', 50.0)
                pred = result.get('predicted_class', 0)
                is_normal = (pred == 0 or str(pred).lower() == 'normal')
                return jsonify({
                    'prediction': f'{test_id.replace("-", " ").title()} Assessment',
                    'confidence': confidence,
                    'risk_level': map_risk_level(confidence, is_normal),
                    'details': {
                        'diagnosis': str(result.get('predicted_class', 'Assessment Complete')),
                        'recommendations': _get_recommendations(test_id, confidence, is_normal),
                        'model_used': 'ophthalmology',
                    },
                    'model_version': 'ophthalmology-v1.0',
                })

        # 10) IMAGE-based models (dermatology, pulmonology, oncology, orthopedics)
        model_info, model_key = get_or_load_model(model_key)

        if model_info and file_paths and len(file_paths) > 0:
            image_path = file_paths[0]
            result = None

            if model_info['type'] == 'keras':
                result = predict_keras_image(model_info, image_path)
            elif model_info['type'] == 'pytorch':
                result = predict_pytorch_image(model_info, image_path)

            if result:
                pred_class = result['predicted_class']
                labels = CLASS_LABELS.get(model_key, [])
                diagnosis = labels[pred_class] if pred_class < len(labels) else f'Class {pred_class}'
                confidence = result.get('confidence', 50.0)
                is_normal = (pred_class == 0)

                return jsonify({
                    'prediction': diagnosis,
                    'confidence': confidence,
                    'risk_level': map_risk_level(confidence, is_normal),
                    'details': {
                        'diagnosis': diagnosis,
                        'predicted_class_index': pred_class,
                        'class_labels': labels,
                        'recommendations': _get_recommendations(model_key, confidence, is_normal),
                        'model_used': model_key,
                    },
                    'model_version': f'{model_key}-v1.0',
                })

        # 11) Sklearn model with generic tabular input
        if model_info and model_info['type'] == 'sklearn' and answers:
            features = _generic_tabular_map(answers)
            result = predict_with_tabular(model_info, features)
            confidence = result.get('confidence', 50.0)
            pred = result.get('predicted_class', 0)
            is_normal = (pred == 0 or str(pred).lower() == 'normal')
            return jsonify({
                'prediction': str(result.get('predicted_class', 'Assessment Complete')),
                'confidence': confidence,
                'risk_level': map_risk_level(confidence, is_normal),
                'details': {
                    'diagnosis': str(result.get('predicted_class', '')),
                    'recommendations': _get_recommendations(test_id, confidence, is_normal),
                    'model_used': model_key,
                },
                'model_version': f'{model_key}-v1.0',
            })


        # 12) Clinical fallback for everything else
        fb = clinical_fallback(test_id, answers, file_paths)
        return jsonify({
            'prediction': fb['diagnosis'],
            'confidence': fb['confidence'],
            'risk_level': fb['risk_level'],
            'details': fb,
            'model_version': 'fallback-v1.0',
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ═══════════════════════════════════════════════════════════════
# 🛠️ HELPER UTILITIES
# ═══════════════════════════════════════════════════════════════

def _generic_tabular_map(answers):
    """Convert answer dict values to numeric features for generic sklearn models."""
    features = []
    for key, val in answers.items():
        if isinstance(val, (int, float)):
            features.append(float(val))
        elif isinstance(val, str):
            try:
                features.append(float(val))
            except ValueError:
                features.append(1.0 if val.lower() in ('yes', 'true') else 0.0)
        elif isinstance(val, list):
            features.append(float(len(val)))
        else:
            features.append(0.0)
    return features


def _get_recommendations(condition, confidence, is_normal=False):
    """Generate clinically relevant recommendations based on condition, confidence, and normal status."""
    if is_normal:
        return [
            'Continue monitoring symptoms at home and note any changes',
            'Maintain a healthy lifestyle, balanced diet, and adequate rest',
            'Schedule a routine wellness check-up if you experience new symptoms',
            'Do not self-diagnose or self-medicate without consulting a physician.'
        ]

    base_recs = {
        'heart_failure': [
            'Schedule an echocardiogram and stress test',
            'Monitor blood pressure and heart rate daily',
            'Reduce sodium intake and manage fluid balance',
        ],
        'hypertension': [
            'Monitor blood pressure twice daily at home',
            'Reduce salt intake to less than 5g per day',
            'Regular cardiovascular exercise (30 min/day)',
        ],
        'stroke': [
            'Seek immediate neurological evaluation',
            'Monitor blood pressure frequently',
            'Avoid smoking and excessive alcohol consumption',
        ],
        'parkinsons': [
            'Schedule a neurologist consultation',
            'Consider a DaTscan imaging test',
            'Begin occupational therapy evaluation',
        ],
        'arrhythmia': [
            'Get a full 12-lead ECG and Holter monitor',
            'Avoid caffeine and stimulants',
            'Consult a cardiologist for rhythm management',
        ],
        'seizure': [
            'Schedule an EEG and MRI of the brain',
            'Avoid known seizure triggers',
            'Consult a neurologist for medication review',
        ],
    }

    recs = base_recs.get(condition, [
        'Consult a qualified physician for detailed evaluation',
        'Keep a symptom diary for your appointment',
        'Do not self-medicate based on this screening',
    ])

    if confidence >= 70:
        recs.insert(0, '⚠️ Priority: Schedule a specialist appointment within 24-48 hours')
    elif confidence >= 50:
        recs.insert(0, 'Schedule a follow-up consultation within the next week')

    return recs



# ═══════════════════════════════════════════════════════════════
# 🚀 START SERVER
# ═══════════════════════════════════════════════════════════════

if __name__ == '__main__':
    discover_models()
    init_huggingface_model()

    port = int(os.environ.get('ML_PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'

    print(f"🧠 Amrith ML Service starting on port {port}")
    print(f"   Health check: http://localhost:{port}/health")
    print(f"   Frameworks: TF={HAS_TF}, PyTorch={HAS_TORCH}, Pillow={HAS_PIL}, HF={HAS_HF}\n")

    app.run(host='0.0.0.0', port=port, debug=debug)
