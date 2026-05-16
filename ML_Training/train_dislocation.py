from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the dislocation model using joint X-ray images
    train_image_classifier(
        dataset_name="dislocation", 
        model_name="dislocation", 
        epochs=15
    )
