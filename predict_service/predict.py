import joblib
from sklearn.pipeline import Pipeline
import numpy as np
import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer, LabelEncoder
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import load_model
from scipy.stats import mode

symptoms = [['кашель', 'головная боль', 'общая слабость', 'озноб', 'потеря аппетита', 'зуд в горле', 'головокружение', 'мокрота']]

random_symptoms_data = [
    ['кашель', 'головная боль', 'общая слабость', 'озноб', 'потеря аппетита', 'зуд в горле', 'головокружение', 'мокрота'],
    ['боль в груди','сжимающая боль в груди','одышка','учащенный пульс','мушки перед глазами','холодный пот','повышенное давление'],
    ['запор', 'боль во время дефекации', 'появление крови в стуле', 'обезвоживание', 'диарея', 'раздражение в анусе'],
    ['раздражение в анусе'],
    ['выделение гноя из уха'],
    ['утрата брюшных рефлексов'],
    ['изменение характера выделений из влагалища']
]

mlb = joblib.load('models/mlb.pkl')
lbe = joblib.load('models/lbe.pkl')

models = list()
models.append(joblib.load('models/model_svc.pkl'))
models.append(joblib.load('models/model_rf.pkl'))
models.append(joblib.load('models/model_xgb.pkl'))
models.append(load_model('models/model_mlp.keras'))


symptoms_encode = mlb.transform(symptoms)
# print(len(symptoms_encode))
# print(len(symptoms_encode[0]))
# print(symptoms_encode[0])
# print(symptoms_encode[1])
# Получаем предсказания от всех моделей
predicts = [model.predict(symptoms_encode) for model in models]
predicts[3] = np.array(np.argmax(predicts[3]))
print(predicts)

predicts_fixed = [np.array(p).ravel() for p in predicts]
# # Преобразуем в (n_samples, n_models)
preds_array = np.array(predicts_fixed).T
print(preds_array)
# Считаем моду (наиболее частое значение по строкам)
final_preds = mode(preds_array, axis=1).mode.ravel()
print(final_preds)