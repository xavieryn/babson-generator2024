export interface SightEngineResponse {
    status: string;
    request: {
        id: string;
        timestamp: number;
        operations: number;
    };
    type: {
        ai_generated: number;
    };
    media: {
        id: string;
        uri: string;
    };
}