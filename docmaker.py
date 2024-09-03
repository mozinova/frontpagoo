import http.client
import json
from extractText import template,historyText
import re

# Sua chave de API
API_KEY = "AIzaSyBSNBu_SKxPEez2THdtu3eVtZtjyG0_QDo"
instruction=f"Você é um criador de trabalhos de pesquisa escolar, Torne todas informações muito longas, não use sua marcação markdown, use [[, para títulos, como [[ titulo ]], outros cabeçalhos use [ cabeçalho ], para outro títulos secundarios e outros mais baixos use [[[ título secundario ]]], para paragrafos use << paragrafo >>, para links use {{ link }}, para italico <i> italico </i>, negrito <b> negrito </b>, para sublinhado <u> sublinhado </u>, e outras partes use marcação html."


def prompt(text):
  # Dados para enviar na requisição
  data = {
    "contents": [
        {
            "role": "user",
            "parts": [
                {
                    "text": text
                }
            ]
        }
    ],
    "systemInstruction":{
    "role":"user",
    "parts":[
    {
    "text":instruction
    }
    ]
    }
    ,
    "generationConfig": {
        "temperature": 1,
        "topK": 64,
        "topP": 0.95,
        "maxOutputTokens": 20000,
        "responseMimeType": "text/plain"
    }
    
  }
  json_data = json.dumps(data)
  headers = {
    'Content-Type': 'application/json'
    
  }
  conn = http.client.HTTPSConnection("generativelanguage.googleapis.com")
  conn.request("POST", f"/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}", json_data, headers)
  response = conn.getresponse()
  response_data = response.read().decode("utf-8")
  conn.close()
  msg=json.loads(response_data).get("candidates")[0].get("content").get("parts")[0].get('text')
  nova_string=msg.replace("*","").replace("#","")
  return nova_string

  
  
def get_prompt():
    prompt=input("insira um prompt;\n")
    return prompt
  
def chaty():
    p=get_prompt().split(",")
    get_msg=prompt(template.format(tema=p[0],subject=p[1]))
    print("\n",get_msg)
    pr=input('')
    chat()
    
def extractTopics(text,regex):
    parts = re.findall(regex, text)
    return parts
    
def prompt_turbo(tema):
    #script for docmaker Turbo
    initPrompt=F"Forneça os temas que devem estar  apenas no Densevolvimento de um trabalho de pesquisa escolar, sobre '{tema}', separe fos temas por vírgulas e não fale nada.."
    text=prompt(initPrompt)
   # topics1=extractTopics(text,r'\[\[\[(.*?)\]\]\]')
    #topics=extractTopics(text,r"\[\[(.*?)\]\]")
    text=text.replace("[[","")
    text=text.replace("]]","")
    topics=text.split(",")
    topics1=["introdução","objectivos do trabalho","metodologia de pesquisa"]
    for x in topics:
        topics1.append(x)
    topics=topics1
    info_prompt="Faça a parte da {topic}, para um trabalho de pequisa escolar sobre {tema}, faça uma {topic},com foco em mocambique, longa, citando sempre as referencias dentro de parentises no fim de cada definicao ou informacao para previnir plagio, não coloque nenhuma observacao, o trabalho deve parecer ser feito por alunos sem usar AI, use palavras e esvritas da lingua portuguesa (português potugal)."
    conclusao_add=False
    topics[3]=""
    info=[]
    for item in topics:
        if len(topics) == len(info):
            if conclusao_add is False:
                info.append("Conclusão")
                conclusao_add=True
                
        if  item!='':
            print("A trabalhar em",item)
            p=prompt(info_prompt.format(topic=item,tema=tema))
            info.append(p)
            print('Fim de',item)
    promptBibliografia=f"Crie uma referencia bibliografica, contendo links para sites em portugues onde pode se encontrar informação sobre {tema} com foco em mocambique, nao fale nada apenas mande os links."
    print("A trabalhar em bibliografia")
    info.append(prompt(promptBibliografia))
    print("Fim")
    return " ".join(info)
    
    
    
from flask import Blueprint, request
appBp=Blueprint("docmaker",__name__)


@appBp.route("/docmaker/turbo")
def turbo():
    qr=request.args.get("qr")
    if qr=="":
        return "introducao invalido"
    else:
        return prompt_turbo(qr)
@appBp.route("/docmaker/mini")
def chat():
    
    qr=request.args.get("qr")
    if qr=="" or qr==None:
        return "Invalid data"
    else:
        return "prompt:"+prompt(template.format(tema=qr))
        
if __name__=="__main__":
    #print(template.format(tema="andebol",subject="Fisica"))
    pass
    