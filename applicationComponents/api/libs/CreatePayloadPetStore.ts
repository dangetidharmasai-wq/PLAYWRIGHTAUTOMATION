import * as  fs from 'fs';
import * as path from 'path';
import {randomString, generateRandomEmail} from '../../../utils/CommonUtils'
import { AppConstants } from '../../utilities/AppConstants';



export function createUserPayloadPost(userInfo: Record<string, any>): string{
    try{
        const jsonFilePath = path.join(__dirname, '../payloads/PetStorePayloads/POST_CreateUser.json');
        let jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');

        // replace id with provided value (if any)
        const idValue = userInfo.id ?? userInfo.ID ?? userInfo.userId ?? '0';
        jsonContent = jsonContent.replace(/("id"\s*:\s*)\d+/g, `$1${idValue}`);

        const randomFirstName = randomString(8);
        const randomLastName  = randomString(6);
        const randomEmail =  generateRandomEmail();

        // placeholders in the JSON use uppercase tokens; map them accordingly
        const replacements = {
            'USERNAME'  : userInfo.userName ?? '',
            'FIRSTNAME' :  randomFirstName,
            'LASTNAME'  :  randomLastName,
            'EMAIL'     :   randomEmail,
            'PASSWORD'  :  AppConstants.PETSTORE_USER_PASSWORD,

        };

        for(const [key, value] of Object.entries(replacements)){
            jsonContent = jsonContent.replace(new RegExp(key, 'g'), value);
        }

        return jsonContent;
    } catch(error){
        console.error("Error Creating pet store post user creation payload:",error);
        throw new Error(`failed to create the pet store post user creation payload: ${error instanceof Error ? error.message : String(error)}`)
    }
}

