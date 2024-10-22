# meet.jpc.io

A dead-simple app for zero-auth video conferencing

The app is available live at [https://meet.jpc.io](https://meet.jpc.io).

## Setup

Clone the repo, install dependencies, deploy backend resources:

```bash
git clone git@github.com:johnpc/jpc-meet.git
cd jpc-meet
npm install
npx ampx sandbox
```

Then, to run the frontend app

```bash
# on web
npm run dev
```

## Deploying

Deploy this application to your own AWS account in one click:

[![amplifybutton](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/johnpc/jpc-meet)
