import pandas as pd
import json

dataset = pd.read_csv("../../data/doctor_vs_symptoms.csv", sep=";", encoding="cp1251")

dataset['Симптомы'] = dataset[["Симптом 1","Симптом 2","Симптом 3","Симптом 4","Симптом 5","Симптом 6","Симптом 7","Симптом 8","Симптом 9",
                               "Симптом 10","Симптом 11","Симптом 12","Симптом 13","Симптом 14","Симптом 15"]].agg(lambda symp: ';'.join(symp.dropna().astype(str)), axis=1)

symptoms_all = list()

dataset['Симптомы'].apply(lambda x: [symptoms_all.append(symptom) for symptom in x.split(';')])
symptoms = sorted(set(symptoms_all), key=str.lower)
symptom_objects = [{"value": s, "label": s.capitalize()} for s in symptoms]

with open('json_data/all_symptoms.json', 'w', encoding='utf-8') as f:
    json.dump(symptom_objects, f, ensure_ascii=False, indent=4)