import os
import sys
import subprocess
from flask import Flask, send_from_directory
from flask_cors import CORS

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__, static_folder=None)
CORS(app)

# Register API
from api.routes import api
app.register_blueprint(api)

# Serve frontend
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend")

@app.route("/")
def serve_index():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(FRONTEND_DIR, path)


# Auto-generate data if not exists on import (for gunicorn)
_data_path = os.path.join(os.path.dirname(__file__), "data", "villages.json")
if not os.path.exists(_data_path):
    from data.generate_data import DataGenerator
    gen = DataGenerator()
    gen.generate()

if __name__ == "__main__":
    print("=" * 60)
    print("  PETA-EBT Dashboard Server")
    print("  Buka di browser: http://127.0.0.1:5000")
    print("  API:             http://127.0.0.1:5000/api/health")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000)
