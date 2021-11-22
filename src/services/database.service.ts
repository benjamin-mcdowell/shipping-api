import { Pool } from 'pg';
import { Shipment } from '../models/internal/shipment.model';
import { TransportPack } from '../models/internal/transportPack.model';
import { ProcessResult } from '../enums/process-result.enum';
import { Organization } from '../models/internal/organization.model';

// this is just here for convenience for the demo, in any actual application we'd have credentials load from AWS
const connectionString = 'postgresql://shipping_api_app:simplepassword14@localhost:5432/shipping_api'

let pool: Pool;

export class DatabaseService {

    constructor() {
        pool = new Pool({connectionString});
    }

    public async createOrUpdateOrganizationRecord(organization: Organization): Promise<ProcessResult> {
        const client = await pool.connect();

        const query = {
        text: `insert into dbo.organizations (id, code)
                values($1,$2) 
                on conflict (id) 
                do update set code = excluded.code;`,
        values: [organization.id, organization.code]
        };

        let processResult = ProcessResult.Failure;
        await client
            .query(query)
            .then(() => {
                processResult = ProcessResult.Successful;
            })
            .catch(e => console.error(e.stack))
        client.release();

        return processResult;
    }

    public async createOrUpdateShipmentRecord(shipment: Shipment): Promise<ProcessResult> {
        const client = await pool.connect();

        const query = {
            text: `insert into dbo.shipments (referenceid, organizations, timestamp)
                    values($1,$2, $3) 
                    on conflict (referenceId) 
                    do update set organizations = excluded.organizations;`,
            values: [shipment.referenceid, shipment.organizations, shipment.timestamp]
            };
    
            let processResult = ProcessResult.Failure;
            await client
                .query(query)
                .then(() => {
                    processResult = ProcessResult.Successful;
                })
                .catch(e => console.error(e.stack))
    

        client.release();

        return processResult;
    }

    public async createOrUpdateTransportPackRecords(shipmentReferenceId: string, transportPacks: TransportPack[]): Promise<ProcessResult> {
        const client = await pool.connect();
        let processResult = ProcessResult.Failure;

        for (let i = 0; i < transportPacks.length; i++) {
            const query = {
                text: `insert into dbo.transportpacks (shipment_referenceid, weight, unit)
                        values($1,$2, $3) 
                        on conflict (shipment_referenceid) 
                        do update set weight = excluded.weight, unit = excluded.unit;`,
                values: [shipmentReferenceId, transportPacks[i].weight, transportPacks[i].unit]
                };
        
                await client
                    .query(query)
                    .then(() => {
                        processResult = ProcessResult.Successful;
                    })
                    .catch(e => console.error(e.stack))
        }

        client.release();

        return processResult;
    }

    public async retrieveOrganizationById(organizationId: string): Promise<Organization> {
        const client = await pool.connect();

        const query = {
            text: `select id, code
                    from dbo.organizations
                    where id = $1`,
            values: [organizationId]
            };

        let organization: Organization = new Organization();
        await client
            .query(query)
            .then(res => {
                organization = res.rows[0];
            })
            .catch(e => console.error(e.stack));

        client.release();

        return organization;
    }

    public async retrieveShipmentById(referenceId: string): Promise<Shipment> {
        const client = await pool.connect();

        const query = {
            text: `select referenceid, organizations, timestamp
                    from dbo.shipments
                    where referenceid = $1`,
            values: [referenceId]
            };

        let shipment: Shipment = new Shipment();
        await client
            .query(query)
            .then(res => {
                shipment = res.rows[0];
            })
            .catch(e => console.error(e.stack));

        client.release();

        return shipment;
    }

    public async retrieveTransportPacksById(referenceId: string): Promise<TransportPack[]> {
        const client = await pool.connect();

        const query = {
            text: `select shipment_referenceid as referenceId, weight, unit 
                    from dbo.transportpacks
                    where shipment_referenceid = $1`,
            values: [referenceId]
            };
        
        let transportPacks: TransportPack[] = [];
        await client
            .query(query)
            .then(res => {
                transportPacks = res.rows;
            })
            .catch(e => console.error(e.stack));

        client.release();

        return transportPacks;
    }

    public async retrieveAllTransportPacks(): Promise<TransportPack[]> {
        const client = await pool.connect();

        const query = `select shipment_referenceid, weight, unit
                        from dbo.transportpacks`;

        const transportPacks: TransportPack[] = [];
        await client
            .query(query)
            .then(res => {
                for (let i = 0; i < res.rows.length; i++) {
                    const transportPack: TransportPack = new TransportPack();
                    transportPack.weight = parseFloat(res.rows[i]['weight']);
                    transportPack.unit = res.rows[i]['unit'];
                    transportPacks.push(transportPack);
                }
            })
            .catch(e => console.error(e.stack))
        client.release();

        return transportPacks;
    }
}