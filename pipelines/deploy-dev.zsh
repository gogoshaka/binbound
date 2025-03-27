#!/bin/zsh
if [ -z "$1" ]; then
    echo "Please provide a version number"
    exit 1
fi
echo "$1 version deployment started on dev server"
ssh -q gogo@dev.lemonjohn.com -p 7474 'bash -s' << EOF
echo "Shell: $(ps -p $$ -o comm=)"
cd /home/gogo/dev.lemonjohn.com
git fetch origin tag $1
git checkout tags/$1
docker build -t lemonjohn:$1 .
if [ "\$(docker ps -a -q -f name=lemonjohn)" ]; then
    echo "Stopping  current lemonjohn container"
    docker stop lemonjohn
    if [ "\$(docker ps -a -q -f name=lemonjohn_old)" ]; then
        echo "Removing old lemonjohn container"
        docker stop lemonjohn_old
        docker rm lemonjohn_old
    else
        echo "goodpay_old not found"
    fi
    
    echo "renaming current lemonjohn container to lemonjohn_old"
    docker rename lemonjohn lemonjohn_old
fi
echo "running new lemonjohn container"
docker run -d -p 3000:3000 --name lemonjohn lemonjohn:$1
exit
EOF
