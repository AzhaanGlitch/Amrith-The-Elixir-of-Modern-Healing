from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the breast cancer model using mammogram or breast ultrasound images
    train_image_classifier(
        dataset_name="breast_cancer", 
        model_name="breast_cancer", 
        epochs=15
    )
