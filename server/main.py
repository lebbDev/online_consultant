import sys
from pathlib import Path
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

sys.path.append(str(Path(__file__).resolve().parent / "predict-service"))
from predict import predict_spec

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модель входных данных
class UserData(BaseModel):
    gender: str
    age: str

class UserSymptoms(BaseModel):
    value: str
    label: str

user_data = None

# Обработка POST-запроса
@app.post("/data")
async def receive_data(data: UserData):
    global user_data
    user_data = data
    
    if data.gender == "man":
        json_path = "json_data/man_symptoms.json"
    elif data.gender == "woman":
        json_path = "json_data/woman_symptoms.json"
    else: return {"error": "Неправильный ввод"}
    
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        return {"error": "JSON файл не найден"}
    except json.JSONDecodeError:
        return {"error": "Ошибка при чтении JSON файла"}

@app.post("/predict")
async def receive_symptoms(symptoms: List[UserSymptoms]):
    try:
        predict_input = [[symptom.value for symptom in symptoms]]
        predict_res = predict_spec(predict_input)

        if int(user_data.age) >= 18:
            predict_res["second_spec"] = "Терапевт"
        else:
            predict_res["second_spec"] = "Педиатр"

        return predict_res
    except Exception as e:
        return e