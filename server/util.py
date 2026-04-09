import json
import joblib
import numpy as np

__model = None
__data_columns = None

def load_saved_artifacts():
    global __model
    global __data_columns
    with open('columns.json', 'r') as f:
        __data_columns = json.load(f)['data_columns']
    __model = joblib.load('banglore_home_prices_model.pkl')
    print("Model loaded")

def get_location_names():
    return __data_columns[3:]

def predict_price(location, sqft, bath, bhk):
    X_input = np.zeros(len(__data_columns))
    X_input[0] = sqft
    X_input[1] = bath
    X_input[2] = bhk
    loc_index = __data_columns.index(location)
    X_input[loc_index] = 1
    return round(__model.predict([X_input])[0], 2)

if __name__ == '__main__':
    load_saved_artifacts()
    print(get_location_names())