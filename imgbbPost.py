import requests
import base64
import json
import os 


images = os.listdir('public/images')

api = '5482d4a2505ccf7870bf7c20b7421b16'
url = "https://api.imgbb.com/1/upload"

imagepath = "public/images/"

def payload(image) :
  with open(imagepath+image, 'rb') as file:
      encoded_image = base64.b64encode(file.read())

  payload = {
      "expiration": "864000",
      "key": api,
      "image":encoded_image,
      "name":image.split('.')[0],
  }

  return payload
    

def req(name) :

  response = requests.post(url, data=payload(name))

  data = data_dict = json.loads(response.text)

  try :
    if data['status'] == 200 :
      return [True,name.split('.')[0]+'__'+data['data']['url']]

  except :
    pass
  return [False]

i=1
j=0

fdat = open('data.txt','a+')
for img in images[590:] :
  rez = req(img)

  if rez[0] == True :
    fdat.write(rez[1]+'\n')
    print('Operation ',i,' successed.')
  else :
    j+=1
    print('Operation ',i,' returned error.')

  if j>10 :
    print('BREAKED AT i=',i)
    break
    

  i+=1




fdat.close()
  
