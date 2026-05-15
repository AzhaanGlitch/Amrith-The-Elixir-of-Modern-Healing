from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the asthma model using pulmonary image / chest X-ray / CT data
    train_image_classifier(
        dataset_name="asthma", 
        model_name="asthma", 
        epochs=15
    )
