import joblib
import numpy as np
from tensorflow.keras.models import load_model
from scipy.stats import mode

symptoms = [['раздражение в анусе']]

random_symptoms_data = [
    ['кашель', 'головная боль', 'общая слабость', 'озноб', 'потеря аппетита', 'зуд в горле', 'головокружение', 'мокрота'],
    ['боль в груди','сжимающая боль в груди','одышка','учащенный пульс','мушки перед глазами','холодный пот','повышенное давление'],
    ['запор', 'боль во время дефекации', 'появление крови в стуле', 'обезвоживание', 'диарея', 'раздражение в анусе'],
    ['раздражение в анусе'],
    ['выделение гноя из уха'],
    ['утрата брюшных рефлексов'],
    ['изменение характера выделений из влагалища']
]

# Загружаем модели
mlb = joblib.load('models/mlb.pkl')
lbe = joblib.load('models/lbe.pkl')

models = list()
models.append(joblib.load('models/model_svc.pkl'))
models.append(joblib.load('models/model_rf.pkl'))
models.append(joblib.load('models/model_xgb.pkl'))
models.append(load_model('models/model_mlp.keras'))

# Получаем hard voiting прогноз с помощью моды
symptoms_encode = mlb.transform(symptoms)

predicts = [model.predict(symptoms_encode) for model in models]
predicts[3] = np.array(np.argmax(predicts[3]))

print(predicts)
# predicts[3] = np.array(5)
# predicts[2] = np.array(7)

predicts_fixed = [np.array(p).ravel() for p in predicts]
predicts_transponent = np.array(predicts_fixed).T

final_predict = mode(predicts_transponent, axis=1).mode.ravel()

final_predict_spec = lbe.inverse_transform(final_predict)

if predicts.count(final_predict) == 3 or predicts.count(final_predict) == 4:
    print("Большая вероятность необходимости посещения данного специалиста:", final_predict_spec)
elif predicts.count(final_predict) == 2:
    print("Средняя вероятность необходимости посещения данного специалиста:", final_predict_spec)
elif predicts.count(final_predict) == 1:
    print("Программа не смогла определить для вас подходящего специалиста")