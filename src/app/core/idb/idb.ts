class TableInfo {
  TableName: string = '';
  PrimaryFieldName: string = '';
  PrimaryIndexName: string = '';
}

class Customer {
  Name: string = '';
  City: string = '';
  CustId: string = '';
}

class ManageTable<T> {
  db: IDBDatabase = new IDBDatabase();
  constructor(public tInfo: TableInfo) {}
  CreateRow(obj: T) {
    var trans: IDBTransaction;
    var tbl: IDBObjectStore;
    trans = this.db.transaction([this.tInfo.TableName], 'readwrite');
    tbl = trans.objectStore(this.tInfo.TableName);
    tbl.add(obj);
  }

  DeleteRow(id: string) {
    var trans: IDBTransaction;
    var tbl: IDBObjectStore;

    trans = this.db.transaction([this.tInfo.TableName], 'readwrite');
    tbl = trans.objectStore(this.tInfo.TableName);
    tbl.delete(id);
  }
  UpdateRow(obj: T) {
    var trans: IDBTransaction;
    var tbl: IDBObjectStore;
    var req: IDBRequest;
    var idx: IDBIndex;

    trans = this.db.transaction([this.tInfo.TableName], 'readwrite');
    tbl = trans.objectStore(this.tInfo.TableName);
    idx = tbl.index(this.tInfo.PrimaryIndexName);
    req = idx.get(this.tInfo.PrimaryFieldName);
    req.onsuccess = function (e: any) {
      tbl.put(obj);
    };
    req.onerror = function (e: any) {
      alert(e.target.result);
    };
  }

  ReadRow(Id: string, callback: IDBCallback<T>) {
    var trans: IDBTransaction;
    var tbl: IDBObjectStore;
    var idx: IDBIndex;
    var req: IDBRequest;

    trans = this.db.transaction([this.tInfo.TableName], 'readwrite');
    tbl = trans.objectStore(this.tInfo.TableName);
    idx = tbl.index(this.tInfo.PrimaryIndexName);
    req = idx.get(Id);
    req.onsuccess = function (e: any) {
      var obj: T;
      obj = e.target.result;
      callback.Refresh(obj);
    };
    req.onerror = function (e: any) {
      alert(e.target.result);
    };
  }
}

interface IDBCallback<T> {
  Refresh(obj: T):any;
}
// // And here's a typical IDBCallback class:
// class CustomerCallBack implements IDBCallback<Customer> {
//   Refresh(cust: Customer) {
//     $('#CustName').val(cust.Name);
//     //...code to update the remainder of the UI...
//   }
// }

export class ManageDatabase {
  private IndxDb: IDBFactory;
  public db: IDBDatabase = new IDBDatabase();
  private ti: TableInfo = new TableInfo();
  private tis: Array<TableInfo> = new Array<TableInfo>();
  private md: ManageDatabase;
  private req: IDBOpenDBRequest;
  private temp: any;
  private mt: ManageTable<Customer>;

  constructor(public dbName: string, public tInfos: Array<TableInfo>) {
    this.IndxDb = window.indexedDB;

    this.ti.TableName = 'CustOrders';
    this.ti.PrimaryFieldName = 'CustId';
    this.ti.PrimaryIndexName = 'CustIdIndex';
    this.tis[0] = this.ti;
    this.md = new ManageDatabase('CustomerOrder', this.tis);
    this.req = this.IndxDb.open(this.dbName);
    this.OpenInitDB();
    this.mt = new ManageTable<Customer>(this.ti);
    this.mt.db = this.md.db;
  }
  OpenInitDB() {
    this.req.onupgradeneeded = this.AddTables;
    this.temp = this.req.onsuccess = function (e: any) {
      return e.target.result;
    };
    this.md.db = this.temp;
  }
  AddTables(e: any) {
    this.db = e.target.result;
    var parms: IDBObjectStoreParameters;
    var tInfo: TableInfo;
    for (var it in this.md.tInfos) {
      tInfo = this.md.tInfos[it];
      parms = { keyPath: tInfo.PrimaryFieldName };
      var tblLocal: IDBObjectStore;
      tblLocal = this.md.db.createObjectStore(tInfo.TableName, parms);
      tblLocal.createIndex(tInfo.PrimaryIndexName, tInfo.PrimaryFieldName);
    }
  }
  ResetDB() {
    this.db.close();
    this.IndxDb.deleteDatabase(this.dbName);
    this.OpenInitDB();
  }
}
