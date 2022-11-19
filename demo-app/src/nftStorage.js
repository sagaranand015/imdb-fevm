import { NFTStorage } from 'nft.storage';
import { NFT_STORAGE_KEY } from './constants';

export function GetStorageClient() {
    const client = new NFTStorage({ token: NFT_STORAGE_KEY });
    return client;
}

// export async function getData(cids) {
//     const client = GetStorageClient();
//     let allResp = [];
//     for (let i = 0; i < cids.length; i++) {
//         const c = cids[i];
//         const res = await client.get(c)
//         console.log(`Got a response! [${res.status}] ${res.statusText}`)
//         if (!res.ok) {
//             continue;
//         }
//         // unpack File objects from the response
//         const files = await res.files();
//         for (const file of files) {
//             // console.log(`${file.cid} -- ${file.path} -- ${file.size} -- ${file.name}`);
//             allResp = [...allResp, {
//                 'cid': c,
//                 'path': file.path,
//                 'size': file.size,
//                 'name': file.name,
//                 'fileUrl': `https://${c}.ipfs.w3s.link/${file.name}`,
//             }];
//         }
//     }
//     console.log("======= all resp: ", allResp);
//     return allResp;
// }

export async function FetchDataFromIpfsLink(cid) {
    const url = `https://ipfs.io/ipfs/${cid}`;
    console.log("======= check this link", url);
}

export async function UploadNftJson(name, description, release, director, image, metadata) {
    const client = GetStorageClient();
    const data = {
        "name": name,
        "description": description,
        "image": image,
        "release": release,
        "director": director,
        "metadata": metadata,
    }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    return await client.storeBlob(blob);
}