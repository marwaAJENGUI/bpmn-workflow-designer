export class Info {
    private key: string;
    private value: string;

    public getKey(): string {
        return this.key;
    }

    public getValue(): string {
        return this.value;
    }
    constructor(key: string, value: string){
        this.key=key;
        this.value=value;
    }
}