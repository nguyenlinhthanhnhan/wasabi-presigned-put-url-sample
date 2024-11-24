import { Credentials, S3 } from "aws-sdk"; // It should be replaced by new @aws-sdk/client-s3 lib

const s3Client = new S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
  endpoint: "<your wasabi bucket with region>",
  sslEnabled: true,
  s3ForcePathStyle: true,
  credentials: new Credentials({
    accessKeyId: "<your access key id>",
    secretAccessKey: "<your secret key>",
  }),
});

async function PresignedPutUrl(file: string) {
  const params = {
    Bucket: "<your bucket name>",
    Key: file,
    Expires: 300,
  };
  return s3Client.getSignedUrl("putObject", params);
}

export async function main(event: any) {
  const file: string = event.queryStringParameters.file;
  const url: string = await PresignedPutUrl(file);

  // Decode the URL
  const decodedUrl = decodeURIComponent(url);

  return {
    url: decodedUrl,
  };
}

main({ queryStringParameters: { file: "test.png" } }).then(console.log);
