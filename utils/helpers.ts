import config from "../config/config";
import axios from "axios";
import { Kyc } from "../models/kycModel";

type RequestBody = Record<string, any>;

const validateFields = (
  body: RequestBody,
  requiredFields: string[]
): string[] => {
  return requiredFields.filter(
    (field) => !body[field] || body[field].trim() === ""
  );
};

const pinValidator = (pin: string): boolean => {
  const pinRegex = /^[0-9]{4}$/;
  return pinRegex.test(pin);
};

const karmaCheck = async (email: string): Promise<boolean> => {
  const url = config.karma.api + "/verification/karma/" + email;
  const headers = {
    Authorization: `Bearer ${config.karma.secret}`,
  };

  try {
    const response = await axios.get(url, {
      headers,
      validateStatus: (status) => {
        return status >= 200 && status < 500; // Resolve for any status code in the range 200-499
      },
    });

    if (response.status === 404 && response.data.message === "Identity not found in karma") {
      return true;
    }

    if (response.status === 200 && response.data.message === "Successful") {
      return true;
    }

    return false; // Default case if no condition matches
  } catch (error: any) {
    console.error("Inside axios catch block", error.message);
    return false;
  }
};


const accNumGenerator = (): number => {
  return Math.floor(1000000000 + Math.random() * 9000000000);
};

// returns arary or error
const nubanBanks = (): object[] | Error => {
  const url = config.karma.api + "/banks";
  const headers = {
    Authorization: `Bearer ${config.karma.secret}`,
  };
  axios
    .get(url, { headers })
    .then((response) => {
      const banks: object[] = response.data;
      return banks;
    })
    .catch((error) => {
      return new Error(error.message);
    });

  return [];
};

// serach for the bank code
const searchBank = (bankName: string): string | Error => {
  const banks = nubanBanks();
  if (banks instanceof Error) {
    return banks;
  }

  const bank: any = banks.find((bank: any) => bank.name === bankName);
  if (bank) {
    return bank;
  }

  return new Error("Bank not found");
};

const verifyKyc = (kyc: Kyc): Kyc | boolean=> {
  // verify phone
  const phoneValid = karmaCheck(kyc.phone);
  if (!phoneValid) {
    console.log("Phone number not valid");
    return false;
  }

  //verify NUBAN account number
  const nubanAcct = kyc.nubanCode + kyc.nubanNumber;
  const nubanValid = karmaCheck(nubanAcct);
  if (!nubanValid) {
    console.log("NUBAN account number not valid");
    return false;
  }

  // verify BVN
  const bvnValid = karmaCheck(kyc.bvn);
  if (!bvnValid) {
    console.log("BVN not valid");
    return false;
  }

    kyc.approved = true;
    return kyc;
};

export {
  validateFields,
  pinValidator,
  karmaCheck,
  accNumGenerator,
  verifyKyc,
  nubanBanks,
  searchBank
};
