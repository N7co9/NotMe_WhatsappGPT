
# Not_Me WhatsappGPT - Autoreply Tool

Node.js Project containing small scripts that utilize whatsapp-web.js library and an OpenAi Implementation to handle automatic replies powered by GPT 3.5 Turbo.

The Script is highly customizable, take a look into the NotMe.js to adjust features like filtered Messages and excluded/included Phonenumbers. The Script also takes Context in consideration and allows for messages to accumulate before a response is sent.

## Installation

Requirements: Node.js & NPM, OpenAi API Key

- Clone the Repository.
- run 'npm install' to obtain the libraries.
- create and alter an .env file in the root directory, to look like the .env_example
- run node NotMe.js
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`OPENAI_API_KEY`


## FAQ

#### Where do I obtain an OpenAi API Key?

https://openai.com/blog/openai-api

#### How can I make the AI act as me?

Alter the System prompt for the LLM Model within the NotMe.js script.
Here you can pass the AI your information and tell it to respond as if it was you.

#### It seems like the Code is not working anymore, why? :/

This could be due to changes in the OpenAi API, look at the API documentation if something crashes, this will most likely be the cause.
The API usage is current as of february 2024, but is subject to change.

