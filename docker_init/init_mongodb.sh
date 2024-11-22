#!/bin/bash

log_with_time() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# MongoDB 서버 시작
mongod --replSet rs0 --bind_ip_all &

log_with_time "Waiting for MongoDB to start..."
until mongosh --quiet --eval "db.adminCommand('ping').ok" >/dev/null 2>&1; do
    log_with_time "Waiting for MongoDB to be ready..."
    sleep 2
done
sleep 10
log_with_time "MongoDB is ready"

log_with_time "Initializing replica set..."
until mongosh --quiet --eval '
    rs.initiate({
        _id: "rs0",
        members: [
            {_id: 0, host: "transaction-db:27017", priority: 2},
            {_id: 1, host: "transaction-db-secondary1:27017", priority: 1},
            {_id: 2, host: "transaction-db-secondary2:27017", priority: 1}
        ]
    })
' >/dev/null 2>&1; do
    log_with_time "Waiting for replica set initialization..."
    sleep 2
done
log_with_time "Replica set initialized"

log_with_time "Waiting for PRIMARY status..."
until mongosh --quiet --eval 'rs.status().members.some(m => m.stateStr === "PRIMARY")' >/dev/null 2>&1; do
    log_with_time "Waiting for PRIMARY status..."
    sleep 2
done
log_with_time "Replica set is ready with PRIMARY status"
sleep 30

log_with_time "Starting user creation..."
max_attempts=30
attempt=1
until mongosh /mongo_init.js || [ $attempt -eq $max_attempts ]; do
    log_with_time "Attempt $attempt of $max_attempts failed. Waiting 5 seconds before retry..."
    sleep 3
    attempt=$((attempt + 1))
done

if [ $attempt -eq $max_attempts ]; then
    log_with_time "Failed to initialize MongoDB after $max_attempts attempts"
    exit 1
fi

log_with_time "MongoDB initialization completed successfully"

tail -f /dev/null