import {PinataSDK} from 'pinata';

const pinata = new PinataSDK({
    pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0Y2Q3YjlhYS04Yzk5LTRjODUtYTJlZC00YjVhNjczMzFkNDciLCJlbWFpbCI6ImtpbnlhY2hyaXN0aW5lMTRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjdhZjhlYTI3YzgxY2I4OWM4OGRjIiwic2NvcGVkS2V5U2VjcmV0IjoiYThhYWIzNjFiYjgyMjFmMWNiNTBmZGI1ODVmMzZkNDk5ZjM5OWMyNGJmZjBhYmVjMzg3MTRkYzQyZWJkYmYxMCIsImV4cCI6MTc3NTM0ODU1OH0.8MLqJ78htUHSmd9HmXRZldUDoR22s9suOACX_D7YYVg",
    pinataGateway: "emerald-left-jellyfish-656.mypinata.cloud"
});

export const uploadFileToPinata = async (file: File) => {
  try {
    const upload = await pinata.upload.public.file(file);
    return upload.cid; // Return the CID of the uploaded file
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    throw error;
  }
};

export const uploadJsonToPinata = async (json: object) => {
  try {
    const file = new File(
      [JSON.stringify(json)], 
      'metadata.json', 
      { type: 'application/json' }
    );
    const upload = await pinata.upload.public.file(file);
    return upload.cid;
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error);
    throw error;
  }
};

export const fetchFromPinata = async (cid: string) => {
  try {
    // Using the gateway to fetch data
    const response = await pinata.gateways.public.get(cid);
    console.log(response)
    // console.log(url)
    return response;
  } catch (error) {
    console.error('Error fetching from Pinata:', error);
    throw error;
  }
};

export const getPinataUrl = async (cid: string) => {
  try {
    const response = await pinata.gateways.public.convert(cid);
    console.log(response)

    return response
  } catch (error) {
    console.error('Error fetching from Pinata:', error);
    throw error;
  }
}

