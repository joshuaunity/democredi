import db from "../config/database";

export interface Kyc {
    id?: string;
    userId?: string;
    phone: string;
    nubanNumber: string;
    nubanCode: string;
    bvn: string;
    approved?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export const createKyc = async (kyc: Partial<Kyc>): Promise<Kyc | Error> => {
    await db("kycs").insert({ ...kyc }).returning("id");
    if (!kyc.userId) {
        return new Error("Failed to create kyc");
    }
    const kycRecord = await getKycByUserId(kyc.userId);
    if (!kycRecord) {
        return new Error("Failed to create kyc");
    }
    return kycRecord;
};

export const allKycs = async (): Promise<Kyc[]> => {
    return await db<Kyc>("kycs").select();
};

export const getKycById = async (id: string): Promise<Kyc | Error> => {
    const kycRecord = await db<Kyc>("kycs").where({ id }).first();
    if (!kycRecord) {
        return new Error("Kyc not found");
    }
    return kycRecord;
}

export const getKycByUserId = async (userId: string): Promise<Kyc | Error> => {
    const kycRecord = await db<Kyc>("kycs").where({ userId }).first();
    if (!kycRecord) {
        return new Error("Kyc not found");
    }
    return kycRecord;
}

export const updateKyc = async (id: string, updates: Partial<Kyc>): Promise<Kyc | Error> => {
    updates.updatedAt = new Date();
    await db<Kyc>("kycs").where({ id }).update(updates);
    const kycRecord = await getKycById(id);
    if (!kycRecord) {
        return new Error("Failed to update kyc");
    }
    return kycRecord;
};

export const deleteKyc = async (id: string): Promise<void | Error> => {
    await db("kycs").where({ id }).delete();
    const kycRecord = await getKycById(id);
    if (kycRecord instanceof Error) {
        return new Error("Failed to delete kyc");
    }
};