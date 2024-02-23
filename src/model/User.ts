import { deserializeAs, serializeAs } from 'cerialize';

export class User {
  @serializeAs('LoginUserID')
  @deserializeAs('LoginUserID')
  private _LoginUserID: number = 0;

  @serializeAs('LoginReferenceID')
  @deserializeAs('LoginReferenceID')
  private _LoginReferenceID: number = 0;

  @serializeAs('Code')
  @deserializeAs('Code')
  private _Code: string = '';

  @serializeAs('LoginUser')
  @deserializeAs('LoginUser')
  private _LoginUser: string = '';

  @serializeAs('LoginCompanyID')
  @deserializeAs('LoginCompanyID')
  private _LoginCompanyID: number = 0;

  @serializeAs('LoginCompany')
  @deserializeAs('LoginCompany')
  private _LoginCompany: string = '';

  @serializeAs('LoginRoleID')
  @deserializeAs('LoginRoleID')
  private _LoginRoleID: number = 0;

  @serializeAs('LoginRole')
  @deserializeAs('LoginRole')
  private _LoginRole: string = '';

  @serializeAs('ValidationMsg')
  @deserializeAs('ValidationMsg')
  private _ValidationMsg: string = '';

  @serializeAs('Profile')
  @deserializeAs('Profile')
  private _Profile: string = '';

  @serializeAs('FinancialYearID')
  @deserializeAs('FinancialYearID')
  private _FinancialYearID: number = 0;

  @serializeAs('FinancialYear')
  @deserializeAs('FinancialYear')
  private _FinancialYear: string = '';

  @serializeAs('NatureOfBusinessID')
  @deserializeAs('NatureOfBusinessID')
  private _NatureOfBusinessID: number = 0;

  @serializeAs('MobileNumber')
  @deserializeAs('MobileNumber')
  private _MobileNumber: number = 0;

  @serializeAs('EmailID')
  @deserializeAs('EmailID')
  private _EmailID: string = '';

  @serializeAs('Welcome')
  @deserializeAs('Welcome')
  private _Welcome: string = '';

  @serializeAs('ContainerName')
  @deserializeAs('ContainerName')
  private _ContainerName: string = '';

  @serializeAs('SASToken')
  @deserializeAs('SASToken')
  private _SASToken: string = '';

  @serializeAs('StorageConnectionString')
  @deserializeAs('StorageConnectionString')
  private _StorageConnectionString: string = '';

  @serializeAs('AzurePath')
  @deserializeAs('AzurePath')
  private _AzurePath: string = '';

  @serializeAs('accountname')
  @deserializeAs('accountname')
  private _accountname: string = '';

  @serializeAs('ActivateUserURL')
  @deserializeAs('ActivateUserURL')
  private _ActivateUserURL: string = '';

  @serializeAs('Auth_Token_Web')
  @deserializeAs('Auth_Token_Web')
  private _Auth_Token_Web: string = '';

  @serializeAs('WidgetID_Labguru')
  @deserializeAs('WidgetID_Labguru')
  private _WidgetID_Labguru: string = '';

  @serializeAs('WidgetID_Portal')
  @deserializeAs('WidgetID_Portal')
  private _WidgetID_Portal: string = '';

  @serializeAs('appId')
  @deserializeAs('appId')
  private _appId: string = '';

  @serializeAs('apiKey')
  @deserializeAs('apiKey')
  private _apiKey: string = '';

  @serializeAs('Cometchat_URL')
  @deserializeAs('Cometchat_URL')
  private _Cometchat_URL: string = '';

  @serializeAs('App_Region')
  @deserializeAs('App_Region')
  private _App_Region: string = '';

  @serializeAs('Main_Group')
  @deserializeAs('Main_Group')
  private _Main_Group: string = '';

  @serializeAs('Cometchat_Enabled')
  @deserializeAs('Cometchat_Enabled')
  private _Cometchat_Enabled: boolean = false;

  @serializeAs('ReleaseNoteURL')
  @deserializeAs('ReleaseNoteURL')
  private _ReleaseNoteURL: string = '';

  @serializeAs('APIURL_Source')
  @deserializeAs('APIURL_Source')
  private _APIURL_Source: string = '';

  @serializeAs('APIURL_Destination')
  @deserializeAs('APIURL_Destination')
  private _APIURL_Destination: string = '';

  @serializeAs('BrandName')
  @deserializeAs('BrandName')
  private _BrandName: string = '';

