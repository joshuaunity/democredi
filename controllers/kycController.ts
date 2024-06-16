import { Request, Response } from "express";
import {
    Kyc,
    createKyc,
    allKycs,
    getKycById,
    updateKyc,
    deleteKyc,
    getKycByUserId,
} from "../models/kycModel";
import { validateFields, verifyKyc } from "../utils/helpers";

// Create a new kyc record
export const createKycHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { phone, nubanNumber, nubanCode, bvn } = req.body;
        const requiredFields = ["phone", "nubanNumber", "nubanCode", "bvn"];
        const missingFields = validateFields(req.body, requiredFields);

        if (missingFields.length > 0) {
            res
                .status(400)
                .json({
                    error: `Missing or empty fields: ${missingFields.join(", ")}`,
                });
            return;
        }

        let kyc: Kyc = {
            userId: req.body.user.id,
            phone,
            nubanNumber,
            nubanCode,
            bvn,
        };

        const kycValid = verifyKyc(kyc);
        if (!kycValid) {
            res.status(400).json({ error: "Invalid kyc details" });
            return;
        }

        const newKyc = await createKyc(kyc);
        if (newKyc instanceof Error) {
            res.status(400).json({ error: newKyc.message });
            return;
        }

        res.status(201).json(newKyc);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Get all kyc records
export const getAllKycsHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const kycs = await allKycs();
        res.status(200).json(kycs);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Get kyc record by id
export const getKycByIdHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const kyc = await getKycById(id);
        if (kyc instanceof Error) {
            res.status(400).json({ error: kyc.message });
            return;
        }
        res.status(200).json(kyc);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Update kyc record
export const updateKycHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { phone, nubanNumber, nubanCode, bvn } = req.body;
        let updatedKycData: Partial<Kyc> = {};
        if (phone) updatedKycData.phone = phone;
        if (nubanNumber) updatedKycData.nubanNumber = nubanNumber;
        if (nubanCode) updatedKycData.nubanCode = nubanCode;
        if (bvn) updatedKycData.bvn = bvn;

        if (Object.keys(updatedKycData).length === 0) {
            res.status(400).json({ error: "Missing fields to update" });
            return;
        }

        // check if the kyc record exists and approved
        const kyc = await getKycById(id);
        if (kyc instanceof Error) {
            res.status(400).json({ error: kyc.message });
            return;
        }

        if (kyc.approved) {
            res.status(400).json({ error: "Kyc record is already approved" });
            return;
        }
        
        const updatedKyc = await updateKyc(id, updatedKycData);
        if (updatedKyc instanceof Error) {
            res.status(400).json({ error: updatedKyc.message });
            return;
        }
        res.status(200).json(updatedKyc);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Delete kyc record
export const deleteKycHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        await deleteKyc(id);
        res.status(204).end();
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Verify kyc details
export const verifyKycHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const kyc = await getKycByUserId(req.body.user.id);
        if (kyc instanceof Error) {
            res.status(400).json({ error: kyc.message });
            return;
        }
        const kycValid = verifyKyc(kyc);
        if (!kycValid) {
            res.status(400).json({ error: "Invalid kyc details" });
            return;
        }
        res.status(200).json({ message: "Kyc details are valid" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
