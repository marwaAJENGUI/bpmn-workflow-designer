export class User {

  private id: number;
  private username: string;
  private password: string;
  private role: string;
  private firstName: string;
  private lastName: string;
  private email: string;


  public setId(id: number) {
    this.id=id;
  }

  public setUsername(username: string) {
    this.username=username;
  }

  public setPassword(password: string) {
    this.password=password;
  }

  public setRole(role: string) {
    this.role=role;
  }

  public setFirstName(firstName: string) {
    this.firstName=firstName;
  }

  public setLastName(lastName: string) {
    this.lastName=lastName;
  }

  public setEmail(email: string) {
    this.email=email;
  }


  public getId(): number {
    return this.id;
  }

  public getUsername(): string {
    return this.username;
  }

  public getPassword(): string {
    return this.password;
  }

  public getRole(): string {
    return this.role;
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getEmail(): string {
    return this.email;
  }


  /*constructor (id:number, username,password,role,firstName,lastName,email  : string){
    this.id=id;
    this.username = username;
    this.password = password;
    this.role=role;
    this.firstName=firstName;
    this.lastName=lastName;
    this.email=email;
  }*/
  
  constructor (username,password : string){
    this.username = username;
    this.password = password ;
  }
}