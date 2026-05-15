from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the COPD model using chest CT scan or clinical images
    train_image_classifier(
        dataset_name="copd", 
        model_name="copd", 
        epochs=15
    )
