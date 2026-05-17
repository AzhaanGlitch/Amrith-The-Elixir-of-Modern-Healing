import tensorflow as tf
from tensorflow.keras import layers, models
import os
import argparse

def train_image_classifier(dataset_name, model_name, epochs=15, batch_size=32, img_size=(224, 224)):
    print(f"\n========================================================")
    print(f"🎬 Initiating Deep Learning Training for: {model_name}.h5")
    print(f"📁 Dataset Directory: dataset/{dataset_name}")
    print(f"========================================================\n")

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dataset_path = os.path.join(base_dir, 'ML_Training', 'dataset', dataset_name)
    
    if not os.path.exists(dataset_path):
        print(f"❌ Error: Dataset path '{dataset_path}' does not exist!")
        print("Please download the dataset and place it in the appropriate folder.")
        return

    # 1. Load Train and Validation Datasets
    print("🔄 Loading images from subdirectories...")
    try:
        train_ds = tf.keras.utils.image_dataset_from_directory(
            dataset_path,
            validation_split=0.2,
            subset="training",
            seed=42,
            image_size=img_size,
            batch_size=batch_size,
            label_mode='categorical'
        )

        val_ds = tf.keras.utils.image_dataset_from_directory(
            dataset_path,
            validation_split=0.2,
            subset="validation",
            seed=42,
            image_size=img_size,
            batch_size=batch_size,
            label_mode='categorical'
        )
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        print("Ensure the folder contains subdirectories (one per class category).")
        return

    class_names = train_ds.class_names
    num_classes = len(class_names)
    print(f"\n✅ Successfully loaded {num_classes} classes: {class_names}")

    # 2. Performance Tuning (Prefetching & Caching)
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    # 3. Data Augmentation
    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.2),
        layers.RandomZoom(0.2),
    ])

    # 4. Model Architecture (Using MobileNetV2 for Fast, Premium Transfer Learning)
    print("\n🧠 Constructing CNN Architecture (MobileNetV2 Backbone)...")
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=img_size + (3,),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False  # Freeze base model layers

    # Build final model
    inputs = layers.Input(shape=img_size + (3,))
    x = data_augmentation(inputs)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)
    
    model = models.Model(inputs, outputs)

    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    model.summary()

    # 5. Training
    print(f"\n🚀 Training for {epochs} epochs...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs
    )

    # 6. Save Model to Production backend/ml_service/models/
    target_dir = os.path.join(base_dir, 'backend', 'ml_service', 'models')
    os.makedirs(target_dir, exist_ok=True)
    
    model_path = os.path.join(target_dir, f"{model_name}.h5")
    model.save(model_path)
    
    print(f"\n🏆 Success! Deep Learning Model securely saved to: {model_path}")
    print(f"🎯 Classes trained: {class_names}")
    print(f"📈 Final Validation Accuracy: {history.history['val_accuracy'][-1]*100:.2f}%")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Amrith Deep Learning Image Model Trainer")
    parser.add_argument("--dataset", required=True, help="Name of directory inside ML_Training/dataset/")
    parser.add_argument("--model", required=True, help="Filename of the saved .h5 model (e.g. skin_cancer)")
    parser.add_argument("--epochs", type=int, default=10, help="Number of training epochs")
    
    args = parser.parse_args()
    train_image_classifier(args.dataset, args.model, epochs=args.epochs)
