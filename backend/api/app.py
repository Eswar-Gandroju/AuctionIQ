from flask import Flask
from flask_cors import CORS
from routes.recommend import recommend_bp 

app = Flask(__name__)

# 🛠️ IMPROVED CORS: Explicitly allow the React Dev Server and JSON Headers
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

app.register_blueprint(recommend_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)