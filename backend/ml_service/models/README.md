# Place your trained ML model files here
# 
# Naming convention:
#   The filename (without extension) should match the test ID from the frontend.
#   Hyphens in test IDs are converted to underscores when looking up models.
#
# Examples:
#   heart_failure.pkl    → matches test ID "heart-failure" (tabular/sklearn)
#   pneumonia.h5         → matches test ID "pneumonia" (image/keras)
#   skin_cancer.h5       → matches test ID "skin-cancer" (image/keras)
#   fever.pkl            → matches test ID "fever" (tabular/sklearn)
#   headache.pkl         → matches test ID "headache" (tabular/sklearn)
#
# Supported formats:
#   .h5   → TensorFlow/Keras models (typically for IMAGE input types)
#   .pkl  → scikit-learn models (typically for TABULAR input types)
#
# The ML service (app.py) will auto-discover and load all models from this directory.
