import json
import os
import sys
import inspect

base_dir = os.getcwd()
if not os.access(base_dir, os.W_OK):
    sys.exit("No Write Permission")

CFG_PATH = './Cfg/config.json'
filename = inspect.getframeinfo(inspect.currentframe()).filename
executablepath = os.path.dirname(os.path.abspath(filename))
programname = os.path.splitext(os.path.basename(filename))[0]
path = executablepath.split("\\")
path.pop()
S = "\\"
LOG_DIR = S.join(path)

def read_config(file):
    with open (file,'r') as f:
        data = f.read()
        conf = json.loads(data)
        # print(type(conf['window_size']))
    f.close()
    return conf
