export const messages = [
    {
        "type": "ORGANIZATION",
        "id": "99f2535b-3f90-4758-8549-5b13c43a8504",
        "code": "BOG",
        "timestamp": "2021-07-01T01:00:00.000Z"
    },
    {
        "type": "ORGANIZATION",
        "id": "34f195b5-2aa1-4914-85ab-f8849f9b541a",
        "code": "FMT",
        "timestamp": "2021-07-03T01:00:00.000Z"
    },
    {
        "type": "SHIPMENT",
        "referenceId": "S00001071",
        "organizations": ["BOG"],
        "estimatedTimeArrival": "2020-03-13T00:00:00",
        "transportPacks": {
            "nodes": [
                {
                    "totalWeight": {
                        "weight": "5",
                        "unit": "KILOGRAMS"
                    }
                }
            ]
        },
        "timestamp": "2021-07-07T01:00:00.000Z"
    },
    {
        "type": "ORGANIZATION",
        "id": "34f195b5-2aa1-4914-85ab-f8849f9b541a",
        "code": "NAM",
        "timestamp": "2021-07-08T01:00:00.000Z"
    },
    {
        "type": "SHIPMENT",
        "referenceId": "S00001142",
        "organizations": ["FMT"],
        "estimatedTimeArrival": "2020-08-29T00:00:00",
        "transportPacks": {
            "nodes": []
        },
        "timestamp": "2021-07-06T01:00:00.000Z"
    },
    {
        "type": "SHIPMENT",
        "referenceId": "S00001175",
        "organizations": ["BOG", "NAM"],
        "transportPacks": {
            "nodes": [
                {
                    "totalWeight": {
                        "weight": "10",
                        "unit": "KILOGRAMS"
                    }
                }
            ]
        },
        "timestamp": "2021-07-10T01:00:00.000Z"
    },
]