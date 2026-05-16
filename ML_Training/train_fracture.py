from train_image_model import train_image_classifier

if __name__ == "__main__":
    # Trains the fracture model using bone X-ray images (e.g. MURA dataset)
    train_image_classifier(
        dataset_name="fracture", 
        model_name="fracture", 
        epochs=15
    )
