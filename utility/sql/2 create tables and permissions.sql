-- ensure tables don't exist so we can recreate as needed tables as needed
drop table if exists dbo.transportpacks;
drop table if exists dbo.shipments;
drop table if exists dbo.organizations;

create table dbo.organizations (
    id varchar(40) primary key,
    code varchar(3) not null
);

create table dbo.shipments (
    referenceid varchar(16) primary key,
    timestamp varchar(40),
    organizations varchar(3)[]
);

create table dbo.transportpacks (
	shipment_referenceid varchar(16) primary key,
    weight decimal,
    unit varchar(16)    
);

-- this is obviously bad practice, but for the purposes of the demo, we're the only one using the dbo schema, we can give our user everything for simplicity
grant usage on schema dbo to shipping_api_app;
grant all on all tables in schema dbo to shipping_api_app;
grant all on all sequences in schema dbo to shipping_api_app;