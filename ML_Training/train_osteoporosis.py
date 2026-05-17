from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the osteoporosis model using bone density / X-ray images
    train_image_classifier(
        dataset_name="osteoporosis", 
        model_name="osteoporosis", 
        epochs=15
    )
