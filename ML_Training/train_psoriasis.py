from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the psoriasis model using skin plaque images
    train_image_classifier(
        dataset_name="psoriasis", 
        model_name="psoriasis", 
        epochs=15
    )
