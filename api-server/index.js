const express= require('express')
const {generateSlug} = require('random-word-slugs') 
const {ECSClient,RunTaskCommand} = require('@aws-sdk/client-ecs')
const { Server } = require('socket.io')
const Redis = require('ioredis')
const app = express()
const PORT = 9000
var cors = require('cors')



app.use(cors())


const subscriber = new Redis('rediss://default:AVNS_Yx79L4motetKBPqAonM@redis-c1d0a88-vercel-bhavesh.a.aivencloud.com:17284')
app.use(express.json()) ;


const io = new Server({ cors: '*' })

io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})

io.listen(9002, () => console.log('Socket Server 9002'))

const ecsClient = new ECSClient({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: 'AKIAYS2NSUVF364SQYP3',
        secretAccessKey: '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'
    }
})


const config = {
    CLUSTER: 'arn:aws:ecs:ap-south-1:590183834955:cluster/builder-cluster-bhavesh',
    TASK: 'arn:aws:ecs:ap-south-1:590183834955:task-definition/builder-task-vercel'
}




app.post('/project', async (req, res) => {
    const { gitURL, slug } = req.body
    const projectSlug = slug ? slug : generateSlug()

    // Spin the container
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: ['subnet-033d07782dd0ccd35', 'subnet-05e134043c6d6d40c', 'subnet-05378435a07f0bc85'],
                securityGroups: ['sg-031e9aa1cba4b31c1']
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'builder-image',
                    environment: [
                        { name: 'GIT_REPOSITORY__URL', value: gitURL },
                        { name: 'PROJECT_ID', value: projectSlug }
                    ]
                }
            ]
        }
    })

    await ecsClient.send(command);

    return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` } })

})


async function initRedisSubscribe() {
    console.log('Subscribed to logs....')
    subscriber.psubscribe('logs:*')
    subscriber.on('pmessage', (pattern, channel, message) => {
        io.to(channel).emit('message', message)
    })
}


initRedisSubscribe()
app.listen(PORT, () => {    
    console.log(`API-Server is running on port ${PORT}`)
})  
