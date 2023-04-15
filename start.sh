#!/bin/bash

if [ "$1" == "-s" ]; then
  osascript -e 'tell app "Terminal"
    set input to "\"\\033]0;CART\\007\""
    set newWindow to do script "echo -n -e " & input & " && cd $(pwd)/bapzendservices/cart_service && clear && ns;"
    set bounds of window 2 to {0, 400, 800, 700} 
    set input to "\"\\033]0;CLIENT\\007\""
    set newWindow to do script "echo -n -e " & input & " && cd $(pwd)/bapzendservices/client_service && clear && ns;"
    set bounds of window 3 to {400, 400, 1200, 700} 
    set input to "\"\\033]0;PRODUCT\\007\""
    do script "echo -n -e " & input & " && cd $(pwd)/bapzendservices/product_service && clear && ns;"
    set bounds of window 4 to {400, 0, 1200, 300}
    set input to "\"\\033]0;PAYMENT\\007\""
    set newWindow to do script "echo -n -e " & input & " && cd $(pwd)/bapzendservices/payment_service && clear && ns;"
    set bounds of window 5 to {400, 800, 1200, 1100}
    set input to "\"\\033]0;DELIVERY\\007\""
    set newWindow to do script "echo -n -e " & input & " && cd $(pwd)/bapzendservices/delivery_service && clear && ns;"
    set bounds of window 6 to {0, 800, 800, 1100}
    set input to "\"\\033]0;COMMAND\\007\""
    set newWindow to do script "echo -n -e " & input & " && cd $(pwd)/bapzendservices/command_service && clear && ns;"
    set bounds of window 7 to {0, 0, 800, 300}
    set input to "\"\\033]0;GATEWAY\\007\""
    set newWindow to do script "echo -n -e " & input & " && cd $(pwd)/bapzendservices/gateway && clear && ns;"
    set bounds of window 8 to {600, 300, 1400, 800} 
    activate
  end tell'
fi


if [ "$1" == "-e" ]; then
  kill -9 $(lsof -i :3000 | grep LISTEN | awk '{print $2}')

fi

if [ "$1" == "-c" ]; then
  for (( i=1; i<=$2; i++ )); do curl 'http://127.0.0.1:3000/ids?limit='$3 && sleep 0.5 && echo '' && curl 'http://127.0.0.1:3000/images'&& sleep 0.5 && echo '' ; done;
fi
