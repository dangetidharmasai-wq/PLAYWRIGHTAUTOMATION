

export class TestInfoHelper {
    static addAllReportingCombined(testInfo: any, params: {
        caseId: string;
        feature: string;
        epic: string;
        owner: string;
        description: string;
        urlBase?: string;
        note?: string;
    }) {
        this.addEnvironment(testInfo);
        this.addFeature(testInfo, params.feature);
        this.addEpic(testInfo, params.epic);
        this.addOwner(testInfo, params.owner);
        this.addDescription(testInfo, params.description);
        this.addTestRail(testInfo, params.caseId, params.urlBase || 'https://yourtestrailurl.com');
        if (params.note) {
            this.addNote(testInfo, params.note);
        }
    }

      static addEnvironment(testInfo: any) {
        testInfo.annotations.push({ type: 'Environment', description: process.env.ENV });
    }    
    
    static addFeature(testInfo: any, feature: string) {
        testInfo.annotations.push({ type: 'feature', description: feature });
    }
     
    static addEpic(testInfo: any, epic: string) {
        testInfo.annotations.push({ type: 'epic', description: epic });
    }

    static addOwner(testInfo: any, owner: string) {
        testInfo.annotations.push({ type: 'owner', description: owner });
    }

    static addDescription(testInfo: any, description: string) {
        testInfo.annotations.push({ type: 'description', description: description });
    }

    static addNote(testInfo: any, note: string) {
        testInfo.annotations.push({ type: 'note', description: note });
    }

    static addTestRail(testInfo: any, caseId: string, urlBase: string) {
        testInfo.annotations.push({ type: 'TestRail', description: caseId });
        testInfo.annotations.push({ type: 'TestRail', description: `${urlBase}${caseId.replace('c','')}` });
    }
}