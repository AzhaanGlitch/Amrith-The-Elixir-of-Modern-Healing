from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the arthritis model using joint / knee X-ray images
    train_image_classifier(
        dataset_name="arthritis", 
        model_name="arthritis", 
        epochs=15
    )
