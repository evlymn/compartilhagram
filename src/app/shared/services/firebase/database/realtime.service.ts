import { Injectable } from '@angular/core';
import { Database, query, ref, set, remove, update, get, push, child, limitToLast, onValue, Query, DataSnapshot, QueryConstraint, onChildChanged, onChildRemoved, onChildAdded } from "@angular/fire/database";

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  constructor(private db: Database) { }

  createId() {
    return push(child(ref(this.db), 'id')).key;
  }

  add(path: string, data: any) {
    return push(child(ref(this.db), path), data);
  }

  set(path: string, data: any) {
    return set(child(ref(this.db), path), data);
  }

  get(path: string, ...queryConstraints: QueryConstraint[]) {
    return get(query(ref(this.db, path),...queryConstraints))
  }

  update(path: string, data: any) {
    return update(ref(this.db, path), data);
  }

  delete(path: string) {
    return remove(ref(this.db, path));
  }

  onChildAdded(q: Query, callback: (snapshot: DataSnapshot, previousChildName?: string | null) => unknown){
    return onChildAdded(q, callback);
  }

  onChildChanged(q: Query, callback: (snapshot: DataSnapshot, previousChildName: string | null) => unknown) {
    return onChildChanged(q, callback);
  }

  onChildRemoved(q: Query, callback: (snapshot: DataSnapshot) => unknown) {
    return onChildRemoved(q, callback);
  }

  onValue(q: Query, callback: (snapshot: DataSnapshot) => unknown) {
    return onValue(q, callback);
  }

  onValueChanges(path: string, ...queryConstraints: QueryConstraint[]) {
    return new Observable<DataSnapshot>(subscriber => {
      onValue(query(ref(this.db, path), ...queryConstraints), snapshot => {
        subscriber.next(snapshot);
      });
    })
  }
}
