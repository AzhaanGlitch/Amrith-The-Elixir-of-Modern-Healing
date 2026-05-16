from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the diabetic retinopathy model using retinal fundus images (e.g. APTOS 2019)
    train_image_classifier(
        dataset_name="diabetic_retinopathy", 
        model_name="diabetic_retinopathy", 
        epochs=15
    )
