#!/bin/bash

until nc -z rabbit 5672; do
    echo "$(date) - waiting for rabbitmq..."
    sleep 1
done

sleep 5
#cd ./workers/users_worker/
nameko run --config ./config.yaml users_worker