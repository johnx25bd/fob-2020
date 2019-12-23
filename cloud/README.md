# Cloud Software

A NodeJS program running on a cloud server will be the "heart" of the application. The program will:

- Fetch trusted data from Redis or S3 Bucket, originating from Pebble trackers
- Analyze data to determine appropriate course of application (perhaps including spawning of child processes inside SGX enclave)
- Possibly generate and sign transactions (with which private keys??), or call edge devices (Pebble trackers) to generate and sign transactions for payment or contract method invocation
- Serve client applications with front-end code and data
