import { Product } from "../../../../../shared/models/product";
import { ProductService } from "../../../../../shared/services/product.service";
import { PagseguroService } from "../../../../../shared/services/pagseguro.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import * as jspdf from "jspdf";
import html2canvas from "html2canvas";
declare var $: any;
@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.scss"],
})
export class ResultComponent implements OnInit {
  products: Product[];
  date: number;
  totalPrice = 0;
  tax = 10;

  constructor(
    private productService: ProductService,
    private pagseguroService: PagseguroService
  ) {
    /* Hiding Billing Tab Element */
    document.getElementById("productsTab").style.display = "none";
    document.getElementById("shippingTab").style.display = "none";
    document.getElementById("billingTab").style.display = "none";
    document.getElementById("resultTab").style.display = "block";

    this.products = productService.getLocalCartProducts();

    this.products.forEach((product) => {
      this.totalPrice += product.productPrice;
    });

    this.date = Date.now();
  }

  ngOnInit() {
    this.tax = this.totalPrice * 0.1;
  }

  downloadReceipt() {
    const data = document.getElementById("receipt");
    // console.log(data);

    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL("image/png");
      const pdf = new jspdf("p", "mm", "a4"); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      pdf.save("pedido.pdf"); // Generated PDF
    });
  }
  getPayment() {
    const params = {
      currency: "BRL",
      itemId1: "0001",
      itemDescription1: "Notebook Prata",
      itemAmount1: 100.0,
      itemQuantity1: 1,
      itemWeight1: 1000,
      reference: "REF1234",
      senderName: "Jose Comprador",
      senderAreaCode: 11,
      senderPhone: 56713293,
      senderCPF: 38440987803,
      senderBornDate: "12 / 03 / 1990",
      senderEmail: "email@sandbox.pagseguro.com.br",
      shippingType: 1,
      shippingAddressStreet: "Av.Brig.Faria Lima",
      shippingAddressNumber: 1384,
      shippingAddressComplement: "2o andar",
      shippingAddressDistrict: "Jardim Paulistano",
      shippingAddressPostalCode: "01452002",
      shippingAddressCity: "Sao Paulo",
      shippingAddressState: "SP",
      shippingAddressCountry: "BRA",
      extraAmount: -0.01,
      redirectURL: "http://sitedocliente.com",
      notificationURL: "https://url_de_notificacao.com",
      maxUses: 1,
      maxAge: 3000,
      shippingCost: 0.0,
    };
    this.pagseguroService.getPayment(params);
  }
}
