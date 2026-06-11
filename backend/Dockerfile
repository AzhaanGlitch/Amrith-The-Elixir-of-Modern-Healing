# Use python:3.10-slim as the base image for a lightweight, stable runtime
FROM python:3.10-slim

# Install system dependencies, curl, dos2unix, and Node.js in a single layer
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    dos2unix \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Node.js package configuration files
COPY package*.json ./

# Install Node.js production dependencies
RUN npm ci --only=production

# Copy Python requirements file
COPY ml_service/requirements.txt ./ml_service/requirements.txt

# Install Python dependencies:
# 1. Install CPU-only PyTorch wheels first (saves ~2GB vs full CUDA build)
# 2. Install CPU-only TensorFlow
# 3. Install remaining requirements (which deliberately exclude tf/torch)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir tensorflow-cpu>=2.12.0 && \
    pip install --no-cache-dir -r ml_service/requirements.txt

# Copy the rest of the backend files
COPY . .

# Expose port 7860 (Hugging Face Spaces default port)
EXPOSE 7860

# Define essential runtime environment variables
ENV PORT=7860
ENV ML_PORT=5001
ENV ML_SERVICE_URL=http://localhost:5001
ENV NODE_ENV=production
ENV FLASK_DEBUG=false
ENV HF_HOME=/app/.cache/huggingface
ENV TF_ENABLE_ONEDNN_OPTS=0
ENV HF_MODELS_REPO=AzhaanGlitch/amrith-models
ENV CLIENT_URL=https://amrith-modern-healing.vercel.app

# Create uploads and cache directories with proper permissions
RUN mkdir -p uploads .cache/huggingface && chmod -R 777 uploads .cache/huggingface

# Ensure start.sh has executable permissions and unix line endings
RUN chmod +x start.sh && dos2unix start.sh

# Run startup script
CMD ["./start.sh"]
