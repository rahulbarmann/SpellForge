import { NextResponse } from "next/server";
import { uploadToPinataFile, uploadToPinataJson } from "@/lib/UploadToPinata";

export async function POST(req: Request) {
    const date = new Date();
    const options: any = {
        weekday: "short" as const,
        day: "2-digit",
        month: "short",
        year: "numeric",
    };
    const curr_date = date.toLocaleDateString("en-US", options);
    try {
        const data = await req.formData();
        const file = data.get("file");
        if (!file) {
            return new Response("No file found", { status: 400 });
        }

        const ImageURI = await uploadToPinataFile(file as File);
        const NFTJsonObject = {
            name: data.get("name"),
            description: "NFT for Club Members",
            image:
                `https://black-just-toucan-396.mypinata.cloud/ipfs/` + ImageURI,
            attributes: [
                {
                    trait_type: "Role",
                    value: data.get("role"),
                },
                {
                    trait_type: "Year",
                    value: data.get("year"),
                },
                {
                    trait_type: "Issue Date",
                    value: curr_date,
                },
            ],
        };
        const json = JSON.stringify(NFTJsonObject);
        const nftURI = await uploadToPinataJson(json);
        return NextResponse.json({ ImageURI, nftURI });
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
}
