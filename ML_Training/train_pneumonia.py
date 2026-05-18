from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the pneumonia model using chest X-ray images
    train_image_classifier(
        dataset_name="pneumonia", 
        model_name="pneumonia", 
        epochs=15
    )
