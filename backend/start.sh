#!/bin/sh

echo ""
echo "===== Application Startup at $(date -u '+%Y-%m-%d %H:%M:%S') ====="
echo ""

# Start the Python ML Service in the background
echo "🧠 Starting Amrith ML Service on port 5001..."
cd /app/ml_service
python3 app.py &
ML_PID=$!

# Wait for ML service to boot up (needs time to download models from HF Hub)
echo "⏳ Waiting for ML service to initialize..."
sleep 15

# Verify ML service is running
if kill -0 $ML_PID 2>/dev/null; then
    echo "✅ ML Service is running (PID: $ML_PID)"
else
    echo "⚠️  ML Service process exited — Node.js will still start (ML fallbacks will activate)"
fi

# Start the Node.js Express API Server in the foreground
echo ""
echo "🏥 Starting Amrith Node.js Express API on port 7860..."
cd /app
exec npm start
