import sys
import os

# Add the current directory to sys.path to make 'app' importable
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.main import app

# This is required for Vercel to find the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
