from pydantic_models import Visual
from typing import List

def lookup_type(visual_name: str, components: List[Visual]):
    try:
        for component in components:
            if component["title"] == visual_name:
                return component["type"]
    except Exception:
        for component in components:
            if component.title == visual_name:
                return component.type
    return None