  @serializeAs('CustomerID_Destination')
  @deserializeAs('CustomerID_Destination')
  private _CustomerID_Destination: number = 0;

  @serializeAs('LoginUserID_Destination')
  @deserializeAs('LoginUserID_Destination')
  private _LoginUserID_Destination: number = 0;

  @serializeAs('LoginCompanyID_Destination')
  @deserializeAs('LoginCompanyID_Destination')
  private _LoginCompanyID_Destination: number = 0;

  @serializeAs('BrandType')
  @deserializeAs('BrandType')
  private _BrandType: string = '';

  @serializeAs('DestinationName')
  @deserializeAs('DestinationName')
  private _DestinationName: string = '';

  @serializeAs('RetainerToBeProvided')
  @deserializeAs('RetainerToBeProvided')
  private _RetainerToBeProvided: boolean = false;

  @serializeAs('LocationID')
  @deserializeAs('LocationID')
  private _LocationID: number = 0;

  /**
   * Getter DestinationName
   * @return {string}
   */
  public get DestinationName(): string {
    return this._DestinationName;
  }

  /**
     * Setter DestinationName
     * @param {string} value
     */
  public set DestinationName(value: string) {
    this._DestinationName = value;
  }

  /**
   * Getter LoginUserID
   * @return {number}
   */
  public get LoginUserID(): number {
    return this._LoginUserID;
  }

  /**
   * Getter Code
   * @return {string}
   */
  public get Code(): string {
    return this._Code;
  }

  /**
   * Getter LoginUser
   * @return {string}
   */
  public get LoginUser(): string {
    return this._LoginUser;
  }

  /**
   * Getter LoginCompanyID
   * @return {number}
   */
  public get LoginCompanyID(): number {
    return this._LoginCompanyID;
  }

  /**
   * Getter LoginCompany
   * @return {string}
   */
  public get LoginCompany(): string {
    return this._LoginCompany;
  }

  /**
   * Getter LoginRoleID
   * @return {number}
   */
  public get LoginRoleID(): number {
    return this._LoginRoleID;
  }

  /**
   * Getter LoginRole
   * @return {string}
   */
  public get LoginRole(): string {
    return this._LoginRole;
  }

  /**
   * Getter ValidationMsg
   * @return {string}
   */
  public get ValidationMsg(): string {
    return this._ValidationMsg;
  }

  /**
   * Getter Profile
   * @return {string}
   */
  public get Profile(): string {
    return this._Profile;
  }

  /**
   * Getter FinancialYearID
   * @return {number}
   */
  public get FinancialYearID(): number {
    return this._FinancialYearID;
  }

  /**
   * Getter FinancialYear
   * @return {string}
   */
  public get FinancialYear(): string {
    return this._FinancialYear;
  }

  /**
   * Getter MobileNumber
   * @return {number}
   */
  public get MobileNumber(): number {
    return this._MobileNumber;
  }

  /**
   * Getter Welcome
   * @return {string}
   */
  public get Welcome(): string {
    return this._Welcome;
  }
  /**
   * Getter EmailID
   * @return {string}
   */
  public get EmailID(): string {
    return this._EmailID;
  }
  /**
   * Getter ContainerName
   * @return {string}
   */
  public get ContainerName(): string {
    return this._ContainerName;
  }
  /**
   * Getter SASToken
   * @return {string}
   */
  public get SASToken(): string {
    return this._SASToken;
  }
  /**
   * Getter StorageConnectionString
   * @return {string}
   */
  public get StorageConnectionString(): string {
    return this._StorageConnectionString;
  }
  /**
   * Getter AzurePath
   * @return {string}
   */
  public get AzurePath(): string {
    return this._AzurePath;
  }
  /**
   * Getter accountname
   * @return {string}
   */
  public get accountname(): string {
    return this._accountname;
  }

  /**
   * Setter LoginUserID
   * @param {number} value
   */
  public set LoginUserID(value: number) {
    this._LoginUserID = value;
  }

  /**
   * Setter Code
   * @param {string} value
   */
  public set Code(value: string) {
    this._Code = value;
  }

  /**
   * Setter LoginUser
   * @param {string} value
   */
  public set LoginUser(value: string) {
    this._LoginUser = value;
  }

  /**
   * Setter LoginCompanyID
   * @param {number} value
   */
  public set LoginCompanyID(value: number) {
    this._LoginCompanyID = value;
  }

  /**
   * Setter LoginCompany
   * @param {string} value
   */
  public set LoginCompany(value: string) {
    this._LoginCompany = value;
  }

