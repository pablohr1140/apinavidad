export interface PrismaFlagState {
    readsEnabled: true;
    writesEnabled: true;
    summary: string;
}
export declare const getPrismaFlagState: () => PrismaFlagState;
