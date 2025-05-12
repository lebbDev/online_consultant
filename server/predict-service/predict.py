import joblib
import numpy as np
from tensorflow.keras.models import load_model
from scipy.stats import mode

def predict_spec(symptoms):
    # Загружаем модели
    mlb = joblib.load('predict-service/models/mlb.pkl')
    lbe = joblib.load('predict-service/models/lbe.pkl')

    models = list()
    models.append(joblib.load('predict-service/models/model_svc.pkl'))
    models.append(joblib.load('predict-service/models/model_rf.pkl'))
    models.append(joblib.load('predict-service/models/model_xgb.pkl'))
    models.append(load_model('predict-service/models/model_mlp.keras'))

    # Получаем hard voiting прогноз с помощью моды
    symptoms_encode = mlb.transform(symptoms)
    
    predicts = [model.predict(symptoms_encode) for model in models]
    predicts[3] = np.array(np.argmax(predicts[3]))
    #print(predicts)

    predicts_fixed = [np.array(p).ravel() for p in predicts]
    predicts_transponent = np.array(predicts_fixed).T

    final_predict = mode(predicts_transponent, axis=1).mode.ravel()
    final_predict_spec = lbe.inverse_transform(final_predict)

    if predicts.count(final_predict) == 3 or predicts.count(final_predict) == 4:
        return {"prob": "high", "spec": str(final_predict_spec[0])}
    elif predicts.count(final_predict) == 2:
        return {"prob": "average", "spec": str(final_predict_spec[0])}
    elif predicts.count(final_predict) == 1:
        return {"prob": "low", "spec": ""}