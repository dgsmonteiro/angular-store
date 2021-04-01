import {
  AngularFireList,
  AngularFireObject,
  AngularFireDatabase,
} from "@angular/fire/database";
import { Billing } from "../models/billing";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  payments: AngularFireList<Billing>;
  payment: AngularFireObject<Billing>;
  constructor(private db: AngularFireDatabase) {
    this.getpayments();
  }

  createpayments(data: Billing) {
    this.payments.push(data);
  }

  getpayments() {
    this.payments = this.db.list("payments");
    return this.payments;
  }

  getpaymentById(key: string) {
    this.payment = this.db.object("products/" + key);
    return this.payment;
  }

  updatepayment(data: Billing) {
    this.payments.update(data.$key, data);
  }

  deletepayment(key: string) {
    this.payments.remove(key);
  }
}
