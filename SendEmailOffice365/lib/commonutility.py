import configparser
from datetime import datetime, timezone
import json

def read_config(configfilepath) :
    with open(configfilepath, 'r') as f:
        data = f.read()
        conf = json.loads(data)
        # print(type(conf['window_size']))
    f.close()
    return conf