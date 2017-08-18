import boto3
from uuid import uuid4
from datetime import datetime

client = boto3.client(
    'ec2',
    region_name='us-west-2',
    aws_access_key_id='AKIAIWJMFHMM7KPBTAHA',
    aws_secret_access_key='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'
)

def describe_spot_pricing_history():
    """
    We can sum/average the last couple days of pricing to give a a good picture of what the user is expected to pay
    http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.describe_spot_price_history
    """
    return client.describe_spot_price_history(
        InstanceTypes=[
            'm3.medium'
        ],
        AvailabilityZone='us-west-2a',
        EndTime=datetime(2017, 8, 17),
        MaxResults=1000,
        StartTime=datetime(2017, 8, 15)
    )

def request_spot_instance():
    """
    Actual command to create spot instances.
    http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.request_spot_instances
    """
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

def describe_spot_instance_requests():
    """
    This will inform us the state spot instance requests. 
    We can use this to know when instances are scheduled to shut down also
    http://boto3.readthedocs.io/en/latest/reference/services/ec2.html#EC2.Client.describe_spot_instance_requests
    """
    return client.describe_spot_instance_requests(
        SpotInstanceRequestIds=[
            'sir-adig96kp'
        ]
    )


# SHUTDOWN AND STARTUP
# This is a bash script we can wrap around user startup/shurdown scripts
# #!/bin/bash
# function listenForShutdown() {
#     while true
#         do
#             if [ -z $(curl -Is http://169.254.169.254/latest/meta-data/spot/termination-time | head -1 | grep 404 | cut -d \  -f 2) ]
#                 then
#                     logger "Running shutdown"
#                     shutdown()
#                     break
#                 else
#                     # Spot instance not yet marked for termination.
#                     sleep 5
#             fi
#         done
# }

# function shutdown() {
#     //call spotawesome and inform them we have been scheduled for termination
#     //run user shutdown script
# }

# function init() {
#     //maybe inform spotawesome we exist? probably not necessary since we have the api...
#     //run user startup script here
# }

# listenForShutdown() &
# init()