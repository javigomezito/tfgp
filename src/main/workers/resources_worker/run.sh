#!/bin/bash

until nc -z rabbit 5672; do
    echo "$(date) - waiting for rabbitmq..."
    sleep 1
done

sleep 5
nameko run --config ./config.yaml resources_worker