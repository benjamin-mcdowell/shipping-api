-- sample upsert into the organizations table
insert into dbo.organizations (type, id, code)
values('ORGANIZATION','99f2535b-3f90-4758-8549-5b13c43a8504', 'BOG') 
on conflict (id) 
do 
   update set code = excluded.code;

-- sample upsert into the shipments table
insert into dbo.shipments (type, referenceid, organizations)
values('SHIPMENT','S00001071', 'SEA, BOG, FMT') 
on conflict (referenceid) 
do 
   update set organizations = excluded.organizations;

-- sample upsert into the transportpacks table
insert into dbo.transportpacks (shipment_referenceid, weight, unit)
values('S00001175','10', 'KILOGRAMS') 
on conflict (shipment_referenceid) 
do 
   update set weight = excluded.weight, unit = excluded.unit;

-- retrieve an organization
select id, code
from dbo.organizations
where id = '34f195b5-2aa1-4914-85ab-f8849f9b541a'

-- retrieve a shipment
select referenceid, organizations
from dbo.shipments
where referenceid = 'S00001175'

-- retrieve all transportpacks from database
select shipment_referenceid, weight, unit
from dbo.transportpacks