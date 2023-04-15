import requests 
import json
import sys


url = "http://localhost:3000"
data_user = { 'email':'aa@a',
       'pwd':'a',
            #   'firstname': 'mlkli7',
            #   'lastname': 'boko',
            #   'username':'fara',
            #   'jwt':'DSFDGSDFHR78568756756' 
        
        }

data = {
    'jwt':'45465TUYJTHRGFS76756',
    'cmds':'Light Blue,S,1,752@Caise,S,1,756@',
    'date':'04/04/2023',
    'adrs':'45 Zoumourouda, Hda zouhal',
}
data_bytes = json.dumps(data_user).encode('utf-8')


if sys.argv[1] == 'ids' :
    res = requests.post(url+'/ids')



print(res.text)