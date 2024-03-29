
# Deployhub - Your Deployment Companion
Deployhub is a platform designed to streamline the deployment process for your applications. Deployhub simplifies the process by providing a composable architecture and seamless integration with Git repositories. Say goodbye to deployment headaches and hello to effortless deployments with Deployhub!

### Setup Guide

This Project contains following services and folders:

- `api-server`: HTTP API Server for REST API's
- `build-server`: Docker Image code which clones, builds and pushes the build to S3
- `s3-reverse-proxy`: Reverse Proxy the subdomains and domains to s3 bucket static assets

### Local Setup

1. Run `npm install` in all the 3 services i.e. `api-server`, `build-server` and `s3-reverse-proxy`
2. Docker build the `build-server` and push the image to AWS ECR.
3. Setup the `api-server` by providing all the required config such as TASK ARN and CLUSTER arn.
4. Run `node index.js` in `api-server` and `s3-reverse-proxy`

At this point following services would be up and running:

| S.No | Service            | PORT    |
| ---- | ------------------ | ------- |
| 1    | `api-server`       | `:9000` |
| 2    | `socket.io-server` | `:9002` |
| 3    | `s3-reverse-proxy` | `:8000` |


### Demo

[Watch The Demo Video](https://imgur.com/a/4qWIp1z)

## System Architecture

![Vercel Clone Architecture](https://i.imgur.com/989XyI2.png)

