import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable()
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    return this._storage?.set(key, value);
  }

  public async get(key: string) {
    if (this._storage) {
      return await this._storage.get(key);
    }
    return null;
  }

  public remove(key: string) {
    return this._storage?.remove(key);
  }
}
