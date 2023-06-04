from typing import Union
from typing import List
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prompt import PROMPT
import os
import openai
from pydantic_models import ComponentGraph
from utils import *
from graphs import *

# uvicorn main:app --reload


openai.api_key = os.environ.get("OPENAI_API_KEY", "fake_key")
FAKE_OAI_RESPONSE = True

app = FastAPI()

origins = [
    "http://localhost:3000" # React dev 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/provenance/chatgpt")
def provenance(component_graph: ComponentGraph):
    # save component graph to a local json file
    
    p = PROMPT.format(json_data=component_graph.json())
    if not FAKE_OAI_RESPONSE:
        completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
                {"role": "user", "content": p},
            ],
        temperature=0.0,
        )
        as_json = json.loads(completion.choices[0].message["content"].replace('\n', ''))
    else:
        with open("chatgpt_onboarding_traversal.json", "r") as f:
            as_json = json.load(f)
    for v in as_json:
        type_ = lookup_type(v["title"], component_graph.visuals)
        v["type"] = type_
    return {"order": as_json}


@app.post("/provenance/dfs")
def provenance_dfs(component_graph: ComponentGraph):
    # save component graph to a local json file
    cg = component_graph.dict()
    STRATEGY = "DFS" 
    return get_traversal(cg, STRATEGY)

@app.post("/provenance/bfs")
def provenance_bfs(component_graph: ComponentGraph):
    # save component graph to a local json file
    cg = component_graph.dict()
    STRATEGY = "BFS" # BFS or DFS
    return get_traversal(cg, STRATEGY)