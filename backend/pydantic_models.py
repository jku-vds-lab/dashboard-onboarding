from pydantic import BaseModel
from typing import List

class Interactions(BaseModel):
    sequence: List[List[str]]

class Visual(BaseModel):
    description: str
    title: str
    type: str
    task: str
    mark: str
    attributes: List[str]

class ComponentGraph(BaseModel):
    layout: str
    purpose: str
    task: str 
    visuals: List[Visual]
    interactions: List[Interactions]