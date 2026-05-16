from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the fungal infection model using skin rash images
    train_image_classifier(
        dataset_name="fungal_infection", 
        model_name="fungal_infection", 
        epochs=15
    )
