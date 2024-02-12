from flask import Flask, request, jsonify
from keras.models import load_model
import keras
import numpy as np
import cv2 as cv

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    model = request.form['model']
    image = request.form['image']
    
    model = keras.models.load_model("../uploads/"+model)
    config = model.get_config() # Returns pretty much every information about your model
    shape = config["layers"][0]["config"]["batch_input_shape"] # returns a tuple of width, height and channels
    
    image = cv.imread("../uploads/"+image)
    print("image originale shape:", image.shape)
    
    image = cv.resize(image, (shape[1], shape[2]))
    print("resized image shape:", image.shape)
    
    # input_arr = keras.preprocessing.image.img_to_array()
    prediction = model.predict(np.array([image]))[0]
    
    # return jsonify(prediction.tolist())
    return jsonify(str(prediction))

if __name__ == '__main__':
    app.run(port=5000)