import {test, expect} from '@playwright/test';
import { loadTestDataForTestCase, generateNumber, randomString } from '../../../utils/CommonUtils';
import {ReporterUtils} from '../../../utils/ReporterUtils';
import { APIUtils } from '../../../utils/APIUtils';
import { createUserPayloadPost } from '../../../applicationComponents/api/libs/CreatePayloadPetStore';
import { PetStoreSwaggerEndpoints } from '../../../applicationComponents/api/endpoints/PetStoreSwaggerEndpoints'


test.describe('pet_1001', () => {
    let data: any;
    let id: number;
    let userName: string;

    test.beforeEach( async ({ page }, testInfo) => {
        data = loadTestDataForTestCase(__filename, 'PetStoreApis');
        console.log(`loaded testdata for ${JSON.stringify(data)}`);
        ReporterUtils.addAllReportingCombined(testInfo,{
            caseId: data.TestCase_Id,
            description: data.TestCase_Description,
            feature: 'PetStore',
            epic: 'Swagger',
            owner: 'Dharma Sai'
        });
    });

    test('Create a new pet store user', { tag: ['@smoke','@priority0']}, async ({request}, testInfo) => {

        id = generateNumber(5);
        userName = randomString(5);

        let  userInfo = {
            id,
            userName
        };

        const apiUtils = new APIUtils(request, testInfo);
        const headers = { 'Content-Type': 'application/json' };
        let createResponse: any;

        await test.step('step 1: call the api and create the new user', async () => {
            const payload = createUserPayloadPost(userInfo);
            const body = JSON.parse(payload);

            createResponse = await apiUtils.postCall(
                PetStoreSwaggerEndpoints.post_CreateStoreUser,
                headers,
                body,
                200
            );
             console.log("post call response :" , createResponse);
            expect(createResponse).toBeTruthy();

            console.log("Step 1 completed successfully");
        });

        await test.step('step 2: validate the api response', async () => {
            const userDetails = await apiUtils.getCall(
                PetStoreSwaggerEndpoints.get_user_Details(userName),
                headers,
                200
            );
           console.log(" response of get call :" , userDetails);
            expect(userDetails).toBeDefined();
            expect(userDetails.username).toBe(userName);
            expect(userDetails.email).toContain('@example.com');

            console.log("step 2 completed successfully");
        });
    });

    test.afterEach(async ({}, testInfo) => {
        try{
            let comment = '';
            if((testInfo as any).pageError){
                comment += `\nError: ${(testInfo as any).pageError}`;
            }
            console.log(testInfo.status);
            console.log(comment);
        } catch(error){
            console.error('Error in the afterEach:', error);
            throw error;
        }
    });
});