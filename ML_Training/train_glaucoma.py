from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the glaucoma model using fundus ophthalmic images
    train_image_classifier(
        dataset_name="glaucoma", 
        model_name="glaucoma", 
        epochs=15
    )
