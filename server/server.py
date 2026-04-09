from flask import Flask, request, jsonify
from flask_cors import CORS
import util

app = Flask(__name__)
CORS(app)

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    return jsonify({'locations': util.get_location_names()})

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    data = request.get_json()
    price = util.predict_price(
        data['location'],
        float(data['total_sqft']),
        int(data['bath']),
        int(data['bhk'])
    )
    return jsonify({'estimated_price': price, 'status': 'success'})

if __name__ == '__main__':
    util.load_saved_artifacts()
    app.run(host='0.0.0.0', port=5000, debug=True)