const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

dotenv.config()


const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKeyId = process.env.ACCESS_KEY_ID
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});


exports.getFileFromS3 = async (image) => {
    const getObjectParams = {
        Bucket: bucketName,
        Key: image
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
}


exports.saveFileToS3 = async (file) => {
    const unique = Date.now()
    const filename = `${file.fieldname}_${unique}_${file.originalname}`
    const params = {
        Bucket: bucketName,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype
    }
    const command = new PutObjectCommand(params);

    const response = await s3.send(command)
    return [ response, filename ]
}