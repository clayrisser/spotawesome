import boto3
from uuid import uuid4
from datetime import datetime

client = boto3.client(
    'ec2',
    region_name='us-west-2',
    aws_access_key_id='AKIAIWJMFHMM7KPBTAHA',
    aws_secret_access_key='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'
)
# http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.describe_spot_price_history
def describe_spot_pricing_history():
    return client.describe_spot_price_history(
        InstanceTypes=[
            'm3.medium'
        ],
        AvailabilityZone='us-west-2a',
        EndTime=datetime(2017, 8, 17),
        MaxResults=1000,
        StartTime=datetime(2017, 8, 15)
    )

# http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.request_spot_instances
def request_spot_instance():
    return client.request_spot_instances(
        AvailabilityZoneGroup='string',
        ClientToken=str(uuid4()),
        InstanceCount=1,
        LaunchSpecification={
            'SecurityGroups': [
                'rancher-machine'
            ],
            'ImageId': 'ami-6e1a0117',
            'InstanceType': 'm3.medium',
            'Placement': {
                'AvailabilityZone': 'us-west-2a',
            },
            'UserData': '''
            PUT STARTUP SCRIPT HERE
            '''
        },
        SpotPrice='0.04',
        Type='one-time'
    )

# http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.describe_spot_instance_requests
def describe_spot_instance_requests():
    return client.describe_spot_instance_requests(
        SpotInstanceRequestIds=[
            'sir-adig96kp'
        ]
    )

print(describe_spot_instance_requests())