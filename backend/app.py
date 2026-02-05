from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Flask backend is running 🚀",
        "service": "backend",
        "version": "1.0.0"
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "backend"
    })

# ✅ API ROUTE (THIS IS THE KEY FIX)
@app.route("/api/submit", methods=["POST"])
def submit():
    try:
        if request.is_json:
            payload = request.get_json()
        else:
            payload = request.form.to_dict()

        logger.info(f"Received from frontend: {payload}")

        if "data" not in payload:
            return jsonify({
                "status": "error",
                "message": "Missing 'data' field"
            }), 400

        return jsonify({
            "status": "success",
            "received_data": payload["data"]
        }), 200

    except Exception as e:
        logger.error(str(e))
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5002,          
        debug=False,
        use_reloader=False
    )
