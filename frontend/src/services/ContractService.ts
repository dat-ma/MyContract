import axiosInstance from "../libs/axiosInstance";

export async function getTotalBid(address: any): Promise<any> {
    console.log(import.meta.env.VITE_BASE_URL);
    
    return await axiosInstance.get(`/total-bid?address=${address}`).then(response => {
        return response.data;
    }).catch((errot) => {
            console.log(errot);
        });
}

// docker run --name fushion-be -p 3333:3333 fushion-be 