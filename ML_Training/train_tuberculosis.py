from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the tuberculosis model using chest X-ray images
    train_image_classifier(
        dataset_name="tuberculosis", 
        model_name="tuberculosis", 
        epochs=15
    )
