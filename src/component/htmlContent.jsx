import Currancy from '../Currancy'
import DateFormate from '../dateFormate'
import numberToWords from "number-to-words";
const htmlContent = ({bill,localUserData})=>{

 const totalQuantity = bill?.products?.reduce((prev,nex)=>{return prev + Number(nex?.quantity)},0)
 
const words = numberToWords.toWords(Number(bill?.totalAmount || 0)) 
const receiveDuesAmount = bill?.dues && bill?.dues?.dues ? bill?.dues?.duesAmount?.reduce((prev,next)=>{return prev + Number(next?.duesAmount)},0) : null
const TotalDuesAmount = receiveDuesAmount &&  bill?.totalAmount - receiveDuesAmount
const TotalDiscount = bill?.totalProductPrice ? (bill?.totalProductPrice - bill?.totalAmount) >= 0 && (bill?.totalProductPrice - bill?.totalAmount) : 0 
return (`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice</title>
  <style>
  *{
    margin:0;
    padding:0;
    box-sizing:border-box;
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
    table th:nth-child(2), table td:nth-child(2) {
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
      <img src="${localUserData ? `data:image/jpeg;base64,${localUserData?.imageLogo}` :"#"}" alt="Logo">

    
     <div>
       <h3 style="color:#ff6600">${localUserData?.beusnessName ? localUserData?.beusnessName :"STORE MANAGEMENT"}</h3>
       <p>Address :${localUserData?.Adress ? localUserData?.Adress : "No"}</p>
       <p>Phone : ${localUserData?.phone ? localUserData?.phone :"No"}</p>
       <p>Email : ${localUserData?.Email ? localUserData?.Email : "No"}</p>
       <p>Website : ${localUserData?.Web ? localUserData?.Web : "No"}</p>
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
          <th>S/R</th>
          <th>ITEMS</th>
          <th>QTY.</th>
          <th>RATE</th>
          <th>AMOUNT</th>
        </tr>
      </thead>
      <tbody>
         ${
         bill?.products?.map((items,index)=>{ 
           return (`
          <tr>
          <td>${index + 1}</td>
          <td>${items?.name}</td>
          <td>${items?.quantity} ${(items?.units || '').toUpperCase()}</td>
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
      <p style="font-weight:bolder;font-size:20px;" >${Currancy(bill?.totalProductPrice ? bill?.totalProductPrice : bill?.totalAmount)}</p>
    </div>
    
    <div style="display:flex;justify-content:space-between;"> <div class="bank-details">
      <h3>Bank Details</h3>
      Name: ${localUserData && localUserData?.bankHolderName ? localUserData?.bankHolderName : 'none'} <br>
      IFSC Code: ${localUserData && localUserData?.ifsccode ? localUserData?.ifsccode : 'none'} <br>
      Account No: ${localUserData && localUserData?.accountNumber ? localUserData?.accountNumber : 'none'} <br>
      Bank: ${localUserData && localUserData?.bankName ? localUserData?.bankName : 'none'} 
    </div>
    ${bill?.dues && bill?.dues?.dues ?
   ` <div style="width:300px;margin-top:20px">
     <h3 style="font-weight:bolder;font-size:18px;">Dues Transactions </h3>
      
     ${bill?.dues?.duesAmount?.map((item,index)=>{ 
       return`
       <div style="display:flex;gap:20px;">
        <p>${index+1}. ${DateFormate(item?.duesDate)}</p> <p>${Currancy(item?.duesAmount)}</p>
       </div>
       `
     }).join('')}
    </div>` : ''
    }
    
    <div class="totals"> 
      <h3>Total Amount: ${Currancy(bill?.totalProductPrice ? bill?.totalProductPrice : bill?.totalAmount)}</h3>
      ${TotalDiscount > 0 ? `<h3>Discount: ${Currancy(TotalDiscount)}</h3>` : ''}
      <h3>Grand Total Amount: ${Currancy(bill?.totalAmount)}</h3>
       <h4 style="text-transform:capitalize">Total Amount (in words): ${words} Rupees</h4>
       </br>
      ${bill?.dues && bill?.dues?.dues ? `<h3> Receive Amount: ${Currancy(receiveDuesAmount)}</h3>` : ''}
      ${bill?.dues && bill?.dues?.dues ? `<h3> Dues Amount: ${Currancy(TotalDuesAmount)}</h3>` : ''} 
      
      
    </div>   
  </div>
  
  <div class="terms">
      <h3>Terms and Conditions</h3>
      1. Goods once sold will not be taken back or exchanged.<br>
      2. All disputes are subject to Garhwa / Jharkhand jurisdiction only.<br>
       Any enqairy Please contact To ${localUserData ? localUserData?.phone : 1234567890} my number.
    </div> 
    <footer>
      Invoice created By <strong>${localUserData ? localUserData?.beusnessName : 'Store Managment'}</strong>
    </footer>
  </div>
</body>
</html>`)
}
export default htmlContent
