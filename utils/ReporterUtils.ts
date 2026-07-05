import { TestInfoHelper } from './TestInfoHelper';
import { AllureHelper } from './AllureHelper';

export class ReporterUtils {

  static addAllReportingCombined(testInfo: any, params: {
    caseId: string;
    feature: string;
    epic: string;
    owner: string;
    description: string;
    urlBase?: string;
    note?: string;
  }) {
    TestInfoHelper.addAllReportingCombined(testInfo, params);
    AllureHelper.addAllReporting(params);
  }

}