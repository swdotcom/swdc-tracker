export declare function filePayload(name: string, path: string, syntax: string, line_count: number, character_count: number): Promise<{
    schema: string;
    data: {
        name: any;
        path: any;
        syntax: string;
        line_count: number;
        character_count: number;
    };
}>;
export declare function projectPayload(name: string, directory: string): Promise<{
    schema: string;
    data: {
        name: any;
        directory: any;
    };
}>;
export declare function pluginPayload(id: number, version: string): {
    schema: string;
    data: {
        id: number;
        version: string;
    };
};
export declare function repoPayload(identifier: string, name: string, owner_id: string, git_branch: string, git_tag: string): Promise<{
    schema: string;
    data: {
        identifier: any;
        name: any;
        owner_id: any;
        git_branch: any;
        git_tag: any;
    };
}>;
export declare function authPayload(jwt: string): {
    schema: string;
    data: {
        jwt: string;
    };
};
