import { DatabaseService } from "./src/services/database.service";
import { ShipmentProcessor } from "./src/processors/shipment.processor";
import { OrganizationProcessor } from "./src/processors/organization.processor";
import { MapperService } from "./src/services/mapper.service";
import { ApiResponseDto } from "./src/models/response/api-response.dto";
import { ValidationService } from "./src/services/validation.service";

const express = require('express')
const bodyParser = require("body-parser");

let shipmentProcessor: ShipmentProcessor;
let organizationProcessor: OrganizationProcessor;

const app = express()
app.use(bodyParser.json());
const port = 3000

startup();

app.post('/shipment', async (req: any, res: any) => {
  console.debug('/shipment endpoint recieved message');

  const response: ApiResponseDto = await shipmentProcessor.addShipment(req);
  res.status(response.status).send(response.message).end();
})

app.post('/organization', async (req: any, res: any) => {
  console.debug('/organization endpoint recieved message');

  const response: ApiResponseDto = await organizationProcessor.addOrganization(req);
  res.status(response.status).send(response.message).end();
})

app.get('/shipments/:shipmentId', async (req: any, res: any) => {
  console.debug('/shipments:shipmentId endpoint recieved message');

  const response: ApiResponseDto = await shipmentProcessor.retrieveShipment(req);
  res.status(response.status).send(response.message).end();
})

app.get('/organizations/:organizationId', async (req: any, res: any) => {
  console.debug('/organization:organizationId endpoint recieved message');
  
  const response: ApiResponseDto = await organizationProcessor.retrieveOrganization(req);
  res.status(response.status).send(response.message).end();
})

app.get('/aggregate', async (req: any, res: any) => {
  console.debug('/aggregate endpoint recieved message');

  const response: ApiResponseDto = await shipmentProcessor.aggregateWeight(req);
  res.status(response.status).send(response.message).end();
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function startup(): void {
  const mapperService: MapperService = new MapperService();
  const databaseService: DatabaseService = new DatabaseService();
  const validationService: ValidationService = new ValidationService();

  shipmentProcessor = new ShipmentProcessor(databaseService, mapperService, validationService);
  organizationProcessor = new OrganizationProcessor(databaseService, mapperService, validationService);
}