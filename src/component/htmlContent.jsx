import Currancy from '../Currancy'
import numberToWords from "number-to-words"; 
import * as FileSystem from "expo-file-system";
import {Image} from 'react-native'  
const htmlContent = ({bill,localUserData,qrImage})=>{

 const totalQuantity = bill?.products?.reduce((prev,nex)=>{return prev + Number(nex?.quantity)},0)
 
 const words = numberToWords.toWords(bill?.totalAmount)
  const localImg = Image.resolveAssetSource(require("../assetes/storelogo.png")).uri;
 
   
return (`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice</title>
  <style>
  *{
    margin:0;
    pading:0;
  }
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background: #f9f9f9;
    }
    .invoice-box {
      max-width: 900px;
      margin: auto;
      padding: 20px;
      border: 2px solid #333;
      border-radius: 10px;
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    header {
      display: flex; 
      align-items: center;
      border-bottom: 3px solid #ff6600;
      padding-bottom: 10px; 
    } 
    header img { 
    max-height:100px;
    }
    .invoice-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 10px;
      background: #f1f1f1;
      border-radius: 8px;
    }
    .invoice-details div {
      width: 48%;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    table th, table td {
      border-bottom: 1px solid #555;
      padding: 8px;
      text-align: center;
    }
    table th:last-child, table td:last-child {
      border-bottom: 1px solid #555;
      padding: 8px 12px;
      text-align: end;
    }
    table th:first-child, table td:first-child {
      border-bottom: 1px solid #555;
      padding: 8px 12px;
      text-align: start;
    }
    table th {
      background: #ff6600;
      color: #fff;
    }
    .totals {
      margin-top: 10px;
      text-align: right;
    }
    .totals h3 {
      margin: 5px 0;
    }
    .bank-details, .terms {
      margin-top: 20px;
      font-size: 14px;
      line-height: 1.5;
    }
    .qr-section {
      display: flex;
      align-items: center; 
      gap: 15px;
      margin-top: 10px;
      flex-direction:column;
      justify-content:space-between
    }
    .qr-section img {
      width: 100px;
      height: 100px;
    }
    footer {
      text-align: center;
      font-size: 12px;
      margin-top: 30px;
      color: #666;
    } 
  </style>
</head>
<body>
  <div class="invoice-box">
    <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px">
    <p style="font-weight:bolder;color:black;">BILL OF SUPPLY</p>
    <p style="border:solid 2px gray; padding:2px 4px;color:gray;font-weight:bolder;border-radius:3px;font-size:14px">ORIGINAL</p>
    </div>
    <header> 
      <img src="${localImg}"    alt="Logo">
      <div>
       <h3 style="color:#ff6600">${localUserData?.beusnessName}</h3>
       <p>Address : Adhouri-more, Rajhara, Ward-No 4, Meral, Garhwa, Jharkhand, 822114</p>
       <p>Phone : ${localUserData?.phone}</p>
       <p>Email : alamsheransari15@gmail.com</p>
       <p>Website : https://easyshopemart.netlify.app/</p>
      </div>
    </header>

    <div class="invoice-details"> 
       <div>
        <strong>Invoice No:</strong>  <br>
        ${bill?.invoice} 
        </div>
       <div>
        <strong>Invoice Date:</strong>  <br>
        ${bill?.date} 
        </div>
       <div>
        <strong>Invoice Time:</strong>  <br>
        ${bill?.time} 
        </div> 
       <div>
        <strong>Bill To:</strong>  <br>
        ${bill?.customerName} 
        </div>   
    </div>
    <table>
      <thead>
        <tr>
          <th>ITEMS</th>
          <th>QTY.</th>
          <th>RATE</th>
          <th>AMOUNT</th>
        </tr>
      </thead>
      <tbody>
         ${
         bill?.products?.map((items)=>{
           return (`
          <tr>
          <td>${items?.name}</td>
          <td>${items?.quantity} ${items?.units.toUpperCase()}</td>
          <td>${items?.salePrice}</td>
          <td>${Number(items?.salePrice) * Number(items?.quantity) }</td>
        </tr>`)
         }).join('')
        }
        </tbody>
    </table> 
    <div style="display:flex;border-bottom:solid 1px black;border-top:solid 1px black; justify-content:space-between;margin-top:50px ;padding:4px 8px">
      <p style="font-weight:bolder;font-size:20px;" >SUBTOTAL</p>
      <p style="font-weight:bolder;font-size:20px;" >${totalQuantity}</p>
      <p style="font-weight:bolder;font-size:20px;" >${Currancy(bill?.totalAmount)}</p>
    </div>
    <div class="totals"> 
      <h3>Total: ${Currancy(bill?.totalAmount)}</h3>
      <h4 style="text-transform:capitalize">Total Amount (in words): ${words} Rupees</h4>
    </div>
   <div style="display:flex;justify-content:space-between">
    <div>
    <div class="bank-details">
      <h3>Bank Details</h3>
      Name: ${localUserData && localUserData?.bankHolderName ? localUserData?.bankHolderName : 'none'} <br>
      IFSC Code: ${localUserData && localUserData?.ifsccode ? localUserData?.ifsccode : 'none'} <br>
      Account No: ${localUserData && localUserData?.accountNumber ? localUserData?.accountNumber : 'none'} <br>
      Bank: ${localUserData && localUserData?.bankName ? localUserData?.bankName : 'none'}
    </div>

    <div class="terms">
      <h3>Terms and Conditions</h3>
      1. Goods once sold will not be taken back or exchanged.<br>
      2. All disputes are subject to Garhwa / Jharkhand jurisdiction only.<br>
       Any enqairy Please contact To ${localUserData ? localUserData?.phone : 1234567890} my number.
    </div>
  </div>
  
    <div class="qr-section"> 
      <img src="${qrImage && qrImage}" style="height:200px;width:200px" alt="QR Code">
      <div>
        <h3>Payment QR Code</h3>
        <p>UPI ID: ${localUserData ? localUserData?.upiId : '1234567890@ybl'}</p>
      </div>
    </div>
</div>
    <footer>
      Invoice created By <strong>${localUserData ? localUserData?.beusnessName : 'Store Managment'}</strong>
    </footer>
  </div>
</body>
</html>`)
}
export default htmlContent
