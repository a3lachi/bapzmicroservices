#!/bin/bash

if [ "$1" == "start" ]; then
  osascript -e 'tell app "Terminal"
    set input to "\"\\033]0;GATEWAY\\007\""
    do script "echo -n -e " & input & " && cd bapzendservices/ && clear && ns;"
    set input to "\"\\033]0;CART\\007\""
    do script "echo -n -e " & input & " && cd bapzendservices/cart_service && clear && ns;"
    set input to "\"\\033]0;CLIENT\\007\""
    do script "echo -n -e " & input & " && cd bapzendservices/client_service && clear && ns;"
    set input to "\"\\033]0;PRODUCT\\007\""
    do script "echo -n -e " & input & " && cd bapzendservices/product_service && clear && ns;"
    set input to "\"\\033]0;PAYMENT\\007\""
    do script "echo -n -e " & input & " && cd bapzendservices/payment_service && clear && ns;"
    set input to "\"\\033]0;DELIVERY\\007\""
    do script "echo -n -e " & input & " && cd bapzendservices/delivery_service && clear && ns;"
    set input to "\"\\033]0;COMMAND\\007\""
    do script "echo -n -e " & input & " && cd bapzendservices/command_service && clear && ns;"
    activate
  end tell'
fi


if [ "$1" == "end" ]; then
  kill -9 $(lsof -i :3000 | grep LISTEN | awk '{print $2}')
  kill -9 $(lsof -i :3001 | grep LISTEN | awk '{print $2}')
  kill -9 $(lsof -i :3002 | grep LISTEN | awk '{print $2}')
  kill -9 $(lsof -i :3003 | grep LISTEN | awk '{print $2}')
  kill -9 $(lsof -i :3004 | grep LISTEN | awk '{print $2}')
  kill -9 $(lsof -i :3005 | grep LISTEN | awk '{print $2}')
  kill -9 $(lsof -i :3006 | grep LISTEN | awk '{print $2}')
fi
