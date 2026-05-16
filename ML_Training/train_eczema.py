from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the eczema model using skin condition images
    train_image_classifier(
        dataset_name="eczema", 
        model_name="eczema", 
        epochs=15
    )
