#!/bin/bash
echo "==============================================="
echo " Starting ScriptureOS Analysis Engine (NLP)    "
echo "==============================================="

# Use pyenv Python 3.12.6
PYTHON_BIN="/Users/davisntirubaza/.pyenv/versions/3.12.6/bin/python"

if [ ! -f "$PYTHON_BIN" ]; then
    echo "Error: Python 3.12.6 not found. Please ensure it is installed via pyenv."
    exit 1
fi

echo "Using Python 3.12.6..."

# First, run a quick script to download the NLP models so it doesn't freeze the API server
cat << 'EOF' > predownload.py
from transformers import pipeline
import sys

print("Checking local NLP models...")
try:
    qa = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")
    print("NLP Models are ready!")
except Exception as e:
    print(f"Error loading models: {e}")
    sys.exit(1)
EOF

"$PYTHON_BIN" predownload.py

if [ $? -eq 0 ]; then
    echo "Starting Server..."
    "$PYTHON_BIN" studio.py
else
    echo "Failed to start server. Are torch and transformers installed?"
fi