  /**
   * Setter LoginRoleID
   * @param {number} value
   */
  public set LoginRoleID(value: number) {
    this._LoginRoleID = value;
  }

  /**
   * Setter LoginRole
   * @param {string} value
   */
  public set LoginRole(value: string) {
    this._LoginRole = value;
  }

  /**
   * Setter ValidationMsg
   * @param {string} value
   */
  public set ValidationMsg(value: string) {
    this._ValidationMsg = value;
  }

  /**
   * Setter Profile
   * @param {string} value
   */
  public set Profile(value: string) {
    this._Profile = value;
  }

  /**
   * Setter FinancialYearID
   * @param {number} value
   */
  public set FinancialYearID(value: number) {
    this._FinancialYearID = value;
  }

  /**
   * Setter FinancialYear
   * @param {string} value
   */
  public set FinancialYear(value: string) {
    this._FinancialYear = value;
  }

  /**
   * Setter MobileNumber
   * @param {number} value
   */
  public set MobileNumber(value: number) {
    this._MobileNumber = value;
  }

  /**
   * Setter EmailID
   * @param {string} value
   */
  public set EmailID(value: string) {
    this._EmailID = value;
  }

  /**
   * Getter LoginReferenceID
   * @return {number}
   */
  public get LoginReferenceID(): number {
    return this._LoginReferenceID;
  }

  /**
   * Getter NatureOfBusinessID
   * @return {number}
   */
  public get NatureOfBusinessID(): number {
    return this._NatureOfBusinessID;
  }

  /**
   * Setter LoginReferenceID
   * @param {number} value
   */
  public set LoginReferenceID(value: number) {
    this._LoginReferenceID = value;
  }

  /**
   * Setter NatureOfBusinessID
   * @param {number} value
   */
  public set NatureOfBusinessID(value: number) {
    this._NatureOfBusinessID = value;
  }

  /**
   * Setter Welcome
   * @param {number} value
   */
  public set Welcome(value: string) {
    this._Welcome = value;
  }
  /**
   * Setter ContainerName
   * @param {number} value
   */
  public set ContainerName(value: string) {
    this._ContainerName = value;
  }
  /**
   * Setter SASToken
   * @param {string} value
   */
  public set SASToken(value: string) {
    this._SASToken = value;
  }
  /**
   * Setter StorageConnectionString
   * @param {string} value
   */
  public set StorageConnectionString(value: string) {
    this._StorageConnectionString = value;
  }
  /**
   * Setter AzurePath
   * @param {string} value
   */
  public set AzurePath(value: string) {
    this._AzurePath = value;
  }
  /**
   * Setter accountname
   * @param {string} value
   */
  public set accountname(value: string) {
    this._accountname = value;
  }

  /**
   * Getter ActivateUserURL
   * @return {string}
   */
  public get ActivateUserURL(): string {
    return this._ActivateUserURL;
  }

  /**
   * Setter ActivateUserURL
   * @param {string} value
   */
  public set ActivateUserURL(value: string) {
    this._ActivateUserURL = value;
  }


  /**
   * Getter Auth_Token_Web
   * @return {string}
   */
  public get Auth_Token_Web(): string {
    return this._Auth_Token_Web;
  }

  /**
   * Setter Auth_Token_Web
   * @param {string} value
   */
  public set Auth_Token_Web(value: string) {
    this._Auth_Token_Web = value;
  }


  /**
   * Getter WidgetID_Labguru
   * @return {string}
   */
  public get WidgetID_Labguru(): string {
    return this._WidgetID_Labguru;
  }
  /**
   * Setter WidgetID_Labguru
   * @param {string} value
   */
  public set WidgetID_Labguru(value: string) {
    this._WidgetID_Labguru = value;
  }

  /**
   * Getter WidgetID_Portal
   * @return {string}
   */
  public get WidgetID_Portal(): string {
    return this._WidgetID_Portal;
  }
  /**
   * Setter WidgetID_Portal
   * @param {string} value
   */
  public set WidgetID_Portal(value: string) {
    this._WidgetID_Portal = value;
  }

  /**
   * Getter appId
   * @return {string}
   */
  public get appId(): string {
    return this._appId;
  }
  /**
   * Setter appId
   * @param {string} value
   */
  public set appId(value: string) {
    this._appId = value;
  }

  /**
   * Getter apiKey
   * @return {string}
   */
  public get apiKey(): string {
    return this._apiKey;
  }
  /**
   * Setter apiKey
   * @param {string} value
   */
  public set apiKey(value: string) {
    this._apiKey = value;
  }

