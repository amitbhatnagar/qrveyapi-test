# qrveyapi-test
This sample code shows how to create a new Survey by using Qrvey (https://qrvey.com) API.

## API Reference

More information about Qrvey API can be found at https://www.qrvey.com/developers.html

API documentation is available at https://apidocs.qrvey.com

## Prerequisites

1. Get a free API key from https://www.qrvey.com/developers.html
2. Install Node from https://nodejs.org if its not already installed.

## How to run
To run this sample

1. Clone the repository or download the zip file and unzip in a new folder
2. Open index.js and insert the API key
3. (Optional) you can change the userBody parameter with any values or choose to load a different json file for qrveyBody in index.js
3. Open command prompt (or terminal) in the same folder and run 

    **npm install && node index.js**

This command will create a new Survey and return a URL that can be used to answer the survey. This URL can be shared with respondents.
