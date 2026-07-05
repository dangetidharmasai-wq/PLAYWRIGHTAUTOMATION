import { APIRequestContext, APIResponse, TestInfo, test } from "@playwright/test";
import { AppConstants } from "../applicationComponents/utilities/AppConstants";


export class APIUtils {
    private request: APIRequestContext;
    private testInfo: TestInfo;

    constructor(request: APIRequestContext, testInfo: TestInfo) {
        this.request = request;
        this.testInfo = testInfo;
    }

    private getEndpointDescription(endpoint: string): string {
        const parts = endpoint.split('/').filter(part => part && !part.match(/^v\d+$/)); // Filter out empty parts and version numbers like v1, v2, etc.
       
        const isId = (part: string) => {
            if(/^\d+$/.test(part)) return true; // Numeric ID
            if(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(part)) return true;
            if(/^[A-Z]{2,4}\d+$/i.test(part)) return true; // MongoDB ObjectId
            return false;
        }   
        let description = '';
        for (let i = parts.length - 1; i >= 0; i--) {
            if (!isId(parts[i])) {
                const resourceName = parts[i];

                const capitalize = (s: string) => s
                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                    .replace(/[_-]/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                if (i < parts.length - 1 && isId(parts[i + 1]) && i === parts.length - 2) {
                    const formattedResourceName = capitalize(resourceName);
                    description = `Get ${formattedResourceName} ${parts[i + 1]}`;
                }
                else if (i < parts.length - 1 && isId(parts[i + 1])) {
                    description = capitalize(parts[parts.length - 1]);
                }
                else {
                    description = capitalize(resourceName);
                }
                break;
            }
        }

        return description || endpoint; // Fallback to the endpoint if no description could be generated
    }

    private formatRequestResponseASHTML(title: string, requestData: Record<string, any> = {}, responseData: Record<string, any> = {}): string {
        const escapeHTML = (text: string) => {
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        };

        const formatValue = (value: any) => {
            if (value === null || value === undefined) return '<i>empty</i>';
            if (typeof value === 'object') {
                const jsonString = JSON.stringify(value, null, 2);
                return `<pre>${escapeHTML(jsonString)}</pre>`;
            }
            return escapeHTML(String(value));
        };

        const requestHtml = Object.entries(requestData)
            .map(([key, value]) => `<p><strong>${escapeHTML(key)}:</strong> ${formatValue(value)}</p>`)
            .join('');

        const responseHtml = Object.entries(responseData)
            .map(([key, value]) => `<p><strong>${escapeHTML(key)}:</strong> ${formatValue(value)}</p>`)
            .join('');

        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHTML(title)}</title><style>body { font-family: Arial, sans-serif; } pre { background:#f6f8fa; padding:8px; border-radius:4px; }</style></head><body><h3>${escapeHTML(title)}</h3><h4>Request Data:</h4>${requestHtml || '<p><i>None</i></p>'}<h4>Response Data:</h4>${responseHtml || '<p><i>None</i></p>'}</body></html>`;
    }

    private buildUrl(endpoint: string, queryParam?: Record<string, string>): string {
        let url = endpoint;
        if (queryParam && Object.keys(queryParam).length > 0) {
            const searchParams = new URLSearchParams(queryParam);
            const separator = url.includes('?') ? '&' : '?';
            url += `${separator}${searchParams.toString()}`;
        }
        return url;
    }

    private parseResponseText(responseText: string): any {
        try {
            return JSON.parse(responseText);
        }
        catch {
            return responseText;
        }
    }

    private async apiCall(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        endpoint: string,
        headers: Record<string, string>,
        expectedStatus: number = 200,
        queryParam?: Record<string, string>,
        body?: any
    ): Promise<any> {
        const url = this.buildUrl(endpoint, queryParam);
        const functionality = this.getEndpointDescription(endpoint);
        const requestLabel = `${method} Call: ${functionality}`;

        const sendRequest = async () => {
            const startTime = Date.now();
            let response: APIResponse;
            switch (method) {
                case 'POST':
                    response = await this.request.post(url, { headers, data: body });
                    break;
                case 'PUT':
                    response = await this.request.put(url, { headers, data: body });
                    break;
                case 'DELETE':
                    response = await this.request.delete(url, { headers });
                    break;
                default:
                    response = await this.request.get(url, { headers });
                    break;
            }

            const responseTime = Date.now() - startTime;
            const status = response.status();
            const responseText = await response.text();
            const responseBody = this.parseResponseText(responseText);
            const responseHeaders = response.headers();

            if (!AppConstants.ENABLE_API_TEST_STEPS || !this.testInfo) {
                console.log(` ***** ${requestLabel}`);
                console.log(`URL: ${url}`);
                console.log(`Query params: ${queryParam ? JSON.stringify(queryParam) : 'None'}`);
                console.log(`Request Headers: ${JSON.stringify(headers)}`);
                if (body !== undefined) {
                    console.log(`Request Body: ${JSON.stringify(body, null, 2)}`);
                }
                console.log(`Response Status: ${status}`);
                console.log(`Response Time: ${responseTime} ms`);
                console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);
            }

            if (status !== expectedStatus) {
                throw new Error(`Rest API ${method} call failed. Expected status ${expectedStatus} but got ${status}. Response: ${responseText}`);
            }

            return {
                status,
                responseTime,
                responseText,
                responseBody,
                responseHeaders
            };
        };

        if (!AppConstants.ENABLE_API_TEST_STEPS || !this.testInfo) {
            const result = await sendRequest();
            return result.responseBody;
        }

        return await test.step(requestLabel, async () => {
            let result: Awaited<ReturnType<typeof sendRequest>> | undefined = undefined;
            try {
                result = await sendRequest();
                return result.responseBody;
            }
            finally {
                const combinedHtml = this.formatRequestResponseASHTML(
                    requestLabel,
                    {
                        URL: url,
                        "Query Params": queryParam ? JSON.stringify(queryParam) : 'None',
                        "Request Headers": JSON.stringify(headers),
                        "Request Body": body !== undefined ? JSON.stringify(body, null, 2) : 'None',
                        "Expected Status": expectedStatus
                    },
                    {
                        'Response Status': result?.status ?? 'unknown',
                        'Response Time': `${result?.responseTime ?? 0} ms`,
                        'Response Headers': JSON.stringify(result?.responseHeaders ?? {}),
                        'Response Body': result?.responseBody ?? result?.responseText ?? 'empty'
                    }
                );

                await this.testInfo!.attach(`${requestLabel} [${result?.status ?? 'unknown'}] (${result?.responseTime ?? 0} ms)`, {
                    body: combinedHtml,
                    contentType: 'text/html'
                });
            }
        });
    }

    async getCall(endpoint: string, headers: Record<string, string>, expectedStatus: number = 200, queryParam?: Record<string, string>): Promise<any> {
        return await this.apiCall('GET', endpoint, headers, expectedStatus, queryParam);
    }

    async postCall(endpoint: string, headers: Record<string, string>, body: any, expectedStatus: number = 201, queryParam?: Record<string, string>): Promise<any> {
        return await this.apiCall('POST', endpoint, headers, expectedStatus, queryParam, body);
    }

    async putCall(endpoint: string, headers: Record<string, string>, body: any, expectedStatus: number = 200, queryParam?: Record<string, string>): Promise<any> {
        return await this.apiCall('PUT', endpoint, headers, expectedStatus, queryParam, body);
    }

    async deleteCall(endpoint: string, headers: Record<string, string>, expectedStatus: number = 204, queryParam?: Record<string, string>): Promise<any> {
        return await this.apiCall('DELETE', endpoint, headers, expectedStatus, queryParam);
    }
}
