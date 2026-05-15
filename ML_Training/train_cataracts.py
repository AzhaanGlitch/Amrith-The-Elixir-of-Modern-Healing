from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the cataracts model using slit-lamp eye lens images
    train_image_classifier(
        dataset_name="cataracts", 
        model_name="cataracts", 
        epochs=15
    )
