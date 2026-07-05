/// <reference types="node" />
import {allure} from 'allure-playwright';

export class AllureHelper {
    static addAllReporting(params:{
        caseId: string;
        feature: string;
        epic: string;
        owner: string;
        description: string;
        urlBase?: string;
    }){
        const {caseId, feature, epic, owner, description, urlBase} = params;
        this.addTestRail(caseId, urlBase);
        this.addFeature(feature);
        this.addEpic(epic);
        this.addOwner(owner);
        this.addDescription(description);
        this.addEnvironment();
    }

    static addTestRail(caseId: string, urlBase: string='https://yourtestrailurl.com'){
        allure.link('TestRail', `${urlBase}${caseId.replace('c','')}`, `TestRail Case ${caseId}`);
    }

    static addFeature(feature: string){
        allure.label('feature', feature);
    }

    static addEpic(epic: string){
        allure.label('epic', epic);
    }

    static addOwner(owner: string){
        allure.label('owner', owner);
    }

    static addDescription(description: string){
        allure.description(description);
    }

    static addEnvironment(){
        allure.label('Environment', process.env.ENV ?? 'unknown');
    }

}