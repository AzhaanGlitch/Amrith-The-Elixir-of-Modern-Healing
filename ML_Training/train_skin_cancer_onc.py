from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the skin cancer (oncology clinical) model using dermoscopic / histopathological images
    train_image_classifier(
        dataset_name="skin_cancer_onc", 
        model_name="skin_cancer_onc", 
        epochs=15
    )
