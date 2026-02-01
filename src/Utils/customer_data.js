

const customer_data = [
  {
    id:'12',
    name:'Alamsher Ansari',
    saleList: [
      {
        sale_id:'234',
        transaction_type:'given',
        total_due:345,
        description:'total saman ka list hai or more data ke sath',
        date:'2026-01-02',
        time:'09:23 AM'
      },
      {
        sale_id:'235',
        transaction_type:'given',
        total_due:120,
        description:'afajl ke hatho gya saman',
        date:'2026-01-03',
        time:'10:12 AM'
      },
      {
        transaction_type:'received',
        total_due:345,
        description:'afjal ke hatho cash mila',
        date:'2026-01-03',
        time:'11:23 AM'
      },
      {
        sale_id:'234',
        transaction_type:'given',
        total_due:345,
        description:'total saman ka list hai or more data ke sath',
        date:'2026-01-02',
        time:'09:23 AM'
      },
      {
        sale_id:'235',
        transaction_type:'given',
        total_due:120,
        description:'afajl ke hatho gya saman',
        date:'2026-01-03',
        time:'10:12 AM'
      },
      {
        transaction_type:'received',
        total_due:345,
        description:'afjal ke hatho cash mila',
        date:'2026-01-03',
        time:'11:23 AM'
      },  {
        sale_id:'234',
        transaction_type:'given',
        total_due:345,
        description:'total saman ka list hai or more data ke sath',
        date:'2026-01-02',
        time:'09:23 AM'
      },
      {
        sale_id:'235',
        transaction_type:'given',
        total_due:120,
        description:'afajl ke hatho gya saman',
        date:'2026-01-03',
        time:'10:12 AM'
      },
      {
        transaction_type:'received',
        total_due:345,
        description:'afjal ke hatho cash mila',
        date:'2026-01-03',
        time:'11:23 AM'
      },
      {
        sale_id:'234',
        transaction_type:'given',
        total_due:345,
        description:'total saman ka list hai or more data ke sath',
        date:'2026-01-02',
        time:'09:23 AM'
      },
      {
        sale_id:'235',
        transaction_type:'given',
        total_due:120,
        description:'afajl ke hatho gya saman',
        date:'2026-01-03',
        time:'10:12 AM'
      },
      {
        transaction_type:'received',
        total_due:345,
        description:'afjal ke hatho cash mila',
        date:'2026-01-03',
        time:'11:23 AM'
      },
      {
        sale_id:'234',
        transaction_type:'given',
        total_due:345,
        description:'total saman ka list hai or more data ke sath',
        date:'2026-01-02',
        time:'09:23 AM'
      },
      {
        sale_id:'235',
        transaction_type:'given',
        total_due:120,
        description:'afajl ke hatho gya saman',
        date:'2026-01-05',
        time:'10:12 AM'
      },
      {
        transaction_type:'received',
        total_due:345,
        description:'afjal ke hatho cash mila',
        date:'2026-01-03',
        time:'11:23 AM'
      },
      {
        sale_id:'234',
        transaction_type:'given',
        total_due:345,
        description:'total saman ka list hai or more data ke sath',
        date:'2026-01-02',
        time:'09:23 AM'
      },
      {
        sale_id:'235',
        transaction_type:'given',
        total_due:120,
        description:'afajl ke hatho gya saman',
        date:'2026-01-03',
        time:'10:12 AM'
      },
      {
        transaction_type:'received',
        total_due:345,
        description:'afjal ke hatho cash mila',
        date:'2026-01-03',
        time:'11:23 AM'
      },
      ],
    grand_total_due: -120,
    latest_transaction_due:345,
    latest_transaction_payment_type:'payment',
    latest_transaction_payment_date:'2025-12-25'
  },
  {
    id:'13',
    name:'Ramdyal Sharma',
    saleList: [
      {
        sale_id:'134',
        transaction_type:'given',
        total_due:345,
        description:'total saman ka list hai',
        date:'2025-11-03',
        time:'11:23 AM'
      },
      {
        transaction_type:'received',
        total_due:445,
        description:'afajl ke hatho gya saman',
        date:'2025-11-12',
        time:'08:23 AM'
      },
      {
        sale_id:'135',
        transaction_type:'given',
        total_due:100,
        description:'afjal ke hatho cash mila',
        date:'2026-01-01',
        time:'11:23 AM'
      },
      ],
    grand_total_due:0,
    latest_transaction_due:100,
    latest_transaction_payment_type:'added',
    latest_transaction_payment_date:'2025-12-26'
  },
  {
    id:'14',
    name:'Mojahid Ansari',
    saleList: [
      {
        sale_id:'334',
        transaction_type:'given',
        total_due:125,
        description:'total saman ka list hai'
      },
      {
        transaction_type:'received',
        total_due:400,
        description:'afajl ke hatho gya saman'
      },
      {
        sale_id:'135',
        transaction_type:'given',
        total_due:100,
        description:'afjal ke hatho cash mila'
      },
      ],
    grand_total_due:175,
    latest_transaction_due:100,
    latest_transaction_payment_type:'added',
    latest_transaction_payment_date:'2025-12-26'
  }
  ]


const listOfFilterCustomer = [
   {
     lable:'Default',value:'default'
   },
   {
     lable:'Last Payment',value:'last-payment'
   },
   {
     lable:'Latest Activity',value:'latest-activity'
   }, 
   {
     lable:'Name',value:'name'
   },
  ]
export { customer_data,listOfFilterCustomer }