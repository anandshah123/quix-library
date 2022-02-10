# Fraud Detection III - Predict

This is the prediction stage for the Fraud Detection example. The prediction is performed with a loaded ml model from the cleaning data read.

## Requirements / Prerequisites

This is part of the Fraud Detection project:

- Fraud Detection I - Ingest: project that writes transaction data into topic
- Fraud Detection II - Clean: project that reads raw transaction data and cleans it (dummyfication) 
- Fraud Detection III - Predict (this one): project that writes the cleaned transaction data and uses it to predict fraud using a loaded machine learning model. 

## Environment Variables

The code sample uses the following environment variables:

- **input**: This is the input topic for cleaned fraud data.
- **output**: This is the output topic for fraud predictions.

## Docs

Check out the [SDK Docs](https://quix.ai/docs/sdk/introduction.html) for detailed usage guidance

## How to Run
Create an account on [Quix](https://portal.platform.quix.ai/self-sign-up?xlink=github) to Edit or Deploy this application without a local environment setup.

Alternativelly, you can check [here](/python/local-development) how to setup your local environment.

