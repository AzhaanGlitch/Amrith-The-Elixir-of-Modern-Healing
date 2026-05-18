from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the skin cancer model using dermoscopy images (e.g. HAM10000)
    train_image_classifier(
        dataset_name="skin_cancer", 
        model_name="skin_cancer", 
        epochs=15
    )
