from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the lung cancer model using chest CT scans
    train_image_classifier(
        dataset_name="lung_cancer", 
        model_name="lung_cancer", 
        epochs=15
    )
