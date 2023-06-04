import networkx as nx
import matplotlib.pyplot as plt

from utils import lookup_type

def flatten(interactions):
    # interactions is a list of dictionaries
    # each dictionary has a key 'sequence' with a list of lists of strings
    # we want to flatten this to a list of lists of strings
    flattened = []
    for i in interactions:
        flattened.extend(i['sequence'])
    return flattened

def traverse(transitions, order = 'BFS'):
    G = nx.DiGraph()
    # Add edges to the graph
    for transition in transitions:
        t1 = transition[0].split(" -")[0]
        t2 = transition[1].split(" -")[0]
        G.add_edge(t1, t2)
    print("GRAPH:")
    print(G)
    print(G.edges())
    print("ENDGRAPH")
    # Get the order of nodes
    if order == 'BFS':
        nodes = list(nx.bfs_tree(G, 'Root'))
    elif order == 'DFS':
        nodes = list(nx.dfs_tree(G, 'Root'))
    
    return nodes


def get_traversal(cg, strategy):
    visuals = [v["title"] for v in cg["visuals"]]
    pairs = flatten(cg["interactions"])
    print(cg["interactions"])
    print(pairs)
    order = traverse(pairs, order=strategy)
    exclude = ['Data Changed', 'Page Reloaded', 'Root']
    order = [word.split(' (')[0] for word in order if word not in exclude]
    print(order)
    for v in visuals:
        if v not in order:
            order.append(v)
    as_json = []
    explanation = {"general": "NaN", "dependencies": "NaN", "insight": "NaN"}
    for v in order:
        d = {"title": v, "type": lookup_type(v, cg["visuals"]), "explanation": explanation}
        as_json.append(d)
    return {"order": as_json}
