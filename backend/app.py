import os
import sys
from flask import Flask, send_from_directory
from flask_cors import CORS

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__, static_folder=None)
CORS(app)

from api.routes import api
app.register_blueprint(api)

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist")

@app.route("/")
def serve_index():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return send_from_directory(FRONTEND_DIR, "index.html")
    return {"error": "Frontend not built yet. Run: cd frontend && npm run build"}, 503

@app.route("/<path:path>")
def serve_static(path):
    if path.startswith("api/"):
        return {"error": "Not found"}, 404
    file_path = os.path.join(FRONTEND_DIR, path)
    if os.path.exists(file_path):
        return send_from_directory(FRONTEND_DIR, path)
    return send_from_directory(FRONTEND_DIR, "index.html")



if __name__ == "__main__":
    print("=" * 60)
    print("  PETA-EBT Dashboard Server (AHP v2)")
    print("  Backend API: http://127.0.0.1:5000")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=True)
