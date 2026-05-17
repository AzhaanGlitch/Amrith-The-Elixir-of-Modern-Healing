from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the myopia model using fundus eye images
    train_image_classifier(
        dataset_name="myopia", 
        model_name="myopia", 
        epochs=15
    )