  /**
   * Getter Cometchat_URL
   * @return {string}
   */
  public get Cometchat_URL(): string {
    return this._Cometchat_URL;
  }
  /**
   * Setter Cometchat_URL
   * @param {string} value
   */
  public set Cometchat_URL(value: string) {
    this._Cometchat_URL = value;
  }

  /**
   * Getter App_Region
   * @return {string}
   */
  public get App_Region(): string {
    return this._App_Region;
  }
  /**
   * Setter App_Region
   * @param {string} value
   */
  public set App_Region(value: string) {
    this._App_Region = value;
  }

  /**
   * Getter Main_Group
   * @return {string}
   */
  public get Main_Group(): string {
    return this._Main_Group;
  }
  /**
   * Setter Main_Group
   * @param {string} value
   */
  public set Main_Group(value: string) {
    this._Main_Group = value;
  }

  /**
   * Getter Cometchat_Enabled
   * @return {boolean}
   */
  public get Cometchat_Enabled(): boolean {
    return this._Cometchat_Enabled;
  }
  /**
   * Setter Cometchat_Enabled
   * @param {boolean} value
   */
  public set Cometchat_Enabled(value: boolean) {
    this._Cometchat_Enabled = value;
  }

  /**
   * Getter ReleaseNoteURL
   * @return {string}
   */
   public get ReleaseNoteURL(): string {
    return this._ReleaseNoteURL;
  }
  /**
   * Setter ReleaseNoteURL
   * @param {string} value
   */
  public set ReleaseNoteURL(value: string) {
    this._ReleaseNoteURL = value;
  }

  /**
 * Getter APIURL_Source
 * @return {string}
 */
  public get APIURL_Source(): string {
    return this._APIURL_Source;
  }

  /**
   * Setter APIURL_Source
   * @param {string} value
   */
    public set APIURL_Source(value: string) {
    this._APIURL_Source = value;
  }

  /**
   * Getter APIURL_Destination
   * @return {string}
   */
    public get APIURL_Destination(): string {
    return this._APIURL_Destination;
  }

  /**
   * Setter APIURL_Destination
   * @param {string} value
   */
    public set APIURL_Destination(value: string) {
    this._APIURL_Destination = value;
  }

  /**
   * Getter BrandName
   * @return {string}
   */
    public get BrandName(): string {
    return this._BrandName;
  }

  /**
   * Setter BrandName
   * @param {string} value
   */
    public set BrandName(value: string) {
    this._BrandName = value;
  }

  /**
   * Getter CustomerID_Destination
   * @return {number}
   */
    public get CustomerID_Destination(): number {
    return this._CustomerID_Destination;
  }

  /**
   * Setter CustomerID_Destination
   * @param {number} value
   */
    public set CustomerID_Destination(value: number) {
    this._CustomerID_Destination = value;
  }

  /**
   * Getter LoginUserID_Destination
   * @return {number}
   */
    public get LoginUserID_Destination(): number {
    return this._LoginUserID_Destination;
  }

  /**
   * Setter LoginUserID_Destination
   * @param {number} value
   */
    public set LoginUserID_Destination(value: number) {
    this._LoginUserID_Destination = value;
  }

  /**
   * Getter LoginCompanyID_Destination
   * @return {number}
   */
    public get LoginCompanyID_Destination(): number {
    return this._LoginCompanyID_Destination;
  }

  /**
   * Setter LoginCompanyID_Destination
   * @param {number} value
   */
    public set LoginCompanyID_Destination(value: number) {
    this._LoginCompanyID_Destination = value;
  }


  /**
   * Getter BrandType
   * @return {string}
   */
   public get BrandType(): string {
    return this._BrandType;
  }

  /**
   * Setter BrandType
   * @param {string} value
   */
   public set BrandType(value: string) {
    this._BrandType = value;
  }

  /**
   * Getter RetainerToBeProvided
   * @return {boolean}
   */
  public get RetainerToBeProvided(): boolean {
    return this._RetainerToBeProvided;
  }
  /**
   * Setter RetainerToBeProvided
   * @param {boolean} value
   */
  public set RetainerToBeProvided(value: boolean) {
    this._RetainerToBeProvided = value;
  }

  /**
   * Getter LocationID
   * @return {number}
   */
   public get LocationID(): number {
    return this._LocationID;
  }
  /**
   * Setter LocationID
   * @param {number} value
   */
  public set LocationID(value: number) {
    this._LocationID = value;
  }

}
