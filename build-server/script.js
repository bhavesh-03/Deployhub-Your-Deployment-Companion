// here whole code from the git repo will go to output directory and then it will do npm install and npm run build which will creat a dist folder and will have all static code like html, css, js etc. 


const {exec} = require('child_process')
const path = require('path')
const fs = require('fs')
const {S3Client,PutObjectCommand} = require('@aws-sdk/client-s3')
const mime = require('mime-types')
const PROJECT_ID = process.env.PROJECT_ID ; // this is the project id which we will get from the environment variable


const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
})

// with exec we can run any code or execute any command, here we have code in ouput directory
async function init() {
    console.log('Executing script.js file')
    // publishLog('Build Started...')
    const outDirPath = path.join(__dirname, 'output')

    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', function (data) {
        console.log(data.toString())
        // publishLog(data.toString())
    })

    p.stdout.on('error', function (data) {
        console.log('Error', data.toString())
        // publishLog(`error: ${data.toString()}`)
    })

    p.on('close', async function () {
        console.log('Build Complete')
        // publishLog(`Build Complete`)
        const distFolderPath = path.join(__dirname, 'output', 'dist')
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true })

        // publishLog(`Starting to upload`)
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file)
            // if the filepath have directory then continue as we want static file like index.html, styles.css etc
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath)
            // publishLog(`uploading ${file}`)
            

            const command = new PutObjectCommand({
                Bucket: 'vercel-clone-bhavesh',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                // used an npm package called mime-types to get the type of file 
                ContentType: mime.lookup(filePath)
            })
            
            // .send will upload this command in S3bucket
            await s3Client.send(command)
            // publishLog(`uploaded ${file}`)
            console.log('uploaded', filePath)
        }
        // publishLog(`Done`)
        console.log('Done...')
    })
}

init() // calling the function


