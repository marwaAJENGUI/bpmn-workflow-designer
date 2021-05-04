export class Workflow {
    private id: number;
    private custumer: string;
    private module: string;
    private name: string;
    private version: number;
    private dateCreated: Date;
    private dateModified: Date;
    private xml: string;
    private draft: string;
    private action: string;
    

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getCustumer(): string {
        return this.custumer;
    }

    public setCustumer(custumer: string): void {
        this.custumer = custumer;
    }

    public getModule(): string {
        return this.module;
    }

    public setModule(module: string): void {
        this.module = module;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getVersion(): number {
        return this.version;
    }

    public setVersion(version: number): void {
        this.version = version;
    }

    public getDateCreated(): Date {
        return this.dateCreated;
    }

    public setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
    }

    public getDateModified(): Date {
        return this.dateModified;
    }

    public setDateModified(dateModified: Date): void {
        this.dateModified = dateModified;
    }

    public getXml(): string {
        return this.xml;
    }

    public setXml(xml: string): void {
        this.xml = xml;
    }

    public getDraft(): string {
        return this.draft;
    }

    public setDraft(draft: string): void {
        this.draft = draft;
    }

    public getAction(): string {
        return this.action;
    }

    public setAction(action: string): void {
        this.action = action;
    }

    constructor(){
        this.dateCreated= new Date();
        this.version=0;
    }
}
