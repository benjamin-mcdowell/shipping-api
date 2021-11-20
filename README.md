
# Reviewer README
I've included a few minor notes on the apps structure for usability, we can discuss details in depth during the interview if you have questions.

### Utility Folder
In the utility folder I have provided the queries used to create my postgres database as well as a postman collection with some tests of the endpoints I created to show use of the weight aggregation, and file retrieval formats.  The test data was based on the messages.ts file you provided.

### Models
You'll notice in the models folder we have two seperate sets of models.  We have the request/response models and the internal models.  I made this distinction, because if we were integrating with an existing or third party service it may use object mappings that don't follow our standards or store data in different types.  The internal models are the ones used to handle business logic and communication with the database.

### Validation Service
The validation service is pretty bare bones but I wanted to provide an example of how I might approach this, and if the need arises it could easily be expanded to cover individual transport packs or to provide individual by field feedback on requests and check for value ranges.

### Possible Future Features & Suggestions
* Unit tests or functional tests via a tool like postman could be included
* Database could be expanded to store more than one transport pack per shipment
* If we needed to support more endpoints and models it might be worth using an ORM to limit manual SQL querying
* Number formatting could be applied uniformly to weight to prevent unnessessary precision