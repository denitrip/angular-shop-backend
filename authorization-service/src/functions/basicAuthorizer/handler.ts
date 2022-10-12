const basicAuthorizer: any =  async (event, context, callback) => {
    if (event['type'] != 'TOKEN') {
        callback('Unautorized')
    }

    try {
        const authToken = event.authorizationToken;

        const encodedCreds = authToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const plainCreds = buff.toString('utf-8').split(':');


        const userName = plainCreds[0];
        const userPassword = plainCreds[1];

        const storedUserPassword = process.env[userName];
        const effect = !storedUserPassword || storedUserPassword != userPassword ? 'Deny' : 'Allow';
        const policy = generatePolicy(encodedCreds, event.methodArn, effect);
        callback(null, policy);

    } catch(e) {
        callback('Unautorized: ', JSON.stringify(e.message))
    }
}

const generatePolicy = (principalId, resource, effect = 'Allow') => {
    return ({
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }]
        }
    })
}
export const main = basicAuthorizer;
