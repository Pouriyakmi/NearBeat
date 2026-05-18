const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const s3 = new S3Client({
  region: 'default',
  endpoint: process.env.ARVAN_STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.ARVAN_STORAGE_ACCESS_KEY,
    secretAccessKey: process.env.ARVAN_STORAGE_SECRET_KEY,
  },
  forcePathStyle: true,
})

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body)

    const fileName = body.fileName
    const fileType = body.fileType

    if (!fileName || !fileType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing fields' }),
      }
    }

    const key = `music/${Date.now()}-${fileName}`

    const command = new PutObjectCommand({
      Bucket: process.env.ARVAN_STORAGE_BUCKET,
      Key: key,
      ContentType: fileType,
    })

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5,
    })

    const publicUrl = `${process.env.ARVAN_STORAGE_PUBLIC_BASE_URL}/${key}`

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl,
        publicUrl,
        key,
      }),
    }
  } catch (err) {
    console.error(err)

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    }
  }
}
