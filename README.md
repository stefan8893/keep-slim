# Keep Slim

## Overview

**Keep Slim** is an application designed to track and analyze body data over time, including:

- Weight
- Body Fat
- Body Water
- Muscle Mass
- BMI
- Daily Calorie Requirement

Some while ago I was obese and needed to lose weight. Therefore I started a strict diet and lifting weights. In order to see the progress not only in the mirror I created this app.

## Infrastructure

- **EntraID** (OAuth2.1 + OpenID Connect) for secure authentication
- **Azure Blob Storage** hosting the frontend as a static website
- **Azure Tables** for storing body data
- **Azure Functions** serving as the backend for data processing and API handling

The frontend authenticates users through EntraID and communicates with the Azure Functions backend, which accesses and updates data in Azure Tables.

## Data Input

Body data is collected from a **SÖHNLE Shape Sense** scale. Users export data from the scale as a CSV file, upload it client-side, and the app sends the data to the Azure Functions backend for parsing and storage.

## Azure Functions Repository

The backend source code is maintained in a separate repository:  
[Azure Functions Backend Repo](https://github.com/stefan8893/keep-slim-functions)
