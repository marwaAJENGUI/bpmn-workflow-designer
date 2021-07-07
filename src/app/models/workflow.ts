import { Customers } from "./customers.enum";
import { Modules } from "./modules.enum";

export class Workflow {
    private id: number;
    private customer: string;
    private module: string;
    private name: string;
    private version: number;
    private dateCreated: Date;
    private dateModified: Date;
//    private filePath: string;
    private draft: boolean;
    private xml: string;
    private action: string;
    private processDefinitionId: string;

    private randomValue = enumeration => {
        console.log('enumeration: ' + enumeration);
        const values = Object.keys(enumeration);
        console.log('values: ' + values);
        const enumKey = values[Math.floor(Math.random() * values.length)];
        console.log('enumKey: ' +enumKey);
        return enumeration[ enumKey];
      };

    public constructor(name: string, draft: boolean, xml: string, action: string){
        this.dateCreated= new Date();
        this.version=this.dateCreated.getTime();
        this.draft=draft;
        this.name=name;
        this.module=this.randomValue(Modules);
        this.customer=this.randomValue(Customers);
    //    this.filePath=this.setPath();
        this.xml= xml;
        this.action=action;
        console.info("workflow->action : "+this.action);
    }
    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getCustumer(): string {
        return this.customer;
    }

    public setCustumer(custumer: string): void {
        this.customer = custumer;
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

 /*   public getFilePath(): string {
        return this.filePath;
    }

    public setFilePath(filePath: string): void {
        this.filePath = filePath;
        this.dateModified = new Date();
        this.version= this.dateModified.getTime();
    }
*/
    public getDraft(): boolean {
        return this.draft;
    }

    public setDraft(draft: boolean): void {
        this.draft = draft;
    }

    public getXml(): string {
        return this.xml;
    }

    public setXml(xml: string): void {
        this.xml = xml;
    }
    public getAction(): string {
        return this.action;
    }

    public setAction(action: string): void {
        this.action = action;
    }

    public getProcessDefinitionId(): string {
        return this.processDefinitionId;
      }
      public setProcessDefinitionId(processDefinitionId: string) {
        this.processDefinitionId=processDefinitionId;
      } 

    public getPath(){
        let file = (this.draft)?"draft":"valid";
        return this.module+"/"+this.customer+"/"+file+"/"+this.name+"_"+this.version;
    }
}
