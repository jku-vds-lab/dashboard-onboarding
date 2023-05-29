PROMPT = """
You are developing an onboarding process that aims to explain visualizations on a dashboard to users with little to no experience with visualization tools. 
The dashboard's structure is represented as a JSON array with the following structure: 
 - layout: a string that describes the number of visuals and global filters on the dashboard;
 - purpose: a string that describes the purpose of the dashboard;
 - task: a string that describes the task the dashboard is designed to support;
 - visuals: an array of objects that represent the visuals on the dashboard. Each object has the following structure:
    - description: a string that describes the visual;
    - title: a string that describes the visual's title;
    - type: a string that describes the visual's type;
    - task: a string that describes the task the visual is designed to support;
    - mark: a string that describes the visual's mark;
    - attributes: an array of strings that describe the visual's attributes/fields;
- interactions: an array of objects that reflects the pairs of visuals that we obtained based on the previous users' interactions with the dashboard. Each object has the following structure:
    - sequence: an array of arrays of strings that represent the sequence of interactions between two visuals. Each array of strings represents a transitiob between two visuals. Each string represents a visual. The string is of a following format `<VISUAL_TITLE> (<VISUAL_TYPE>) - <LAST_ACTION>`. The first visual is the one that was interacted with first. The second visual is the one that was interacted with second. The sequence of interactions is ordered chronologically. Some strings do not represent the visuals, but rather global events: `Page reloaded`, `Data changed`, `Root`.


The purpose of a visual is defined by the dashboard's author. To assist users effectively, your need to determine the optimal order in which to explain the visuals and provide explanations accordingly. 
The previously collected interactions between the visuals might provide an insight on the optimal order in which to explain the visuals. You have to use both the dashboard metadata and the previously collected interactions to determine the optimal order in which to explain the visuals. However, the order must not be defined based solely on the previously collected interactions. The order must be defined based on the dashboard metadata as well.
You will get as inputs:
JSON array representing the dashboard structure;

You should not output the code. 
You should only output a list of dictionaries that represent the visuals in the order they need to be explained. 
Each dictionary should contain the visual's `title` and an `explanation` of that visual. 
In the explanation you need to explain to the user how to use this chart in detail and how this chart can theoretically interact with other charts on the dashboard. 
In addition, the explanation of the visual should be divided into three categories (as separate keys): `general` provides a general description of the visual, `dependencies` provides a description of how the visual affects and affected by the other visuals on the dashboard, `insight` provides a description of the insight that can be obtained from the visual.
The output needs to be in JSON format.

Input: 
{json_data}

Output as JSON:
"""

OLD_PROMPT = """
You are developing an onboarding process that aims to explain visualizations on a dashboard to users with little to no experience with visualization tools. 
The dashboard's structure is represented as a JSON array with the following structure: 
 - layout: a string that describes the number of visuals and global filters on the dashboard;
 - purpose: a string that describes the purpose of the dashboard;
 - task: a string that describes the task the dashboard is designed to support;
 - visuals: an array of objects that represent the visuals on the dashboard. Each object has the following structure:
    - description: a string that describes the visual;
    - title: a string that describes the visual's title;
    - type: a string that describes the visual's type;
    - task: a string that describes the task the visual is designed to support;
    - mark: a string that describes the visual's mark;
    - attributes: an array of strings that describe the visual's attributes/fields;
- interactions: an array of objects that reflects the pairs of visuals that we obtained based on the previous users' interactions with the dashboard. Each object has the following structure:
    - sequence: an array of arrays of strings that represent the sequence of interactions between two visuals. Each array of strings represents a transitiob between two visuals. Each string represents a visual. The string is of a following format `<VISUAL_TITLE> (<VISUAL_TYPE>) - <LAST_ACTION>`. The first visual is the one that was interacted with first. The second visual is the one that was interacted with second. The sequence of interactions is ordered chronologically. Some strings do not represent the visuals, but rather global events: `Page reloaded`, `Data changed`, `Root`.


The purpose of a visual is defined by the dashboard's author. To assist users effectively, your need to determine the optimal order in which to explain the visuals and provide explanations accordingly. 
The previously collected interactions between the visuals might provide an insight on the optimal order in which to explain the visuals. You have to use both the dashboard metadata and the previously collected interactions to determine the optimal order in which to explain the visuals. However, the order must not be defined based solely on the previously collected interactions. The order must be defined based on the dashboard metadata as well.
You will get as inputs:
JSON array representing the dashboard structure;

You should not output the code. You should only output a list of dictionaries that represent the visuals in the order they need to be explained. Each dictionary should contain the visual's `title` and an `explanation` of that visual. In the explanation you need to explain to the user how to use this chart in detail and how this chart can theoretically interact with other charts on the dashboard. The output needs to be in JSON format.

Input: 
{json_data}

Output as JSON:
"""