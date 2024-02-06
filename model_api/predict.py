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
    image = cv.imread("../uploads/"+image)
    cv.imshow("test", image)
    # input_arr = keras.preprocessing.image.img_to_array()
    prediction = model.predict([image])[0]
    # return jsonify(prediction.tolist())
    return jsonify(str(prediction))

if __name__ == '__main__':
    app.run(port=5000)