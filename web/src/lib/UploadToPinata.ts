const PINATA_JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYzIxODM2MS1lNmZiLTQzNjQtYjhiOS04NzQ4YjMzZGYwNDEiLCJlbWFpbCI6InZhbnNoLnNhaGF5MTIzNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDNkZTE3NzY1ZjgyOTI5ZWYxMjYiLCJzY29wZWRLZXlTZWNyZXQiOiI5MjU0ZjI1NTYyZWIxYjQ1YzU1NWUwMzhiNjhkOGExMjlkNjM1ODFiNTk4YzkzMjQ5YWNiYjgyY2ZkMjAyOGZkIiwiZXhwIjoxNzU3MTExMTk5fQ.gsXzTbG_Bl08T_usQkSdU2dWrtzGz9TI497TQY4EKDw";
const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export const uploadToPinataFile = async (file: File) => {
    console.log("Uploading Image File to Pinata...");

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
        "pinataMetadata",
        JSON.stringify({ name: "File to upload" })
    );

    try {
        const res = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${PINATA_JWT}`,
                },
                body: formData,
            }
        );

        const result = await res.json();
        const { IpfsHash } = result;
        const url = `${IPFS_GATEWAY}${IpfsHash}`;

        console.log("The URL is: ", url);

        return IpfsHash;
    } catch (e) {
        console.error("Error uploading file:", e);
        alert("Failed to upload file");
    }
};

export const uploadToPinataJson = async (formData: string) => {
    console.log("Uploading MetaData to Pinata...");

    try {
        const res = await fetch(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${PINATA_JWT}`,
                    "Content-Type": "application/json",
                },
                body: formData,
            }
        );

        const result = await res.json();
        const { IpfsHash } = result;
        const url = `${IPFS_GATEWAY}${IpfsHash}`;

        console.log("The URL is: ", url);

        return IpfsHash;
    } catch (e) {
        console.error("Error uploading file:", e);
        alert("Failed to upload file");
    }
};
